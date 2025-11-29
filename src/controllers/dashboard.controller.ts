import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";

export const DashboardController = {
  async getDashboard(req: Request, res: Response) {
    try {
      const data = await DashboardService.getDashboardData();
      return res.json(data);
    } catch (error) {
      console.error("Erro ao obter dados do dashboard:", error);
      return res
        .status(500)
        .json({ error: "Erro interno do servidor ao carregar dashboard." });
    }
  },

  async getBottomProducts(req: Request, res: Response) {
    try {
      const data = await DashboardService.getBottomProducts();
      return res.json(data);
    } catch (error) {
      console.error("Erro ao obter produtos com menor saída:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  },

  async getMonthlySales(req: Request, res: Response) {
    try {
      const data = await DashboardService.getMonthlySales();
      return res.json(data);
    } catch (error) {
      console.error("Erro ao obter vendas mensais:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  },
};
