import prisma from '../config/database.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Private
export const getProducts = async (req, res) => {
  try {
    const { search, category, inStock } = req.query;

    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(inStock === 'true' && {
        stock: { gt: 0 },
      }),
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        tieredPricing: {
          orderBy: { minQuantity: 'asc' },
        },
        customPricing: {
          where: { userId: req.user.id },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Calculate available stock (total - reserved)
    const productsWithAvailableStock = products.map((product) => ({
      ...product,
      availableStock: product.stock - product.reservedStock,
      customPrice: product.customPricing[0]?.price || null,
      customPricing: undefined, // Remove from response
    }));

    res.json({ products: productsWithAvailableStock });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:sku
// @access  Private
export const getProductBySku = async (req, res) => {
  try {
    const { sku } = req.params;

    const product = await prisma.product.findUnique({
      where: { sku },
      include: {
        tieredPricing: {
          orderBy: { minQuantity: 'asc' },
        },
        customPricing: {
          where: { userId: req.user.id },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      product: {
        ...product,
        availableStock: product.stock - product.reservedStock,
        customPrice: product.customPricing[0]?.price || null,
        customPricing: undefined,
      },
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      packSize,
      unitPrice,
      stock,
      reorderThreshold,
      images,
      nutrition,
      allergens,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        packSize,
        unitPrice,
        stock: parseInt(stock) || 0,
        reorderThreshold: parseInt(reorderThreshold) || 10,
        images: images || [],
        nutrition,
        allergens: allergens || [],
      },
    });

    res.status(201).json({ product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json({ product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};
