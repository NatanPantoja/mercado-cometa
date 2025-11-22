import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { createUserSchema } from "../schemas/user.schema";
import { ZodError } from "zod";

export const UserController = {
  async create(req: Request, res: Response) {
    try {
      const userData = createUserSchema.parse(req.body);
      const newUser = await UserService.create(userData);
      return res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof ZodError) {
        // Agora que corrigimos o service, este código não deve mais dar erro
        return res.status(400).json({
          message: "Dados inválidos.",
          errors: error.issues, // Esta linha está correta
        });
      }

      if (
        error instanceof Error &&
        error.message.includes("e-mail já está em uso")
      ) {
        return res.status(409).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },
};
