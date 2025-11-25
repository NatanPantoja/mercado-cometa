import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";

export const DashboardController = {
  async getDashboard(req: Request, res: Response) {
    try {
      const dashboardData = await DashboardService.getDashboardData();
      return res.status(200).json(dashboardData);
    } catch (error) {
      console.error("Erro no DashboardController:", error);
      return res
        .status(500)
        .json({ message: "Erro ao carregar dados do dashboard." });
    }
  },
};
