import { Request, Response } from "express";
import { AlertService } from "../services/alert.service";

export const AlertController = {
  async getLowStock(req: Request, res: Response) {
    try {
      const products = await AlertService.getLowStockProducts();
      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar alertas de estoque." });
    }
  },

  async getExpiring(req: Request, res: Response) {
    try {
      const lots = await AlertService.getExpiringLots();
      return res.status(200).json(lots);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar alertas de validade." });
    }
  },
};
