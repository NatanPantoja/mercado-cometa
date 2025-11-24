import { z } from "zod";
import { createProductSchema } from "../schemas/product.schema";
import { ProductRepository } from "../repositories/product.repository";
import { prisma } from "../config/prisma";

type ProductCreateData = z.infer<typeof createProductSchema>;

export const ProductService = {
  async create(data: ProductCreateData) {
    // 1. Verificar se a Categoria existe
    const categoryExists = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!categoryExists) {
      throw new Error("Categoria não encontrada.");
    }

    // 2. Verificar se o Fornecedor existe
    const supplierExists = await prisma.supplier.findUnique({
      where: { id: data.supplierId },
    });

    if (!supplierExists) {
      throw new Error("Fornecedor não encontrado.");
    }

    // 3. Criar o produto
    const product = await ProductRepository.create({
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      category: { connect: { id: data.categoryId } }, // Conecta com a categoria existente
      supplier: { connect: { id: data.supplierId } }, // Conecta com o fornecedor existente
    });

    return product;
  },

  async findAll() {
    return ProductRepository.findAll();
  },
};
