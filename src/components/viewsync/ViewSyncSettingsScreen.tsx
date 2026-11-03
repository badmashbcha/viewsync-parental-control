import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Bell,
  Lock,
  Smartphone,
  Info,
  MessageSquare,
  LogOut,
  User,
  CheckCircle2,
} from 'lucide-react';

interface ViewSyncSettingsScreenProps {
  onBack: () => void;
  onSignOut: () => void;
  userName?: string;
  userEmail?: string;
}

export const ViewSyncSettingsScreen: React.FC<ViewSyncSettingsScreenProps> = ({
  onBack,
  onSignOut,
  userName = 'Badmash Bcha',
  userEmail = 'badmashbcha0@gmail.com',
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const initials = userName
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'BB';

  const settingsList = [
    { id: 'security', label: 'Account Security', icon: Shield, color: 'text-emerald-400 bg-emerald-500/20' },
    { id: 'notifications', label: 'Notification Settings', icon: Bell, color: 'text-cyan-400 bg-cyan-500/20' },
    { id: 'privacy', label: 'Privacy & Data', icon: Lock, color: 'text-blue-400 bg-blue-500/20' },
    { id: 'device', label: 'Device Management', icon: Smartphone, color: 'text-indigo-400 bg-indigo-500/20' },
    { id: 'about', label: 'About View Sync', icon: Info, color: 'text-cyan-400 bg-cyan-500/20' },
    { id: 'contact', label: 'Contact Us', icon: MessageSquare, color: 'text-purple-400 bg-purple-500/20' },
  ];

  return (
    <div className="space-y-4 select-none pb-4">
      {/* Header */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-black text-white tracking-tight">Settings</h2>
      </div>

      {/* User Profile Card matching Mockup */}
      <div className="p-3.5 rounded-3xl bg-white text-slate-800 shadow-xl border border-white/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 p-0.5 shadow-md">
            <div className="w-full h-full rounded-full bg-indigo-950 flex items-center justify-center text-white font-black text-sm">
              {initials}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">{userName}</h3>
            <p className="text-[11px] text-indigo-600 font-bold flex items-center gap-0.5">
              <span>Change Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>

      {/* Settings Options List matching Mockup */}
      <div className="rounded-3xl bg-white/5 border border-white/10 divide-y divide-white/5 overflow-hidden shadow-xl">
        {settingsList.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveItem(item.label);
                setTimeout(() => setActiveItem(null), 2000);
              }}
              className="w-full flex items-center justify-between p-3.5 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          );
        })}
      </div>

      {/* Notice alert */}
      {activeItem && (
        <div className="p-2.5 rounded-2xl bg-indigo-900/80 text-indigo-200 text-xs text-center border border-indigo-400/30">
          Opened {activeItem} preferences.
        </div>
      )}

      {/* Big Red Log Out Button matching Mockup */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSignOut}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-extrabold text-sm shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 transition active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};
