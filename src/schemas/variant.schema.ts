import { z } from "zod";

// Copiamos o ENUM do Prisma manualmente ou validamos como string restrita
const UnitEnum = z.enum(["UN", "KG", "L", "M", "CX", "PCT"]);

export const createVariantSchema = z.object({
  name: z.string().min(1, "Nome da variante obrigatório (ex: 300g, Azul, P)."),
  sku: z.string().min(3, "SKU deve ter no mínimo 3 caracteres."),
  barcode: z.string().optional(), // Pode ser nulo se não tiver código de barras

  // Transformamos a string que vem do JSON em número para salvar no banco
  price: z.number().min(0, "O preço não pode ser negativo."),
  cost: z.number().min(0, "O custo não pode ser negativo."),
  stock: z.number().int().min(0, "O estoque não pode ser negativo.").default(0),
  minStock: z.number().int().default(5),

  unit: UnitEnum.default("UN"),

  productId: z.string().uuid("ID do produto inválido."),
});

// NOVO: Schema de atualização (todos os campos opcionais)
export const updateVariantSchema = createVariantSchema.partial();
