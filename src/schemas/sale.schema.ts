import { z } from "zod";

// Validamos o ENUM de pagamento igual ao do Banco de Dados
const PaymentMethodEnum = z.enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "PIX"]);

const saleItemSchema = z.object({
  variantId: z.string().uuid("ID do produto inválido."),
  quantity: z.number().int().positive("A quantidade deve ser maior que zero."),
});

export const createSaleSchema = z.object({
  paymentMethod: PaymentMethodEnum,

  // O caixa pode informar quanto o cliente pagou (para calcular troco)
  amountPaid: z.number().positive().optional(),

  // Array de itens (carrinho de compras)
  items: z
    .array(saleItemSchema)
    .min(1, "A venda precisa ter pelo menos um item."),
});
