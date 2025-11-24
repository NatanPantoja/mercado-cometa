import { Request, Response } from "express";
import { ZodError } from "zod";
import { createLotSchema } from "../schemas/lot.schema";
import { LotService } from "../services/lot.service";

export const LotController = {
  async create(req: Request, res: Response) {
    try {
      const data = createLotSchema.parse(req.body);
      const newLot = await LotService.create(data);
      return res.status(201).json(newLot);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Dados inválidos.", errors: error.issues });
      }
      if (error.message === "Variante não encontrada.") {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const lots = await LotService.findAll();
      return res.status(200).json(lots);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },
};
