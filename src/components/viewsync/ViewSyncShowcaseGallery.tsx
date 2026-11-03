import React, { useState } from 'react';
import { Sparkles, Eye, Smartphone, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { ViewSyncSplashScreen } from './ViewSyncSplashScreen';
import { ViewSyncHomeScreen } from './ViewSyncHomeScreen';
import { ViewSyncGameZone } from './ViewSyncGameZone';
import { ViewSyncSocialFeed } from './ViewSyncSocialFeed';
import { ViewSyncProfileScreen } from './ViewSyncProfileScreen';
import { ViewSyncParentalControlScreen } from './ViewSyncParentalControlScreen';
import { ViewSyncSettingsScreen } from './ViewSyncSettingsScreen';

interface ViewSyncShowcaseGalleryProps {
  userName?: string;
  onSelectScreen?: (screen: string) => void;
  onOpenLiveMonitor?: () => void;
}

export const ViewSyncShowcaseGallery: React.FC<ViewSyncShowcaseGalleryProps> = ({
  userName = 'Badmash Bcha',
  onSelectScreen,
  onOpenLiveMonitor,
}) => {
  const [selectedPreview, setSelectedPreview] = useState<
    'all' | 'splash' | 'home' | 'games' | 'social' | 'profile' | 'parental' | 'settings' | 'reference'
  >('all');

  return (
    <div className="space-y-6 select-none">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-950/80 via-purple-950/80 to-indigo-950/80 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 flex-shrink-0">
            <img
              src="/assets/aistudio/file_00000000da108211b0e62540220f79da_6786b4ce.png"
              alt="ViewSync"
              className="w-full h-full rounded-2xl object-cover"
            />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>ViewSync 7-Screen Design System</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Play • Connect • Grow
              </span>
            </h2>
            <p className="text-xs text-indigo-200/80">
              Interactive recreation of your uploaded design: Splash, Home, Game Zone, Social, Profile, Parental Control &amp; Settings.
            </p>
          </div>
        </div>

        {/* View switcher buttons */}
        <div className="flex items-center flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800">
          <button
            type="button"
            onClick={() => setSelectedPreview('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedPreview === 'all'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Screens Grid
          </button>

          <button
            type="button"
            onClick={() => setSelectedPreview('reference')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              selectedPreview === 'reference'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Design Blueprint</span>
          </button>
        </div>
      </div>

      {/* Reference Image View if selected */}
      {selectedPreview === 'reference' && (
        <div className="p-4 rounded-3xl bg-slate-900/80 border border-indigo-500/30 text-center space-y-3">
          <div className="flex items-center justify-between text-xs text-indigo-200">
            <span className="font-bold">Original Uploaded Reference Blueprint</span>
            <button
              type="button"
              onClick={() => setSelectedPreview('all')}
              className="text-blue-400 hover:underline font-bold"
            >
              Back to Live Interactive Screens
            </button>
          </div>
          <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <img
              src="/assets/aistudio/file_00000000b2548211b0b1a635b3a6dd24_62e04f50.png"
              alt="Design Reference Mockup"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* All Screens Grid matching the 7 Mockup Screens */}
      {selectedPreview === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Screen 1: Splash / Welcome */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-bold px-1">
              <span>1. Splash Screen</span>
              <span className="text-[10px] text-amber-300">Play • Connect • Grow</span>
            </div>
            <div className="rounded-[32px] overflow-hidden border border-indigo-500/40 shadow-2xl scale-[0.98] hover:scale-100 transition">
              <ViewSyncSplashScreen onGetStarted={() => {}} />
            </div>
          </div>

          {/* Screen 2: Home Screen */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-bold px-1">
              <span>2. Home Screen</span>
              <span className="text-[10px] text-emerald-400">🟢 Galaxy A54</span>
            </div>
            <div className="rounded-[32px] overflow-hidden border border-indigo-500/40 shadow-2xl bg-gradient-to-b from-[#0b0c26] to-[#1d0b45] p-4 scale-[0.98] hover:scale-100 transition min-h-[640px]">
              <ViewSyncHomeScreen
                userName={userName}
                onNavigateTab={() => {}}
                onOpenDeviceDetails={() => {}}
                onOpenNotifications={() => {}}
                onOpenLocationMap={() => {}}
                onOpenMoreActions={() => {}}
              />
            </div>
          </div>

          {/* Screen 3: Game Zone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-bold px-1">
              <span>3. Game Zone</span>
              <span className="text-[10px] text-amber-400">🪙 125 Coins</span>
            </div>
            <div className="rounded-[32px] overflow-hidden border border-indigo-500/40 shadow-2xl bg-gradient-to-b from-[#0b0c26] to-[#1d0b45] p-4 scale-[0.98] hover:scale-100 transition min-h-[640px]">
              <ViewSyncGameZone onBack={() => {}} />
            </div>
          </div>

          {/* Screen 4: Social Feed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-bold px-1">
              <span>4. Social Feed</span>
              <span className="text-[10px] text-pink-400">Stories &amp; Posts</span>
            </div>
            <div className="rounded-[32px] overflow-hidden border border-indigo-500/40 shadow-2xl bg-gradient-to-b from-[#0b0c26] to-[#1d0b45] p-4 scale-[0.98] hover:scale-100 transition min-h-[640px]">
              <ViewSyncSocialFeed userName={userName} />
            </div>
          </div>

          {/* Screen 5: Profile Screen */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-bold px-1">
              <span>5. Profile Screen</span>
              <span className="text-[10px] text-amber-300">Level 12 ⭐</span>
            </div>
            <div className="rounded-[32px] overflow-hidden border border-indigo-500/40 shadow-2xl bg-gradient-to-b from-[#0b0c26] to-[#1d0b45] p-4 scale-[0.98] hover:scale-100 transition min-h-[640px]">
              <ViewSyncProfileScreen
                userName={userName}
                onNavigateTab={() => {}}
                onSignOut={() => {}}
              />
            </div>
          </div>

          {/* Screen 6: Parental Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-bold px-1">
              <span>6. Parental Control</span>
              <span className="text-[10px] text-emerald-400">Active ✅</span>
            </div>
            <div className="rounded-[32px] overflow-hidden border border-indigo-500/40 shadow-2xl bg-gradient-to-b from-[#0b0c26] to-[#1d0b45] p-4 scale-[0.98] hover:scale-100 transition min-h-[640px]">
              <ViewSyncParentalControlScreen onOpenLiveSupervisor={onOpenLiveMonitor} />
            </div>
          </div>

          {/* Screen 7: Settings Screen */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-bold px-1">
              <span>7. Settings Screen</span>
              <span className="text-[10px] text-blue-400">Preferences</span>
            </div>
            <div className="rounded-[32px] overflow-hidden border border-indigo-500/40 shadow-2xl bg-gradient-to-b from-[#0b0c26] to-[#1d0b45] p-4 scale-[0.98] hover:scale-100 transition min-h-[640px]">
              <ViewSyncSettingsScreen
                userName={userName}
                onBack={() => {}}
                onSignOut={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
