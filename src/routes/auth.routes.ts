import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/login", AuthController.login);

// No futuro, a rota para o refresh token virá aqui
// authRoutes.post('/refresh-token', AuthController.refreshToken);

export { authRoutes };
