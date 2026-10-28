import { supabaseAdmin } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * List products with search, category filtering, sorting, and pagination
 */
export const getProducts = async (req, res) => {
  try {
    const { search, category, sort = 'newest', page = 1, limit = 12 } = req.query;

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('products')
      .select('*', { count: 'exact' });

    // Category filter
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    // Search filter (searches across name and description)
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'name_asc':
        query = query.order('name', { ascending: true });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // Pagination range
    query = query.range(offset, offset + limit - 1);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return sendError(res, 'DATABASE_ERROR', 'Failed to retrieve products from database', 500);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    return sendSuccess(res, {
      products: products || [],
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (err) {
    console.error('getProducts controller exception:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'An error occurred while loading products', 500);
  }
};

/**
 * Fetch a single product by UUID
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !product) {
      return sendError(res, 'PRODUCT_NOT_FOUND', 'Product not found', 404);
    }

    return sendSuccess(res, { product });
  } catch (err) {
    console.error('getProductById exception:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Failed to load product details', 500);
  }
};

/**
 * Create a new product (authenticated)
 */
export const createProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, price, category, image_url, stock_quantity } = req.body;

    const newProductData = {
      name,
      description,
      price: Number(price),
      category,
      image_url,
      stock_quantity: Number(stock_quantity),
      created_by: userId,
    };

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert([newProductData])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return sendError(res, 'DATABASE_ERROR', error.message || 'Failed to create product', 400);
    }

    return sendSuccess(res, { product }, 201);
  } catch (err) {
    console.error('createProduct exception:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Could not create product', 500);
  }
};

/**
 * Update an existing product (authenticated, owner only)
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if product exists and belongs to user
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('products')
      .select('id, created_by')
      .eq('id', id)
      .single();

    if (fetchErr || !existing) {
      return sendError(res, 'PRODUCT_NOT_FOUND', 'Product not found', 404);
    }

    if (existing.created_by && existing.created_by !== userId) {
      return sendError(res, 'FORBIDDEN', 'You are not authorized to update this product', 403);
    }

    const updateData = {};
    const allowedFields = ['name', 'description', 'price', 'category', 'image_url', 'stock_quantity'];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const { data: updatedProduct, error: updateErr } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      console.error('Error updating product:', updateErr);
      return sendError(res, 'DATABASE_ERROR', 'Failed to update product', 400);
    }

    return sendSuccess(res, { product: updatedProduct });
  } catch (err) {
    console.error('updateProduct exception:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Could not update product', 500);
  }
};

/**
 * Delete a product (authenticated, owner only)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if product exists and belongs to user
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('products')
      .select('id, created_by')
      .eq('id', id)
      .single();

    if (fetchErr || !existing) {
      return sendError(res, 'PRODUCT_NOT_FOUND', 'Product not found', 404);
    }

    if (existing.created_by && existing.created_by !== userId) {
      return sendError(res, 'FORBIDDEN', 'You are not authorized to delete this product', 403);
    }

    const { error: deleteErr } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteErr) {
      console.error('Error deleting product:', deleteErr);
      return sendError(res, 'DATABASE_ERROR', 'Failed to delete product', 400);
    }

    return sendSuccess(res, { message: 'Product deleted successfully', id });
  } catch (err) {
    console.error('deleteProduct exception:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Could not delete product', 500);
  }
};
