import { compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { z } from "zod";
import crypto from "crypto"; // Módulo nativo do Node.js para hash
import { UserRepository } from "../repositories/user.repository";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";
import { loginSchema } from "../schemas/auth.schema";
import { env } from "../config/env";
import { prisma } from "../config/prisma";

type loginData = z.infer<typeof loginSchema>;

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

// Função auxiliar para gerar o hash do token (SHA256) antes de salvar no banco
function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const AuthService = {
  // =================================================================
  // 1. LOGIN (Gera o par inicial de tokens)
  // =================================================================
  async login(data: loginData): Promise<LoginResponse> {
    const user = await UserRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Email ou senha invalidos.");
    }

    const isPasswordValid = await compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Email ou senha invalidos");
    }

    // Regra: Admin tem refresh token de 24h, Caixa tem de 7 dias (padrão)
    let refreshTokenDuration = env.JWT_REFRESH_EXPIRES_IN;
    if (user.role === "ADMIN") {
      refreshTokenDuration = "24h";
    }

    // A. Gerar Access Token (Curto)
    const accessToken = sign({ role: user.role }, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    // B. Gerar Refresh Token (Longo)
    const refreshToken = sign(
      {}, // Payload vazio
      env.JWT_REFRESH_SECRET,
      { subject: user.id, expiresIn: refreshTokenDuration as any }
    );

    // C. Salvar o Refresh Token no Banco (Para permitir rotação/revogação)
    // Definimos a data de expiração no banco (ex: hoje + 7 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const hashedRefreshToken = hashToken(refreshToken);

    await RefreshTokenRepository.create(user.id, hashedRefreshToken, expiresAt);

    return { accessToken, refreshToken };
  },

  // =================================================================
  // 2. REFRESH TOKEN (Rotação: Troca o velho por um novo)
  // =================================================================
  async refreshToken(token: string): Promise<LoginResponse> {
    // A. Validar a assinatura do JWT (se foi a gente mesmo que gerou)
    let payload: any;
    try {
      payload = verify(token, env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new Error("Refresh Token inválido ou expirado (assinatura).");
    }

    const userId = payload.sub as string;
    const hashedToken = hashToken(token);

    // B. Buscar esse token no banco de dados
    const savedToken = await RefreshTokenRepository.findByHashedToken(
      hashedToken
    );

    // C. Verificações de Segurança (Reuso de token)
    if (
      !savedToken ||
      savedToken.revoked ||
      new Date() > savedToken.expiresAt
    ) {
      // Se o token não existe, já foi revogado ou expirou, mas alguém tentou usar...
      // Pode ser um ataque! Revogamos TODOS os tokens desse usuário por segurança.
      if (savedToken) {
        await RefreshTokenRepository.revokeTokensForUser(userId);
      }
      throw new Error("Token inválido ou reutilizado. Faça login novamente.");
    }

    // D. Verificar se o usuário ainda existe no banco
    const userFound = await prisma.user.findUnique({ where: { id: userId } });
    if (!userFound) {
      throw new Error("Usuário não encontrado.");
    }

    // E. ROTAÇÃO: Apagar (ou invalidar) o token velho que acabou de ser usado
    await RefreshTokenRepository.delete(savedToken.id);

    // F. Gerar um NOVO par de tokens
    const newAccessToken = sign({ role: userFound.role }, env.JWT_SECRET, {
      subject: userFound.id,
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    const newRefreshToken = sign({}, env.JWT_REFRESH_SECRET, {
      subject: userFound.id,
      expiresIn: "7d",
    });

    // G. Salvar o NOVO refresh token no banco
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    await RefreshTokenRepository.create(
      userFound.id,
      hashToken(newRefreshToken),
      newExpiresAt
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },
};
