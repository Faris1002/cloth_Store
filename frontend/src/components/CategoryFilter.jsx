import React from 'react';
import { CATEGORIES } from '../constants/categories.js';

export const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  const allCategories = ['All', ...CATEGORIES];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {allCategories.map((category) => {
        const isSelected =
          selectedCategory === category || (!selectedCategory && category === 'All');

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category === 'All' ? '' : category)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
              isSelected
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
