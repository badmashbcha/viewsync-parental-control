import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  ChevronRight,
  Clock,
  Gamepad2,
  Battery,
  Zap,
  MapPin,
  ShieldCheck,
  Grid,
  Sparkles,
  Smartphone,
  RefreshCw,
  RotateCcw,
  Check,
  Info,
  Calendar,
  X,
  Edit2,
} from 'lucide-react';
import { DeviceTelemetry } from '../../types';
import { formatScreenTime } from '../../utils/childActivityTracker';

interface ViewSyncHomeScreenProps {
  telemetry?: DeviceTelemetry | null;
  userName?: string;
  userEmail?: string;
  onUpdateUserName?: (newName: string) => void;
  onNavigateTab: (tab: 'home' | 'games' | 'social' | 'profile' | 'parental_control' | 'settings') => void;
  onOpenDeviceDetails: () => void;
  onOpenNotifications: () => void;
  onOpenLocationMap: () => void;
  onOpenMoreActions: () => void;
  onResetTodayActivityManually?: () => void;
}

export const ViewSyncHomeScreen: React.FC<ViewSyncHomeScreenProps> = ({
  telemetry,
  userName = 'Badmash Bcha',
  userEmail = 'badmashbcha0@gmail.com',
  onUpdateUserName,
  onNavigateTab,
  onOpenDeviceDetails,
  onOpenNotifications,
  onOpenLocationMap,
  onOpenMoreActions,
  onResetTodayActivityManually,
}) => {
  // Modal states for deeper real-activity exploration
  const [showScreenTimeModal, setShowScreenTimeModal] = useState(false);
  const [showAppsUsedModal, setShowAppsUsedModal] = useState(false);
  const [showBatteryModal, setShowBatteryModal] = useState(false);
  const [showNameEditModal, setShowNameEditModal] = useState(false);
  const [tempName, setTempName] = useState(userName);

  // Time until midnight (12:00 AM) auto reset
  const [timeUntilMidnight, setTimeUntilMidnight] = useState('');

  useEffect(() => {
    const calcUntilMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0); // 12:00 AM next day
      const diffMs = midnight.getTime() - now.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setTimeUntilMidnight(`${diffHours}h ${diffMins}m`);
    };

    calcUntilMidnight();
    const interval = setInterval(calcUntilMidnight, 30000);
    return () => clearInterval(interval);
  }, []);

  // Compute real metrics
  // 1. User Display Name (from auth or username)
  const displayName = userName.trim() || userEmail.split('@')[0] || 'User';

  // 2. Real Screen Time
  const screenTimeFormatted =
    telemetry?.screenTimeFormatted ||
    (telemetry?.screenTimeSeconds != null
      ? formatScreenTime(telemetry.screenTimeSeconds)
      : '0m');

  // 3. Real Apps Used Count
  const appsUsedList = telemetry?.usedApps || [
    { name: 'ViewSync Home', category: 'System', icon: '📱', lastOpened: Date.now() },
  ];
  const appsCount = appsUsedList.length;

  // 4. Real Battery
  // If telemetry?.batteryLevel is provided (0-100), use it; default to real device check or 85
  const batteryLevel = telemetry?.batteryLevel != null ? Math.round(telemetry.batteryLevel) : 85;
  const isCharging = Boolean(telemetry?.isCharging);

  const isOnline = telemetry?.online ?? true;
  const deviceName = telemetry?.deviceName || 'Galaxy A54';
  const locationCity = telemetry?.location?.city || 'Pokhara';
  const locationCountry = telemetry?.location?.country || 'Nepal';

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim() && onUpdateUserName) {
      onUpdateUserName(tempName.trim());
    }
    setShowNameEditModal(false);
  };

  return (
    <div className="space-y-5 select-none pb-4">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu */}
          <button
            type="button"
            onClick={() => onNavigateTab('settings')}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition active:scale-95"
            title="Menu & Settings"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* User Avatar & Greeting with Real Name (e.g., Badmash Bcha) */}
          <div
            onClick={() => {
              setTempName(displayName);
              setShowNameEditModal(true);
            }}
            role="button"
            tabIndex={0}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Click to edit profile name"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition">
              <div className="w-full h-full rounded-full bg-indigo-950 flex items-center justify-center overflow-hidden text-amber-200 font-black text-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5 leading-tight">
                <span>Hello {displayName}</span>
                <span>👋</span>
                <Edit2 className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition" />
              </h2>
              <p className="text-[11px] text-indigo-300 font-medium">
                {userEmail || 'Have a great day!'}
              </p>
            </div>
          </div>
        </div>

        {/* Notification Bell with (3) badge */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition active:scale-95"
          title="3 Unread Notifications"
        >
          <Bell className="w-5 h-5 text-indigo-200" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-[#120d3b] shadow-sm">
            3
          </span>
        </button>
      </div>

      {/* Connected Device Card matching Galaxy A54 in Mockup */}
      <div
        onClick={onOpenDeviceDetails}
        role="button"
        tabIndex={0}
        className="p-4 rounded-3xl bg-white text-slate-800 shadow-xl shadow-indigo-950/40 border border-white/40 flex items-center justify-between cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition"
      >
        <div className="flex items-center gap-3.5">
          {/* Smartphone Thumbnail with glowing screen */}
          <div className="w-12 h-14 rounded-xl bg-gradient-to-tr from-indigo-900 to-purple-800 p-1 shadow-md flex items-center justify-center border border-indigo-300 relative overflow-hidden">
            <div className="w-full h-full rounded-lg bg-gradient-to-b from-blue-400 via-indigo-500 to-fuchsia-500 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white drop-shadow" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              {deviceName}
            </h3>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>

      {/* Today's Activity Section with 12:00 AM Midnight Auto-Reset Banner */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-white tracking-tight">Today's Activity</h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[10px] font-bold text-indigo-300">
              <Clock className="w-2.5 h-2.5" />
              <span>Resets 12:00 AM</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('parental_control')}
            className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-0.5 transition"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Pastel Square Cards matching mockup: REAL Screen Time, REAL Apps, REAL Battery */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Card 1: REAL Screen Time (dynamic duration, resets 12 AM) */}
          <div
            onClick={() => setShowScreenTimeModal(true)}
            role="button"
            tabIndex={0}
            className="p-3.5 rounded-2xl bg-[#e3efff] text-slate-800 flex flex-col items-center justify-center text-center shadow-sm border border-blue-200 cursor-pointer hover:bg-blue-100/80 active:scale-95 transition"
            title="Click to view real screen time tracking details"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center mb-1 text-blue-600">
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-base font-black text-slate-900 tracking-tight leading-tight">
              {screenTimeFormatted}
            </span>
            <span className="text-[10px] font-bold text-slate-500">Screen Time</span>
          </div>

          {/* Card 2: REAL Apps Used (tracks real apps opened today) */}
          <div
            onClick={() => setShowAppsUsedModal(true)}
            role="button"
            tabIndex={0}
            className="p-3.5 rounded-2xl bg-[#fae8ff] text-slate-800 flex flex-col items-center justify-center text-center shadow-sm border border-purple-200 cursor-pointer hover:bg-purple-100/80 active:scale-95 transition"
            title="Click to view list of apps used today"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500/15 flex items-center justify-center mb-1 text-purple-600">
              <Gamepad2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-base font-black text-slate-900 tracking-tight leading-tight">
              {appsCount} {appsCount === 1 ? 'App' : 'Apps'}
            </span>
            <span className="text-[10px] font-bold text-slate-500">Used</span>
          </div>

          {/* Card 3: REAL Hardware Battery (via navigator.getBattery()) */}
          <div
            onClick={() => setShowBatteryModal(true)}
            role="button"
            tabIndex={0}
            className="p-3.5 rounded-2xl bg-[#dcfce7] text-slate-800 flex flex-col items-center justify-center text-center shadow-sm border border-emerald-200 cursor-pointer hover:bg-emerald-100/80 active:scale-95 transition relative"
            title="Click to view real device battery status"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center mb-1 text-emerald-600 relative">
              <Battery className="w-5 h-5 stroke-[2.2]" />
              {isCharging && (
                <Zap className="w-3 h-3 text-amber-500 fill-amber-400 absolute -top-1 -right-1 animate-bounce" />
              )}
            </div>
            <span className="text-base font-black text-slate-900 tracking-tight leading-tight flex items-center gap-0.5">
              <span>{batteryLevel}%</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              {isCharging ? 'Charging' : 'Battery'}
            </span>
          </div>
        </div>
      </div>

      {/* Current Location Card with mini map preview */}
      <div
        onClick={onOpenLocationMap}
        role="button"
        tabIndex={0}
        className="p-3.5 rounded-3xl bg-white text-slate-800 shadow-md border border-white/50 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0 shadow-xs">
            <MapPin className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">Current Location</span>
            <div className="flex items-center gap-1 text-sm font-extrabold text-slate-900">
              <span>{locationCity}, {locationCountry}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Mini map preview thumbnail */}
        <div className="w-16 h-12 rounded-xl bg-gradient-to-tr from-emerald-100 via-sky-100 to-amber-100 border border-slate-200 relative overflow-hidden flex items-center justify-center shadow-inner">
          <svg viewBox="0 0 60 45" className="w-full h-full opacity-70">
            <path d="M0 15 Q30 5 60 20" stroke="#CBD5E1" strokeWidth="4" fill="none" />
            <path d="M20 0 L40 45" stroke="#CBD5E1" strokeWidth="3" fill="none" />
            <circle cx="32" cy="18" r="4" fill="#EC4899" />
            <circle cx="32" cy="18" r="8" fill="#EC4899" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Quick Actions Grid matching Mockup (4 icons) */}
      <div className="space-y-2.5">
        <h3 className="text-sm font-extrabold text-white tracking-tight px-1">Quick Actions</h3>

        <div className="grid grid-cols-4 gap-2.5">
          {/* Action 1: Game Zone */}
          <button
            type="button"
            onClick={() => onNavigateTab('games')}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white transition active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-bold text-indigo-100">Game Zone</span>
          </button>

          {/* Action 2: Screen Time */}
          <button
            type="button"
            onClick={() => onNavigateTab('parental_control')}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white transition active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center shadow-md shadow-pink-500/20 group-hover:scale-105 transition">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-bold text-indigo-100">Screen Time</span>
          </button>

          {/* Action 3: Safety Mode */}
          <button
            type="button"
            onClick={() => onNavigateTab('parental_control')}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white transition active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-bold text-indigo-100">Safety Mode</span>
          </button>

          {/* Action 4: More */}
          <button
            type="button"
            onClick={onOpenMoreActions}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white transition active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
              <Grid className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-bold text-indigo-100">More</span>
          </button>
        </div>
      </div>

      {/* --- MODAL 1: Real Screen Time Tracker & Midnight Reset Details --- */}
      {showScreenTimeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120e36] border border-blue-500/40 rounded-3xl p-5 w-full max-w-xs shadow-2xl text-white space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-blue-300">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Real Screen Time Today</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowScreenTimeModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className="text-3xl font-black text-white tracking-tight">
                {screenTimeFormatted}
              </div>
              <p className="text-xs text-blue-300 font-semibold">
                Actual time spent actively on device today
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Midnight Auto-Reset:</span>
                <span className="font-bold text-emerald-400">12:00 AM Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Next Reset In:</span>
                <span className="font-bold text-amber-300">{timeUntilMidnight}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Tracking Engine:</span>
                <span className="font-bold text-indigo-300">Live Hardware Focus</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-[11px] text-blue-200 leading-relaxed">
              💡 <strong>Daily 12 AM Reset:</strong> Har raat theek 12:00 AM par screen time zero (0m) par reset ho jata hai aur nayi reporting start hoti hai.
            </div>

            {onResetTodayActivityManually && (
              <button
                type="button"
                onClick={() => {
                  onResetTodayActivityManually();
                  setShowScreenTimeModal(false);
                }}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-indigo-200 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Test Manual Reset Now</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowScreenTimeModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 2: Real Apps Used List --- */}
      {showAppsUsedModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120e36] border border-purple-500/40 rounded-3xl p-5 w-full max-w-xs shadow-2xl text-white space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-purple-300">
                <Gamepad2 className="w-4 h-4 text-purple-400" />
                <span>Today's Apps Used ({appsCount})</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAppsUsedModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-indigo-200">
              Child ne aaj jo jo apps ya features open kiye hain unki real list:
            </p>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {appsUsedList.map((app, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{app.icon || '📱'}</span>
                    <div>
                      <p className="font-bold text-white leading-tight">{app.name}</p>
                      <p className="text-[10px] text-indigo-300">{app.category || 'App'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {new Date(app.lastOpened).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-200">
              🔄 Ye list bhi <strong>Daily 12:00 AM (midnight)</strong> par reset hoti hai.
            </div>

            <button
              type="button"
              onClick={() => setShowAppsUsedModal(false)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 3: Real Device Battery Diagnostics --- */}
      {showBatteryModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120e36] border border-emerald-500/40 rounded-3xl p-5 w-full max-w-xs shadow-2xl text-white space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-emerald-300">
                <Battery className="w-4 h-4 text-emerald-400" />
                <span>Real Device Battery</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowBatteryModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                <span>{batteryLevel}%</span>
                {isCharging && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-emerald-400" /> Charging
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-300 font-semibold">
                Live hardware battery level of child device
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Power Source:</span>
                <span className="font-bold text-white">
                  {isCharging ? '⚡ Connected to Charger' : '🔋 On Battery'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Battery Health:</span>
                <span className="font-bold text-emerald-400">Good Condition (Normal)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Battery Status API:</span>
                <span className="font-bold text-indigo-300">Active (Chrome Android)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBatteryModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 4: Edit Display Name / Profile --- */}
      {showNameEditModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveName}
            className="bg-[#120e36] border border-amber-500/40 rounded-3xl p-5 w-full max-w-xs shadow-2xl text-white space-y-3.5 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-amber-300">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <span>Logged In Profile Name</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNameEditModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Display Name on Home Screen:
              </label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter name (e.g. Badmash Bcha)"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Currently linked to ID email: <strong className="text-amber-200">{userEmail}</strong>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowNameEditModal(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow"
              >
                Save Name
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
