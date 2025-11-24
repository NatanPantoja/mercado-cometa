import { prisma } from "../config/prisma";

export const RefreshTokenRepository = {
  // Salva um novo refresh token no banco
  async create(userId: string, hashedToken: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        userId,
        hashedToken,
        expiresAt,
        revoked: false,
      },
    });
  },

  // Busca um token pelo hash (para saber se ele existe)
  async findByHashedToken(hashedToken: string) {
    return prisma.refreshToken.findFirst({
      where: {
        hashedToken,
      },
    });
  },

  // Busca token pelo ID do usuário (para revogar todos se precisar)
  async findByUserId(userId: string) {
    return prisma.refreshToken.findMany({
      where: { userId },
    });
  },

  // Revoga (apaga ou marca como inválido) um token específico
  // Aqui vamos apagar para não encher o banco, mas poderíamos só marcar revoked: true
  async delete(id: string) {
    return prisma.refreshToken.delete({
      where: { id },
    });
  },

  // Limpa tokens expirados ou revogados de um usuário (manutenção)
  async revokeTokensForUser(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  },
};
