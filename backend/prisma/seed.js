import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed with high-quality data...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.rFQ.deleteMany();
  await prisma.customPricing.deleteMany();
  await prisma.tieredPricing.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.settings.deleteMany();

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 1. Create Admin User
  console.log('👤 Creating admin user...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ice.com',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'APPROVED',
      businessName: 'ICE Premium Artisan Creamery',
      primaryContactName: 'Sarah Anderson',
      phone: '+919876543210',
      businessAddress: 'Factory Road, Andheri East, Mumbai 400069',
      businessType: 'OTHER',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // 2. Create Sample Buyers
  console.log('👥 Creating buyer accounts...');
  const buyers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'sweetcorner@example.com',
        password: hashedPassword,
        role: 'BUYER',
        status: 'APPROVED',
        businessName: 'Sweet Corner Desserts',
        primaryContactName: 'Rajesh Kumar',
        phone: '+919876543211',
        businessAddress: 'Shop 45, Linking Road, Bandra West, Mumbai 400050',
        businessType: 'RETAIL_SHOP',
        yearsInBusiness: 8,
        gstin: '27AABCS9876M1Z5',
      },
    }),
    prisma.user.create({
      data: {
        email: 'creamycafe@example.com',
        password: hashedPassword,
        role: 'BUYER',
        status: 'APPROVED',
        businessName: 'The Creamy Café',
        primaryContactName: 'Priya Mehta',
        phone: '+919876543212',
        businessAddress: 'Ground Floor, Phoenix Mall, Lower Parel, Mumbai 400013',
        businessType: 'RESTAURANT',
        yearsInBusiness: 5,
        gstin: '27AABCU9603R1ZM',
      },
    }),
    prisma.user.create({
      data: {
        email: 'mumbaidistro@example.com',
        password: hashedPassword,
        role: 'BUYER',
        status: 'APPROVED',
        businessName: 'Mumbai Food Distributors Pvt Ltd',
        primaryContactName: 'Amit Shah',
        phone: '+919876543213',
        businessAddress: 'Warehouse 12, Goregaon Industrial Estate, Mumbai 400063',
        businessType: 'DISTRIBUTOR',
        yearsInBusiness: 15,
        gstin: '27AABCU9603R1ZN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'iceparadise@example.com',
        password: hashedPassword,
        role: 'BUYER',
        status: 'APPROVED',
        businessName: 'Ice Paradise Parlour',
        primaryContactName: 'Sneha Desai',
        phone: '+919876543214',
        businessAddress: 'Shop 8, Juhu Tara Road, Juhu, Mumbai 400049',
        businessType: 'RESTAURANT',
        yearsInBusiness: 3,
      },
    }),
    prisma.user.create({
      data: {
        email: 'frozendreams@example.com',
        password: hashedPassword,
        role: 'BUYER',
        status: 'PENDING',
        businessName: 'Frozen Dreams',
        primaryContactName: 'Arjun Patel',
        phone: '+919876543215',
        businessAddress: 'Shop 23, Hill Road, Bandra West, Mumbai 400050',
        businessType: 'RETAIL_SHOP',
        yearsInBusiness: 1,
      },
    }),
  ]);
  console.log('✅ Created', buyers.length, 'buyers');

  // 3. Create Premium Ice Cream Products with High-Quality Images
  console.log('🍦 Creating premium ice cream products...');
  const products = await Promise.all([
    // Classic Premium Collection
    prisma.product.create({
      data: {
        sku: 'ICE-VAN-5L-PREM',
        name: 'Madagascar Vanilla Bean',
        description: 'Luxurious vanilla ice cream crafted with hand-selected Madagascar bourbon vanilla beans. Each spoonful reveals visible vanilla specks and delivers a rich, creamy texture with authentic vanilla flavor. Perfect for dessert pairing or standalone indulgence.',
        category: 'Classic Premium',
        packSize: '5L Tub',
        unitPrice: 495.0,
        stock: 200,
        reorderThreshold: 60,
        images: [
          'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 207kcal, Fat 11g, Carbs 24g, Protein 4g, Sugar 21g',
        allergens: ['Milk', 'Eggs'],
        featured: true,
        tieredPricing: {
          create: [
            { minQuantity: 10, price: 480.0 },
            { minQuantity: 50, price: 460.0 },
            { minQuantity: 100, price: 440.0 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ICE-CHOC-5L-DARK',
        name: 'Belgian Dark Chocolate',
        description: 'Decadent dark chocolate ice cream made with 70% Belgian cocoa. Rich, intense chocolate flavor balanced with premium cream for a velvety smooth texture. A chocolate lover\'s ultimate dream.',
        category: 'Classic Premium',
        packSize: '5L Tub',
        unitPrice: 525.0,
        stock: 180,
        reorderThreshold: 50,
        images: [
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 245kcal, Fat 14g, Carbs 28g, Protein 5g, Sugar 24g',
        allergens: ['Milk', 'Soy', 'Eggs'],
        featured: true,
        tieredPricing: {
          create: [
            { minQuantity: 10, price: 510.0 },
            { minQuantity: 50, price: 490.0 },
            { minQuantity: 100, price: 470.0 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ICE-STRAW-5L-PREM',
        name: 'Fresh Strawberry Cream',
        description: 'Made with handpicked, sun-ripened strawberries blended into smooth cream. Bursting with real fruit flavor and natural sweetness. No artificial colors or flavors.',
        category: 'Fruity Delights',
        packSize: '5L Tub',
        unitPrice: 485.0,
        stock: 160,
        reorderThreshold: 50,
        images: [
          'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1560008581-09b0e155f6f6?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 195kcal, Fat 10g, Carbs 26g, Protein 3g, Sugar 23g',
        allergens: ['Milk', 'Eggs'],
        featured: true,
      },
    }),

    // Artisan Gourmet Collection
    prisma.product.create({
      data: {
        sku: 'ICE-PISTA-5L-ROYAL',
        name: 'Royal Pistachio Baklava',
        description: 'Pure roasted pistachio cream with honey-glazed baklava pieces. Crafted with Californian pistachios for a rich, nutty flavor with hints of rose water. A Middle Eastern-inspired masterpiece.',
        category: 'Artisan Gourmet',
        packSize: '5L Tub',
        unitPrice: 650.0,
        stock: 120,
        reorderThreshold: 40,
        images: [
          'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1567327519515-3b6c8f64e2eb?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1590997652117-09e39f700315?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 275kcal, Fat 16g, Carbs 30g, Protein 6g, Sugar 26g',
        allergens: ['Milk', 'Pistachios', 'Tree Nuts', 'Wheat', 'Eggs'],
        featured: true,
        tieredPricing: {
          create: [
            { minQuantity: 10, price: 630.0 },
            { minQuantity: 50, price: 610.0 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ICE-CARA-5L-SALT',
        name: 'Salted Caramel Bliss',
        description: 'Handcrafted salted caramel swirled through premium vanilla base. Made with slow-cooked caramel and Himalayan pink salt. Sweet and salty perfection in every bite.',
        category: 'Artisan Gourmet',
        packSize: '5L Tub',
        unitPrice: 595.0,
        stock: 150,
        reorderThreshold: 45,
        images: [
          'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1582716401138-0b3b1c7d4b49?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 265kcal, Fat 13g, Carbs 35g, Protein 4g, Sugar 32g',
        allergens: ['Milk', 'Eggs'],
        featured: true,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ICE-MANGO-5L-ALPHONSO',
        name: 'Alphonso Mango Sorbet',
        description: 'Made with the king of mangoes - authentic Alphonso from Ratnagiri. Pure mango pulp blended with cream for an authentic Indian summer treat. Limited seasonal availability.',
        category: 'Fruity Delights',
        packSize: '5L Tub',
        unitPrice: 550.0,
        stock: 95,
        reorderThreshold: 40,
        images: [
          'https://images.unsplash.com/photo-1591206369811-4eeb2f03bc95?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1589780342656-0e5e282f3c4c?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 185kcal, Fat 8g, Carbs 30g, Protein 2g, Sugar 28g',
        allergens: ['Milk'],
        featured: true,
      },
    }),

    // Exotic Signature Collection
    prisma.product.create({
      data: {
        sku: 'ICE-MATCHA-5L-KYOTO',
        name: 'Kyoto Matcha Green Tea',
        description: 'Premium ceremonial-grade matcha from Kyoto, Japan. Earthy, smooth green tea flavor with a natural sweetness. Antioxidant-rich and authentically Japanese.',
        category: 'Exotic Signature',
        packSize: '5L Tub',
        unitPrice: 695.0,
        stock: 85,
        reorderThreshold: 30,
        images: [
          'https://images.unsplash.com/photo-1630508954039-a4e81ea820b1?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1626509653291-18d6b302a8db?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 210kcal, Fat 11g, Carbs 26g, Protein 4g, Sugar 22g',
        allergens: ['Milk', 'Eggs'],
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ICE-HAZEL-5L-PRALINE',
        name: 'Hazelnut Chocolate Praline',
        description: 'Roasted Italian hazelnuts blended with Swiss chocolate and crunchy praline pieces. Inspired by European patisseries. A sophisticated, nutty indulgence.',
        category: 'Exotic Signature',
        packSize: '5L Tub',
        unitPrice: 625.0,
        stock: 110,
        reorderThreshold: 35,
        images: [
          'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 290kcal, Fat 18g, Carbs 30g, Protein 6g, Sugar 25g',
        allergens: ['Milk', 'Hazelnuts', 'Tree Nuts', 'Soy', 'Eggs'],
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ICE-BERRY-5L-TRIPLE',
        name: 'Triple Berry Compote',
        description: 'A harmonious blend of blueberries, raspberries, and blackberries swirled with vanilla cream. Each berry handpicked for optimal sweetness. A berry lover\'s paradise.',
        category: 'Fruity Delights',
        packSize: '5L Tub',
        unitPrice: 565.0,
        stock: 130,
        reorderThreshold: 40,
        images: [
          'https://images.unsplash.com/photo-1560008511-69a3da49cef4?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1546119031-d44ac18c88b1?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 200kcal, Fat 10g, Carbs 28g, Protein 3g, Sugar 25g',
        allergens: ['Milk', 'Eggs'],
        featured: false,
      },
    }),

    // Classic Comfort Collection
    prisma.product.create({
      data: {
        sku: 'ICE-BUTTER-5L-SCOTCH',
        name: 'Classic Butterscotch Crunch',
        description: 'Traditional butterscotch ice cream loaded with crunchy caramelized butter-sugar pieces. A nostalgic favorite with the perfect balance of sweet and buttery flavors.',
        category: 'Classic Comfort',
        packSize: '5L Tub',
        unitPrice: 475.0,
        stock: 170,
        reorderThreshold: 50,
        images: [
          'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 235kcal, Fat 12g, Carbs 30g, Protein 4g, Sugar 27g',
        allergens: ['Milk', 'Eggs', 'Tree Nuts'],
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ICE-COOKIE-5L-CREAM',
        name: 'Cookies & Cream Dream',
        description: 'Premium vanilla ice cream packed with chunky chocolate cookie pieces. Made with crushed Oreo-style cookies for maximum crunch. A timeless crowd-pleaser.',
        category: 'Classic Comfort',
        packSize: '5L Tub',
        unitPrice: 510.0,
        stock: 155,
        reorderThreshold: 45,
        images: [
          'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1581887073032-e52e5e8db32d?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 255kcal, Fat 13g, Carbs 32g, Protein 4g, Sugar 28g',
        allergens: ['Milk', 'Wheat', 'Soy', 'Eggs'],
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ICE-MINT-5L-CHOC',
        name: 'Mint Chocolate Chip',
        description: 'Refreshing natural mint ice cream studded with premium dark chocolate chips. Made with real peppermint extract for authentic cooling sensation. Cool, crisp, and chocolatey.',
        category: 'Classic Comfort',
        packSize: '5L Tub',
        unitPrice: 495.0,
        stock: 140,
        reorderThreshold: 40,
        images: [
          'https://images.unsplash.com/photo-1560008511-69a3da49cef4?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1626509653291-18d6b302a8db?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 240kcal, Fat 13g, Carbs 28g, Protein 4g, Sugar 24g',
        allergens: ['Milk', 'Soy', 'Eggs'],
        featured: false,
      },
    }),

    // Vegan & Special Diet Collection
    prisma.product.create({
      data: {
        sku: 'ICE-VEGAN-5L-CHOC',
        name: 'Vegan Dark Chocolate',
        description: 'Rich, creamy dark chocolate made with coconut milk and cocoa. 100% plant-based, dairy-free, and egg-free. Indulgence without compromise.',
        category: 'Vegan Special',
        packSize: '5L Tub',
        unitPrice: 585.0,
        stock: 90,
        reorderThreshold: 30,
        images: [
          'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1626509653291-18d6b302a8db?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 220kcal, Fat 14g, Carbs 26g, Protein 2g, Sugar 23g',
        allergens: ['Coconut', 'Soy'],
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ICE-VEGAN-5L-STRAW',
        name: 'Vegan Strawberry Coconut',
        description: 'Fresh strawberries blended with coconut cream for a tropical twist. Dairy-free, egg-free, and naturally sweet. Perfect for vegan customers.',
        category: 'Vegan Special',
        packSize: '5L Tub',
        unitPrice: 565.0,
        stock: 75,
        reorderThreshold: 25,
        images: [
          'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1560008581-09b0e155f6f6?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 195kcal, Fat 12g, Carbs 24g, Protein 1g, Sugar 21g',
        allergens: ['Coconut'],
        featured: false,
      },
    }),

    // Limited Edition Seasonal
    prisma.product.create({
      data: {
        sku: 'ICE-SAFFRON-5L-ROYAL',
        name: 'Royal Saffron Kesar',
        description: 'Luxurious ice cream infused with Kashmiri saffron strands and cardamom. Inspired by traditional Indian kulfi. A royal treat with exotic spices.',
        category: 'Limited Edition',
        packSize: '5L Tub',
        unitPrice: 795.0,
        stock: 60,
        reorderThreshold: 20,
        images: [
          'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&h=1400&fit=crop&q=85',
          'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=1200&h=1400&fit=crop&q=85'
        ],
        nutrition: 'Per 100g: Calories 250kcal, Fat 13g, Carbs 30g, Protein 5g, Sugar 27g',
        allergens: ['Milk', 'Pistachios', 'Tree Nuts', 'Eggs'],
        featured: true,
        tieredPricing: {
          create: [
            { minQuantity: 10, price: 770.0 },
            { minQuantity: 50, price: 750.0 },
          ],
        },
      },
    }),

    // Single Serve Cups - High Turnover
    prisma.product.create({
      data: {
        sku: 'ICE-CUP-500ML-VAN',
        name: 'Vanilla Bean Cup 500ml',
        description: 'Premium Madagascar vanilla in convenient single-serve cup. Perfect for retail.',
        category: 'Single Serve',
        packSize: '500ml Cup',
        unitPrice: 85.0,
        stock: 500,
        reorderThreshold: 100,
        images: [
          'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&h=1000&fit=crop&q=85',
        ],
        nutrition: 'Per 100g: Calories 207kcal, Fat 11g, Carbs 24g, Protein 4g',
        allergens: ['Milk', 'Eggs'],
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ICE-CUP-500ML-CHOC',
        name: 'Dark Chocolate Cup 500ml',
        description: 'Rich Belgian dark chocolate in convenient single-serve cup.',
        category: 'Single Serve',
        packSize: '500ml Cup',
        unitPrice: 95.0,
        stock: 450,
        reorderThreshold: 100,
        images: [
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=1000&fit=crop&q=85',
        ],
        nutrition: 'Per 100g: Calories 245kcal, Fat 14g, Carbs 28g, Protein 5g',
        allergens: ['Milk', 'Soy', 'Eggs'],
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ICE-CUP-500ML-STRAW',
        name: 'Strawberry Cream Cup 500ml',
        description: 'Fresh strawberry cream in convenient single-serve cup.',
        category: 'Single Serve',
        packSize: '500ml Cup',
        unitPrice: 90.0,
        stock: 400,
        reorderThreshold: 100,
        images: [
          'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&h=1000&fit=crop&q=85',
        ],
        nutrition: 'Per 100g: Calories 195kcal, Fat 10g, Carbs 26g, Protein 3g',
        allergens: ['Milk', 'Eggs'],
        featured: false,
      },
    }),

    // Low Stock Items (for testing admin alerts)
    prisma.product.create({
      data: {
        sku: 'ICE-ROSE-5L-LIMITED',
        name: 'Rose Petal Gelato - LIMITED',
        description: 'Delicate rose water gelato with candied rose petals. Limited seasonal batch.',
        category: 'Limited Edition',
        packSize: '5L Tub',
        unitPrice: 725.0,
        stock: 15, // Low stock for testing
        reorderThreshold: 20,
        images: [
          'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=1200&h=1400&fit=crop&q=85',
        ],
        nutrition: 'Per 100g: Calories 215kcal, Fat 11g, Carbs 27g, Protein 3g',
        allergens: ['Milk', 'Eggs'],
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ICE-COFFEE-5L-ESPRESSO',
        name: 'Espresso Coffee Swirl',
        description: 'Bold Italian espresso ribboned through creamy coffee ice cream. Coffee house quality.',
        category: 'Artisan Gourmet',
        packSize: '5L Tub',
        unitPrice: 545.0,
        stock: 8, // Very low stock for urgent reorder alert
        reorderThreshold: 30,
        images: [
          'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=1200&h=1400&fit=crop&q=85',
        ],
        nutrition: 'Per 100g: Calories 225kcal, Fat 12g, Carbs 27g, Protein 4g',
        allergens: ['Milk', 'Eggs'],
        featured: false,
      },
    }),
  ]);
  console.log('✅ Created', products.length, 'premium products');

  // 4. Create Custom Pricing for VIP Customers
  console.log('💰 Creating custom pricing...');
  const distributor = buyers[2]; // Mumbai Food Distributors
  await Promise.all([
    prisma.customPricing.create({
      data: {
        userId: distributor.id,
        productId: products[0].id, // Madagascar Vanilla
        price: 440.0, // VIP distributor price
      },
    }),
    prisma.customPricing.create({
      data: {
        userId: distributor.id,
        productId: products[1].id, // Belgian Dark Chocolate
        price: 470.0,
      },
    }),
  ]);
  console.log('✅ Custom pricing created for VIP customers');

  // 5. Create Realistic Sample Orders with Multiple Items
  console.log('📦 Creating sample orders...');

  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2025-0147',
      userId: buyers[0].id, // Sweet Corner Desserts
      subtotal: 4755.0,
      total: 4755.0,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      shippingAddress: buyers[0].businessAddress,
      paymentReceivedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      dispatchedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      trackingNumber: 'DTH1234567890',
      courier: 'Blue Dart Express',
      items: {
        create: [
          {
            productId: products[0].id, // Madagascar Vanilla
            quantity: 5,
            unitPrice: 480.0,
            lineTotal: 2400.0,
          },
          {
            productId: products[1].id, // Belgian Dark Chocolate
            quantity: 3,
            unitPrice: 510.0,
            lineTotal: 1530.0,
          },
          {
            productId: products[2].id, // Fresh Strawberry
            quantity: 2,
            unitPrice: 485.0,
            lineTotal: 970.0,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2025-0148',
      userId: buyers[1].id, // The Creamy Café
      subtotal: 6850.0,
      total: 6850.0,
      status: 'DISPATCHED',
      paymentStatus: 'PAID',
      shippingAddress: buyers[1].businessAddress,
      paymentReceivedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      dispatchedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      trackingNumber: 'FDX9876543210',
      courier: 'FedEx Priority',
      items: {
        create: [
          {
            productId: products[3].id, // Royal Pistachio
            quantity: 5,
            unitPrice: 630.0,
            lineTotal: 3150.0,
          },
          {
            productId: products[4].id, // Salted Caramel
            quantity: 4,
            unitPrice: 595.0,
            lineTotal: 2380.0,
          },
          {
            productId: products[14].id, // Saffron Kesar
            quantity: 2,
            unitPrice: 770.0,
            lineTotal: 1540.0,
          },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2025-0149',
      userId: buyers[2].id, // Mumbai Food Distributors
      subtotal: 23500.0,
      total: 23500.0,
      status: 'PAID',
      paymentStatus: 'PAID',
      shippingAddress: buyers[2].businessAddress,
      paymentReceivedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          {
            productId: products[0].id, // Madagascar Vanilla (VIP pricing)
            quantity: 20,
            unitPrice: 440.0,
            lineTotal: 8800.0,
          },
          {
            productId: products[1].id, // Belgian Dark Chocolate (VIP pricing)
            quantity: 15,
            unitPrice: 470.0,
            lineTotal: 7050.0,
          },
          {
            productId: products[2].id, // Fresh Strawberry
            quantity: 10,
            unitPrice: 485.0,
            lineTotal: 4850.0,
          },
          {
            productId: products[9].id, // Butterscotch
            quantity: 6,
            unitPrice: 475.0,
            lineTotal: 2850.0,
          },
        ],
      },
    },
  });

  const order4 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2025-0150',
      userId: buyers[3].id, // Ice Paradise Parlour
      subtotal: 3640.0,
      total: 3640.0,
      status: 'PENDING_PAYMENT',
      paymentStatus: 'PENDING',
      shippingAddress: buyers[3].businessAddress,
      paymentProofUrl: 'https://example.com/payment-proof-150.jpg',
      stockReservedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
      items: {
        create: [
          {
            productId: products[10].id, // Cookies & Cream
            quantity: 4,
            unitPrice: 510.0,
            lineTotal: 2040.0,
          },
          {
            productId: products[11].id, // Mint Chocolate Chip
            quantity: 3,
            unitPrice: 495.0,
            lineTotal: 1485.0,
          },
        ],
      },
    },
  });

  const order5 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2025-0151',
      userId: buyers[0].id, // Sweet Corner (repeat customer)
      subtotal: 2620.0,
      total: 2620.0,
      status: 'PENDING_PAYMENT',
      paymentStatus: 'PENDING',
      shippingAddress: buyers[0].businessAddress,
      stockReservedUntil: new Date(Date.now() + 48 * 60 * 60 * 1000),
      items: {
        create: [
          {
            productId: products[15].id, // Vanilla Cup 500ml
            quantity: 20,
            unitPrice: 85.0,
            lineTotal: 1700.0,
          },
          {
            productId: products[16].id, // Chocolate Cup 500ml
            quantity: 10,
            unitPrice: 95.0,
            lineTotal: 950.0,
          },
        ],
      },
    },
  });

  console.log('✅ Created 5 sample orders with realistic data');

  // 6. Create Sample RFQs
  console.log('💬 Creating sample RFQs...');
  await Promise.all([
    prisma.rFQ.create({
      data: {
        rfqNumber: 'RFQ-2025-0023',
        userId: distributor.id,
        productId: products[0].id,
        quantity: 100,
        desiredPrice: 420.0,
        message: 'Planning to stock up for the summer season. Can you offer better pricing for bulk order of 100+ units? Looking for long-term partnership.',
        status: 'NEW',
      },
    }),
    prisma.rFQ.create({
      data: {
        rfqNumber: 'RFQ-2025-0024',
        userId: buyers[1].id, // The Creamy Café
        productId: products[6].id, // Matcha Green Tea
        quantity: 20,
        desiredPrice: 650.0,
        message: 'Interested in introducing matcha flavor to our menu. Need competitive pricing for trial order.',
        status: 'NEW',
      },
    }),
    prisma.rFQ.create({
      data: {
        rfqNumber: 'RFQ-2025-0025',
        userId: buyers[3].id, // Ice Paradise
        productId: products[14].id, // Saffron Kesar
        quantity: 10,
        desiredPrice: 720.0,
        message: 'Would like to feature this premium flavor. Can you provide samples and better pricing?',
        status: 'QUOTED',
        quotedPrice: 730.0,
        adminMessage: 'Thank you for your interest! We can offer ₹730 per unit for 10+ units. Samples will be sent within 2 days.',
        quotedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    }),
  ]);
  console.log('✅ Created 3 sample RFQs');

  // 7. Create Settings
  console.log('⚙️ Creating settings...');
  await Promise.all([
    prisma.settings.create({
      data: {
        key: 'payment_instructions',
        value: 'Bank Transfer Details:\n\nBank: HDFC Bank Ltd\nAccount Name: ICE Premium Artisan Creamery\nAccount Number: 50200012345678\nIFSC Code: HDFC0001234\nBranch: Andheri East, Mumbai\n\nUPI: icecreamery@hdfcbank\nGPay/PhonePe: +919876543210\n\nPlease share payment proof via email after transfer.',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'lead_time_metro',
        value: 'Mumbai Metro: 24-48 hours | Other Metro Cities: 2-3 business days',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'lead_time_outstation',
        value: 'Tier 2 Cities: 4-5 business days | Remote Areas: 6-8 business days',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'minimum_order_value',
        value: '2000',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'free_shipping_threshold',
        value: '10000',
      },
    }),
  ]);
  console.log('✅ Settings created');

  console.log('\n🎉 High-quality seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log('  - 1 Admin user');
  console.log('  - 5 Buyer users (4 approved, 1 pending)');
  console.log('  - 20 Premium ice cream products with high-quality images');
  console.log('  - 5 Realistic orders (2 delivered, 1 dispatched, 1 paid, 2 pending)');
  console.log('  - 3 RFQ requests (2 new, 1 responded)');
  console.log('  - Custom VIP pricing for distributor');
  console.log('\n🔐 Login Credentials (Password: admin123):');
  console.log('  Admin: admin@ice.com');
  console.log('  Shop: sweetcorner@example.com');
  console.log('  Café: creamycafe@example.com');
  console.log('  Distributor: mumbaidistro@example.com');
  console.log('  Parlour: iceparadise@example.com');
  console.log('  Pending User: frozendreams@example.com');
  console.log('\n✨ All products feature premium descriptions and Unsplash high-quality images');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
