import { Request, Response } from "express";
import { ZodError } from "zod";
import { createProductSchema } from "../schemas/product.schema";
import { ProductService } from "../services/product.service";

export const ProductController = {
  async create(req: Request, res: Response) {
    try {
      const data = createProductSchema.parse(req.body);
      const newProduct = await ProductService.create(data);
      return res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Dados inválidos.", errors: error.issues });
      }
      if (error instanceof Error) {
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
};
