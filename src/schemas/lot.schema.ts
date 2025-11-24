import { z } from "zod";

export const createLotSchema = z.object({
  variantId: z.string().uuid("ID da variante inválido."),
  quantity: z.number().int().positive("A quantidade deve ser positiva."),
  costPrice: z.number().min(0, "O custo não pode ser negativo."),

  // O coerce converte a string "2024-12-25" para objeto Date automaticamente
  expirationDate: z.coerce.date({}),

  manufactureDate: z.coerce.date().optional(),
});
