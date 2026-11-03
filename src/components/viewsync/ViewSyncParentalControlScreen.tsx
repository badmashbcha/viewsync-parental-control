import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  Smartphone,
  Moon,
  MapPin,
  ShieldAlert,
  ChevronRight,
  Lock,
  Tv,
  Radio,
  Video,
  Bell,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface ViewSyncParentalControlScreenProps {
  onBack?: () => void;
  onOpenLiveSupervisor?: () => void;
  onSendAlertRing?: () => void;
}

export const ViewSyncParentalControlScreen: React.FC<ViewSyncParentalControlScreenProps> = ({
  onBack,
  onOpenLiveSupervisor,
  onSendAlertRing,
}) => {
  const [controls, setControls] = useState({
    screenTimeLimit: '2 hrs / day',
    appRestrictions: '3 apps blocked',
    bedtimeSchedule: '10 PM – 6 AM',
    locationAlerts: 'Enabled',
    safetyFilter: 'On',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggle = (setting: string) => {
    setToastMessage(`${setting} updated and synced with Guardian.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-4 select-none pb-4">
      {/* Top Header matching Mockup */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-black text-white tracking-tight">Parental Control</h2>
            <p className="text-[11px] text-indigo-300 font-medium">(Set by Guardian)</p>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>

      {/* Big Green Status Pill matching Mockup */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40">
        <span>All controls are active</span>
        <CheckCircle2 className="w-5 h-5" />
      </div>

      {toastMessage && (
        <div className="p-3 rounded-2xl bg-indigo-900/90 text-indigo-200 text-xs font-bold text-center border border-indigo-500/40 animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Parental Controls Setting List matching mockup */}
      <div className="rounded-3xl bg-white/5 border border-white/10 divide-y divide-white/5 overflow-hidden shadow-xl">
        {/* Screen Time Limit */}
        <div
          onClick={() => handleToggle('Screen Time Limit')}
          role="button"
          tabIndex={0}
          className="p-3.5 flex items-center justify-between hover:bg-white/5 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-white block">Screen Time Limit</span>
              <span className="text-[11px] text-indigo-300 font-medium">
                {controls.screenTimeLimit}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* App Restrictions */}
        <div
          onClick={() => handleToggle('App Restrictions')}
          role="button"
          tabIndex={0}
          className="p-3.5 flex items-center justify-between hover:bg-white/5 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-white block">App Restrictions</span>
              <span className="text-[11px] text-indigo-300 font-medium">
                {controls.appRestrictions}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Bedtime Schedule */}
        <div
          onClick={() => handleToggle('Bedtime Schedule')}
          role="button"
          tabIndex={0}
          className="p-3.5 flex items-center justify-between hover:bg-white/5 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-white block">Bedtime Schedule</span>
              <span className="text-[11px] text-indigo-300 font-medium">
                {controls.bedtimeSchedule}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Location Alerts */}
        <div
          onClick={() => handleToggle('Location Alerts')}
          role="button"
          tabIndex={0}
          className="p-3.5 flex items-center justify-between hover:bg-white/5 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-white block">Location Alerts</span>
              <span className="text-[11px] text-indigo-300 font-medium">
                {controls.locationAlerts}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Safety Filter */}
        <div
          onClick={() => handleToggle('Safety Filter')}
          role="button"
          tabIndex={0}
          className="p-3.5 flex items-center justify-between hover:bg-white/5 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-white block">Safety Filter</span>
              <span className="text-[11px] text-indigo-300 font-medium">
                {controls.safetyFilter}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Remote Supervisor Quick Commands Bar */}
      <div className="p-3.5 rounded-2xl bg-indigo-950/70 border border-indigo-500/30 space-y-2.5">
        <span className="text-xs font-extrabold text-indigo-200 block">
          Guardian Quick Remote Operations
        </span>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {onOpenLiveSupervisor && (
            <button
              type="button"
              onClick={onOpenLiveSupervisor}
              className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95"
            >
              <Tv className="w-4 h-4" />
              <span>Live Monitor Stage</span>
            </button>
          )}

          {onSendAlertRing && (
            <button
              type="button"
              onClick={onSendAlertRing}
              className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95"
            >
              <Bell className="w-4 h-4" />
              <span>Ring Device</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Purple Safety Banner matching Mockup */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-800/80 via-indigo-800/80 to-purple-800/80 border border-purple-400/30 text-white flex items-center gap-3 shadow-lg">
        <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg flex-shrink-0">
          🔒
        </div>
        <div>
          <h4 className="text-xs font-black tracking-tight">Don't worry!</h4>
          <p className="text-[11px] text-purple-200 font-medium">
            We keep you safe ❤️ (Encrypted P2P stream)
          </p>
        </div>
      </div>
    </div>
  );
};
