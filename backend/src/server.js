import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import rfqRoutes from './routes/rfq.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import notificationService from './services/notification.service.js';
import { upload } from './config/multer.js';
import { initializeSocket } from './config/socket.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
initializeSocket(httpServer);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ICE B2B API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/rfqs', rfqRoutes);
app.use('/api/notifications', notificationRoutes);

// Admin routes
app.get('/api/admin/orders', async (req, res) => {
  try {
    const { default: prisma } = await import('./config/database.js');
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, businessName: true, email: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const { default: prisma } = await import('./config/database.js');
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, businessName: true, primaryContactName: true,
        phone: true, businessType: true, gstin: true, status: true,
        role: true, businessAddress: true, createdAt: true, updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.patch('/api/admin/users/:id/approve', async (req, res) => {
  try {
    const { default: prisma } = await import('./config/database.js');
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status: 'APPROVED' }
    });

    // Send real-time notification
    await notificationService.create({
      userId: user.id,
      type: 'ACCOUNT_APPROVED',
      title: 'Account Approved! 🎉',
      message: `Welcome to ICE B2B! Your account has been approved. You can now start placing orders.`,
      priority: 'HIGH'
    });

    res.json({ message: 'User approved', user });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ message: 'Failed to approve user' });
  }
});

app.patch('/api/admin/orders/:id/mark-paid', async (req, res) => {
  try {
    const { default: prisma } = await import('./config/database.js');
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        paymentStatus: 'PAID',
        status: 'PAID',
        paymentReceivedAt: new Date()
      },
      include: { items: true }
    });

    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          reservedStock: { decrement: item.quantity }
        }
      });
    }

    // Send real-time notification
    await notificationService.sendOrderStatusNotification(order, 'PAID');

    res.json({ message: 'Order marked as paid', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark order as paid' });
  }
});

app.patch('/api/admin/orders/:id/dispatch', async (req, res) => {
  try {
    const { default: prisma } = await import('./config/database.js');
    const { trackingNumber, courier } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status: 'DISPATCHED',
        trackingNumber,
        courier: courier || 'Standard Courier',
        dispatchedAt: new Date()
      }
    });

    // Send real-time notification
    await notificationService.sendOrderStatusNotification(order, 'DISPATCHED');

    res.json({ message: 'Order dispatched', order });
  } catch (error) {
    console.error('Dispatch order error:', error);
    res.status(500).json({ message: 'Failed to dispatch order' });
  }
});

app.patch('/api/admin/orders/:id/deliver', async (req, res) => {
  try {
    const { default: prisma } = await import('./config/database.js');
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status: 'DELIVERED',
        deliveredAt: new Date()
      }
    });

    // Send real-time notification
    await notificationService.sendOrderStatusNotification(order, 'DELIVERED');

    res.json({ message: 'Order marked as delivered', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark order as delivered' });
  }
});

app.patch('/api/admin/orders/:id/cancel', async (req, res) => {
  try {
    const { default: prisma } = await import('./config/database.js');
    const { reason } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        notes: reason
      },
      include: { items: true }
    });

    // Restore stock and remove reservation
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { increment: item.quantity },
          reservedStock: { decrement: item.quantity }
        }
      });
    }

    // Send real-time notification
    await notificationService.sendOrderStatusNotification(order, 'CANCELLED');

    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel order' });
  }
});

app.patch('/api/admin/users/:id/reject', async (req, res) => {
  try {
    const { default: prisma } = await import('./config/database.js');
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status: 'BLOCKED' }
    });
    res.json({ message: 'User rejected', user });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ message: 'Failed to reject user' });
  }
});

app.patch('/api/admin/users/:id/suspend', async (req, res) => {
  try {
    const { default: prisma } = await import('./config/database.js');
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status: 'BLOCKED' }
    });
    res.json({ message: 'User suspended', user });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ message: 'Failed to suspend user' });
  }
});

app.patch('/api/admin/users/:id/activate', async (req, res) => {
  try {
    const { default: prisma } = await import('./config/database.js');
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status: 'APPROVED' }
    });
    res.json({ message: 'User activated', user });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({ message: 'Failed to activate user' });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const { default: prisma } = await import('./config/database.js');

    // Check if user has orders
    const orderCount = await prisma.order.count({
      where: { userId: req.params.id }
    });

    if (orderCount > 0) {
      return res.status(400).json({
        message: `Cannot delete user with existing orders. User has ${orderCount} order(s). Consider suspending instead.`
      });
    }

    // Check if user has RFQs
    const rfqCount = await prisma.rFQ.count({
      where: { userId: req.params.id }
    });

    if (rfqCount > 0) {
      return res.status(400).json({
        message: `Cannot delete user with existing RFQs. User has ${rfqCount} RFQ(s). Consider suspending instead.`
      });
    }

    await prisma.user.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Image Upload Endpoint
app.post('/api/admin/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Return the URL path to access the uploaded image
    const imageUrl = `/uploads/products/${req.file.filename}`;
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});

// Admin Product Management
app.post('/api/admin/products', async (req, res) => {
  try {
    const { default: prisma } = await import('./config/database.js');
    const { name, description, category, sku, packSize, unitPrice, stock, images, featured } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        sku,
        packSize,
        unitPrice: parseFloat(unitPrice),
        stock: parseInt(stock),
        images: images || [],
        allergens: [],
        featured: featured || false,
        isActive: true
      }
    });

    // Notify buyers about new product (optional - can be made configurable)
    if (featured) {
      await notificationService.notifyBuyersNewProduct(product);
    }

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

app.put('/api/admin/products/:id', async (req, res) => {
  try {
    const { default: prisma } = await import('./config/database.js');
    const { name, description, category, sku, packSize, unitPrice, stock, images, featured } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        category,
        sku,
        packSize,
        unitPrice: parseFloat(unitPrice),
        stock: parseInt(stock),
        images: images || [],
        featured: featured || false
      }
    });
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    const { default: prisma } = await import('./config/database.js');
    await prisma.product.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`🔌 Socket.io ready for real-time notifications`);
});

export default app;
