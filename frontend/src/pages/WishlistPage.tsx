import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, TrendingDown } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { SmartBuyScoreBadge } from '../components/SmartBuyScoreBadge';

interface WishlistItem {
  wishlistId: string;
  addedAt: string;
  product: Product;
}

export const WishlistPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/user/wishlist');
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [isAuthenticated]);

  const handleRemove = async (productId: string) => {
    try {
      await api.delete(`/user/wishlist/${productId}`);
      setItems(items.filter((item) => item.product.id !== productId));
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <Heart className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Your Saved Wishlist</h2>
        <p className="text-slate-400 text-xs max-w-sm mx-auto">
          Please log in to view and manage your saved products and track price drops.
        </p>
        <Link to="/login" className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold inline-block">
          Log In to PricePilot
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-xs">Loading saved wishlist items...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-400" />
              <span>Personal Saved Products ({items.length})</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Saved Wishlist</h1>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
            <Heart className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Save products to track store price updates, price drops, and Smart Buy Scores.
            </p>
            <Link to="/products" className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold inline-flex items-center gap-2">
              <span>Browse Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(({ wishlistId, product }) => (
              <div
                key={wishlistId}
                className="bg-slate-900/60 border border-slate-800/80 hover:border-brand-500/40 rounded-2xl p-5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded border border-brand-500/20 uppercase">
                      {product.brand?.name}
                    </span>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link to={`/product/${product.slug}`} className="block mb-3">
                    <img src={product.image} alt={product.name} className="w-full h-40 object-contain rounded-xl bg-slate-950/40 p-2 mb-3" />
                    <h3 className="text-sm font-bold text-white hover:text-brand-400 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mb-4">
                    <SmartBuyScoreBadge score={85} size="sm" />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 mb-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">Current Best Price</span>
                      <span className="text-lg font-black text-white">₹{product.bestPrice.toLocaleString('en-IN')}</span>
                    </div>
                    {product.discount > 0 && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                          <TrendingDown className="w-3 h-3" /> {product.discount}% Discount
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  to={`/product/${product.slug}`}
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-brand-600/20"
                >
                  <span>Compare Store Prices</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
