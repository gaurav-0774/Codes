import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Store as StoreIcon, Heart, GitCompare, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { SmartBuyScoreBadge } from './SmartBuyScoreBadge';

interface ProductCardProps {
  product: Product;
  onCompare?: (product: Product) => void;
  onWishlistToggle?: (productId: string) => void;
  isWishlisted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onCompare,
  onWishlistToggle,
  isWishlisted = false,
}) => {
  // Approximate score for card display if not pre-fetched
  const approxScore = product.smartBuyScore?.score || Math.min(96, Math.max(65, Math.round(
    (product.rating / 5) * 45 +
    (product.discount > 0 ? product.discount * 1.2 : 15) +
    25
  )));

  return (
    <div className="group relative bg-slate-900/60 border border-slate-800/80 hover:border-brand-500/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 flex flex-col justify-between">
      <div>
        {/* Header badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-md border border-brand-500/20 uppercase tracking-wider">
            {product.brand?.name || 'Brand'}
          </span>
          <div className="flex items-center gap-1.5">
            {onWishlistToggle && (
              <button
                onClick={() => onWishlistToggle(product.id)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isWishlisted
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-rose-400 border-slate-700/50'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400' : ''}`} />
              </button>
            )}
            {onCompare && (
              <button
                onClick={() => onCompare(product)}
                className="p-1.5 rounded-lg bg-slate-800/60 text-slate-400 hover:text-brand-400 border border-slate-700/50 transition-colors"
                title="Add to Compare"
              >
                <GitCompare className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Product Image */}
        <Link to={`/product/${product.slug}`} className="block overflow-hidden rounded-xl bg-slate-950/40 mb-4 p-4 text-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-44 object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Smart Buy Score */}
        <div className="mb-2">
          <SmartBuyScoreBadge score={approxScore} size="sm" />
        </div>

        {/* Product Title */}
        <Link to={`/product/${product.slug}`} className="block mb-2">
          <h3 className="text-base font-bold text-slate-100 group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating & Review Count */}
        <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
          <div className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span>({product.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Pricing Footer */}
      <div className="pt-3 border-t border-slate-800/60">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <div className="text-xs text-slate-400">Best Store Price</div>
            <div className="text-xl font-extrabold text-white">
              ₹{product.bestPrice.toLocaleString('en-IN')}
            </div>
          </div>
          {product.discount > 0 && (
            <div className="text-right">
              <div className="text-xs text-slate-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                {product.discount}% OFF
              </div>
            </div>
          )}
        </div>

        {/* Store Compare Link */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <StoreIcon className="w-3.5 h-3.5 text-brand-400" />
            {product.storeCount || 3} Stores Compared
          </span>
          <span className="text-[11px] text-slate-500">Last updated today</span>
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-brand-600/20"
        >
          <span>Compare Prices</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
