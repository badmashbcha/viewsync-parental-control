import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Battery,
  Shield,
  RefreshCw,
  Layers,
  Smartphone,
  Home,
  User,
  Plus,
  Minus,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  History,
} from 'lucide-react';
import { DeviceTelemetry } from '../../types';

interface ParentLocationScreenProps {
  telemetry?: DeviceTelemetry | null;
  childDeviceName?: string;
  onNavigateTab: (tab: 'device' | 'location' | 'family' | 'my') => void;
  onRefreshLocation?: () => void;
}

export const ParentLocationScreen: React.FC<ParentLocationScreenProps> = ({
  telemetry,
  childDeviceName = 'Realme RMX5313',
  onNavigateTab,
  onRefreshLocation,
}) => {
  const [geofenceActive, setGeofenceActive] = useState(true);
  const [geofenceRadius, setGeofenceRadius] = useState<'200m' | '500m' | '1000m'>('500m');
  const [zoomLevel, setZoomLevel] = useState(15);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState('Just now');

  const lat = telemetry?.location?.latitude ?? 28.6139;
  const lng = telemetry?.location?.longitude ?? 77.2090;
  const address = telemetry?.location?.address ?? 'Sector 4, Central Avenue, Near School';

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefreshLocation?.();
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
  };

  const handleOpenGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const zoomDelta = zoomLevel === 16 ? 0.005 : zoomLevel === 15 ? 0.01 : 0.02;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(lng - zoomDelta).toFixed(4)}%2C${(lat - zoomDelta * 0.7).toFixed(4)}%2C${(lng + zoomDelta).toFixed(4)}%2C${(lat + zoomDelta * 0.7).toFixed(4)}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen bg-[#f3f0fd] text-slate-800 flex flex-col justify-between overflow-hidden select-none sm:rounded-[36px] sm:border sm:border-slate-300 shadow-2xl">
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#2e62f5] to-[#6d51fa] text-white pt-4 pb-6 px-5 rounded-b-[28px] shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">Live GPS Radar</span>
            </div>
            <h1 className="text-xl font-extrabold text-white">{childDeviceName} Location</h1>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
            title="Refresh GPS Location"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-4">
          {/* Interactive Live Map Card */}
          <div className="relative w-full h-80 rounded-3xl overflow-hidden shadow-md border-2 border-white bg-slate-100">
            {/* Real OpenStreetMap Embedded Tile Frame */}
            <iframe
              title="Live OpenStreetMap"
              src={osmEmbedUrl}
              className="w-full h-full border-0 pointer-events-auto"
              loading="lazy"
            />

            {/* Floating Top-Left Status Pill */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-slate-200/80 flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-slate-800 text-[11px]">{childDeviceName} • Online</span>
            </div>

            {/* Map Zoom Controls */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(16, z + 1))}
                className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md text-slate-700 shadow-md flex items-center justify-center font-bold hover:bg-white active:scale-90 transition border border-slate-200/70"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(14, z - 1))}
                className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md text-slate-700 shadow-md flex items-center justify-center font-bold hover:bg-white active:scale-90 transition border border-slate-200/70"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {/* Floating Bottom Location & Navigate Pill */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-md border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 overflow-hidden mr-2">
                <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-slate-800 block truncate text-[11px]">{address}</span>
                  <span className="text-[10px] text-slate-400">Synced {lastRefreshedAt} • GPS ±4m</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleOpenGoogleMaps}
                className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 shrink-0 shadow-xs transition active:scale-95"
              >
                <span>Navigate</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Safe Zone Geofence Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Safe Zone Geofencing</h3>
                  <span className="text-[11px] text-slate-400">Auto-alert when child enters/exits zone</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGeofenceActive(!geofenceActive)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
                  geofenceActive ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                    geofenceActive ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {geofenceActive && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-800 font-bold text-[11px]">Child is currently INSIDE Safe Zone</span>
                </div>
                <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-[10px] font-bold text-emerald-700">
                  {geofenceRadius}
                </div>
              </div>
            )}

            {/* Geofence Radius Selector */}
            <div>
              <span className="text-[11px] font-bold text-slate-600 block mb-1.5">Geofence Radius Perimeter</span>
              <div className="grid grid-cols-3 gap-2">
                {(['200m', '500m', '1000m'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setGeofenceRadius(r)}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      geofenceRadius === r
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Latitude</span>
                <span className="font-mono font-bold text-slate-800">{lat.toFixed(5)}° N</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Longitude</span>
                <span className="font-mono font-bold text-slate-800">{lng.toFixed(5)}° E</span>
              </div>
            </div>
          </div>

          {/* Today's Location Breadcrumbs */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-sm">Today's Route Timeline</h3>
            </div>

            <div className="space-y-3 pl-2 relative border-l-2 border-purple-200 ml-2">
              <div className="relative pl-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[7px] top-1" />
                <span className="font-bold text-slate-800 block text-[11px]">08:30 AM — Departed Home Safe Zone</span>
                <span className="text-slate-400 text-[10px]">Main Residence, Sector 4</span>
              </div>

              <div className="relative pl-4">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -left-[7px] top-1" />
                <span className="font-bold text-slate-800 block text-[11px]">09:12 AM — Arrived at School Campus</span>
                <span className="text-slate-400 text-[10px]">St. Xavier's Academy, Zone B</span>
              </div>

              <div className="relative pl-4">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500 absolute -left-[7px] top-1" />
                <span className="font-bold text-slate-800 block text-[11px]">01:45 PM — Present at Science Lab</span>
                <span className="text-slate-400 text-[10px]">Stationary • Battery 36%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM 4 TABS NAVIGATION */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-4 z-40">
        <div className="grid grid-cols-4 max-w-sm mx-auto">
          <button onClick={() => onNavigateTab('device')} className="flex flex-col items-center justify-center gap-1 py-0.5">
            <div className="w-14 h-7 rounded-full flex items-center justify-center hover:bg-slate-100">
              <Smartphone className="w-4 h-4 stroke-[2.2] text-slate-400" />
            </div>
            <span className="text-[11px] font-bold text-slate-400">Device</span>
          </button>

          <button onClick={() => onNavigateTab('location')} className="flex flex-col items-center justify-center gap-1 py-0.5">
            <div className="w-14 h-7 rounded-full bg-[#dbeafe] flex items-center justify-center">
              <MapPin className="w-4 h-4 stroke-[2.4] text-[#2563eb]" />
            </div>
            <span className="text-[11px] font-bold text-[#2563eb]">Location</span>
          </button>

          <button onClick={() => onNavigateTab('family')} className="flex flex-col items-center justify-center gap-1 py-0.5">
            <div className="w-14 h-7 rounded-full flex items-center justify-center hover:bg-slate-100">
              <Home className="w-4 h-4 stroke-[2.2] text-slate-400" />
            </div>
            <span className="text-[11px] font-bold text-slate-400">Family</span>
          </button>

          <button onClick={() => onNavigateTab('my')} className="flex flex-col items-center justify-center gap-1 py-0.5">
            <div className="w-14 h-7 rounded-full flex items-center justify-center hover:bg-slate-100">
              <User className="w-4 h-4 stroke-[2.2] text-slate-400" />
            </div>
            <span className="text-[11px] font-bold text-slate-400">My</span>
          </button>
        </div>
      </div>
    </div>
  );
};
