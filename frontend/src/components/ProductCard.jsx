import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    const success = await addToCart(product.id, 1);
    setIsAdding(false);

    if (success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-subtle hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
      {/* Product Image Frame */}
      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-[4/5] bg-slate-100 overflow-hidden"
      >
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            // High quality fashion placeholder fallback if image link fails
            e.target.onerror = null;
            e.target.src =
              'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm border border-slate-200/50">
            {product.category}
          </span>
        </div>

        {/* Stock Badge */}
        {isOutOfStock ? (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-sm">
              Sold Out
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
              Only {product.stock_quantity} Left
            </span>
          </div>
        ) : null}

        {/* Quick View Overlay on Desktop */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/95 text-slate-900 text-xs font-bold shadow-md">
            <Eye className="w-4 h-4" /> View Details
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-5">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-slate-900 text-base line-clamp-1 hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-extrabold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : addedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-emerald-600 text-white hover:shadow-md'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                {isOutOfStock ? 'Out of Stock' : isAdding ? 'Adding...' : 'Add to Cart'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
