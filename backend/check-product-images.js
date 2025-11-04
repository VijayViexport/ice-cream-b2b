import prisma from './src/config/database.js';

async function checkProductImages() {
  try {
    const product = await prisma.product.findFirst({
      select: {
        id: true,
        name: true,
        images: true,
        category: true,
        unitPrice: true,
        sku: true
      }
    });

    console.log('Sample Product Data:');
    console.log(JSON.stringify(product, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductImages();
