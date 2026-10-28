import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import CartItem from '../components/CartItem.jsx';
import CartSummary from '../components/CartSummary.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export const CartPage = () => {
  const { cartItems, totalItems, loading, error, refreshCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-200 pb-6 gap-2">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Shopping Bag
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {totalItems > 0
              ? `You have ${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your cart.`
              : 'Review your items and proceed to secure checkout.'}
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <ErrorMessage
          title="Could not load cart"
          message={error}
          onRetry={refreshCart}
        />
      )}

      {/* Cart Content */}
      {cartItems.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your shopping bag is empty"
          description="Explore our contemporary apparel collections and add your favorite pieces."
          actionLabel="Explore Catalog"
          actionLink="/products"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items list */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 sticky top-24">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
