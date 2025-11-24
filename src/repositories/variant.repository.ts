import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

export const VariantRepository = {
  async create(data: Prisma.ProductVariantCreateInput) {
    return prisma.productVariant.create({
      data,
    });
  },

  // Buscar por SKU (para validar duplicidade)
  async findBySku(sku: string) {
    return prisma.productVariant.findUnique({
      where: { sku },
    });
  },

  // Buscar por Código de Barras
  async findByBarcode(barcode: string) {
    return prisma.productVariant.findUnique({
      where: { barcode },
    });
  },

  // Listar todas as variantes de um produto específico
  async findAllByProduct(productId: string) {
    return prisma.productVariant.findMany({
      where: { productId },
    });
  },

  async findAll() {
    return prisma.productVariant.findMany({
      include: { product: true }, // Traz o nome do produto pai junto
    });
  },
};
