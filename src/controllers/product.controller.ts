import { Request, Response } from "express";
import { ZodError } from "zod";
import { createProductSchema } from "../schemas/product.schema";
import { ProductService } from "../services/product.service";

export const ProductController = {
  async create(req: Request, res: Response) {
    try {
      const data = createProductSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }

      const newProduct = await ProductService.create(data, userId);

      return res.status(201).json(newProduct);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Dados inválidos.", errors: error.issues });
      }
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const products = await ProductService.findAll();
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    // 1. Pegar o ID do usuário logado.
    // Onde fica o ID depende do seu middleware de Auth.
    // Geralmente é req.user.id ou req.userId.
    // Se der erro aqui, verifique como você salva o user no request.
    const userId = req.user?.id || "ID_DE_TESTE";

    try {
      // 2. Passar os DOIS argumentos agora
      await ProductService.delete(id, userId);

      return res.status(204).send();
    } catch (error) {
      // É boa prática tratar o erro
      return res
        .status(400)
        .json({
          error: error instanceof Error ? error.message : "Erro ao deletar",
        });
    }
  },
};
