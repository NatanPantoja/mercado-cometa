/// <reference types="node" />
import { PrismaClient, PaymentMethod, SaleStatus } from "@prisma/client";
import { fakerPT_BR as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando simulação de Vendas para Dashboard...");

  // 1. Carregar dados necessários (Caixas e Lotes com estoque)
  const cashiers = await prisma.user.findMany();
  const availableLots = await prisma.lot.findMany({
    where: { quantity: { gt: 5 } }, // Pegar lotes com pelo menos 5 itens
    include: { variant: true },
  });

  if (cashiers.length === 0 || availableLots.length === 0) {
    throw new Error(
      "❌ Precisa ter usuários e produtos no banco. Rode o seed primeiro."
    );
  }

  console.log(
    `📊 Temos ${availableLots.length} produtos disponíveis para venda.`
  );

  // 2. Loop para criar 50 Vendas
  for (let i = 0; i < 50; i++) {
    // Escolher aleatórios
    const cashier = cashiers[Math.floor(Math.random() * cashiers.length)];
    const numItems = faker.number.int({ min: 1, max: 6 }); // 1 a 6 produtos por venda

    // "Viajar no tempo": Data aleatória nos últimos 30 dias
    const saleDate = faker.date.recent({ days: 30 });

    // Selecionar itens para este carrinho (sem repetir o mesmo lote na mesma venda para simplificar)
    const shuffledLots = availableLots.sort(() => 0.5 - Math.random());
    const selectedLots = shuffledLots.slice(0, numItems);

    let saleTotal = 0;
    const saleItemsData: any[] = [];

    // Preparar os itens da venda
    for (const lot of selectedLots) {
      const qty = faker.number.int({ min: 1, max: 3 }); // 1 a 3 unidades de cada
      const price = Number(lot.variant.price);
      const cost = Number(lot.variant.cost);

      saleTotal += price * qty;

      saleItemsData.push({
        lotId: lot.id,
        variantId: lot.variantId,
        quantity: qty,
        unitPrice: price,
        costPrice: cost,
      });
    }

    // 3. Executar a Transação no Banco
    await prisma.$transaction(async (tx) => {
      // A. Criar a Venda com data passada
      const sale = await tx.sale.create({
        data: {
          userId: cashier.id,
          total: saleTotal,
          amountPaid: saleTotal,
          change: 0,
          paymentMethod: faker.helpers.enumValue(PaymentMethod), // Pix, Dinheiro, Cartão aleatório
          status: SaleStatus.COMPLETED,
          createdAt: saleDate, // <--- O PULO DO GATO: Data no passado
        },
      });

      // B. Processar cada item
      for (const item of saleItemsData) {
        // Criar SaleItem
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            ...item,
          },
        });

        // Baixar Estoque Variante
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });

        // Baixar Estoque Lote
        await tx.lot.update({
          where: { id: item.lotId },
          data: { quantity: { decrement: item.quantity } },
        });
      }
    });

    console.log(
      `[${i + 1}/50] Venda de R$ ${saleTotal.toFixed(
        2
      )} em ${saleDate.toLocaleDateString()}`
    );
  }

  console.log("\n✅ Dashboard populado! Agora você tem dados históricos.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
