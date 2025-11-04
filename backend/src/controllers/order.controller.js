import prisma from '../config/database.js';
import notificationService from '../services/notification.service.js';

// Generate order number
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
}

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Calculate totals and verify stock
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product ${item.productId} not available` });
      }

      const availableStock = product.stock - product.reservedStock;
      if (availableStock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${availableStock}`
        });
      }

      const lineTotal = product.unitPrice * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.unitPrice,
        lineTotal
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        subtotal,
        total: subtotal,
        status: 'PENDING_PAYMENT',
        paymentStatus: 'PENDING',
        paymentMethod: paymentMethod || 'OFFLINE_BANK_TRANSFER',
        shippingAddress,
        stockReservedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Reserve stock for each product
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          reservedStock: {
            increment: item.quantity
          }
        }
      });
    }

    // Get user details for notification
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, businessName: true, email: true }
    });

    // Notify admins about new order
    await notificationService.notifyAdminsNewOrder(order, user);

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// Get all orders for current user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (!isAdmin && order.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

// Upload payment proof
export const uploadPaymentProof = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // In a real app, you'd upload the file to cloud storage (S3, etc.)
    // For now, we'll just store a placeholder URL
    const paymentProofUrl = `/uploads/payment-proofs/${Date.now()}-${req.file?.originalname || 'proof.jpg'}`;

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        paymentProofUrl
      },
      include: {
        user: true
      }
    });

    // Notify admins about payment proof upload
    await notificationService.notifyAdminsPaymentProofUploaded(updatedOrder, updatedOrder.user);

    res.json(updatedOrder);
  } catch (error) {
    console.error('Upload payment proof error:', error);
    res.status(500).json({ message: 'Failed to upload payment proof' });
  }
};
