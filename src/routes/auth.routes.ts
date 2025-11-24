import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/login", AuthController.login);
authRoutes.post("/refresh", AuthController.refresh); // <--- Nova rota

export { authRoutes };
