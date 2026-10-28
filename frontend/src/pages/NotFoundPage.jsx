import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mb-6">
        <Shirt className="w-8 h-8" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
        Error 404
      </span>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-2">
        Page Not Found
      </h1>
      <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-md leading-relaxed">
        The garment or page you were looking for doesn't exist or may have moved to a different collection.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          Browse Catalog
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
