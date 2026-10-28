import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Shield,
  Plus,
  Minus,
} from 'lucide-react';
import { productService } from '../services/productService.js';
import { useCart } from '../context/CartContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error('Failed to load product details:', err);
      setError(err.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading apparel details..." size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <ErrorMessage
          title="Apparel Not Found"
          message={error || 'This product does not exist or may have been removed.'}
          onRetry={fetchProduct}
        />
        <div className="mt-6 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  const maxAllowedQuantity = Math.max(1, product.stock_quantity);

  const handleIncrement = () => {
    if (quantity < maxAllowedQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    const success = await addToCart(product.id, quantity);
    setIsAdding(false);

    if (success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-emerald-600">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-emerald-600">
          Catalog
        </Link>
        <span>/</span>
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-emerald-600"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Image Frame */}
        <div className="relative aspect-[4/5] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/80 shadow-card">
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
          <div className="absolute top-4 left-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm border border-slate-200">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Buying Info */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              ModernWear Atelier
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              {product.name}
            </h1>
            <div className="mt-3 flex items-baseline gap-4">
              <span className="text-3xl font-black text-slate-900">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-medium">USD • Tax included</span>
            </div>
          </div>

          {/* Stock Availability Indicator */}
          <div className="pt-2">
            {isOutOfStock ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Currently Out of Stock
              </div>
            ) : isLowStock ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Limited Stock — Only {product.stock_quantity} left!
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                In Stock ({product.stock_quantity} units available)
              </div>
            )}
          </div>

          {/* Description */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Description & Highlights
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line font-light">
              {product.description}
            </p>
          </div>

          {/* Quantity and Add to Cart Section */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Quantity
              </span>
              <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-base text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= maxAllowedQuantity || isOutOfStock}
                  className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className={`flex-1 py-4 px-8 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-emerald-600 text-white'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Added to Shopping Bag!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    {isOutOfStock ? 'Sold Out' : isAdding ? 'Adding to Cart...' : 'Add to Bag'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="border-t border-slate-200 pt-6 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Complimentary standard shipping on all domestic orders over $75</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <RotateCcw className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Free 30-day returns and exchanges on unworn garments with tags</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Verified Supabase transaction with tamper-proof persistence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
