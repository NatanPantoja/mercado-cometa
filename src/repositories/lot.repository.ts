import { prisma } from "../config/prisma";

export const LotRepository = {
  async findAll() {
    return prisma.lot.findMany({
      include: {
        variant: true, // Mostra de qual produto é esse lote
      },
      orderBy: {
        expirationDate: "asc", // Mostra primeiro o que vence primeiro
      },
    });
  },
};
