import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { ensureAdmin } from "../middlewares/ensureAdmin.middleware";
import { SupplierController } from "../controllers/supplier.controller";

const supplierRoutes = Router();

// Protege todas as rotas de fornecedores
supplierRoutes.use(ensureAuthenticated);

// Rota para LISTAR todos os fornecedores (qualquer usuário logado)
supplierRoutes.get("/", SupplierController.findAll);

// Rota para CRIAR um novo fornecedor (apenas ADMIN)
supplierRoutes.post("/", ensureAdmin, SupplierController.create);

export { supplierRoutes };
