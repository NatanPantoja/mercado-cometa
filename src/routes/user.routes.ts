import { Router } from "express";
import { UserController } from "../controllers/user.controller";
// Se quiser proteger a criação de usuários (apenas ADMIN pode criar), importe os middlewares:
// import { ensureAuthenticated, ensureAdmin } from "../middlewares/auth.middleware";

const userRoutes = Router();

// Rota POST /users (Criar Usuário)
// Dica: Inicialmente deixe aberta para você criar o primeiro ADMIN.
// Depois, adicione os middlewares: userRoutes.post("/", ensureAuthenticated, ensureAdmin, UserController.create);
userRoutes.post("/", UserController.create);

userRoutes.get("/", UserController.findAll);

export { userRoutes };
