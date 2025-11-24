import { prisma } from "../config/prisma"; // Ajustado para o caminho correto
import { Prisma } from "@prisma/client";

export const ProductRepository = {
  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
    });
  },

  async findAll() {
    return prisma.product.findMany({
      include: {
        category: true, // Traz os dados da categoria junto
        supplier: true, // Traz os dados do fornecedor junto
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        variants: true, // Já traz as variantes se tiver (para o futuro)
      },
    });
  },
};
