import React, { useState, useEffect } from 'react';
import { MapPin, Star, ExternalLink, Globe } from 'lucide-react';
import { fetchStores } from '../services/api';
import { Store } from '../types';
import { StoreMap } from '../components/StoreMap';

export const StoresPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStores = async () => {
      try {
        const data = await fetchStores();
        setStores(data);
        if (data.length > 0) {
          setSelectedStore(data[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadStores();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-xs">Loading local retail stores map...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Leaflet + OpenStreetMap Locator</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Nearby Verified Retail Stores</h1>
          </div>
          <div className="text-xs text-slate-400">
            Showing <span className="text-white font-bold">{stores.length} partner stores</span> across India
          </div>
        </div>

        {/* MAP & STORES SIDEBAR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Map Column */}
          <div className="lg:col-span-8">
            <StoreMap stores={stores} selectedStore={selectedStore} />
          </div>

          {/* Stores List Sidebar */}
          <div className="lg:col-span-4 space-y-4 max-h-[500px] overflow-y-auto pr-1">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">
              Store Locations List ({stores.length})
            </h3>

            {stores.map((st) => {
              const isSelected = selectedStore?.id === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStore(st)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-brand-500 shadow-lg shadow-brand-500/10'
                      : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <img src={st.logo} alt={st.name} className="w-10 h-10 object-cover rounded-lg bg-slate-950 p-1 border border-slate-800" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{st.name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{st.rating} Rating</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 font-normal">{st.listedPricesCount} Listed Deals</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1 pl-1 mb-3">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{st.address}, {st.city}</span>
                    </div>
                  </div>

                  {st.website && (
                    <a
                      href={st.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-brand-400" />
                      <span>Visit Store Site</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
