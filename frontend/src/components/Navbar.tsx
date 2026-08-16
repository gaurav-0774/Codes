import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Search,
  GitCompare,
  Heart,
  Calculator,
  MapPin,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SearchModal } from './SearchModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                  PRICE<span className="text-brand-500">PILOT</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">
                  Compare Smarter. Buy Better.
                </span>
              </div>
            </Link>

            {/* Quick Search Bar trigger */}
            <div className="hidden md:flex items-center min-w-[180px] lg:min-w-[260px] max-w-md shrink-0">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-brand-500/40 text-slate-400 text-xs sm:text-sm transition-all shadow-inner group overflow-hidden"
              >
                <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-400 transition-colors shrink-0" />
                <span className="flex-1 text-left whitespace-nowrap truncate">Search products, specs...</span>
                <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700 shrink-0">
                  Ctrl K
                </kbd>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link to="/products" className="hover:text-brand-400 transition-colors">
                Browse Catalog
              </Link>
              <Link to="/compare" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                <GitCompare className="w-4 h-4 text-brand-400" />
                Compare (0)
              </Link>
              <Link to="/stores" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Stores Map
              </Link>
              <Link to="/calculators" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-cyan-400" />
                Calculators
              </Link>
            </nav>

            {/* User Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                to="/wishlist"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-rose-400 transition-colors relative"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-purple-500/20 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200">
                    <UserIcon className="w-4 h-4 text-brand-400" />
                    <span>{user?.name.split(' ')[0]}</span>
                    <button
                      onClick={logout}
                      className="ml-2 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-900 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all shadow-md shadow-brand-600/20"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-xl bg-slate-900 text-slate-300"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-900 text-slate-300"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900 text-sm font-medium"
            >
              Browse Catalog
            </Link>
            <Link
              to="/compare"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900 text-sm font-medium"
            >
              Compare Products
            </Link>
            <Link
              to="/stores"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900 text-sm font-medium"
            >
              Nearby Stores Map
            </Link>
            <Link
              to="/calculators"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900 text-sm font-medium"
            >
              EMI & Discount Calculators
            </Link>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              {isAuthenticated ? (
                <div className="flex items-center justify-between w-full">
                  <div className="text-sm font-medium text-white">{user?.name}</div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 text-xs bg-rose-500/10 text-rose-400 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-xl bg-slate-900 text-slate-200 text-xs font-semibold"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Quick Search Overlay Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
