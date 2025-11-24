import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { ensureAdmin } from "../middlewares/ensureAdmin.middleware";
import { ProductController } from "../controllers/product.controller";

const productRoutes = Router();

productRoutes.use(ensureAuthenticated);

// Listar produtos (Todo mundo logado pode ver)
productRoutes.get("/", ProductController.findAll);

// Criar produto (Só ADMIN)
productRoutes.post("/", ensureAdmin, ProductController.create);

export { productRoutes };
