import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, X, Plus, Star, Check, ArrowRight } from 'lucide-react';
import { fetchProducts, fetchProductBySlug } from '../services/api';
import { Product } from '../types';
import { SmartBuyScoreBadge } from '../components/SmartBuyScoreBadge';

export const ComparePage: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const res = await fetchProducts({ limit: 30 });
        setAllProducts(res.data);
        // Select first 2 products by default for an instant comparison showcase
        if (res.data.length >= 2) {
          const p1 = await fetchProductBySlug(res.data[0].slug);
          const p2 = await fetchProductBySlug(res.data[1].slug);
          setSelectedProducts([p1, p2]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, []);

  const handleAddProduct = async (product: Product) => {
    if (selectedProducts.length >= 3) return;
    if (selectedProducts.some((p) => p.id === product.id)) return;

    try {
      const fullProd = await fetchProductBySlug(product.slug);
      setSelectedProducts([...selectedProducts, fullProd]);
      setIsSelectorOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const getSpecValue = (p: Product, specName: string): string => {
    const specs = p.specifications || {};
    const key = Object.keys(specs).find(
      (k) => k.toLowerCase().includes(specName.toLowerCase())
    );
    return key ? String(specs[key]) : 'N/A';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-xs">Loading comparison matrix...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
              <GitCompare className="w-3.5 h-3.5" />
              <span>Category-Aware Specs & Price Comparison</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Compare Products (Max 3)</h1>
          </div>

          {selectedProducts.length < 3 && (
            <button
              onClick={() => setIsSelectorOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shadow-lg shadow-purple-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product ({selectedProducts.length}/3)</span>
            </button>
          )}
        </div>

        {/* COMPARISON MATRIX TABLE */}
        {selectedProducts.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
            <GitCompare className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Products Selected</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Select up to 3 products to compare store prices, specs, ratings, and Smart Buy Scores side-by-side.
            </p>
            <button
              onClick={() => setIsSelectorOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Select Products to Compare</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="w-1/4 p-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900/80 rounded-tl-2xl border-b border-slate-800">
                    Product Specification
                  </th>
                  {selectedProducts.map((p) => (
                    <th key={p.id} className="w-1/4 p-4 bg-slate-900/80 border-b border-slate-800 relative align-top">
                      <button
                        onClick={() => handleRemoveProduct(p.id)}
                        className="absolute top-3 right-3 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="text-center space-y-2 pt-2">
                        <img src={p.image} alt={p.name} className="w-24 h-24 object-contain mx-auto rounded-lg bg-slate-950 p-2" />
                        <span className="text-[10px] font-bold text-brand-400 uppercase bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                          {p.brand?.name}
                        </span>
                        <h4 className="text-sm font-bold text-white line-clamp-2 px-2">
                          {p.name}
                        </h4>
                      </div>
                    </th>
                  ))}
                  {Array.from({ length: 3 - selectedProducts.length }).map((_, idx) => (
                    <th key={idx} className="w-1/4 p-4 bg-slate-900/40 border-b border-slate-800 text-center align-middle">
                      <button
                        onClick={() => setIsSelectorOpen(true)}
                        className="p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-brand-500/50 text-slate-500 hover:text-brand-400 transition-colors inline-flex flex-col items-center gap-2"
                      >
                        <Plus className="w-6 h-6" />
                        <span className="text-xs font-semibold">Add Product</span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {/* 1. Best Store Price */}
                <tr className="bg-slate-900/40">
                  <td className="p-4 font-bold text-slate-300">Best Store Price</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center">
                      <div className="text-lg font-black text-white">₹{p.bestPrice.toLocaleString('en-IN')}</div>
                      {p.discount > 0 && (
                        <div className="text-[11px] text-emerald-400 font-semibold">{p.discount}% OFF</div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 2. Smart Buy Score */}
                <tr>
                  <td className="p-4 font-bold text-slate-300">Smart Buy Score</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center">
                      <SmartBuyScoreBadge score={p.smartBuyScore?.score || 80} size="sm" />
                    </td>
                  ))}
                </tr>

                {/* 3. Customer Rating */}
                <tr className="bg-slate-900/40">
                  <td className="p-4 font-bold text-slate-300">Rating & Reviews</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{p.rating}</span>
                        <span className="text-slate-500 font-normal">({p.reviewCount})</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 4. Processor */}
                <tr>
                  <td className="p-4 font-bold text-slate-300">Processor / Chipset</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center font-medium text-slate-200">
                      {getSpecValue(p, 'processor')}
                    </td>
                  ))}
                </tr>

                {/* 5. RAM */}
                <tr className="bg-slate-900/40">
                  <td className="p-4 font-bold text-slate-300">RAM Memory</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center font-medium text-slate-200">
                      {getSpecValue(p, 'ram')}
                    </td>
                  ))}
                </tr>

                {/* 6. Storage */}
                <tr>
                  <td className="p-4 font-bold text-slate-300">Internal Storage</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center font-medium text-slate-200">
                      {getSpecValue(p, 'storage')}
                    </td>
                  ))}
                </tr>

                {/* 7. Display */}
                <tr className="bg-slate-900/40">
                  <td className="p-4 font-bold text-slate-300">Display Spec</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center font-medium text-slate-200">
                      {getSpecValue(p, 'display')}
                    </td>
                  ))}
                </tr>

                {/* 8. Battery */}
                <tr>
                  <td className="p-4 font-bold text-slate-300">Battery & Charging</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center font-medium text-slate-200">
                      {getSpecValue(p, 'battery')}
                    </td>
                  ))}
                </tr>

                {/* 9. Action Buttons */}
                <tr className="bg-slate-900/80">
                  <td className="p-4 font-bold text-slate-300">Full Details</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-center">
                      <Link
                        to={`/product/${p.slug}`}
                        className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Compare Stores</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* SELECTOR MODAL */}
        {isSelectorOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Select Product to Compare</h3>
                <button onClick={() => setIsSelectorOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                {allProducts.map((p) => {
                  const isAlreadySelected = selectedProducts.some((sp) => sp.id === p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => !isAlreadySelected && handleAddProduct(p)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isAlreadySelected
                          ? 'bg-slate-950/40 border-slate-800 opacity-50 cursor-not-allowed'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-brand-500/40 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded bg-slate-950 p-1" />
                        <div>
                          <div className="text-xs font-bold text-white">{p.name}</div>
                          <div className="text-[11px] text-slate-400">₹{p.bestPrice.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      {isAlreadySelected ? (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Added
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-brand-400">+ Select</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
