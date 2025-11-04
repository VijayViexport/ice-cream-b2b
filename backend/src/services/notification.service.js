import prisma from '../config/database.js';
import { emitToUser, emitToAdmins, emitToBuyers } from '../config/socket.js';

class NotificationService {
  /**
   * Create a notification and emit via Socket.io
   */
  async create({ userId, type, title, message, data = null, priority = 'MEDIUM' }) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          data,
          priority,
          // Set expiration: 30 days from now
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });

      // Emit real-time notification via Socket.io
      emitToUser(userId, 'new_notification', notification);

      console.log(`✅ Notification created: ${type} for user ${userId}`);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Get user notifications with pagination
   */
  async getUserNotifications(userId, { limit = 20, offset = 0, unreadOnly = false }) {
    try {
      const where = { userId };
      if (unreadOnly) {
        where.isRead = false;
      }

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset
        }),
        prisma.notification.count({ where })
      ]);

      return { notifications, total };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId) {
    try {
      return await prisma.notification.count({
        where: { userId, isRead: false }
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true, readAt: new Date() }
      });

      // Emit updated unread count
      const unreadCount = await this.getUnreadCount(userId);
      emitToUser(userId, 'unread_count_updated', { count: unreadCount });

      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    try {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true, readAt: new Date() }
      });

      // Emit updated unread count (should be 0 now)
      emitToUser(userId, 'unread_count_updated', { count: 0 });

      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async delete(notificationId, userId) {
    try {
      return await prisma.notification.deleteMany({
        where: { id: notificationId, userId }
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Clean up expired notifications
   */
  async cleanupExpired() {
    try {
      const deleted = await prisma.notification.deleteMany({
        where: {
          expiresAt: { lte: new Date() }
        }
      });
      console.log(`🧹 Cleaned up ${deleted.count} expired notifications`);
      return deleted;
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
      throw error;
    }
  }

  // ============= Business Logic Notification Triggers =============

  /**
   * Send notification when order status changes
   */
  async sendOrderStatusNotification(order, newStatus) {
    const statusConfig = {
      PAID: {
        title: 'Payment Confirmed ✅',
        message: `Your payment of ₹${order.total} for order #${order.orderNumber} has been verified.`,
        priority: 'HIGH'
      },
      DISPATCHED: {
        title: 'Order Dispatched! 🚚',
        message: `Your order #${order.orderNumber} has been dispatched${order.trackingNumber ? ` via ${order.courier}. Track: ${order.trackingNumber}` : ''}.`,
        priority: 'HIGH'
      },
      DELIVERED: {
        title: 'Order Delivered 🎉',
        message: `Your order #${order.orderNumber} has been successfully delivered!`,
        priority: 'MEDIUM'
      },
      CANCELLED: {
        title: 'Order Cancelled ❌',
        message: `Your order #${order.orderNumber} has been cancelled.${order.notes ? ` Reason: ${order.notes}` : ''}`,
        priority: 'URGENT'
      }
    };

    const config = statusConfig[newStatus];
    if (config) {
      await this.create({
        userId: order.userId,
        type: 'ORDER_STATUS_CHANGE',
        title: config.title,
        message: config.message,
        data: { orderId: order.id, orderNumber: order.orderNumber, status: newStatus },
        priority: config.priority
      });
    }
  }

  /**
   * Send notification when payment proof is approved/rejected
   */
  async sendPaymentNotification(order, isApproved) {
    await this.create({
      userId: order.userId,
      type: isApproved ? 'PAYMENT_CONFIRMATION' : 'PAYMENT_REJECTED',
      title: isApproved ? 'Payment Confirmed ✅' : 'Payment Proof Rejected ❌',
      message: isApproved
        ? `Your payment of ₹${order.total} for order #${order.orderNumber} has been verified.`
        : `Your payment proof for order #${order.orderNumber} was rejected. Please upload a valid proof.`,
      data: { orderId: order.id, orderNumber: order.orderNumber },
      priority: 'URGENT'
    });
  }

  /**
   * Send notification when account status changes
   */
  async sendAccountStatusNotification(user, isApproved) {
    await this.create({
      userId: user.id,
      type: isApproved ? 'ACCOUNT_APPROVED' : 'ACCOUNT_REJECTED',
      title: isApproved ? 'Welcome to ICE! 🎉' : 'Account Registration Update',
      message: isApproved
        ? 'Your business account has been approved. Start ordering now!'
        : 'Your account registration requires additional review. Our team will contact you shortly.',
      data: { userId: user.id, businessName: user.businessName },
      priority: 'URGENT'
    });
  }

  /**
   * Send notification to admins about new user registration
   */
  async notifyAdminsNewUserRegistration(user) {
    try {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' }
      });

      for (const admin of admins) {
        await this.create({
          userId: admin.id,
          type: 'SYSTEM_ANNOUNCEMENT',
          title: 'New User Registration 👤',
          message: `${user.businessName} (${user.email}) has registered and is pending approval.`,
          data: { userId: user.id, businessName: user.businessName, email: user.email },
          priority: 'MEDIUM'
        });
      }

      // Emit real-time event
      emitToAdmins('new_user_registration', {
        userId: user.id,
        businessName: user.businessName,
        email: user.email
      });
    } catch (error) {
      console.error('Error notifying admins of new user:', error);
    }
  }

  /**
   * Send notification to admins about new order
   */
  async notifyAdminsNewOrder(order, user) {
    try {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' }
      });

      for (const admin of admins) {
        await this.create({
          userId: admin.id,
          type: 'ORDER_STATUS_CHANGE',
          title: 'New Order Received 📦',
          message: `New order #${order.orderNumber} from ${user?.businessName || 'Customer'} for ₹${order.total}`,
          data: { orderId: order.id, orderNumber: order.orderNumber, customerId: order.userId },
          priority: 'HIGH'
        });
      }

      // Emit real-time event
      emitToAdmins('new_order', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customer: user?.businessName,
        total: order.total
      });
    } catch (error) {
      console.error('Error notifying admins of new order:', error);
    }
  }

  /**
   * Send low stock alert to admins
   */
  async sendLowStockAlert(product) {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });

    for (const admin of admins) {
      await this.create({
        userId: admin.id,
        type: 'LOW_STOCK_ALERT',
        title: 'Low Stock Alert ⚠️',
        message: `Product "${product.name}" (SKU: ${product.sku}) is running low. Only ${product.stock - product.reservedStock} units available.`,
        data: { productId: product.id, productName: product.name, sku: product.sku, stock: product.stock },
        priority: 'MEDIUM'
      });
    }
  }

  /**
   * Send notification to admins about new RFQ submission
   */
  async notifyAdminsNewRFQ(rfq, user) {
    try {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' }
      });

      for (const admin of admins) {
        await this.create({
          userId: admin.id,
          type: 'SYSTEM_ANNOUNCEMENT',
          title: 'New RFQ Submitted 💬',
          message: `${user?.businessName || 'Customer'} submitted a new RFQ for ${rfq.quantity} units.`,
          data: { rfqId: rfq.id, customerId: rfq.userId, productName: rfq.productName },
          priority: 'MEDIUM'
        });
      }

      // Emit real-time event
      emitToAdmins('new_rfq', {
        rfqId: rfq.id,
        customer: user?.businessName,
        productName: rfq.productName,
        quantity: rfq.quantity
      });
    } catch (error) {
      console.error('Error notifying admins of new RFQ:', error);
    }
  }

  /**
   * Send RFQ quote notification to buyer
   */
  async sendRFQQuoteNotification(rfq, user) {
    await this.create({
      userId: rfq.userId,
      type: 'RFQ_QUOTE_RECEIVED',
      title: 'Quote Received 💬',
      message: `You've received a quote for your RFQ. Quoted price: ₹${rfq.quotedPrice}`,
      data: { rfqId: rfq.id, quotedPrice: rfq.quotedPrice },
      priority: 'HIGH'
    });
  }

  /**
   * Send notification to admins about payment proof upload
   */
  async notifyAdminsPaymentProofUploaded(order, user) {
    try {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' }
      });

      for (const admin of admins) {
        await this.create({
          userId: admin.id,
          type: 'PAYMENT_CONFIRMATION',
          title: 'Payment Proof Uploaded 💳',
          message: `${user?.businessName || 'Customer'} uploaded payment proof for order #${order.orderNumber} (₹${order.total})`,
          data: { orderId: order.id, orderNumber: order.orderNumber, customerId: order.userId, paymentProofUrl: order.paymentProofUrl },
          priority: 'HIGH'
        });
      }

      // Emit real-time event
      emitToAdmins('payment_proof_uploaded', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customer: user?.businessName,
        total: order.total
      });
    } catch (error) {
      console.error('Error notifying admins of payment upload:', error);
    }
  }

  /**
   * Send notification to admins about order cancellation by buyer
   */
  async notifyAdminsOrderCancelled(order, user, reason) {
    try {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' }
      });

      for (const admin of admins) {
        await this.create({
          userId: admin.id,
          type: 'SYSTEM_ANNOUNCEMENT',
          title: 'Order Cancelled by Customer ❌',
          message: `${user?.businessName || 'Customer'} cancelled order #${order.orderNumber}.${reason ? ` Reason: ${reason}` : ''}`,
          data: { orderId: order.id, orderNumber: order.orderNumber, customerId: order.userId, reason },
          priority: 'MEDIUM'
        });
      }

      // Emit real-time event
      emitToAdmins('order_cancelled_by_buyer', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customer: user?.businessName
      });
    } catch (error) {
      console.error('Error notifying admins of order cancellation:', error);
    }
  }

  /**
   * Send notification to buyers about new product added
   */
  async notifyBuyersNewProduct(product) {
    try {
      // Get all approved buyers
      const buyers = await prisma.user.findMany({
        where: {
          role: 'BUYER',
          status: 'APPROVED'
        },
        take: 100 // Limit to prevent overwhelming notifications
      });

      for (const buyer of buyers) {
        await this.create({
          userId: buyer.id,
          type: 'NEW_PRODUCT',
          title: 'New Product Available! 🍦',
          message: `Check out our new product: ${product.name} - ${product.category}`,
          data: { productId: product.id, productName: product.name, category: product.category },
          priority: 'LOW'
        });
      }

      // Emit real-time event to all buyers
      emitToBuyers('new_product_added', {
        productId: product.id,
        productName: product.name,
        category: product.category
      });
    } catch (error) {
      console.error('Error notifying buyers of new product:', error);
    }
  }
}

export default new NotificationService();
