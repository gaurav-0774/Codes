import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  TrendingUp,
  Award,
  Zap,
  Sparkles,
  ArrowRight,
  GitCompare,
  PieChart,
} from 'lucide-react';
import { fetchCategories, fetchFeaturedProducts } from '../services/api';
import { Category, Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<{
    trending: Product[];
    bestDeals: Product[];
    topRated: Product[];
  }>({ trending: [], bestDeals: [], topRated: [] });

  const [activeTab, setActiveTab] = useState<'trending' | 'bestDeals' | 'topRated'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, feat] = await Promise.all([
          fetchCategories(),
          fetchFeaturedProducts(),
        ]);
        setCategories(cats);
        setFeatured(feat);
      } catch (e) {
        console.error('Failed to load homepage data:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const currentProducts = featured[activeTab] || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/60 bg-gradient-to-b from-brand-950/20 via-slate-950 to-slate-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-brand-500/10 blur-[140px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Independent Store Price Comparison & Smart Discovery</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
            Compare Smarter. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Buy Better.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
            PricePilot evaluates store listings, historical price trends, and technical specifications to help you decide what to buy, which store offers the best deal, and whether to buy now or wait.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto relative mb-10">
            <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900/90 backdrop-blur-xl focus-within:border-brand-500 transition-all p-1.5">
              <Search className="w-6 h-6 text-slate-400 ml-4 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products (iPhone 16 Pro, S25 Ultra, M4 MacBook, Sony WH-1000XM5)..."
                className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm sm:text-base px-2 py-2"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-600/30 flex items-center gap-2 shrink-0"
              >
                <span>Find Best Price</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/60 text-left">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-xl font-bold text-white mb-0.5">30+ Flagships</div>
              <div className="text-xs text-slate-400">Structured Tech Catalog</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-xl font-bold text-emerald-400 mb-0.5">5 Local Stores</div>
              <div className="text-xs text-slate-400">Verified Retail Options</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-xl font-bold text-cyan-400 mb-0.5">Smart Buy 0-100</div>
              <div className="text-xs text-slate-400">Weighted Value Score</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-xl font-bold text-amber-400 mb-0.5">100% Offline</div>
              <div className="text-xs text-slate-400">Zero Paid API Dependency</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="py-16 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-1">
                Explore Categories
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Popular Product Categories
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 group"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 text-center flex flex-col items-center justify-between"
              >
                <div className="w-full h-28 overflow-hidden rounded-xl bg-slate-950/40 p-2 mb-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-1">
                  {cat.productCount || 0} Products
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PRODUCT SHOWCASE TABS */}
      <section className="py-16 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <div className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-1">
                Product Showcase
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Discover Today's Top Products
              </h2>
            </div>

            {/* Tab Controls */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto">
              <button
                onClick={() => setActiveTab('trending')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'trending'
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Trending Now</span>
              </button>
              <button
                onClick={() => setActiveTab('bestDeals')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'bestDeals'
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Best Deals</span>
              </button>
              <button
                onClick={() => setActiveTab('topRated')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'topRated'
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Highest Rated</span>
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. SMART BUY SCORE SPOTLIGHT */}
      <section className="py-20 border-b border-slate-800/60 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
                <PieChart className="w-3.5 h-3.5" />
                <span>Proprietary Value Algorithm</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Understand the <span className="text-brand-500">Smart Buy Score</span> (0–100)
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Rather than relying on raw star ratings or biased store promotions, PricePilot evaluates each product across 6 objective vectors to give you a single composite score.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-brand-400 font-bold text-sm mb-1">Price Value (30%)</div>
                  <div className="text-xs text-slate-400">Competitive pricing relative to category standard.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-cyan-400 font-bold text-sm mb-1">User Rating (20%)</div>
                  <div className="text-xs text-slate-400">Normalized 5-star customer review average.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-emerald-400 font-bold text-sm mb-1">Review Volume (15%)</div>
                  <div className="text-xs text-slate-400">Statistical rating confidence weight.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-amber-400 font-bold text-sm mb-1">Price Trend (10%)</div>
                  <div className="text-xs text-slate-400">Checks 60-day historical price lows.</div>
                </div>
              </div>
            </div>

            {/* Score Callout Card */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Example Evaluation</span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  91 / 100 • Excellent Deal
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Samsung Galaxy S25 Ultra 5G</h3>
                <div className="text-xs text-slate-400">Current Best Store Price: <span className="text-white font-bold">₹1,29,999</span> (Save ₹12,000)</div>
              </div>

              {/* Progress bars */}
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Price Score</span>
                    <span className="text-brand-400 font-bold">92%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Customer Rating</span>
                    <span className="text-cyan-400 font-bold">96%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Historical Price Low Check</span>
                    <span className="text-emerald-400 font-bold">95%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SIDE-BY-SIDE COMPARE CALLOUT */}
      <section className="py-16 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
              <GitCompare className="w-3.5 h-3.5" />
              <span>Category-Aware Comparison Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Compare Up to 3 Products Side-by-Side
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Compare technical specs, processors, display refresh rates, battery capacities, store prices, and Smart Buy Scores in a clear comparison matrix.
            </p>
            <div className="pt-4">
              <Link
                to="/compare"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/20"
              >
                <span>Open Comparison Tool</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW PRICEPILOT WORKS */}
      <section className="py-20 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-1">
              Workflow Guide
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              How PricePilot Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400 font-extrabold flex items-center justify-center mb-4 text-base">
                1
              </div>
              <h3 className="text-base font-bold text-white mb-2">Discover Products</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse or search products across smartphones, laptops, audio, smartwatches, and gaming gear.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-extrabold flex items-center justify-center mb-4 text-base">
                2
              </div>
              <h3 className="text-base font-bold text-white mb-2">Check Smart Buy Score</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review our 0–100 Smart Buy Score evaluating real value, specs, discounts, and ratings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-extrabold flex items-center justify-center mb-4 text-base">
                3
              </div>
              <h3 className="text-base font-bold text-white mb-2">Buy or Wait Advice</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                See rule-based market recommendations comparing current prices against 30-day average lows.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 font-extrabold flex items-center justify-center mb-4 text-base">
                4
              </div>
              <h3 className="text-base font-bold text-white mb-2">Pick Store & Save</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compare local and online store listings with transparent "Last Updated" timestamps.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
