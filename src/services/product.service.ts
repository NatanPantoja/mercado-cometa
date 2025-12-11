import { z } from "zod";
import { createProductSchema } from "../schemas/product.schema";
import { ProductRepository } from "../repositories/product.repository";
import { prisma } from "../config/prisma";
import { AuditService } from "./audit.service";

type ProductCreateData = z.infer<typeof createProductSchema>;

export const ProductService = {
  async create(data: ProductCreateData, userId: string) {
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
      category: { connect: { id: data.categoryId } },
      supplier: { connect: { id: data.supplierId } },
    });

    // 4. LOG DE AUDITORIA
    // Importante para saber quem criou
    await AuditService.log(userId, "CREATE_PRODUCT", "Product", product.id, {
      name: product.name,
      categoryId: data.categoryId,
    });

    return product;
  },

  async findAll() {
    // Agora o repository deve estar configurado para trazer apenas is_active: true
    return ProductRepository.findAll();
  },

  // Adicionei userId aqui para podermos auditar QUEM deletou
  async delete(id: string, userId: string) {
    // 1. Verificar se o produto existe
    const productExists = await ProductRepository.findById(id);

    if (!productExists) {
      throw new Error("Produto não encontrado.");
    }

    // 2. Soft Delete (Desativar em vez de excluir)
    // Precisamos chamar o método softDelete do repositório agora
    const deletedProduct = await ProductRepository.softDelete(id);

    // 3. LOG DE AUDITORIA
    // Agora registramos que o produto foi "deletado" (desativado)
    await AuditService.log(userId, "DELETE_PRODUCT", "Product", id, {
      oldStatus: "active",
      newStatus: "inactive/deleted",
      productName: productExists.name,
    });

    return deletedProduct;
  },
};
