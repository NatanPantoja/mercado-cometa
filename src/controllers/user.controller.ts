import { Request, Response } from "express";
import { ZodError } from "zod";
import { createUserSchema } from "../schemas/user.schema";
import { UserService } from "../services/user.service";

export const UserController = {
  async create(req: Request, res: Response) {
    try {
      // Valida o corpo da requisição
      const data = createUserSchema.parse(req.body);

      // Chama o serviço
      const newUser = await UserService.create(data);

      return res.status(201).json(newUser);
    } catch (error: any) {
      // Erro de Validação do Zod
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Dados inválidos.", errors: error.issues });
      }

      // Erro de Regra de Negócio (ex: Email duplicado)
      if (error.message === "E-mail já cadastrado.") {
        return res.status(409).json({ message: error.message });
      }

      // Erro desconhecido (para debugging, mostramos no terminal)
      console.error(error);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const users = await UserService.findAll();
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },
};
