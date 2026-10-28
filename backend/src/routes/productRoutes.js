import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { uuidParamSchema } from '../validators/commonValidator.js';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from '../validators/productValidator.js';

const router = Router();

// GET /api/products - List products (public)
router.get('/', validate(productQuerySchema, 'query'), getProducts);

// GET /api/products/:id - Product detail (public)
router.get('/:id', validate(uuidParamSchema, 'params'), getProductById);

// POST /api/products - Create a product (protected)
router.post('/', requireAuth, validate(createProductSchema, 'body'), createProduct);

// PATCH /api/products/:id - Update product (protected, owner only)
router.patch(
  '/:id',
  requireAuth,
  validate(uuidParamSchema, 'params'),
  validate(updateProductSchema, 'body'),
  updateProduct
);

// DELETE /api/products/:id - Delete product (protected, owner only)
router.delete('/:id', requireAuth, validate(uuidParamSchema, 'params'), deleteProduct);

export default router;
