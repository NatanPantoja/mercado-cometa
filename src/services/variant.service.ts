import { z } from "zod";
import { createVariantSchema } from "../schemas/variant.schema";
import { VariantRepository } from "../repositories/variant.repository";
import { prisma } from "../config/prisma";

type VariantCreateData = z.infer<typeof createVariantSchema>;

export const VariantService = {
  async create(data: VariantCreateData) {
    // 1. Validar se o Produto Pai existe
    const productExists = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!productExists) {
      throw new Error("Produto pai não encontrado.");
    }

    // 2. Validar SKU duplicado
    const skuExists = await VariantRepository.findBySku(data.sku);
    if (skuExists) {
      throw new Error("Já existe uma variante com este SKU.");
    }

    // 3. Validar Barcode duplicado (apenas se foi enviado)
    if (data.barcode) {
      const barcodeExists = await VariantRepository.findByBarcode(data.barcode);
      if (barcodeExists) {
        throw new Error("Já existe um produto com este Código de Barras.");
      }
    }

    // 4. Criar
    const variant = await VariantRepository.create({
      name: data.name,
      sku: data.sku,
      barcode: data.barcode,
      price: data.price,
      cost: data.cost,
      minStock: data.minStock,
      unit: data.unit,
      stock: 0, // Começa com 0. O estoque entra via Lotes (próximo passo)
      product: { connect: { id: data.productId } },
    });

    return variant;
  },

  async findAll() {
    return VariantRepository.findAll();
  },
};
