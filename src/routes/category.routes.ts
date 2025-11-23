import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { ensureAdmin } from "../middlewares/ensureAdmin.middleware";
import { CategoryController } from "../controllers/category.controller";

const categoryRoutes = Router();

// 1. Rota para LISTAR todas as categorias.
// Exigimos apenas que o usuário esteja logado (pode ser ADMIN ou CAIXA).
categoryRoutes.get("/", ensureAuthenticated, CategoryController.findAll);

// 2. Rota para CRIAR uma nova categoria.
// Aqui exigimos DUAS verificações em sequência:
// Primeiro, o ensureAuthenticated verifica se o token é válido.
// Se for, o ensureAdmin verifica se o cargo do usuário é ADMIN.
// Só então a requisição chega ao CategoryController.create.
categoryRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  CategoryController.create
);

export { categoryRoutes };
