import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post("/", UserController.create);

// No futuro, outras rotas como GET /users, GET /users/:id, etc., virão aqui.

export { userRoutes };
