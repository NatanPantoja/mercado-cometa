// src/services/supplier.service.ts
import { z } from "zod";
import { createSupplierSchema } from "../schemas/supplier.schema";
import { SupplierRepository } from "../repositories/supplier.repository";

type SupplierCreateData = z.infer<typeof createSupplierSchema>;

export const SupplierService = {
  async create(data: SupplierCreateData) {
    const existingSupplier = await SupplierRepository.findByName(data.name);

    if (existingSupplier) {
      throw new Error("Já existe um fornecedor com este nome.");
    }

    const supplier = await SupplierRepository.create(data);
    return supplier;
  },

  async findAll() {
    return SupplierRepository.findAll();
  },
};
