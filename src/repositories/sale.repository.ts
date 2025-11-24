import { prisma } from "../config/prisma";

export const SaleRepository = {
  async findAll() {
    return prisma.sale.findMany({
      include: {
        user: {
          select: { name: true }, // Mostra quem foi o caixa que vendeu
        },
        items: {
          include: {
            variant: true, // Mostra o nome dos produtos vendidos
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Vendas mais recentes primeiro
      },
    });
  },

  async findById(id: string) {
    return prisma.sale.findUnique({
      where: { id },
      include: {
        user: true,
        items: { include: { variant: true } },
      },
    });
  },
};
