import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { ensureAdmin } from "../middlewares/ensureAdmin.middleware";
import { LotController } from "../controllers/lot.controller";

const lotRoutes = Router();

lotRoutes.use(ensureAuthenticated);

lotRoutes.get("/", LotController.findAll);
// Apenas ADMIN pode dar entrada em estoque (segurança básica)
lotRoutes.post("/", ensureAdmin, LotController.create);

export { lotRoutes };
