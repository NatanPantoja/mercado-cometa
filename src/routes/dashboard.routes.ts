import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { ensureAdmin } from "../middlewares/ensureAdmin.middleware";

const dashboardRoutes = Router();

dashboardRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  DashboardController.getDashboard
);

// Endpoints opcionais
dashboardRoutes.get(
  "/bottom-products",
  ensureAuthenticated,
  ensureAdmin,
  DashboardController.getBottomProducts
);
dashboardRoutes.get(
  "/monthly-sales",
  ensureAuthenticated,
  ensureAdmin,
  DashboardController.getMonthlySales
);

export { dashboardRoutes };
