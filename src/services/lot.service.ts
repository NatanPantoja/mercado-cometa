import { z } from "zod";
import { createLotSchema } from "../schemas/lot.schema";
import { prisma } from "../config/prisma";

type LotCreateData = z.infer<typeof createLotSchema>;

export const LotService = {
  async create(data: LotCreateData) {
    // 1. Verificar se a Variante existe
    const variant = await prisma.productVariant.findUnique({
      where: { id: data.variantId },
    });

    if (!variant) {
      throw new Error("Variante não encontrada.");
    }

    // 2. Transação Atômica (Tudo ou Nada)
    const result = await prisma.$transaction(async (tx) => {
      // Passo A: Criar o Lote
      const newLot = await tx.lot.create({
        data: {
          variantId: data.variantId,
          quantity: data.quantity,
          initialQty: data.quantity, // Guarda quanto entrou originalmente
          costPrice: data.costPrice,
          expirationDate: data.expirationDate,
          manufactureDate: data.manufactureDate,
        },
      });

      // Passo B: Atualizar o Estoque Total da Variante
      // Incrementamos o valor atual + a quantidade do lote
      await tx.productVariant.update({
        where: { id: data.variantId },
        data: {
          stock: {
            increment: data.quantity,
          },
          // Opcional: Atualizar o custo médio se quiser, mas vamos manter simples por enquanto
        },
      });

      return newLot;
    });

    return result;
  },

  async findAll() {
    // Aqui poderíamos filtrar lotes vencidos, mas vamos listar todos por enquanto
    return prisma.lot.findMany({
      include: { variant: true },
    });
  },
};
