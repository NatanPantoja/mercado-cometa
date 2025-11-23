import { compare } from "bcryptjs";
import { sign, SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { UserRepository } from "../repositories/user.repository";
import { loginSchema } from "../schemas/auth.schema";
import { env } from "../config/env";

type loginData = z.infer<typeof loginSchema>;

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export const AuthService = {
  async login(data: loginData): Promise<LoginResponse> {
    // 1. Verifica se o usuário existe
    const user = await UserRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Email ou senha invalidos.");
    }

    // 2. Verifica a senha
    const isPasswordValid = await compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Email ou senha invalidos");
    }

    // 3. Define a duração do Refresh Token
    let refreshTokenExpiration = env.JWT_REFRESH_EXPIRES_IN;

    if (user.role === "ADMIN") {
      refreshTokenExpiration = "24h";
    }

    // 4. Configurações do Token
    // O 'as any' aqui desliga o erro chato do TypeScript, pois o Zod já garantiu que a string existe e é válida.
    const jwtOptions: SignOptions = {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN as any,
    };

    const refreshJwtOptions: SignOptions = {
      subject: user.id,
      expiresIn: refreshTokenExpiration as any,
    };

    // 5. Gera os Tokens
    const accessToken = sign({ role: user.role }, env.JWT_SECRET, jwtOptions);

    const refreshToken = sign({}, env.JWT_REFRESH_SECRET, refreshJwtOptions);

    return { accessToken, refreshToken };
  },
};
