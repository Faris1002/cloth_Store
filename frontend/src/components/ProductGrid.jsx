import React from 'react';
import ProductCard from './ProductCard.jsx';
import EmptyState from './EmptyState.jsx';

export const ProductGrid = ({ products, loading, emptyMessage = 'No products found' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-subtle animate-pulse"
          >
            <div className="aspect-[4/5] bg-slate-200" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="pt-4 flex justify-between items-center">
                <div className="h-6 bg-slate-200 rounded w-16" />
                <div className="h-9 bg-slate-200 rounded-xl w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No products available"
        description={emptyMessage}
        actionLabel="Reset Filters"
        actionLink="/products"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
