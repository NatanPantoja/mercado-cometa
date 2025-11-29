import { prisma } from "../config/prisma";

export const DashboardRepository = {
  // 1. Resumo do dia
  async getTodaySummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const summary = await prisma.sale.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { total: true },
      _count: { id: true },
    });

    return {
      totalSales: summary._sum.total || 0,
      totalCount: summary._count.id || 0,
    };
  },

  // 2. Últimos 7 dias
  async getLast7DaysSales() {
    const start = new Date();
    start.setDate(start.getDate() - 7);

    const sales = await prisma.sale.findMany({
      where: { createdAt: { gte: start } },
      select: {
        createdAt: true,
        total: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return sales.map((s) => ({
      date: s.createdAt.toISOString().split("T")[0],
      total: Number(s.total),
    }));
  },

  // 3. Top 5 produtos mais vendidos
  async getTopProducts() {
    const topItems = await prisma.saleItem.groupBy({
      by: ["variantId"],
      _sum: { quantity: true },
      orderBy: {
        _sum: { quantity: "desc" },
      },
      take: 5,
    });

    const enrichedProducts = await Promise.all(
      topItems.map(async (item) => {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          select: {
            name: true,
            sku: true,
            product: { select: { name: true } },
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

  // 4. NOVO → 5 produtos com menor saída
  async getBottomProducts() {
    const bottomItems = await prisma.saleItem.groupBy({
      by: ["variantId"],
      _sum: { quantity: true },
      orderBy: {
        _sum: { quantity: "asc" }, // menor quantidade primeiro
      },
      take: 5,
    });

    const enrichedProducts = await Promise.all(
      bottomItems.map(async (item) => {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          select: {
            name: true,
            sku: true,
            product: { select: { name: true } },
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

  // 5. NOVO → vendas agrupadas por mês/ano
  async getMonthlySales() {
    const result = await prisma.sale.groupBy({
      by: ["createdAt"],
      _sum: { total: true },
      _count: { id: true },
    });

    const map = new Map();

    result.forEach((item) => {
      const year = item.createdAt.getFullYear();
      const month = String(item.createdAt.getMonth() + 1).padStart(2, "0");
      const key = `${year}-${month}`;

      if (!map.has(key)) {
        map.set(key, {
          month: key,
          total: 0,
          count: 0,
        });
      }

      const entry = map.get(key);
      entry.total += Number(item._sum.total || 0);
      entry.count += Number(item._count.id || 0);
    });

    return Array.from(map.values());
  },
};
