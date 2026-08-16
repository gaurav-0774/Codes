import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  Store as StoreIcon,
  Users,
  MessageSquare,
  Heart,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { api, fetchCategories, fetchBrands, fetchStores, fetchProducts } from '../services/api';
import { Product, Category, Brand, Store } from '../types';
import { useAuth } from '../context/AuthContext';

interface DashboardStats {
  counts: {
    totalUsers: number;
    totalProducts: number;
    totalStores: number;
    totalReviews: number;
    totalWishlists: number;
  };
  recentProducts: Product[];
  recentPrices: any[];
}

export const AdminDashboardPage: React.FC = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [selectedProductForPrice, setSelectedProductForPrice] = useState<Product | null>(null);

  // Product Form state
  const [prodName, setProdName] = useState('');
  const [prodSlug, setProdSlug] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodBrandId, setProdBrandId] = useState('');
  const [prodCatId, setProdCatId] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodSpecs, setProdSpecs] = useState('{"display": "6.7 inch AMOLED 120Hz", "processor": "Snapdragon 8 Gen 3", "ram": "12 GB", "storage": "256 GB", "battery": "5000 mAh"}');

  // Price Form state
  const [priceStoreId, setPriceStoreId] = useState('');
  const [priceAmount, setPriceAmount] = useState<number>(49999);
  const [origPriceAmount, setOrigPriceAmount] = useState<number>(54999);
  const [priceAvailability, setPriceAvailability] = useState('In Stock');
  const [priceDelivery, setPriceDelivery] = useState('Free Express Delivery by Tomorrow');
  const [priceProductUrl] = useState('https://example.com/buy');

  const loadAdminData = async () => {
    try {
      const [statsRes, prodsRes, catsData, brandsData, storesData] = await Promise.all([
        api.get('/admin/dashboard'),
        fetchProducts({ limit: 30 }),
        fetchCategories(),
        fetchBrands(),
        fetchStores(),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      setProducts(prodsRes.data);
      setCategories(catsData);
      setBrands(brandsData);
      setStores(storesData);

      if (brandsData.length > 0) setProdBrandId(brandsData[0].id);
      if (catsData.length > 0) setProdCatId(catsData[0].id);
      if (storesData.length > 0) setPriceStoreId(storesData[0].id);
    } catch (e) {
      console.error('Failed to load admin dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = prodSlug || prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const res = await api.post('/admin/products', {
        name: prodName,
        slug,
        description: prodDesc,
        brandId: prodBrandId,
        categoryId: prodCatId,
        image: prodImage || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
        specifications: prodSpecs,
      });

      if (res.data.success) {
        setIsProductModalOpen(false);
        setProdName('');
        setProdSlug('');
        setProdDesc('');
        loadAdminData();
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      loadAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpsertPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForPrice) return;

    try {
      const res = await api.post('/admin/prices', {
        productId: selectedProductForPrice.id,
        storeId: priceStoreId,
        price: Number(priceAmount),
        originalPrice: Number(origPriceAmount),
        availability: priceAvailability,
        deliveryText: priceDelivery,
        productUrl: priceProductUrl,
      });

      if (res.data.success) {
        setIsPriceModalOpen(false);
        loadAdminData();
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Admin Access Restricted</h2>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          You must be logged in as an Administrator (`admin@pricepilot.com` / `Admin@123`) to access the PricePilot Control Panel.
        </p>
        <a href="/login" className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold inline-block">
          Log In as Admin
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-xs">Loading Admin Dashboard & Metrics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PricePilot Platform Management</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Administrator Control Panel</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProductModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-brand-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* 1. METRIC COUNTER CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total Users</span>
              <Users className="w-4 h-4 text-brand-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats?.counts.totalUsers || 0}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total Products</span>
              <Package className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats?.counts.totalProducts || 0}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Verified Stores</span>
              <StoreIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats?.counts.totalStores || 0}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>User Reviews</span>
              <MessageSquare className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats?.counts.totalReviews || 0}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Saved Wishlists</span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats?.counts.totalWishlists || 0}</div>
          </div>
        </div>

        {/* 2. PRODUCT MANAGEMENT TABLE */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-400" />
              Manage Products & Store Pricing
            </h2>
            <div className="text-xs text-slate-400">Showing {products.length} Products</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Current Best Price</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-8 h-8 object-contain rounded bg-slate-950 p-0.5" />
                        <span className="truncate max-w-xs">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold">{p.brand?.name}</td>
                    <td className="py-3.5 px-4 text-slate-300">{p.category?.name}</td>
                    <td className="py-3.5 px-4 font-extrabold text-white">₹{p.bestPrice.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProductForPrice(p);
                          setIsPriceModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold hover:bg-emerald-500/20 transition-colors"
                      >
                        + Update Price
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. ADD PRODUCT MODAL */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Add New Product</h3>
                <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Sony PlayStation 5 Pro"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Brand</label>
                    <select
                      value={prodBrandId}
                      onChange={(e) => setProdBrandId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={prodCatId}
                      onChange={(e) => setProdCatId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Brief description..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Specifications (JSON string)</label>
                  <textarea
                    rows={2}
                    value={prodSpecs}
                    onChange={(e) => setProdSpecs(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
                  >
                    Create Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. UPDATE STORE PRICE MODAL */}
        {isPriceModalOpen && selectedProductForPrice && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Update Store Price</h3>
                <button onClick={() => setIsPriceModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-brand-400 font-bold bg-brand-500/10 p-2.5 rounded-xl border border-brand-500/20 truncate">
                {selectedProductForPrice.name}
              </div>

              <form onSubmit={handleUpsertPrice} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Select Store</label>
                  <select
                    value={priceStoreId}
                    onChange={(e) => setPriceStoreId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Store Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={priceAmount}
                      onChange={(e) => setPriceAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={origPriceAmount}
                      onChange={(e) => setOrigPriceAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Availability</label>
                  <select
                    value={priceAvailability}
                    onChange={(e) => setPriceAvailability(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Pre-order">Pre-order</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Delivery Info</label>
                  <input
                    type="text"
                    value={priceDelivery}
                    onChange={(e) => setPriceDelivery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPriceModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                  >
                    Save & Log Price History
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
