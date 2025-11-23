import { Request, Response } from "express";
import { ZodError } from "zod";
import { createCategorySchema } from "../schemas/category.schema";
import { CategoryService } from "../services/category.service";

export const CategoryController = {
  async create(req: Request, res: Response) {
    try {
      const data = createCategorySchema.parse(req.body);
      const newCategory = await CategoryService.create(data);
      return res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Dados inválidos.", errors: error.issues });
      }
      if (error instanceof Error) {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const categories = await CategoryService.findAll();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },
};
