import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { cartService } from '../services/cartService.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({ totalItems: 0, subtotal: 0, currency: 'USD' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from backend (backed by Supabase)
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setSummary({ totalItems: 0, subtotal: 0, currency: 'USD' });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      if (data) {
        setCartItems(data.items || []);
        setSummary(data.summary || { totalItems: 0, subtotal: 0, currency: 'USD' });
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError(err.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Reload cart whenever auth state changes
  useEffect(() => {
    refreshCart();
  }, [user, refreshCart]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      showToast('Please log in to add items to your cart', 'info');
      return false;
    }

    try {
      setLoading(true);
      await cartService.addToCart(productId, quantity);
      showToast('Added to cart!', 'success');
      await refreshCart();
      return true;
    } catch (err) {
      showToast(err.message || 'Could not add to cart', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(cartItemId);
    }

    try {
      setLoading(true);
      await cartService.updateCartItem(cartItemId, newQuantity);
      await refreshCart();
      return true;
    } catch (err) {
      showToast(err.message || 'Could not update quantity', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true);
      await cartService.removeCartItem(cartItemId);
      showToast('Item removed from cart', 'info');
      await refreshCart();
      return true;
    } catch (err) {
      showToast(err.message || 'Could not remove item', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      await cartService.clearCart();
      setCartItems([]);
      setSummary({ totalItems: 0, subtotal: 0, currency: 'USD' });
      showToast('Cart cleared', 'info');
      return true;
    } catch (err) {
      showToast(err.message || 'Could not clear cart', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartItems,
    summary,
    totalItems: summary.totalItems,
    subtotal: summary.subtotal,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
