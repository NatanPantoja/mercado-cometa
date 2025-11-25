import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { ensureAdmin } from "../middlewares/ensureAdmin.middleware";

const dashboardRoutes = Router();

// Apenas ADMIN pode ver o dashboard geral
dashboardRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  DashboardController.getDashboard
);

export { dashboardRoutes };
