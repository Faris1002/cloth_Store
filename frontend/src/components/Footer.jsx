import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, ShieldCheck, Truck, RotateCcw, Heart } from 'lucide-react';
import { CATEGORIES } from '../constants/categories.js';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      {/* Values Banner */}
      <div className="border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Complimentary Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">Free standard delivery on orders over $75</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">30-Day Hassle-Free Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">Return or exchange any unworn items</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Secure Authentication</h4>
                <p className="text-xs text-slate-400 mt-0.5">Powered by Supabase PostgreSQL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Shirt className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                MODERN<span className="text-emerald-500">WEAR</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated modern clothing essentials crafted with sustainable textiles, timeless tailoring, and functional aesthetics.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Shop Collections
            </h5>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Explore
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Full Catalog
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  My Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/add-product" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Add New Product
                </Link>
              </li>
            </ul>
          </div>

          {/* Stack & Info */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Architecture
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built with React, Vite, Node.js, Express, and Supabase PostgreSQL with verified Row Level Security (RLS).
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Backend API Status: Active
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ModernWear Studio. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for high performance
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
