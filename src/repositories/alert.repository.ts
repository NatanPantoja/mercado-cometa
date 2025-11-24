import { prisma } from "../config/prisma";
import { ProductVariant, Lot } from "@prisma/client";

export const AlertRepository = {
  // Busca produtos onde o Estoque Atual é MENOR ou IGUAL ao Estoque Mínimo
  async findLowStock(): Promise<ProductVariant[]> {
    // No Prisma, comparar duas colunas (stock <= minStock) exige raw query ou filtragem em memória.
    // Usaremos Raw Query para máxima performance no MySQL.
    return prisma.$queryRaw<ProductVariant[]>`
      SELECT * FROM ProductVariant 
      WHERE stock <= minStock
      ORDER BY stock ASC
    `;
  },

  // Busca lotes que vencem nos próximos X dias
  async findExpiring(days: number): Promise<Lot[]> {
    const today = new Date();
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + days);

    return prisma.lot.findMany({
      where: {
        expirationDate: {
          gte: today, // Vencimento maior que hoje (não vencido ainda)
          lte: targetDate, // Menor que a data limite (próximos 30 dias)
        },
        quantity: {
          gt: 0, // Só mostra lotes que ainda têm produtos
        },
      },
      include: {
        variant: true, // Traz o nome do produto para sabermos qual é
      },
      orderBy: {
        expirationDate: "asc",
      },
    });
  },
};
