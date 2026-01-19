import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default categories
  const defaultCategories = [
    { name: 'Salary', color: '#10B981', isDefault: true },
    { name: 'Freelance', color: '#3B82F6', isDefault: true },
    { name: 'Investment', color: '#8B5CF6', isDefault: true },
    { name: 'Gift', color: '#F59E0B', isDefault: true },
    { name: 'Other', color: '#6B7280', isDefault: true },
  ];

  for (const category of defaultCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        name: category.name,
        isDefault: true,
        userId: null,
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: category,
      });
    }
  }

  console.log('Default categories created successfully');

  // Optional: Create a test user (for development only)
  if (process.env.NODE_ENV === 'development') {
    const bcrypt = require('bcryptjs');
    const testPassword = await bcrypt.hash('Test123!@#', 12);

    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        passwordHash: testPassword,
        firstName: 'Test',
        lastName: 'User',
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    console.log('Test user created:', testUser.email);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
