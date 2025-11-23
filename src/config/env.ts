import { z } from "zod";
import dotenv from "dotenv";

// Carrega o arquivo .env
dotenv.config();

// Define o esquema de validação das suas variáveis de ambiente
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default("24h"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  PORT: z.string().default("3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

// Tenta validar. Se falhar, o app nem inicia e mostra o erro no terminal.
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Variáveis de ambiente inválidas:", _env.error.format());
  throw new Error("Variáveis de ambiente inválidas.");
}

// Exporta as variáveis limpas e tipadas
export const env = _env.data;
