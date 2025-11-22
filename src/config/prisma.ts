import { PrismaClient } from "@prisma/client";

// Evita instanciar vários clients durante o Hot-Reload (desenvolvimento)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Opcional: mostra as queries SQL no terminal (bom para debugar)
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
