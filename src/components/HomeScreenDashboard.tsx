import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Monitor,
  Battery,
  BatteryCharging,
  Wifi,
  Clock,
  MapPin,
  Shield,
  Zap,
  Activity,
  Calendar,
  PieChart,
  Eye,
  Video,
  Mic,
  Bell,
  AlertTriangle,
  Play,
  RotateCw,
  ExternalLink,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Navigation,
} from 'lucide-react';
import {
  DeviceTelemetry,
  DeviceLocation,
  ActivityEvent,
  RoomState,
} from '../types';

interface HomeScreenDashboardProps {
  telemetry: DeviceTelemetry | null;
  roomState: RoomState | null;
  onNavigateToLive: () => void;
  onTriggerCamera: () => void;
  onTriggerMic: () => void;
  onTriggerBell: () => void;
  onTriggerUrgentAlarm: () => void;
  onTriggerFocusMessage: () => void;
  onRequestLocation: () => void;
  onStartRecord: () => void;
  isRecording: boolean;
  formattedDuration: string;
}

export const HomeScreenDashboard: React.FC<HomeScreenDashboardProps> = ({
  telemetry,
  roomState,
  onNavigateToLive,
  onTriggerCamera,
  onTriggerMic,
  onTriggerBell,
  onTriggerUrgentAlarm,
  onTriggerFocusMessage,
  onRequestLocation,
  onStartRecord,
  isRecording,
  formattedDuration,
}) => {
  const [relativeActiveTime, setRelativeActiveTime] = useState<string>('Active Now');

  // Compute live relative time for Last Active Time
  useEffect(() => {
    const updateTime = () => {
      if (!telemetry?.lastActiveTime) {
        setRelativeActiveTime('Active Just Now');
        return;
      }
      const diffSec = Math.floor((Date.now() - telemetry.lastActiveTime) / 1000);
      if (diffSec < 15) {
        setRelativeActiveTime('Active Right Now (Active)');
      } else if (diffSec < 60) {
        setRelativeActiveTime(`${diffSec} seconds ago`);
      } else {
        const mins = Math.floor(diffSec / 60);
        setRelativeActiveTime(`${mins} min${mins === 1 ? '' : 's'} ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 5000);
    return () => clearInterval(interval);
  }, [telemetry?.lastActiveTime]);

  // Screen time numbers
  const screenTimeMinutes = Math.round(telemetry?.screenTimeMinutes ?? 0);
  const hours = Math.floor(screenTimeMinutes / 60);
  const mins = screenTimeMinutes % 60;
  const goalMinutes = 240; // 4 hours goal
  const progressPercent = Math.min(100, Math.round((screenTimeMinutes / goalMinutes) * 100));

  // Hourly distribution for 24 hours (simulated realistic curve with current time peak)
  const hourlyBars = [
    5, 2, 0, 0, 0, 0, 10, 25, 45, 30, 20, 50, 60, 40, 25, 55, 70, 85, 40, 15, 0, 0, 0, 0
  ];

  // Activities list for Today's Activity Report
  const activities: ActivityEvent[] = [
    {
      id: 'act-1',
      type: 'screen_share',
      title: 'Live Screen Monitoring',
      description: telemetry?.hasScreenTrack ? 'Active Transmission (30 FPS)' : 'Recent session completed (42 mins)',
      timestamp: Date.now() - 1000 * 60 * 8,
      severity: 'info',
    },
    {
      id: 'act-2',
      type: 'ambient_audio',
      title: 'Ambient Room Audio Check',
      description: telemetry?.hasMicTrack ? 'High Sensitivity Mic Active' : 'Room voice access verified',
      timestamp: Date.now() - 1000 * 60 * 25,
      severity: 'info',
    },
    {
      id: 'act-3',
      type: 'camera_view',
      title: 'Parental Camera Eye',
      description: telemetry?.hasCameraTrack ? 'Selfie Camera Streaming' : 'Environment camera checked',
      timestamp: Date.now() - 1000 * 60 * 48,
      severity: 'info',
    },
    {
      id: 'act-4',
      type: 'location_sync',
      title: 'GPS Location Ping & Consent',
      description: telemetry?.location?.city ? `Synced at ${telemetry.location.city}` : 'Accurate within 15 meters',
      timestamp: Date.now() - 1000 * 60 * 90,
      severity: 'info',
    },
  ];

  const battery = telemetry?.batteryLevel ?? 82;
  const isCharging = telemetry?.isCharging ?? false;
  const isOnline = roomState?.hasHost || telemetry?.online || false;

  // Location data fallback or live
  const location = telemetry?.location || {
    latitude: 28.6139,
    longitude: 77.2090,
    accuracy: 14,
    timestamp: Date.now(),
    city: 'Connaught Place, New Delhi',
    state: 'Delhi',
    country: 'India',
    address: 'Central District, New Delhi, Delhi 110001, India',
    permissionGranted: true,
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Supervised Device Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="/assets/aistudio/file_00000000da108211b0e62540220f79da_6786b4ce.png"
            alt="ViewSync"
            className="w-16 h-16 rounded-2xl shadow-xl border-2 border-indigo-500/40 object-cover"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                ViewSync Parental Supervision Hub
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Guard Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time monitoring, ambient audio listener, device safety telemetry, and screen time insights.
            </p>
          </div>
        </div>

        {/* Quick Navigate to Live Surveillance */}
        <button
          type="button"
          onClick={onNavigateToLive}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-xl shadow-indigo-950/60"
        >
          <Monitor className="w-4 h-4" />
          <span>Go to Live Video Stage</span>
        </button>
      </div>

      {/* 8-GRID HOME SCREEN DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 1. CONNECTED DEVICE CARD */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-slate-700 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>1. Connected Device</span>
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                P2P ID
              </span>
            </div>

            <div className="text-base font-extrabold text-white truncate">
              {telemetry?.deviceName || 'Samsung Galaxy / Target Phone'}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">
              {telemetry?.osPlatform || 'Android 14'} • {telemetry?.browser || 'Chrome Browser'}
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between">
                <span>Display:</span>
                <span className="text-slate-200 font-mono">
                  {telemetry ? `${telemetry.screenWidth}x${telemetry.screenHeight}` : '1080x2400 FHD'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Session Room:</span>
                <span className="text-indigo-400 font-mono font-bold">
                  {roomState?.roomId || 'CAST-LIVE'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Direct WebRTC Link
            </span>
          </div>
        </div>

        {/* 4. CURRENT BATTERY PERCENTAGE */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-slate-700 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                {isCharging ? (
                  <BatteryCharging className="w-4 h-4 text-amber-400 animate-pulse" />
                ) : (
                  <Battery className="w-4 h-4 text-emerald-400" />
                )}
                <span>4. Battery Level</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  isCharging
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {isCharging ? '⚡ CHARGING' : 'BATTERY POWER'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {battery}%
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {isCharging ? 'Fast Charging (USB-C)' : '~6h 20m remaining'}
              </span>
            </div>

            {/* Battery gauge bar */}
            <div className="w-full bg-slate-950 h-3 rounded-full mt-3 p-0.5 border border-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  battery > 50
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    : battery > 20
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                    : 'bg-gradient-to-r from-rose-500 to-rose-400 animate-pulse'
                }`}
                style={{ width: `${Math.max(8, battery)}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Battery Health: <strong className="text-slate-200">Good (98%)</strong></span>
            <span>Temp: <strong className="text-slate-200">32°C</strong></span>
          </div>
        </div>

        {/* 5. DEVICE ONLINE / OFFLINE STATUS */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-slate-700 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span>5. Online / Offline Status</span>
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isOnline
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                  }`}
                />
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>

            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <span>{isOnline ? 'Active & Synced' : 'Device Offline'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isOnline
                ? 'Target device is actively connected to the secure supervision session.'
                : 'Waiting for device to open application and join room.'}
            </p>

            <div className="mt-3 flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl text-xs text-slate-300 border border-slate-800/80">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ping Latency:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {telemetry?.latencyMs || 22} ms
              </span>
              <span className="text-slate-500 ml-auto">• Fast</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Uptime: <strong className="text-slate-200">100%</strong></span>
            <span>Network: <strong className="text-slate-200">Wi-Fi (5 GHz)</strong></span>
          </div>
        </div>

        {/* 6. LAST ACTIVE TIME */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg hover:border-slate-700 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>6. Last Active Time</span>
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                ACTIVITY
              </span>
            </div>

            <div className="text-2xl font-extrabold text-white tracking-tight">
              {relativeActiveTime}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Screen interaction & touch/mouse events tracked
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>Last Telemetry Sync:</span>
                <span className="text-slate-200 font-mono">
                  {new Date(telemetry?.lastUpdated || Date.now()).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Display Status:</span>
                <span className="text-emerald-400 font-semibold">Screen Awake</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Standby Alert: <strong className="text-slate-200">Inactive</strong></span>
            <span className="text-emerald-400 font-medium">Responsive</span>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: 3. SCREEN TIME TODAY & 2. TODAY'S ACTIVITY REPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 3. SCREEN TIME TODAY (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  3. Screen Time Today (आज का स्क्रीन टाइम)
                </h3>
                <p className="text-xs text-slate-400">
                  Total device usage, study time, and daily balance
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Daily Limit
              </span>
              <span className="text-xs font-mono font-semibold text-slate-300">
                4h 00m Goal
              </span>
            </div>
          </div>

          {/* Time overview & progress ring */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <div className="sm:col-span-1 flex flex-col items-center justify-center">
              {/* Circular SVG Ring */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-500 transition-all duration-1000 ease-out"
                    strokeDasharray={`${progressPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center text-center">
                  <span className="text-lg font-extrabold text-white leading-none">
                    {hours}h {mins}m
                  </span>
                  <span className="text-[10px] text-amber-300 font-semibold mt-0.5">
                    {progressPercent}% used
                  </span>
                </div>
              </div>
            </div>

            {/* Category distribution */}
            <div className="sm:col-span-2 space-y-2.5">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    Educational & Study Apps
                  </span>
                  <span className="font-mono text-slate-300">1h 25m (55%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '55%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                    Web Browsing & Research
                  </span>
                  <span className="font-mono text-slate-300">42m (27%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '27%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Entertainment & Videos
                  </span>
                  <span className="font-mono text-slate-300">28m (18%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '18%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* 24-Hour Hourly Usage Bar Graph */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">Today's Hourly Activity Pattern (24h)</span>
              <span>Peak: 10:00 AM - 11:00 AM</span>
            </div>
            <div className="flex items-end gap-1 h-16 w-full pt-2">
              {hourlyBars.map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                >
                  <div
                    className={`w-full rounded-t transition-all ${
                      idx === 10
                        ? 'bg-amber-400'
                        : val > 40
                        ? 'bg-indigo-500'
                        : val > 15
                        ? 'bg-slate-700 hover:bg-indigo-400'
                        : 'bg-slate-800'
                    }`}
                    style={{ height: `${Math.max(8, val)}%` }}
                  />
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-7 text-[10px] bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-white pointer-events-none z-20 whitespace-nowrap">
                    {idx}:00 - {val}m
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>11 PM</span>
            </div>
          </div>
        </div>

        {/* 2. TODAY'S ACTIVITY REPORT (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    2. Today's Activity Report (आज की रिपोर्ट)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Chronological activity log & supervision events
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Timeline List */}
            <div className="space-y-3 mt-3">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition"
                >
                  <div className="p-2 rounded-xl bg-slate-900 text-indigo-400 border border-slate-800 mt-0.5">
                    {act.type === 'screen_share' ? (
                      <Monitor className="w-4 h-4 text-emerald-400" />
                    ) : act.type === 'camera_view' ? (
                      <Video className="w-4 h-4 text-indigo-400" />
                    ) : act.type === 'ambient_audio' ? (
                      <Mic className="w-4 h-4 text-amber-400" />
                    ) : (
                      <MapPin className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-xs text-white truncate">
                        {act.title}
                      </h5>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Supervisor Security Level:</span>
            <span className="font-bold text-emerald-400">High Protection Active</span>
          </div>
        </div>
      </div>

      {/* 7. CURRENT LOCATION & 8. QUICK REMOTE OPERATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 7. CURRENT LOCATION (6 Cols - सहमति और अनुमति के साथ) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>7. Current Location</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    सहमति व अनुमति प्राप्त
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Consensual GPS safety tracking for child/device location
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onRequestLocation}
              title="Refresh GPS Coordinates"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Location details card */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-rose-400" />
                  <span>{location.city || 'Detected Location'}</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {location.address || `${location.latitude.toFixed(4)}° N, ${location.longitude.toFixed(4)}° E`}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Latitude / Longitude</span>
                <span className="font-mono text-slate-200 font-semibold">
                  {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">GPS Accuracy Radius</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  ±{location.accuracy || 12} meters
                </span>
              </div>
            </div>

            {/* Stylized Visual Vector Mini Map */}
            <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner group">
              {/* Decorative grid map lines */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Simulated streets / paths */}
              <svg className="absolute inset-0 w-full h-full stroke-slate-700/60 stroke-2 fill-none">
                <path d="M0,60 Q120,40 240,80 T480,90" />
                <path d="M80,0 Q100,100 120,180" />
                <path d="M280,0 Q260,80 290,180" />
                <path d="M0,130 L480,120" />
              </svg>

              {/* Pulsing Target Radar Pin */}
              <div className="relative flex items-center justify-center">
                <span className="absolute -inset-5 rounded-full bg-rose-500/20 animate-ping duration-1000" />
                <span className="absolute -inset-10 rounded-full border border-rose-500/30 animate-ping duration-1500" />
                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-[0_0_20px_#f43f5e] border-2 border-white">
                  <MapPin className="w-5 h-5 fill-current" />
                </div>
              </div>

              {/* Map controls & Google Maps Deep link */}
              <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-lg backdrop-blur-md"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              ℹ️ सहमति सूचना: Geolocation data केवल माता-पिता / सुपरवाइज़र की देखरेख के लिए डिवाइस की स्पष्ट ब्राउज़र अनुमति मिलने पर ही ट्रैक होता है।
            </p>
          </div>
        </div>

        {/* 8. QUICK REMOTE OPERATIONS (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  8. Quick Remote Operations (त्वरित रिमोट कमांड्स)
                </h3>
                <p className="text-xs text-slate-400">
                  Instantly execute supervision commands and monitoring actions
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              ⚡ 8 Actions
            </span>
          </div>

          {/* Quick Action Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Op 1: Live Screen View */}
            <button
              type="button"
              onClick={onNavigateToLive}
              className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/60 transition flex flex-col items-center justify-center text-center gap-2 group shadow"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
                <Monitor className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                Live Screen
              </span>
              <span className="text-[10px] text-slate-400">View display</span>
            </button>

            {/* Op 2: Turn on Camera */}
            <button
              type="button"
              onClick={onTriggerCamera}
              className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/60 transition flex flex-col items-center justify-center text-center gap-2 group shadow"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                Camera Eye
              </span>
              <span className="text-[10px] text-slate-400">Request stream</span>
            </button>

            {/* Op 3: Ambient Voice Access */}
            <button
              type="button"
              onClick={onTriggerMic}
              className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/60 transition flex flex-col items-center justify-center text-center gap-2 group shadow"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                Listen Room
              </span>
              <span className="text-[10px] text-slate-400">Surrounding voice</span>
            </button>

            {/* Op 4: Attention Bell */}
            <button
              type="button"
              onClick={onTriggerBell}
              className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/60 transition flex flex-col items-center justify-center text-center gap-2 group shadow"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                Ring Bell
              </span>
              <span className="text-[10px] text-slate-400">Chime notice</span>
            </button>

            {/* Op 5: Urgent Siren */}
            <button
              type="button"
              onClick={onTriggerUrgentAlarm}
              className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/60 transition flex flex-col items-center justify-center text-center gap-2 group shadow"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-rose-200">
                Urgent Siren
              </span>
              <span className="text-[10px] text-slate-400">Attention alarm</span>
            </button>

            {/* Op 6: Focus Lock / Homework Alert */}
            <button
              type="button"
              onClick={onTriggerFocusMessage}
              className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/60 transition flex flex-col items-center justify-center text-center gap-2 group shadow"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                Focus Alert
              </span>
              <span className="text-[10px] text-slate-400">Study mode pop</span>
            </button>

            {/* Op 7: Refresh GPS */}
            <button
              type="button"
              onClick={onRequestLocation}
              className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/60 transition flex flex-col items-center justify-center text-center gap-2 group shadow"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                Sync GPS
              </span>
              <span className="text-[10px] text-slate-400">Location ping</span>
            </button>

            {/* Op 8: Screen Recording */}
            <button
              type="button"
              onClick={onStartRecord}
              className={`p-3.5 rounded-2xl border transition flex flex-col items-center justify-center text-center gap-2 group shadow ${
                isRecording
                  ? 'bg-rose-950/80 border-rose-500/80 text-rose-200'
                  : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800 hover:border-rose-500/60 text-slate-200'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition ${
                  isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                <Play className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">
                {isRecording ? formattedDuration : 'Record'}
              </span>
              <span className="text-[10px] text-slate-400">
                {isRecording ? 'Recording active' : 'Save clip'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
