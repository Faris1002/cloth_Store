import { Router } from 'express';
import {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
} from '../controllers/cartController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { uuidParamSchema } from '../validators/commonValidator.js';
import { addCartItemSchema, updateCartItemSchema } from '../validators/cartValidator.js';

const router = Router();

// All cart endpoints require authentication
router.use(requireAuth);

// GET /api/cart - Fetch current user's cart
router.get('/', getCart);

// POST /api/cart/items - Add item or increment quantity
router.post('/items', validate(addCartItemSchema, 'body'), addItem);

// PATCH /api/cart/items/:id - Update item quantity
router.patch(
  '/items/:id',
  validate(uuidParamSchema, 'params'),
  validate(updateCartItemSchema, 'body'),
  updateItemQuantity
);

// DELETE /api/cart/items/:id - Remove specific cart item
router.delete('/items/:id', validate(uuidParamSchema, 'params'), removeItem);

// DELETE /api/cart - Clear entire cart
router.delete('/', clearCart);

export default router;
