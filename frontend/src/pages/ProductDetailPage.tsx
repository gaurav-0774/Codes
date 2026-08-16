import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Store as StoreIcon,
  Heart,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { fetchProductBySlug, fetchProductAlternatives } from '../services/api';
import { Product } from '../types';
import { PriceHistoryChart } from '../components/PriceHistoryChart';
import { ReviewSection } from '../components/ReviewSection';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [alternatives, setAlternatives] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const loadData = async () => {
    if (!slug) return;
    setLoading(true);
    setError('');
    try {
      const prod = await fetchProductBySlug(slug);
      setProduct(prod);

      // Fetch alternatives once product ID is resolved
      if (prod.id) {
        const alts = await fetchProductAlternatives(prod.id);
        setAlternatives(alts);
      }
    } catch (err: any) {
      setError('Product not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading PricePilot product analysis...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">{error || 'The requested product could not be located.'}</p>
        <Link to="/products" className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const scoreObj = product.smartBuyScore;
  const recObj = product.buyWaitRecommendation;
  const prices = product.prices || [];
  const minPrice = Math.min(...prices.map((p) => p.price));
  const maxStoreRating = Math.max(...prices.map((p) => p.store?.rating || 0));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-brand-400">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-brand-400">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category?.slug}`} className="hover:text-brand-400">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-semibold truncate">{product.name}</span>
        </div>

        {/* TOP PRODUCT HEADER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Image Gallery */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 flex items-center justify-center relative">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-96 w-full object-contain mx-auto hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-rose-400'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Core Info & Best Price Summary */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/30 text-xs font-bold uppercase tracking-wider">
                  {product.brand?.name}
                </span>
                <span className="text-xs text-slate-400">{product.category?.name}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating & Review Summary */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-400">({product.reviewCount} verified reviews)</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> In Stock Across Stores
              </span>
            </div>

            {/* Price Overview Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/30 border border-slate-800 space-y-3">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Current Best Store Price
              </div>
              <div className="flex items-baseline gap-4">
                <div className="text-4xl font-black text-white">
                  ₹{product.bestPrice.toLocaleString('en-IN')}
                </div>
                {product.discount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                      {product.discount}% OFF
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Compared across <span className="text-white font-bold">{prices.length} stores</span>. PricePilot does not charge extra fees.
              </p>
            </div>

            {/* Smart Buy Score & Recommendation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scoreObj && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center shrink-0">
                    <div className="text-2xl font-black text-white">{scoreObj.score}</div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Out of 100</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-0.5">Smart Buy Score</div>
                    <div className="text-sm font-bold text-cyan-400">{scoreObj.label}</div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">6-Vector Value Algorithm</div>
                  </div>
                </div>
              )}

              {recObj && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
                  <div className={`px-3 py-2 rounded-xl text-xs font-extrabold border ${recObj.badgeColor} shrink-0`}>
                    {recObj.recommendation}
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-0.5">PricePilot Recommendation</div>
                    <div className="text-[11px] text-slate-300 line-clamp-2">{recObj.reason}</div>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>
        </div>

        {/* 2. MULTI-STORE PRICE COMPARISON TABLE */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                <StoreIcon className="w-6 h-6 text-brand-400" />
                Store Price Comparison Table
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real store prices with explicit <span className="text-amber-400 font-semibold">"Last Updated"</span> timestamps.
              </p>
            </div>
            <div className="text-xs text-slate-500">
              Showing prices from {prices.length} verified stores
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Store</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Delivery</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {prices.map((stPrice) => {
                  const isBestPrice = stPrice.price === minPrice;
                  const isBestRated = stPrice.store?.rating === maxStoreRating;
                  const formattedDate = new Date(stPrice.lastUpdated).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={stPrice.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Store Details */}
                      <td className="py-4 px-4 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-950 p-1 border border-slate-800 overflow-hidden shrink-0">
                            <img src={stPrice.store?.logo} alt={stPrice.store?.name} className="w-full h-full object-cover rounded" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              <span>{stPrice.store?.name}</span>
                              {isBestPrice && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                  BEST PRICE
                                </span>
                              )}
                              {isBestRated && !isBestPrice && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                                  TOP RATED
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{stPrice.store?.rating} • {stPrice.store?.city}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4">
                        <div className="text-base font-extrabold text-white">
                          ₹{stPrice.price.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-slate-500 line-through">
                          ₹{stPrice.originalPrice.toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Discount */}
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                          {stPrice.discount}% OFF
                        </span>
                      </td>

                      {/* Availability */}
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {stPrice.availability}
                        </span>
                      </td>

                      {/* Delivery */}
                      <td className="py-4 px-4 text-slate-300">
                        {stPrice.deliveryText}
                      </td>

                      {/* Last Updated Badge */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-[11px]">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Last updated: {formattedDate}</span>
                        </div>
                      </td>

                      {/* Product Link CTA */}
                      <td className="py-4 px-4 text-right">
                        <a
                          href={stPrice.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors shadow-md shadow-brand-600/20"
                        >
                          <span>Visit Store</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. SPECIFICATIONS MATRIX & PRICE HISTORY CHART GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Specifications Matrix */}
          <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-400" />
              Technical Specifications
            </h3>

            <div className="divide-y divide-slate-800/60 border-t border-b border-slate-800/60">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="py-3 grid grid-cols-3 text-xs">
                  <span className="font-semibold text-slate-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="col-span-2 text-white font-medium">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price History Timeline Chart */}
          <div className="lg:col-span-6">
            <PriceHistoryChart history={product.priceHistories || []} />
          </div>
        </div>

        {/* 4. BETTER ALTERNATIVES RECOMMENDATION SECTION */}
        {alternatives.length > 0 && (
          <div className="space-y-6">
            <div>
              <div className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-1">
                Smart Recommendations
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Better Alternatives in {product.category?.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {alternatives.map((alt) => (
                <div
                  key={alt.id}
                  className="bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 rounded-2xl p-5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-3">
                      <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[11px] font-bold">
                        {alt.keyAdvantage || 'Better Value'}
                      </span>
                    </div>

                    <Link to={`/product/${alt.slug}`} className="block mb-3">
                      <img src={alt.image} alt={alt.name} className="w-full h-36 object-contain rounded-xl bg-slate-950/40 p-2 mb-2" />
                      <h4 className="text-sm font-bold text-white hover:text-brand-400 transition-colors line-clamp-1">
                        {alt.name}
                      </h4>
                    </Link>

                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-slate-400">Best Price</span>
                      <span className="font-extrabold text-white text-base">₹{alt.bestPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <Link
                    to={`/product/${alt.slug}`}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-brand-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Alternative</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CUSTOMER REVIEWS SECTION */}
        <ReviewSection
          productId={product.id}
          reviews={product.reviews || []}
          onReviewAdded={loadData}
        />
      </div>
    </div>
  );
};
