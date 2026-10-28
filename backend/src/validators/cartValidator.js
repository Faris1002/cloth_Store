import { z } from 'zod';

export const addCartItemSchema = z.object({
  productId: z.string().uuid({ message: 'productId must be a valid UUID' }),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .positive('Quantity must be at least 1')
    .max(100, 'Cannot add more than 100 of a single item at once'),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .positive('Quantity must be at least 1')
    .max(100, 'Cannot exceed 100 items per product in cart'),
});
