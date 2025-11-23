// src/repositories/supplier.repository.ts
import { prisma } from "../lib/prisma";
import { z } from "zod"; // 1. Importar o Zod
import { createSupplierSchema } from "../schemas/supplier.schema"; // 2. Importar o Schema

// 3. Criar o tipo a partir da ÚNICA fonte da verdade (o schema)
type SupplierCreateData = z.infer<typeof createSupplierSchema>;

export const SupplierRepository = {
  async findByName(name: string) {
    return prisma.supplier.findFirst({
      where: { name },
    });
  },

  async findAll() {
    return prisma.supplier.findMany();
  },

  // Agora a função create espera o tipo que vem do Zod, o mesmo do Service
  async create(data: SupplierCreateData) {
    return prisma.supplier.create({
      data,
    });
  },
};
