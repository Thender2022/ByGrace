import { PrismaClient, CategoryType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Skateboards', slug: 'skateboards', type: CategoryType.PRODUCT, isActive: true },
    { name: 'T-Shirts', slug: 't-shirts', type: CategoryType.PRODUCT, isActive: true },
    { name: 'Hoodies', slug: 'hoodies', type: CategoryType.PRODUCT, isActive: true },
    { name: 'Hats', slug: 'hats', type: CategoryType.PRODUCT, isActive: true },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('✅ Categories seeded successfully!');
  console.log('📋 Created categories:', categories.map(c => c.name).join(', '));
}

main()
  .catch((e) => {
    console.error('❌ Error seeding categories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });