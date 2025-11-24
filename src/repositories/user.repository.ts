import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

export const UserRepository = {
  // Buscar usuário pelo e-mail
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  // Criar novo usuário
  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  },

  // Listar todos (opcional, mas útil)
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        // NÃO selecionamos a senha aqui por segurança
      },
    });
  },
};
