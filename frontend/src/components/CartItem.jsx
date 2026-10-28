import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart, loading } = useCart();
  const product = item.product;

  if (!product) {
    return (
      <div className="flex items-center justify-between p-4 bg-rose-50 border border-rose-200 rounded-2xl">
        <span className="text-sm text-rose-700">Product is no longer available</span>
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-rose-600 hover:text-rose-800 text-xs font-semibold"
        >
          Remove
        </button>
      </div>
    );
  }

  const maxStock = product.stock_quantity;

  const handleIncrement = () => {
    if (item.quantity < maxStock) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-white rounded-3xl border border-slate-200/80 shadow-subtle hover:shadow-card transition-shadow">
      {/* Product Thumbnail */}
      <Link
        to={`/products/${product.id}`}
        className="w-24 h-28 sm:w-28 sm:h-32 flex-shrink-0 bg-slate-100 rounded-2xl overflow-hidden"
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          {product.category}
        </span>
        <Link to={`/products/${product.id}`}>
          <h4 className="text-base font-bold text-slate-900 hover:text-emerald-600 transition-colors">
            {product.name}
          </h4>
        </Link>
        <p className="text-xs text-slate-400 mt-0.5">
          ${Number(product.price).toFixed(2)} each
        </p>

        {maxStock <= 5 && (
          <p className="text-xs text-amber-600 font-medium mt-1">
            Only {maxStock} left in stock
          </p>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={loading}
            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-bold text-sm text-slate-900">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={loading || item.quantity >= maxStock}
            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Item Subtotal & Delete */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
        <span className="text-lg font-extrabold text-slate-900">
          ${item.itemTotal.toFixed(2)}
        </span>

        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
          aria-label={`Remove ${product.name} from cart`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
