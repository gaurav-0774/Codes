import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Store } from '../types';

// Fix default leaflet marker icon links
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface StoreMapProps {
  stores: Store[];
  selectedStore: Store | null;
}

export const StoreMap: React.FC<StoreMapProps> = ({ stores, selectedStore }) => {
  // Default map center (Nashik, Maharashtra coordinates)
  const centerLat = selectedStore ? selectedStore.latitude : stores.length > 0 ? stores[0].latitude : 19.9975;
  const centerLng = selectedStore ? selectedStore.longitude : stores.length > 0 ? stores[0].longitude : 73.7898;

  return (
    <div className="w-full h-[500px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative z-10">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={selectedStore ? 14 : 12}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stores.map((st) => (
          <Marker key={st.id} position={[st.latitude, st.longitude]}>
            <Popup>
              <div className="text-slate-900 font-sans p-1">
                <h4 className="font-bold text-sm mb-1">{st.name}</h4>
                <p className="text-xs text-slate-600 mb-1">{st.address}, {st.city}</p>
                <div className="text-xs font-semibold text-amber-600">Rating: {st.rating} ★</div>
                {st.website && (
                  <a
                    href={st.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 font-medium underline mt-1 block"
                  >
                    Visit Store Website
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
