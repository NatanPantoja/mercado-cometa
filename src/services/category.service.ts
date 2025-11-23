import { z } from "zod";
import { createCategorySchema } from "../schemas/category.schema";
import { CategoryRepository } from "../repositories/category.repository";

type CategoryCreateData = z.infer<typeof createCategorySchema>;

export const CategoryService = {
  async create(data: CategoryCreateData) {
    const existingCategory = await CategoryRepository.findByName(data.name);

    if (existingCategory) {
      throw new Error("Já existe uma categoria com este nome.");
    }

    const category = await CategoryRepository.create(data);
    return category;
  },

  async findAll() {
    return CategoryRepository.findAll();
  },
};
