import express from 'express';
import { authenticate, requireApproval } from '../middleware/auth.middleware.js';
import prisma from '../config/database.js';
import { paymentProofUpload } from '../config/multer.js';
import notificationService from '../services/notification.service.js';

const router = express.Router();

// Generate order number
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
}

// Create a new order
router.post('/', authenticate, requireApproval, async (req, res) => {
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
        shippingAddress: JSON.stringify(shippingAddress),
        stockReservedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
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

    // Reserve stock
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { reservedStock: { increment: item.quantity } }
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
});

// Get all orders for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Parse shippingAddress JSON string back to object
    const ordersWithParsedAddress = orders.map(order => {
      let parsedAddress = order.shippingAddress;

      if (typeof order.shippingAddress === 'string') {
        try {
          // Try to parse as JSON (new format)
          parsedAddress = JSON.parse(order.shippingAddress);
        } catch (e) {
          // If it fails, it's old plain text format, keep it as is
          parsedAddress = order.shippingAddress;
        }
      }

      return {
        ...order,
        shippingAddress: parsedAddress
      };
    });

    res.json(ordersWithParsedAddress);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: { include: { product: true } },
        user: true
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Parse shippingAddress JSON string back to object
    let parsedAddress = order.shippingAddress;

    if (typeof order.shippingAddress === 'string') {
      try {
        // Try to parse as JSON (new format)
        parsedAddress = JSON.parse(order.shippingAddress);
      } catch (e) {
        // If it fails, it's old plain text format, keep it as is
        parsedAddress = order.shippingAddress;
      }
    }

    const orderWithParsedAddress = {
      ...order,
      shippingAddress: parsedAddress
    };

    res.json(orderWithParsedAddress);
  } catch (error) {
    console.error('Fetch single order error:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// Upload payment proof
router.post('/:id/payment-proof', authenticate, requireApproval, paymentProofUpload.single('paymentProof'), async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id }
    });

    if (!order || order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No payment proof file uploaded' });
    }

    const paymentProofUrl = `http://localhost:5000/uploads/payment-proofs/${req.file.filename}`;

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: { paymentProofUrl },
      include: {
        items: { include: { product: true } },
        user: true
      }
    });

    // Notify admins about payment proof upload
    await notificationService.notifyAdminsPaymentProofUploaded(updatedOrder, updatedOrder.user);

    res.json({
      message: 'Payment proof uploaded successfully',
      order: updatedOrder,
      proofUrl: paymentProofUrl
    });
  } catch (error) {
    console.error('Upload payment proof error:', error);
    res.status(500).json({ message: 'Failed to upload payment proof' });
  }
});

export default router;
