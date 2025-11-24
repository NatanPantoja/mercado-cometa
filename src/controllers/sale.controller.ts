import { Request, Response } from "express";
import { ZodError } from "zod";
import { createSaleSchema } from "../schemas/sale.schema";
import { SaleService } from "../services/sale.service";

export const SaleController = {
  async create(req: Request, res: Response) {
    try {
      const data = createSaleSchema.parse(req.body);

      // Pegamos o ID do usuário logado (caixa) que veio do middleware
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Usuário não identificado." });
      }

      const newSale = await SaleService.create(data, userId);
      return res.status(201).json(newSale);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Dados inválidos.", errors: error.issues });
      }
      // Erro de estoque insuficiente
      if (error.message.includes("Estoque insuficiente")) {
        return res.status(409).json({ message: error.message });
      }
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro interno ao processar venda." });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const sales = await SaleService.findAll();
      return res.status(200).json(sales);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },
};
