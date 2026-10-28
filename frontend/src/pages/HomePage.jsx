import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Leaf, Compass } from 'lucide-react';
import { productService } from '../services/productService.js';
import ProductGrid from '../components/ProductGrid.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { CATEGORIES, CATEGORY_DETAILS } from '../constants/categories.js';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts({ limit: 8, sort: 'newest' });
      setFeaturedProducts(data?.products || []);
    } catch (err) {
      console.error('Error fetching home products:', err);
      setError(err.message || 'Unable to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80"
          alt="ModernWear Haute Couture Fashion"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-32 flex flex-col justify-center min-h-[560px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-md border border-emerald-500/30 w-max mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Autumn / Winter '26 Collection
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] max-w-2xl">
            Modern Apparel for Thoughtful Living.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-light">
            Crafted with organic fibers, architectural silhouettes, and unmatched attention to detail. Designed to elevate your daily wardrobe.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold shadow-lg hover:shadow-emerald-500/25 transition-all"
            >
              Shop New Arrivals
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/products?category=Women"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md border border-white/20 transition-all"
            >
              Explore Women
            </Link>
          </div>
        </div>
      </section>

      {/* Category Discovery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Curated Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors flex items-center gap-1 mt-2 sm:mt-0"
          >
            View all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((category) => {
            const meta = CATEGORY_DETAILS[category];
            return (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-100 shadow-subtle hover:shadow-hover transition-all"
              >
                <img
                  src={meta?.image}
                  alt={category}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-base sm:text-lg group-hover:text-emerald-400 transition-colors">
                    {category}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium flex items-center gap-1 mt-0.5 opacity-90 group-hover:opacity-100">
                    Explore collection &rarr;
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured & Latest Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Handpicked Essentials
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Latest Arrivals
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors flex items-center gap-1 mt-2 sm:mt-0"
          >
            See full catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {error ? (
          <ErrorMessage
            title="Unable to load catalog"
            message={error}
            onRetry={fetchFeatured}
          />
        ) : (
          <ProductGrid
            products={featuredProducts}
            loading={loading}
            emptyMessage="No clothing products currently available. Check back soon or add one!"
          />
        )}
      </section>

      {/* Brand Values / Sustainability & Quality */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/70 rounded-3xl p-8 sm:p-12 border border-slate-200">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              The ModernWear Promise
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Engineered for Quality, Conceived for Longevity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Ethical & Sustainable</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                We partner with certified mills utilizing fair trade labor and 100% organic cotton, recycled wool, and low-impact dyes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Timeless Versatility</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Garments that transcend seasonal micro-trends, designed with clean geometry and durable construction that lasts for years.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Direct & Guaranteed</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Enjoy transparent pricing without middlemen markups, backed by our 30-day wear-and-wash guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
