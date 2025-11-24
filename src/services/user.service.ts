import { hash } from "bcryptjs"; // <--- Importante!
import { z } from "zod";
import { createUserSchema } from "../schemas/user.schema";
import { UserRepository } from "../repositories/user.repository";

// Infere o tipo a partir do schema do Zod
type UserCreateData = z.infer<typeof createUserSchema>;

export const UserService = {
  async create(data: UserCreateData) {
    // 1. Verificar se o e-mail já existe
    const userAlreadyExists = await UserRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new Error("E-mail já cadastrado.");
    }

    // 2. Criptografar a senha (Hash)
    // O número 8 é o "salt", o custo do processamento.
    const passwordHash = await hash(data.password, 8);

    // 3. Criar o usuário com a senha criptografada
    const newUser = await UserRepository.create({
      name: data.name,
      email: data.email,
      password: passwordHash, // Salva o hash, não a senha original!
      role: data.role || "CAIXA", // Se não vier role, assume CAIXA
    });

    // 4. Retornar o usuário (removemos a senha do retorno manual se quiser, ou retornamos tudo)
    // Por segurança, vamos retornar sem a senha
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async findAll() {
    return UserRepository.findAll();
  },
};
