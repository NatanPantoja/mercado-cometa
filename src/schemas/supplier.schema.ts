import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z
    .string()
    .min(2, "O nome do fornecedor precisa ter no mínimo 2 caracteres."),
  contact: z.string().optional(),
});
