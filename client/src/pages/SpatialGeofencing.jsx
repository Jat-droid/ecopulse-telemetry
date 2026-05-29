import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import { MapPin, AlertTriangle, Truck } from 'lucide-react';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL;

export default function SpatialGeofencing() {
  const delhiCenter = [28.6139, 77.2090];
  const safeRadiusMeters = 6000; 
  
  // State to hold the live GPS coordinates of the trucks
  const [activeNodes, setActiveNodes] = useState({});

  // Connect to the WebSocket to get live GPS data
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    
    socket.on('telemetry-data', (data) => {
      setActiveNodes((prev) => ({
        ...prev,
        [data.vehicleId]: data.metrics.gps
      }));
    });

    return () => socket.disconnect();
  }, []);

  const handleUpdateRules = () => {
    alert("Geofence perimeter update module initializing. (This would open a modal to change the radius!)");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans h-full flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-200 font-mono uppercase tracking-widest">Spatial Operations Center</h1>
          <p className="text-slate-500 text-xs mt-1 font-mono">LIVE GEOFENCE PERIMETER CONFIGURATION</p>
        </div>
        {/* Wired up the button onClick */}
        <button onClick={handleUpdateRules} className="flex items-center gap-2 text-xs font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-lg hover:bg-amber-500/20 transition-colors cursor-pointer">
          <AlertTriangle size={14} /> Update Perimeter Rules
        </button>
      </div>

      <div className="flex-1 min-h-[500px] bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden relative shadow-2xl">
        <MapContainer center={delhiCenter} zoom={12} style={{ height: '100%', width: '100%', background: '#0f172a' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          <Circle 
            center={delhiCenter} 
            radius={safeRadiusMeters} 
            pathOptions={{ color: '#34d399', fillColor: '#34d399', fillOpacity: 0.1, weight: 2, dashArray: '5, 5' }}
          />

          <Marker position={delhiCenter}>
            <Popup className="font-mono text-xs"><strong>Delhi NCR Hub</strong><br/>Central Dispatch Server</Popup>
          </Marker>

          {/* Map through the live WebSocket data and render moving trucks! */}
          {Object.entries(activeNodes).map(([vehicleId, gps]) => (
            <Marker key={vehicleId} position={[gps.lat, gps.lng]}>
              <Popup className="font-mono text-xs">
                <strong>{vehicleId}</strong><br/>
                Lat: {gps.lat.toFixed(4)}<br/>
                Lng: {gps.lng.toFixed(4)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="absolute top-4 left-4 z-[400] bg-slate-950/90 border border-slate-800 p-4 rounded-xl shadow-lg backdrop-blur-md pointer-events-none">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-2">
            <MapPin size={14} className="text-emerald-400" /> Active Perimeter
          </h3>
          <p className="text-slate-400 font-mono text-[10px]">Center: {delhiCenter[0]}, {delhiCenter[1]}</p>
          <p className="text-slate-400 font-mono text-[10px]">Radius: 6.0 km</p>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-emerald-400">Tracking {Object.keys(activeNodes).length} Live Nodes</span>
          </div>
        </div>
      </div>
    </div>
  );
}