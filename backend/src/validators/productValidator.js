import { z } from 'zod';

export const VALID_CATEGORIES = ['Men', 'Women', 'Kids', 'Accessories', 'Footwear'];

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(120, 'Product name cannot exceed 120 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2,000 characters')
    .trim(),
  price: z
    .number({ invalid_type_error: 'Price must be a valid number' })
    .positive('Price must be greater than zero')
    .max(1000000, 'Price must be realistic'),
  category: z.enum(VALID_CATEGORIES, {
    errorMap: () => ({ message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` }),
  }),
  image_url: z
    .string()
    .url('Image URL must be a valid HTTP or HTTPS URL')
    .regex(/^https?:\/\//i, 'Image URL must start with http:// or https://'),
  stock_quantity: z
    .number({ invalid_type_error: 'Stock quantity must be an integer' })
    .int('Stock quantity must be an integer')
    .nonnegative('Stock quantity cannot be negative'),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  search: z.string().optional().default(''),
  category: z
    .string()
    .optional()
    .refine((val) => !val || VALID_CATEGORIES.includes(val) || val === 'All', {
      message: `Invalid category filter`,
    }),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'name_asc']).optional().default('newest'),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(50, Math.max(1, parseInt(val, 10) || 12)) : 12)),
});
