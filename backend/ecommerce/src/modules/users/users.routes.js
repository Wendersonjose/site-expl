import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
} from './users.controller.js';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', listUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
