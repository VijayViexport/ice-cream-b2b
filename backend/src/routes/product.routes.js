import express from 'express';
import {
  getProducts,
  getProductBySku,
  createProduct,
  updateProduct,
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, getProducts);
router.get('/:sku', authenticate, getProductBySku);
router.post('/', authenticate, authorize('ADMIN'), createProduct);
router.put('/:id', authenticate, authorize('ADMIN'), updateProduct);

export default router;
