import { prisma } from "../config/prisma";

export const AuditRepository = {
  // Salvar um novo log
  async create(data: {
    userId: string;
    action: string;
    entity: string;
    entityId: string;
    details?: string;
  }) {
    return prisma.auditLog.create({
      data,
    });
  },

  // Buscar logs de um registro específico (Ex: ver histórico de um produto)
  async findByEntity(entity: string, entityId: string) {
    return prisma.auditLog.findMany({
      where: { entity, entityId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } }, // Mostra quem fez
      },
    });
  },

  // Listar todos os logs (painel geral de auditoria)
  async findAll() {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100, // Limita aos últimos 100 para não pesar
      include: {
        user: { select: { name: true } },
      },
    });
  },
};
