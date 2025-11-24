import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { loginSchema } from "../schemas/auth.schema";
import { z } from "zod";

// Schema simples só para validar o body do refresh
const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh Token é obrigatório"),
});

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const data = loginSchema.parse(req.body);
      const tokens = await AuthService.login(data);
      return res.status(200).json(tokens);
    } catch (error: any) {
      // ... (seu tratamento de erro existente continua igual)
      if (error.message === "Email ou senha invalidos") {
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors });
      }
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // --- NOVO MÉTODO ---
  static async refresh(req: Request, res: Response) {
    try {
      // Valida se enviou o token
      const { refreshToken } = refreshSchema.parse(req.body);

      const tokens = await AuthService.refreshToken(refreshToken);
      return res.status(200).json(tokens);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors });
      }
      // Se o token for inválido, retornamos 401 para o front deslogar o usuário
      return res.status(401).json({ error: error.message || "Token inválido" });
    }
  }
}
