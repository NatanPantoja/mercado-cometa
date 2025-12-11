/// <reference types="node" />
import { PrismaClient, Unit, PaymentMethod, Role } from "@prisma/client";
import { fakerPT_BR as faker } from "@faker-js/faker"; // Dados em Português

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando a semeadura do banco de dados...");

  // 1. Limpar banco (opcional - cuidado em produção!)
  // await prisma.stockAdjustment.deleteMany();
  // await prisma.saleItem.deleteMany();
  // await prisma.sale.deleteMany();
  // await prisma.lot.deleteMany();
  // await prisma.productVariant.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.category.deleteMany();
  // await prisma.supplier.deleteMany();

  // 2. Criar Categorias Básicas
  const categories = await Promise.all(
    ["Bebidas", "Mercearia", "Limpeza", "Higiene", "Padaria", "Açougue"].map(
      (name) =>
        prisma.category.upsert({
          where: { name },
          update: {},
          create: { name },
        })
    )
  );

  // 3. Criar Fornecedores
  const suppliers: any[] = [];
  for (let i = 0; i < 5; i++) {
    suppliers.push(
      await prisma.supplier.create({
        data: {
          name: faker.company.name(),
          cnpj: faker.string.numeric(14),
          contact: faker.person.fullName(),
          email: faker.internet.email(),
        },
      })
    );
  }

  // 4. Criar Produtos com Variantes e Lotes
  console.log("📦 Criando 50 produtos simulados...");

  for (let i = 0; i < 50; i++) {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomSupplier =
      suppliers[Math.floor(Math.random() * suppliers.length)];

    // Criar o Produto Pai
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        categoryId: randomCategory.id,
        supplierId: randomSupplier.id,
        imageUrl: faker.image.urlLoremFlickr({ category: "food" }), // Gera URL de imagem
      },
    });

    // Criar Variante (Item vendável)
    const price = parseFloat(faker.commerce.price({ min: 5, max: 100 }));
    const cost = price * 0.6; // Custo é 60% do preço

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: `${product.name} ${faker.helpers.arrayElement([
          "200g",
          "1kg",
          "500ml",
          "Grande",
        ])}`,
        sku: faker.string.alphanumeric(8).toUpperCase(),
        barcode: faker.string.numeric(13),
        unit: faker.helpers.enumValue(Unit),
        price: price,
        cost: cost,
        stock: faker.number.int({ min: 10, max: 200 }),
        minStock: 10,
      },
    });

    // Criar Lote (Controle de validade)
    await prisma.lot.create({
      data: {
        variantId: variant.id,
        quantity: variant.stock,
        initialQty: variant.stock,
        costPrice: cost,
        manufactureDate: faker.date.recent({ days: 30 }),
        expirationDate: faker.date.future({ years: 1 }), // Vence daqui a 1 ano
      },
    });
  }

  console.log("✅ Banco de dados preenchido com sucesso!");
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
