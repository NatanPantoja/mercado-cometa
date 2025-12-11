import { z } from "zod";
import {
  createVariantSchema,
  updateVariantSchema,
} from "../schemas/variant.schema";
import { VariantRepository } from "../repositories/variant.repository";
import { prisma } from "../config/prisma";

type VariantCreateData = z.infer<typeof createVariantSchema>;
type VariantUpdateData = z.infer<typeof updateVariantSchema>;

export const VariantService = {
  // ... (create e findAll mantidos iguais) ...
  async create(data: VariantCreateData) {
    const productExists = await prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!productExists) throw new Error("Produto pai não encontrado.");

    const skuExists = await VariantRepository.findBySku(data.sku);
    if (skuExists) throw new Error("Já existe uma variante com este SKU.");

    if (data.barcode) {
      const barcodeExists = await VariantRepository.findByBarcode(data.barcode);
      if (barcodeExists)
        throw new Error("Já existe um produto com este Código de Barras.");
    }

    return VariantRepository.create({
      name: data.name,
      sku: data.sku,
      barcode: data.barcode,
      price: data.price,
      cost: data.cost,
      minStock: data.minStock,
      unit: data.unit,
      stock: data.stock,
      product: { connect: { id: data.productId } },
    });
  },

  async findAll() {
    return VariantRepository.findAll();
  },

  async findByBarcode(barcode: string) {
    const variant = await VariantRepository.findByBarcode(barcode);
    if (!variant) throw new Error("Produto não encontrado.");
    return variant;
  },

  // --- UPDATE CORRIGIDO ---
  async update(id: string, data: VariantUpdateData) {
    // 1. Verifica se a variante existe
    const variantExists = await VariantRepository.findById(id); // Certifique-se que o Repo tem findById
    if (!variantExists) {
      throw new Error("Variante não encontrada.");
    }

    // 2. Verifica duplicidade de SKU (se foi enviado e mudou)
    if (data.sku && data.sku !== variantExists.sku) {
      const variantBySku = await VariantRepository.findBySku(data.sku);
      if (variantBySku) {
        throw new Error("Já existe uma variante com este SKU."); // Mensagem corrigida
      }
    }

    // 3. Verifica duplicidade de Barcode (se foi enviado e mudou)
    if (data.barcode && data.barcode !== variantExists.barcode) {
      // Apenas verifica se barcode não é null/undefined/vazio antes de buscar
      const variantByBarcode = await VariantRepository.findByBarcode(
        data.barcode
      );
      if (variantByBarcode) {
        throw new Error("Já existe um produto com este Código de Barras.");
      }
    }

    // 4. Atualiza
    const variant = await VariantRepository.update(id, data);
    return variant;
  },
};
