import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

export const ProductRepository = {
  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
    });
  },

  async findAll() {
    return prisma.product.findMany({
      where: {
        is_active: true, // Certifique-se que criou esse campo no schema.prisma
      },
      include: {
        category: true,
        supplier: true,
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

  // Novo método para Soft Delete
  async softDelete(id: string) {
    return prisma.product.update({
      where: { id },
      data: {
        is_active: false, // Apenas desativa
      },
    });
  },
};
