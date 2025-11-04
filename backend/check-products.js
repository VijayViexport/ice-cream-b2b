import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProducts() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      sku: true,
      category: true,
      unitPrice: true,
      stock: true,
      images: true
    },
    orderBy: { createdAt: 'desc' }
  });

  console.log(`\n📊 Total Products in Database: ${products.length}\n`);

  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   SKU: ${p.sku} | Category: ${p.category || 'N/A'} | Price: ₹${p.unitPrice} | Stock: ${p.stock}`);
    console.log(`   Images: ${p.images.length} image(s)`);
    console.log('');
  });
}

checkProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
