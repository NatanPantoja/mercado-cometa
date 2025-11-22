// src/middlewares/ensureAdmin.middleware.ts
import { Request, Response, NextFunction } from "express";

export function ensureAdmin(req: Request, res: Response, next: NextFunction) {
  // Este middleware DEVE ser usado DEPOIS do ensureAuthenticated,
  // por isso podemos confiar que req.user existe.
  const { role } = req.user;

  if (role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Acesso negado. Rota exclusiva para administradores." }); // 403 Forbidden
  }

  return next();
}
