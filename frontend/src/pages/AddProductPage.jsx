import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Image as ImageIcon, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { productService } from '../services/productService.js';
import { useToast } from '../context/ToastContext.jsx';
import { CATEGORIES } from '../constants/categories.js';

export const AddProductPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Men',
    price: '',
    stock_quantity: '10',
    image_url: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim() || formData.name.trim().length < 2 || formData.name.trim().length > 120) {
      return 'Product name must be between 2 and 120 characters.';
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      return 'Description must be at least 10 characters.';
    }
    if (formData.description.trim().length > 2000) {
      return 'Description cannot exceed 2,000 characters.';
    }
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return 'Price must be a positive number greater than 0.';
    }
    const stockNum = parseInt(formData.stock_quantity, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      return 'Stock quantity must be a non-negative integer (0 or more).';
    }
    if (!formData.image_url || !/^https?:\/\//i.test(formData.image_url)) {
      return 'Image URL must be a valid HTTP or HTTPS URL.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity, 10),
        image_url: formData.image_url.trim(),
        description: formData.description.trim(),
      };

      const createdProduct = await productService.createProduct(payload);
      showToast('Product created successfully!', 'success');
      navigate(`/products/${createdProduct.id}`);
    } catch (err) {
      console.error('Failed to create product:', err);
      setError(err.message || 'Failed to create product. Check database connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Add New Clothing Item
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          List a new garment or accessory in the ModernWear store catalog.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Form Fields */}
        <div className="md:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-subtle">
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Title * (2–120 characters)
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Tailored Wool Overshirt"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Price (USD) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="79.00"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stock_quantity" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Stock Quantity *
              </label>
              <input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                step="1"
                required
                value={formData.stock_quantity}
                onChange={handleChange}
                placeholder="25"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="image_url" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Image URL * (HTTP/HTTPS)
              </label>
              <input
                id="image_url"
                name="image_url"
                type="url"
                required
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Description * (max 2,000 characters)
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe materials, fit, care instructions, and design features..."
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              {formData.description.length} / 2000 characters
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Publishing Product...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" /> Publish to Store Catalog
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Card Preview */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Live Store Preview
          </h3>
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-subtle p-3">
            <div className="aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center relative">
              {formData.image_url ? (
                <img
                  src={formData.image_url}
                  alt="Live Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <ImageIcon className="w-10 h-10 mb-2 stroke-1" />
                  <span className="text-xs">Paste Image URL</span>
                </div>
              )}
              <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
                {formData.category}
              </span>
            </div>

            <div className="p-3 space-y-1">
              <h4 className="font-bold text-slate-900 text-sm truncate">
                {formData.name || 'Sample Garment Title'}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                {formData.description || 'Description of fabrics and cut will display here...'}
              </p>
              <div className="pt-2 flex justify-between items-baseline">
                <span className="text-base font-extrabold text-slate-900">
                  ${formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  Qty: {formData.stock_quantity || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
