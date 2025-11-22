// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface TokenPayload {
  sub: string;
  role: "ADMIN" | "CAIXA";
}

// 👇 VERIFIQUE SE A PALAVRA 'export' ESTÁ AQUI
export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Token de autenticação não fornecido." });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, process.env.JWT_SECRET!);

    const { sub, role } = decoded as TokenPayload;

    req.user = {
      id: sub,
      role,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token de autenticação inválido." });
  }
}
