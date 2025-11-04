const prisma = require('../config/database');

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            id: true,
            businessName: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        businessName: true,
        primaryContactName: true,
        phone: true,
        businessType: true,
        gstin: true,
        status: true,
        role: true,
        businessAddress: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Approve user
exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.update({
      where: { id },
      data: { status: 'APPROVED' },
      select: {
        id: true,
        email: true,
        businessName: true,
        status: true
      }
    });

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ message: 'Failed to approve user' });
  }
};

// Mark order as paid
exports.markOrderPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        paymentStatus: 'PAID',
        status: 'PAID',
        paymentReceivedAt: new Date()
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Release reserved stock and deduct from actual stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          },
          reservedStock: {
            decrement: item.quantity
          }
        }
      });
    }

    res.json({ message: 'Order marked as paid', order });
  } catch (error) {
    console.error('Mark order paid error:', error);
    res.status(500).json({ message: 'Failed to mark order as paid' });
  }
};

// Dispatch order
exports.dispatchOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber, courier } = req.body;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        status: 'DISPATCHED',
        trackingNumber,
        courier: courier || 'Standard Courier',
        dispatchedAt: new Date()
      }
    });

    res.json({ message: 'Order dispatched successfully', order });
  } catch (error) {
    console.error('Dispatch order error:', error);
    res.status(500).json({ message: 'Failed to dispatch order' });
  }
};

// Mark order as delivered
exports.markOrderDelivered = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        status: 'DELIVERED',
        deliveredAt: new Date()
      }
    });

    res.json({ message: 'Order marked as delivered', order });
  } catch (error) {
    console.error('Mark order delivered error:', error);
    res.status(500).json({ message: 'Failed to mark order as delivered' });
  }
};
