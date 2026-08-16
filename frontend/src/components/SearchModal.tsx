import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Tag, Star } from 'lucide-react';
import { fetchProducts } from '../services/api';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetchProducts({ search: query, limit: 6 });
        setResults(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Search Header */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-slate-800 p-4">
          <Search className="w-5 h-5 text-slate-400 absolute left-6" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands (iPhone 16, M4 MacBook, Sony WH-1000XM5)..."
            className="w-full bg-transparent pl-10 pr-12 text-white placeholder-slate-500 focus:outline-none text-base font-medium"
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors absolute right-4"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading && (
            <div className="py-8 text-center text-slate-400 text-sm">Searching PricePilot database...</div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No products found matching "<span className="text-white font-medium">{query}</span>"
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 px-2 mb-2">
                Matching Products ({results.length})
              </div>
              {results.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p.slug)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer border border-transparent hover:border-slate-700/50 transition-all group"
                >
                  <img src={p.image} alt={p.name} className="w-12 h-12 object-contain rounded-lg bg-slate-950/40 p-1" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white group-hover:text-brand-400 truncate">
                      {p.name}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {p.rating}
                      </span>
                      <span>{p.category?.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">₹{p.bestPrice.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-emerald-400 font-medium">{p.discount}% OFF</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          )}

          {!query && (
            <div className="py-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2 mb-3">Popular Searches</div>
              <div className="flex flex-wrap gap-2">
                {['Samsung S25 Ultra', 'iPhone 16 Pro', 'M4 MacBook Pro', 'Sony WH-1000XM5', 'PlayStation 5 Pro', 'Apple Watch Ultra'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-brand-600/20 text-slate-300 hover:text-brand-300 border border-slate-700/50 text-xs transition-colors"
                  >
                    <Tag className="w-3 h-3" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
