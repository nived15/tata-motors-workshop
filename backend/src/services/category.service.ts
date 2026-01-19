import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateCategoryData {
  name: string;
  color?: string;
  userId: string;
}

export const getCategories = async (userId: string) => {
  // Get default categories and user's custom categories
  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { isDefault: true },
        { userId },
      ],
    },
    orderBy: [
      { isDefault: 'desc' },
      { name: 'asc' },
    ],
  });

  return categories;
};

export const createCategory = async (data: CreateCategoryData) => {
  // Check if category name already exists for this user
  const existing = await prisma.category.findFirst({
    where: {
      name: data.name,
      userId: data.userId,
    },
  });

  if (existing) {
    throw new Error('A category with this name already exists');
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      color: data.color || '#3B82F6',
      userId: data.userId,
      isDefault: false,
    },
  });

  return category;
};
