import React from 'react';
import {
  Settings,
  Crown,
  Star,
  ShieldCheck,
  Award,
  Users,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ViewSyncProfileScreenProps {
  onNavigateTab: (tab: 'settings' | 'parental_control') => void;
  onSignOut: () => void;
  userName?: string;
}

export const ViewSyncProfileScreen: React.FC<ViewSyncProfileScreenProps> = ({
  onNavigateTab,
  onSignOut,
  userName = 'Badmash Bcha',
}) => {
  return (
    <div className="space-y-5 select-none pb-4">
      {/* Top Header with Settings Gear */}
      <div className="flex items-center justify-between pt-1">
        <div className="w-8" />
        <h2 className="text-lg font-black text-white tracking-tight">Profile</h2>
        <button
          type="button"
          onClick={() => onNavigateTab('settings')}
          className="p-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition active:scale-95"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-indigo-200" />
        </button>
      </div>

      {/* Avatar & Crown Container */}
      <div className="flex flex-col items-center text-center">
        {/* Crown & Avatar with Golden Ring matching mockup */}
        <div className="relative mb-3">
          {/* Mini Gold Crown above Avatar */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center text-amber-300 drop-shadow-md z-10">
            <Crown className="w-7 h-7 fill-amber-400 stroke-amber-600" />
          </div>

          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-xl shadow-amber-500/20">
            <div className="w-full h-full rounded-full bg-slate-900 border-2 border-slate-950 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <circle cx="40" cy="40" r="36" fill="#FED7AA" />
                <path d="M20 36C20 24 28 16 40 16C52 16 60 24 60 36C56 28 48 26 40 26C32 26 24 28 20 36Z" fill="#1E293B" />
                <circle cx="32" cy="36" r="4" fill="#1E293B" />
                <circle cx="48" cy="36" r="4" fill="#1E293B" />
                <path d="M34 46C36 50 44 50 46 46" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Name & Level Badge */}
        <h3 className="text-xl font-black text-white tracking-tight">{userName}</h3>
        <div className="mt-1 flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 font-extrabold text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Level 12</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>

        {/* XP Progress Bar matching mockup */}
        <div className="w-full max-w-xs mt-3.5 space-y-1">
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
              style={{ width: '72%' }}
            />
          </div>
          <span className="text-[11px] font-bold text-indigo-300">720 / 1000 XP</span>
        </div>
      </div>

      {/* 3 Badges Row matching mockup */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Badge 1: Pro Player */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center shadow-md">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-1">
            <Crown className="w-5 h-5 fill-amber-400" />
          </div>
          <span className="text-xs font-black text-white">Pro</span>
          <span className="text-[10px] text-indigo-200/80 font-medium">Player</span>
        </div>

        {/* Badge 2: Top Fan */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center shadow-md">
          <div className="w-9 h-9 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center mb-1">
            <Star className="w-5 h-5 fill-rose-400" />
          </div>
          <span className="text-xs font-black text-white">Top</span>
          <span className="text-[10px] text-indigo-200/80 font-medium">Fan</span>
        </div>

        {/* Badge 3: Safe User */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center shadow-md">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-1">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-black text-white">Safe</span>
          <span className="text-[10px] text-indigo-200/80 font-medium">User</span>
        </div>
      </div>

      {/* Profile Menu List matching mockup */}
      <div className="rounded-3xl bg-white/5 border border-white/10 divide-y divide-white/5 overflow-hidden shadow-xl">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3.5 text-left hover:bg-white/5 transition"
        >
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-white">My Achievements</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-between p-3.5 text-left hover:bg-white/5 transition"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold text-white">My Friends (24)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('settings')}
          className="w-full flex items-center justify-between p-3.5 text-left hover:bg-white/5 transition"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-indigo-300" />
            <span className="text-xs font-bold text-white">Settings</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-between p-3.5 text-left hover:bg-white/5 transition"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-purple-300" />
            <span className="text-xs font-bold text-white">Help &amp; Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={onSignOut}
          className="w-full flex items-center justify-between p-3.5 text-left hover:bg-rose-500/10 transition text-rose-400"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-rose-400" />
            <span className="text-xs font-bold text-rose-400">Log Out</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400/60" />
        </button>
      </div>
    </div>
  );
};
