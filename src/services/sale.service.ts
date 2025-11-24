import { z } from "zod";
import { createSaleSchema } from "../schemas/sale.schema";
import { prisma } from "../config/prisma";

type SaleCreateData = z.infer<typeof createSaleSchema>;

export const SaleService = {
  async create(data: SaleCreateData, userId: string) {
    // Iniciamos uma transação GIGANTE. Se qualquer coisa der errado (estoque insuficiente),
    // o banco desfaz tudo e nada é salvo.
    return prisma.$transaction(async (tx) => {
      let saleTotal = 0;

      // 1. Criar o cabeçalho da Venda (ainda sem total, atualizaremos no fim)
      const sale = await tx.sale.create({
        data: {
          userId: userId,
          paymentMethod: data.paymentMethod,
          total: 0,
          status: "COMPLETED",
        },
      });

      // 2. Processar cada item do carrinho
      for (const item of data.items) {
        // A. Buscar a variante e seu estoque total atual
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        });

        if (!variant)
          throw new Error(`Produto ${item.variantId} não encontrado.`);

        if (variant.stock < item.quantity) {
          throw new Error(
            `Estoque insuficiente para ${variant.name}. Disponível: ${variant.stock}`
          );
        }

        // B. Buscar Lotes disponíveis (FIFO - Vencimento mais próximo primeiro)
        const lots = await tx.lot.findMany({
          where: {
            variantId: item.variantId,
            quantity: { gt: 0 }, // Apenas lotes com saldo
          },
          orderBy: { expirationDate: "asc" }, // <--- O SEGREDO DO FIFO ESTÁ AQUI
        });

        let quantityToDeduct = item.quantity;
        let itemTotal = 0;

        // C. Loop para consumir os lotes
        for (const lot of lots) {
          if (quantityToDeduct <= 0) break;

          // Quanto vamos tirar desse lote específico?
          // Se o lote tem 10 e preciso de 3, tiro 3.
          // Se o lote tem 2 e preciso de 5, tiro 2 e procuro o resto no próximo.
          const quantityTakenFromLot = Math.min(lot.quantity, quantityToDeduct);

          // Atualizar Lote
          await tx.lot.update({
            where: { id: lot.id },
            data: { quantity: { decrement: quantityTakenFromLot } },
          });

          // Criar Item da Venda vinculado a ESSE lote específico
          // Salvamos o preço do momento da venda (histórico)
          const priceAtSale = Number(variant.price);
          const costAtSale = Number(lot.costPrice); // Custo real daquele lote

          await tx.saleItem.create({
            data: {
              saleId: sale.id,
              variantId: variant.id,
              lotId: lot.id,
              quantity: quantityTakenFromLot,
              unitPrice: priceAtSale,
              costPrice: costAtSale,
            },
          });

          // Contabilidade
          quantityToDeduct -= quantityTakenFromLot;
          itemTotal += quantityTakenFromLot * priceAtSale;
        }

        // D. Atualizar estoque total da Variante (Soma simples)
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } },
        });

        saleTotal += itemTotal;
      }

      // 3. Atualizar o total final da venda e troco
      const change = data.amountPaid ? data.amountPaid - saleTotal : 0;

      const finalSale = await tx.sale.update({
        where: { id: sale.id },
        data: {
          total: saleTotal,
          amountPaid: data.amountPaid || saleTotal,
          change: change,
        },
        include: { items: true },
      });

      return finalSale;
    });
  },

  async findAll() {
    return prisma.sale.findMany({
      include: { user: { select: { name: true } }, items: true },
      orderBy: { createdAt: "desc" },
    });
  },
};
