import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/25">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                PRICE<span className="text-brand-500">PILOT</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              PricePilot is an independent product discovery & multi-store price comparison engine. We track authentic store prices with mandatory "Last Updated" audit badges.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>BCA Semester 3 Capstone Project</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/products" className="hover:text-brand-400 transition-colors">Browse Product Catalog</Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-brand-400 transition-colors">Side-by-Side Product Comparison</Link>
              </li>
              <li>
                <Link to="/stores" className="hover:text-brand-400 transition-colors">Nearby Retail Stores Map</Link>
              </li>
              <li>
                <Link to="/calculators" className="hover:text-brand-400 transition-colors">EMI & Discount Calculators</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-brand-400 transition-colors">Saved Wishlist Items</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Popular Categories</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/products?category=smartphones" className="hover:text-brand-400 transition-colors">Flagship Smartphones</Link>
              </li>
              <li>
                <Link to="/products?category=laptops" className="hover:text-brand-400 transition-colors">Ultrabooks & Gaming Laptops</Link>
              </li>
              <li>
                <Link to="/products?category=audio-headphones" className="hover:text-brand-400 transition-colors">Noise-Canceling Headphones</Link>
              </li>
              <li>
                <Link to="/products?category=smartwatches" className="hover:text-brand-400 transition-colors">Fitness Smartwatches</Link>
              </li>
              <li>
                <Link to="/products?category=gaming-consoles" className="hover:text-brand-400 transition-colors">Next-Gen Gaming Consoles</Link>
              </li>
            </ul>
          </div>

          {/* Key Features & Disclaimers */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform Transparency</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              PricePilot does NOT sell products directly. We aggregate store pricing data manually and through verified seed stores.
            </p>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-brand-400">Zero Paid API Dependency</div>
              <div className="text-[11px] text-slate-500">100% Standalone & Offline Execution Ready</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} PricePilot Platform. Created by Student Developer.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for BCA Project
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
