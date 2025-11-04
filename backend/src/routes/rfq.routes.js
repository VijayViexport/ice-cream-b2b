import express from 'express';
import { authenticate, requireApproval } from '../middleware/auth.middleware.js';

const router = express.Router();

// Placeholder routes - to be implemented
router.get('/', authenticate, requireApproval, (req, res) => {
  res.json({ message: 'Get RFQs endpoint' });
});

router.post('/', authenticate, requireApproval, (req, res) => {
  res.json({ message: 'Create RFQ endpoint' });
});

export default router;
