import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { ensureAdmin } from "../middlewares/ensureAdmin.middleware";
import { VariantController } from "../controllers/variant.controller";

const variantRoutes = Router();

variantRoutes.use(ensureAuthenticated);

variantRoutes.get("/", VariantController.findAll);
variantRoutes.post("/", ensureAdmin, VariantController.create);

export { variantRoutes };
