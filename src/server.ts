import express from "express";
import { prisma } from "./config/prisma"; // <--- Importa a conexão aqui

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Mercadinho funcionando!" });
});

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
