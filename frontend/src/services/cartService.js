import api from './api.js';

export const cartService = {
  /**
   * Fetch current user's shopping cart
   */
  async getCart() {
    const res = await api.get('/cart');
    return res.data?.data;
  },

  /**
   * Add item or increment quantity
   */
  async addToCart(productId, quantity = 1) {
    const res = await api.post('/cart/items', { productId, quantity });
    return res.data?.data;
  },

  /**
   * Update quantity of a cart item
   */
  async updateCartItem(cartItemId, quantity) {
    const res = await api.patch(`/cart/items/${cartItemId}`, { quantity });
    return res.data?.data;
  },

  /**
   * Remove item from cart
   */
  async removeCartItem(cartItemId) {
    const res = await api.delete(`/cart/items/${cartItemId}`);
    return res.data?.data;
  },

  /**
   * Clear all items in user's cart
   */
  async clearCart() {
    const res = await api.delete('/cart');
    return res.data?.data;
  },
};
