import { Request, Response } from "express";
import { ZodError } from "zod";
import { createSupplierSchema } from "../schemas/supplier.schema";
import { SupplierService } from "../services/supplier.service";

export const SupplierController = {
  async create(req: Request, res: Response) {
    try {
      const data = createSupplierSchema.parse(req.body);
      const newSupplier = await SupplierService.create(data);
      return res.status(201).json(newSupplier);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Dados inválidos.", errors: error.issues });
      }
      if (error instanceof Error) {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const suppliers = await SupplierService.findAll();
      return res.status(200).json(suppliers);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },
};
