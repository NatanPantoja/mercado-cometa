import { hash } from "bcryptjs";
import { User } from "@prisma/client";
import { UserRepository } from "../repositories/user.repository";
import { z } from "zod";
import { createUserSchema } from "../schemas/user.schema";

// Esta é a mágica! Criamos o tipo diretamente a partir do schema do Zod.
// Agora, o tipo de entrada do nosso serviço é EXATAMENTE o que o Zod produz.
type UserCreateData = z.infer<typeof createUserSchema>;

export const UserService = {
  // O Promise agora retorna um usuário SEM a senha
  async create(data: UserCreateData): Promise<Omit<User, "password">> {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Este e-mail já está em uso.");
    }

    const hashedPassword = await hash(data.password, 10);

    const user = await UserRepository.create({
      name: data.name,
      email: data.email,
      role: data.role, // O Zod já garante que a role é 'ADMIN' ou 'CAIXA'
      password: hashedPassword,
    });

    // Remove a senha antes de retornar os dados
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};
