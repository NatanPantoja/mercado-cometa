import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "O nome do produto precisa ter no mínimo 2 caracteres."),
  description: z.string().optional(),
  imageUrl: z.string().url("A imagem deve ser uma URL válida.").optional(),

  // Validamos se é um UUID válido para garantir que o formato está certo
  categoryId: z.string().uuid("ID da categoria inválido."),
  supplierId: z.string().uuid("ID do fornecedor inválido."),
});
