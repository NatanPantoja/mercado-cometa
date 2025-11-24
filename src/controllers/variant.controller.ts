import { Request, Response } from "express";
import { ZodError } from "zod";
import { createVariantSchema } from "../schemas/variant.schema";
import { VariantService } from "../services/variant.service";

export const VariantController = {
  async create(req: Request, res: Response) {
    try {
      const data = createVariantSchema.parse(req.body);
      const newVariant = await VariantService.create(data);
      return res.status(201).json(newVariant);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Dados inválidos.", errors: error.issues });
      }
      if (error.message.includes("Já existe")) {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const variants = await VariantService.findAll();
      return res.status(200).json(variants);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },
};
