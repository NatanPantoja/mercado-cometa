import { prisma } from "../config/prisma";

export const DashboardRepository = {
  // 1. Totais de Hoje
  async getTodaySummary() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const result = await prisma.sale.aggregate({
      _sum: { total: true },
      _count: { id: true },
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
        status: "COMPLETED",
      },
    });

    return {
      totalAmount: Number(result._sum.total || 0),
      count: result._count.id,
    };
  },

  // 2. Gráfico: Vendas dos últimos 7 dias
  async getLast7DaysSales() {
    // Usamos queryRaw para agrupar por dia de forma eficiente no SQL
    const result = await prisma.$queryRaw<any[]>`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m-%d') as date, 
        SUM(total) as total,
        COUNT(id) as count
      FROM Sale
      WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        AND status = 'COMPLETED'
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m-%d')
      ORDER BY date ASC;
    `;

    // Formatamos o retorno para garantir números
    return result.map((item) => ({
      date: item.date,
      total: Number(item.total),
      count: Number(item.count),
    }));
  },

  // 3. Ranking: Top 5 Produtos Mais Vendidos
  async getTopProducts() {
    const topItems = await prisma.saleItem.groupBy({
      by: ["variantId"],
      _sum: { quantity: true },
      orderBy: {
        _sum: { quantity: "desc" },
      },
      take: 5,
    });

    // Agora buscamos os nomes desses produtos
    const enrichedProducts = await Promise.all(
      topItems.map(async (item) => {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          select: {
            name: true,
            sku: true,
            product: { select: { name: true } }, // Nome do produto pai
          },
        });

        return {
          productName: variant?.product.name || "Produto Desconhecido",
          variantName: variant?.name || "",
          sku: variant?.sku || "N/A",
          quantitySold: item._sum.quantity || 0,
        };
      })
    );

    return enrichedProducts;
  },
};
