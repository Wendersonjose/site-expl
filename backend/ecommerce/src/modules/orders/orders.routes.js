import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware.js';
import { createOrder, listOrders, updateOrderStatus } from './orders.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', listOrders);
router.post('/', createOrder);
router.put('/:id/status', authorizeAdmin, updateOrderStatus);

export default router;
