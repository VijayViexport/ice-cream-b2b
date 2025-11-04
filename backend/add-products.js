import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addProducts() {
  console.log('🍦 Adding 10 more premium products...');

  const newProducts = await Promise.all([
    // Premium Dessert Collection
    prisma.product.create({
      data: {
        sku: 'ICE-TIRAMISU-5L-PREM',
        name: 'Classic Tiramisu Gelato',
        description: 'Authentic Italian tiramisu transformed into creamy gelato. Layers of mascarpone cream, espresso-soaked ladyfingers, and dusted cocoa powder. A coffee lover dream dessert.',
        category: 'Premium Dessert',
        packSize: '5L Tub',
        unitPrice: 695.0,
        stock: 95,
        reorderThreshold: 35,
        images: [
          'https://images.unsplash.com/photo-1561487138-99ccf59b135c?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1616690710722-c99f7ab0648d?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 270kcal, Fat 15g, Carbs 30g, Protein 5g, Sugar 26g',
        allergens: ['Milk', 'Eggs', 'Wheat', 'Soy'],
        featured: true,
        tieredPricing: {
          create: [
            { minQuantity: 10, price: 675.0 },
            { minQuantity: 50, price: 655.0 },
          ],
        },
      },
    }),

    prisma.product.create({
      data: {
        sku: 'ICE-BROWNIE-5L-FUDGE',
        name: 'Fudge Brownie Explosion',
        description: 'Rich chocolate ice cream loaded with chunks of gooey fudge brownies and chocolate fudge swirl. Made with real Belgian chocolate brownies. Decadent and indulgent.',
        category: 'Premium Dessert',
        packSize: '5L Tub',
        unitPrice: 625.0,
        stock: 135,
        reorderThreshold: 40,
        images: [
          'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 295kcal, Fat 16g, Carbs 36g, Protein 5g, Sugar 30g',
        allergens: ['Milk', 'Eggs', 'Wheat', 'Soy'],
        featured: true,
      },
    }),

    prisma.product.create({
      data: {
        sku: 'ICE-CHEESCAPE-5L-BERRY',
        name: 'New York Cheesecake with Berries',
        description: 'Creamy cheesecake ice cream with graham cracker crust pieces and mixed berry swirl. Inspired by classic New York cheesecake. Rich, tangy, and sweet.',
        category: 'Premium Dessert',
        packSize: '5L Tub',
        unitPrice: 675.0,
        stock: 105,
        reorderThreshold: 35,
        images: [
          'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 280kcal, Fat 15g, Carbs 32g, Protein 4g, Sugar 28g',
        allergens: ['Milk', 'Eggs', 'Wheat'],
        featured: false,
      },
    }),

    // Tropical Paradise Collection
    prisma.product.create({
      data: {
        sku: 'ICE-COCONUT-5L-TROP',
        name: 'Tropical Coconut Paradise',
        description: 'Fresh coconut cream blended with pineapple chunks and toasted coconut flakes. Transport yourself to a tropical beach. Refreshing and exotic.',
        category: 'Tropical Paradise',
        packSize: '5L Tub',
        unitPrice: 565.0,
        stock: 145,
        reorderThreshold: 45,
        images: [
          'https://images.unsplash.com/photo-1572443484048-b6ba3fbe88fe?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1569701419328-19d8de7ee769?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 220kcal, Fat 13g, Carbs 26g, Protein 2g, Sugar 24g',
        allergens: ['Coconut', 'Milk'],
        featured: false,
      },
    }),

    prisma.product.create({
      data: {
        sku: 'ICE-PASSION-5L-MANGO',
        name: 'Passion Fruit & Mango Swirl',
        description: 'Tangy passion fruit sorbet swirled with sweet Alphonso mango cream. Perfectly balanced tropical flavors. Refreshing and vibrant.',
        category: 'Tropical Paradise',
        packSize: '5L Tub',
        unitPrice: 595.0,
        stock: 115,
        reorderThreshold: 40,
        images: [
          'https://images.unsplash.com/photo-1591206369811-4eeb2f03bc95?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1560008581-09b0e155f6f6?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 190kcal, Fat 8g, Carbs 30g, Protein 2g, Sugar 27g',
        allergens: ['Milk'],
        featured: false,
      },
    }),

    // Nutty Delights Collection
    prisma.product.create({
      data: {
        sku: 'ICE-ALMOND-5L-PRALINE',
        name: 'Toasted Almond Praline',
        description: 'Creamy almond ice cream with crunchy caramelized almond praline pieces. Made with California almonds. Nutty, sweet, and crunchy.',
        category: 'Nutty Delights',
        packSize: '5L Tub',
        unitPrice: 615.0,
        stock: 125,
        reorderThreshold: 40,
        images: [
          'https://images.unsplash.com/photo-1590997652117-09e39f700315?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 270kcal, Fat 16g, Carbs 29g, Protein 6g, Sugar 25g',
        allergens: ['Milk', 'Almonds', 'Tree Nuts', 'Eggs'],
        featured: false,
      },
    }),

    prisma.product.create({
      data: {
        sku: 'ICE-CASHEW-5L-SAFFRON',
        name: 'Cashew Saffron Kulfi',
        description: 'Traditional Indian kulfi with cashew nuts and premium Kashmiri saffron. Dense, creamy, and aromatic. An authentic Indian dessert experience.',
        category: 'Nutty Delights',
        packSize: '5L Tub',
        unitPrice: 745.0,
        stock: 75,
        reorderThreshold: 25,
        images: [
          'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1567327519515-3b6c8f64e2eb?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 285kcal, Fat 17g, Carbs 30g, Protein 6g, Sugar 27g',
        allergens: ['Milk', 'Cashews', 'Tree Nuts', 'Eggs'],
        featured: true,
      },
    }),

    // Candy Shop Collection
    prisma.product.create({
      data: {
        sku: 'ICE-BUBBLE-5L-GUM',
        name: 'Bubble Gum Pop',
        description: 'Fun pink bubble gum flavored ice cream with candy pieces. Nostalgic and playful. Perfect for kids and the young at heart.',
        category: 'Candy Shop',
        packSize: '5L Tub',
        unitPrice: 495.0,
        stock: 165,
        reorderThreshold: 50,
        images: [
          'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 230kcal, Fat 11g, Carbs 32g, Protein 3g, Sugar 29g',
        allergens: ['Milk', 'Eggs', 'Soy'],
        featured: false,
      },
    }),

    prisma.product.create({
      data: {
        sku: 'ICE-CARAMEL-5L-POPCORN',
        name: 'Caramel Popcorn Crunch',
        description: 'Sweet cream ice cream with ribbons of caramel and crunchy caramel popcorn pieces. Movie theater vibes. Sweet, salty, and crunchy.',
        category: 'Candy Shop',
        packSize: '5L Tub',
        unitPrice: 575.0,
        stock: 140,
        reorderThreshold: 45,
        images: [
          'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 265kcal, Fat 14g, Carbs 34g, Protein 4g, Sugar 30g',
        allergens: ['Milk', 'Corn', 'Eggs'],
        featured: false,
      },
    }),

    // Premium Rare Flavors
    prisma.product.create({
      data: {
        sku: 'ICE-LAVENDER-5L-HONEY',
        name: 'Lavender Honey Dream',
        description: 'Delicate lavender-infused cream with swirls of wildflower honey. Floral, elegant, and soothing. A sophisticated European-inspired flavor.',
        category: 'Premium Rare',
        packSize: '5L Tub',
        unitPrice: 725.0,
        stock: 65,
        reorderThreshold: 25,
        images: [
          'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 215kcal, Fat 11g, Carbs 28g, Protein 3g, Sugar 26g',
        allergens: ['Milk', 'Eggs'],
        featured: true,
        tieredPricing: {
          create: [
            { minQuantity: 10, price: 705.0 },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Added ${newProducts.length} premium products`);
  console.log('\nNew Products Summary:');
  newProducts.forEach(p => {
    console.log(`  - ${p.name} (${p.sku}) - ₹${p.unitPrice}`);
  });
}

addProducts()
  .catch((e) => {
    console.error('❌ Failed to add products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
