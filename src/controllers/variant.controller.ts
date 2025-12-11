import { Request, Response } from "express";
import { VariantService } from "../services/variant.service";
import {
  createVariantSchema,
  updateVariantSchema,
} from "../schemas/variant.schema";
import { z } from "zod";

export const VariantController = {
  // Criar Variante
  async create(req: Request, res: Response) {
    try {
      const data = createVariantSchema.parse(req.body);
      const variant = await VariantService.create(data);
      return res.status(201).json(variant);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.issues });
      }
      return res
        .status(500)
        .json({ error: error.message || "Erro na criação" });
    }
  },

  // Listar Todas
  async findAll(req: Request, res: Response) {
    try {
      const variants = await VariantService.findAll();
      return res.json(variants);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar variantes" });
    }
  },

  // --- BUSCAR POR CÓDIGO DE BARRAS (USADO NO PDV) ---
  async getByBarcode(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const variant = await VariantService.findByBarcode(code);
      return res.json(variant);
    } catch (error: any) {
      if (error.message === "Produto não encontrado.") {
        return res.status(404).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Erro interno ao buscar produto." });
    }
  },

  // Atualizar
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = updateVariantSchema.parse(req.body);
      const updatedVariant = await VariantService.update(id, data);
      return res.json(updatedVariant);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.issues });
      }
      return res
        .status(500)
        .json({ message: error.message || "Erro ao atualizar." });
    }
  },
};
