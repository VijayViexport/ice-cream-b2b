const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Get all orders
router.get('/orders', adminController.getAllOrders);

// Get all users
router.get('/users', adminController.getAllUsers);

// Approve user
router.patch('/users/:id/approve', adminController.approveUser);

// Mark order as paid
router.patch('/orders/:id/mark-paid', adminController.markOrderPaid);

// Dispatch order
router.patch('/orders/:id/dispatch', adminController.dispatchOrder);

// Mark order as delivered
router.patch('/orders/:id/delivered', adminController.markOrderDelivered);

module.exports = router;
