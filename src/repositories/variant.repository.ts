import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

export const VariantRepository = {
  // Cria uma nova variante no banco
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

  // Buscar por Código de Barras (ESSENCIAL PARA O PDV)
  async findByBarcode(barcode: string) {
    return prisma.productVariant.findUnique({
      where: { barcode },
      include: {
        product: true, // Traz o nome do produto pai junto (Importante para o PDV exibir o nome completo)
      },
    });
  },

  // Listar todas as variantes de um produto específico
  async findAllByProduct(productId: string) {
    return prisma.productVariant.findMany({
      where: { productId },
    });
  },

  // Listar todas as variantes do sistema
  async findAll() {
    return prisma.productVariant.findMany({
      include: { product: true }, // Traz o nome do produto pai junto
    });
  },

  async findById(id: string) {
    return prisma.productVariant.findUnique({
      where: { id },
    });
  },

  async update(id: string, data: Prisma.ProductVariantUpdateInput) {
    return prisma.productVariant.update({
      where: { id },
      data,
    });
  },
};
