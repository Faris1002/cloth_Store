import { supabaseAdmin } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Fetch current user's shopping cart with joined product details.
 * Calculates subtotal and total item count server-side from trusted database records.
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: rawItems, error } = await supabaseAdmin
      .from('cart_items')
      .select(`
        id,
        user_id,
        product_id,
        quantity,
        created_at,
        updated_at,
        products (
          id,
          name,
          description,
          price,
          category,
          image_url,
          stock_quantity
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user cart:', error);
      return sendError(res, 'DATABASE_ERROR', 'Failed to retrieve shopping cart', 500);
    }

    const items = (rawItems || []).map((item) => {
      const product = item.products;
      const price = product ? Number(product.price) : 0;
      const quantity = Number(item.quantity);
      const itemTotal = Number((price * quantity).toFixed(2));

      return {
        id: item.id,
        productId: item.product_id,
        quantity,
        product: product
          ? {
              id: product.id,
              name: product.name,
              description: product.description,
              price,
              category: product.category,
              image_url: product.image_url,
              stock_quantity: product.stock_quantity,
            }
          : null,
        itemTotal,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    });

    // Compute cart totals strictly using DB prices
    const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);
    const subtotal = Number(
      items.reduce((acc, curr) => acc + curr.itemTotal, 0).toFixed(2)
    );

    return sendSuccess(res, {
      items,
      summary: {
        totalItems,
        subtotal,
        currency: 'USD',
      },
    });
  } catch (err) {
    console.error('getCart controller exception:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Failed to load cart', 500);
  }
};

/**
 * Add an item to cart or increment its quantity
 */
export const addItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // 1. Fetch product to verify existence and check stock
    const { data: product, error: productErr } = await supabaseAdmin
      .from('products')
      .select('id, name, price, stock_quantity')
      .eq('id', productId)
      .single();

    if (productErr || !product) {
      return sendError(res, 'PRODUCT_NOT_FOUND', 'The requested product does not exist', 404);
    }

    if (product.stock_quantity <= 0) {
      return sendError(res, 'OUT_OF_STOCK', 'This product is currently out of stock', 400);
    }

    // 2. Check if item already exists in user's cart
    const { data: existingItem, error: fetchCartErr } = await supabaseAdmin
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (fetchCartErr) {
      console.error('Error checking existing cart item:', fetchCartErr);
      return sendError(res, 'DATABASE_ERROR', 'Failed to process cart item', 500);
    }

    const currentQty = existingItem ? existingItem.quantity : 0;
    const newQty = currentQty + quantity;

    if (newQty > product.stock_quantity) {
      return sendError(
        res,
        'STOCK_EXCEEDED',
        `Cannot add ${quantity} more. Only ${product.stock_quantity - currentQty} available in stock.`,
        400
      );
    }

    let savedItem;

    if (existingItem) {
      // Update existing cart item quantity
      const { data: updated, error: updateErr } = await supabaseAdmin
        .from('cart_items')
        .update({ quantity: newQty })
        .eq('id', existingItem.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateErr) {
        console.error('Error updating cart item quantity:', updateErr);
        return sendError(res, 'DATABASE_ERROR', 'Failed to update item quantity in cart', 500);
      }
      savedItem = updated;
    } else {
      // Insert new cart item
      const { data: inserted, error: insertErr } = await supabaseAdmin
        .from('cart_items')
        .insert([
          {
            user_id: userId,
            product_id: productId,
            quantity,
          },
        ])
        .select()
        .single();

      if (insertErr) {
        console.error('Error adding item to cart:', insertErr);
        return sendError(res, 'DATABASE_ERROR', 'Failed to add product to cart', 500);
      }
      savedItem = inserted;
    }

    return sendSuccess(res, { item: savedItem, message: 'Item added to cart successfully' }, 201);
  } catch (err) {
    console.error('addItem controller exception:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Could not add item to cart', 500);
  }
};

/**
 * Update quantity of a specific cart item
 */
export const updateItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: cartItemId } = req.params;
    const { quantity } = req.body;

    // Fetch existing cart item with product stock
    const { data: cartItem, error: fetchErr } = await supabaseAdmin
      .from('cart_items')
      .select('id, user_id, product_id, quantity, products(stock_quantity, name)')
      .eq('id', cartItemId)
      .eq('user_id', userId)
      .single();

    if (fetchErr || !cartItem) {
      return sendError(res, 'ITEM_NOT_FOUND', 'Cart item not found', 404);
    }

    const availableStock = cartItem.products?.stock_quantity ?? 0;

    if (quantity > availableStock) {
      return sendError(
        res,
        'STOCK_EXCEEDED',
        `Only ${availableStock} items available in stock.`,
        400
      );
    }

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateErr) {
      console.error('Error updating cart item:', updateErr);
      return sendError(res, 'DATABASE_ERROR', 'Failed to update cart item', 500);
    }

    return sendSuccess(res, { item: updated, message: 'Cart updated successfully' });
  } catch (err) {
    console.error('updateItemQuantity controller exception:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Could not update cart item', 500);
  }
};

/**
 * Remove a specific item from current user's cart
 */
export const removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: cartItemId } = req.params;

    const { error } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing cart item:', error);
      return sendError(res, 'DATABASE_ERROR', 'Failed to remove item from cart', 500);
    }

    return sendSuccess(res, { message: 'Item removed from cart', id: cartItemId });
  } catch (err) {
    console.error('removeItem controller exception:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Could not remove item from cart', 500);
  }
};

/**
 * Clear the current user's entire cart
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { error } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing cart:', error);
      return sendError(res, 'DATABASE_ERROR', 'Failed to clear cart', 500);
    }

    return sendSuccess(res, { message: 'Shopping cart cleared successfully' });
  } catch (err) {
    console.error('clearCart controller exception:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Could not clear cart', 500);
  }
};
