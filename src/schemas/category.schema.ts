import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome da categoria precisa ter no mínimo 2 caracteres."),
});
