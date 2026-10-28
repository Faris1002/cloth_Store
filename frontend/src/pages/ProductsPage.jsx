import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { productService } from '../services/productService.js';
import ProductGrid from '../components/ProductGrid.jsx';
import ProductSearch from '../components/ProductSearch.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search input state with debounce
  const [searchInput, setSearchInput] = useState(searchParam);

  // Sync search input with URL search param
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Load products based on query params
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await productService.getProducts({
        category: categoryParam,
        search: searchParam,
        sort: sortParam,
        page: pageParam,
        limit: 12,
      });

      setProducts(data?.products || []);
      setPagination(
        data?.pagination || { total: 0, page: pageParam, limit: 12, totalPages: 1 }
      );
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err.message || 'Could not load products');
    } finally {
      setLoading(false);
    }
  }, [categoryParam, searchParam, sortParam, pageParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle query parameter updates
  const updateQueryParam = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    // Reset to page 1 if search, category, or sort changes
    if ('search' in updates || 'category' in updates || 'sort' in updates) {
      newParams.set('page', '1');
    }

    setSearchParams(newParams);
  };

  // Debounced search input handler
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== searchParam) {
        updateQueryParam({ search: searchInput });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Apparel Catalog
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Explore our collection of contemporary essentials, knitwear, denim, and accessories.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <ProductSearch
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search by apparel name or keywords..."
          />

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortParam}
              onChange={(e) => updateQueryParam({ sort: e.target.value })}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Alphabetical: A-Z</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div>
          <CategoryFilter
            selectedCategory={categoryParam}
            onSelectCategory={(cat) => updateQueryParam({ category: cat })}
          />
        </div>
      </div>

      {/* Active Filter Indicators */}
      {(categoryParam || searchParam) && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-slate-500 font-medium">Active Filters:</span>
          {categoryParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Category: {categoryParam}
              <button
                type="button"
                onClick={() => updateQueryParam({ category: '' })}
                className="hover:text-emerald-900 font-bold"
              >
                &times;
              </button>
            </span>
          )}
          {searchParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              Search: "{searchParam}"
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateQueryParam({ search: '' });
                }}
                className="hover:text-slate-900 font-bold"
              >
                &times;
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setSearchInput('');
              setSearchParams(new URLSearchParams());
            }}
            className="text-xs text-rose-600 hover:underline font-semibold ml-2"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Catalog Results */}
      {error ? (
        <ErrorMessage
          title="Failed to load apparel"
          message={error}
          onRetry={fetchProducts}
        />
      ) : (
        <>
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>
              Showing {products.length} of {pagination.total} {pagination.total === 1 ? 'item' : 'items'}
            </span>
          </div>

          <ProductGrid
            products={products}
            loading={loading}
            emptyMessage={
              searchParam || categoryParam
                ? 'No apparel matches your current search or category filter.'
                : 'No apparel found in the catalog.'
            }
          />

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <button
                type="button"
                onClick={() => updateQueryParam({ page: pageParam - 1 })}
                disabled={pageParam <= 1 || loading}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                type="button"
                onClick={() => updateQueryParam({ page: pageParam + 1 })}
                disabled={pageParam >= pagination.totalPages || loading}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;
