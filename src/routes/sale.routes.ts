import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { SaleController } from "../controllers/sale.controller";

const saleRoutes = Router();

saleRoutes.use(ensureAuthenticated);

saleRoutes.get("/", SaleController.findAll);
saleRoutes.post("/", SaleController.create);

export { saleRoutes };
