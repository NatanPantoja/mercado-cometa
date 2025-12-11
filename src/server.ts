import express from "express";
import { prisma } from "./config/prisma";
import cors from "cors";
import helmet from "helmet";
import { userRoutes } from "./routes/user.routes";
import { authRoutes } from "./routes/auth.routes";
import { categoryRoutes } from "./routes/category.routes";
import { supplierRoutes } from "./routes/supplier.routes";
import { productRoutes } from "./routes/product.routes";
import { variantRoutes } from "./routes/variant.routes";
import { lotRoutes } from "./routes/lot.routes";
import { saleRoutes } from "./routes/sale.routes";
import { alertRoutes } from "./routes/alert.routes";
import { dashboardRoutes } from "./routes/dashboard.routes";

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173", // fazendo isso, apenas o frontend nessa origem poderá acessar a API
  })
);
const PORT = process.env.PORT || 3333;

app.use(express.json());

//ROUTES

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/products", productRoutes);
app.use("/variants", variantRoutes);
app.use("/lots", lotRoutes);
app.use("/sales", saleRoutes);
app.use("/alerts", alertRoutes);
app.use("/dashboard", dashboardRoutes);

// Inicia o servidor
async function main() {
  try {
    // Tenta conectar ao banco antes de subir a porta
    await prisma.$connect();
    console.log("✅ Banco de dados conectado com sucesso!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao conectar no banco:", error);
    process.exit(1);
  }
}

main();
