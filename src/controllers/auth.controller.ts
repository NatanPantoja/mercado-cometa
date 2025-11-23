import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { loginSchema } from "../schemas/auth.schema";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      // 1. Valida os dados que chegaram no corpo da requisição usando o Zod
      // Se tiver algo errado (ex: email inválido), ele já estoura erro aqui.
      const data = loginSchema.parse(req.body);

      // 2. Chama o serviço que cria os tokens
      const tokens = await AuthService.login(data);

      // 3. Devolve a resposta
      return res.status(200).json(tokens);
    } catch (error: any) {
      // Tratamento básico de erro
      if (error.message === "Email ou senha invalidos") {
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      // Erros do Zod (validação)
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors });
      }

      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
