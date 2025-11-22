import { prisma } from "../lib/prisma";
import { User, Prisma } from "@prisma/client";

export const UserRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  // 2. Mude o tipo do parâmetro 'data' para Prisma.UserCreateInput
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  },
};
