import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProducts, fetchCategories, fetchBrands } from '../services/api';
import { Product, Category, Brand } from '../types';
import { ProductCard } from '../components/ProductCard';
import { SkeletonCard } from '../components/SkeletonCard';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filter States initialized from URL search params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catsData, brandsData] = await Promise.all([
        fetchProducts({
          search: search || undefined,
          category: selectedCategory || undefined,
          brand: selectedBrand || undefined,
          sortBy,
          page,
          limit: 12,
        }),
        fetchCategories(),
        fetchBrands(),
      ]);

      setProducts(prodRes.data);
      setPagination(prodRes.pagination);
      setCategories(catsData);
      setBrands(brandsData);
    } catch (e) {
      console.error('Failed to fetch catalog products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedCategory, selectedBrand, sortBy, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold mb-2">
              <Filter className="w-3.5 h-3.5" />
              <span>Full Product Catalog ({pagination.total} Available)</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Product Discovery Engine</h1>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-brand-500"
            >
              <option value="newest">Newest Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest User Rating</option>
            </select>
          </div>
        </div>

        {/* CATALOG CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-400" />
                  Filter Catalog
                </h3>
                {(search || selectedCategory || selectedBrand) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Search Filter */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by keyword..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </form>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Category</label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => { setSelectedCategory(''); setPage(1); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      !selectedCategory ? 'bg-brand-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCategory(c.slug); setPage(1); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === c.slug ? 'bg-brand-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px] text-slate-500">({c.productCount})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Brand</label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => { setSelectedBrand(''); setPage(1); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      !selectedBrand ? 'bg-brand-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { setSelectedBrand(b.slug); setPage(1); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedBrand === b.slug ? 'bg-brand-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span>{b.name}</span>
                      <span className="text-[10px] text-slate-500">({b.productCount})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-9 space-y-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SkeletonCard key={n} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
                <Search className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Products Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search keywords or resetting filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-6 border-t border-slate-800">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs text-slate-400 font-semibold">
                  Page <span className="text-white">{page}</span> of {pagination.totalPages}
                </span>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
