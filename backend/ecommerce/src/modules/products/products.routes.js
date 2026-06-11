import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from './products.controller.js';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, authorizeAdmin, createProduct);
router.put('/:id', authenticate, authorizeAdmin, updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

export default router;
