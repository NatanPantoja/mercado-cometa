import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export const CategoryRepository = {
  async findByName(name: string) {
    return prisma.category.findUnique({
      where: { name },
    });
  },

  async findAll() {
    return prisma.category.findMany();
  },

  async create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({
      data,
    });
  },
};
