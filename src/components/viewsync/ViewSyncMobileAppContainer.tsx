import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Gamepad2,
  Users,
  User,
  Shield,
  Layers,
  Smartphone,
  Eye,
  Tv,
  Radio,
  Video,
  ExternalLink,
  MapPin,
  Bell,
  X,
  Zap,
} from 'lucide-react';
import { DeviceTelemetry } from '../../types';
import { ViewSyncSplashScreen } from './ViewSyncSplashScreen';
import { ViewSyncHomeScreen } from './ViewSyncHomeScreen';
import { ViewSyncGameZone } from './ViewSyncGameZone';
import { ViewSyncSocialFeed } from './ViewSyncSocialFeed';
import { ViewSyncProfileScreen } from './ViewSyncProfileScreen';
import { ViewSyncParentalControlScreen } from './ViewSyncParentalControlScreen';
import { ViewSyncSettingsScreen } from './ViewSyncSettingsScreen';
import {
  loadTodayActivityRecord,
  saveDailyActivityRecord,
  incrementScreenTime,
  recordAppUsage,
  subscribeToRealBattery,
  formatScreenTime,
  getLocalDateString,
  createFreshDayRecord,
  DailyActivityRecord,
} from '../../utils/childActivityTracker';

export type ViewSyncTab =
  | 'splash'
  | 'home'
  | 'games'
  | 'social'
  | 'profile'
  | 'parental_control'
  | 'settings';

interface ViewSyncMobileAppContainerProps {
  telemetry?: DeviceTelemetry | null;
  userName?: string;
  userEmail?: string;
  onUpdateUserName?: (name: string) => void;
  onOpenSupervisorLive: () => void;
  onOpenPermissionWizard?: () => void;
  onSignOut: () => void;
  onSendAlertRing?: () => void;
  onTelemetryChanged?: (updated: DeviceTelemetry) => void;
}

export const ViewSyncMobileAppContainer: React.FC<ViewSyncMobileAppContainerProps> = ({
  telemetry,
  userName = 'Badmash Bcha',
  userEmail = 'badmashbcha0@gmail.com',
  onUpdateUserName,
  onOpenSupervisorLive,
  onOpenPermissionWizard,
  onSignOut,
  onSendAlertRing,
  onTelemetryChanged,
}) => {
  const [currentTab, setCurrentTab] = useState<ViewSyncTab>('home');
  const [coins, setCoins] = useState(125);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showMoreActionsModal, setShowMoreActionsModal] = useState(false);

  // Local activity state (real screen time seconds and real apps used)
  const [dailyActivity, setDailyActivity] = useState<DailyActivityRecord>(() =>
    loadTodayActivityRecord()
  );

  // Real Hardware Battery state
  const [realBattery, setRealBattery] = useState<{
    levelPercent: number;
    isCharging: boolean;
  }>({
    levelPercent: telemetry?.batteryLevel != null ? Math.round(telemetry.batteryLevel) : 85,
    isCharging: Boolean(telemetry?.isCharging),
  });

  // Track battery using navigator.getBattery() with live events
  useEffect(() => {
    const unsubscribe = subscribeToRealBattery((state) => {
      setRealBattery({
        levelPercent: state.levelPercent,
        isCharging: state.isCharging,
      });
    });
    return () => unsubscribe();
  }, []);

  // Real active screen time tracking + 12:00 AM Midnight auto reset
  useEffect(() => {
    const timer = setInterval(() => {
      // Check if document is visible and user is actively on the page
      if (document.visibilityState === 'visible') {
        const todayStr = getLocalDateString();
        // Midnight reset check
        if (dailyActivity.date !== todayStr) {
          const fresh = createFreshDayRecord(todayStr);
          saveDailyActivityRecord(fresh);
          setDailyActivity(fresh);
        } else {
          // Increment 1 real second
          setDailyActivity((prev) => {
            const updated = {
              ...prev,
              screenTimeSeconds: prev.screenTimeSeconds + 1,
            };
            saveDailyActivityRecord(updated);
            return updated;
          });
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [dailyActivity.date]);

  // Track app navigation
  const handleNavigateTab = (tab: ViewSyncTab) => {
    setCurrentTab(tab);

    const tabAppNames: Record<ViewSyncTab, { name: string; category: string; icon: string }> = {
      splash: { name: 'Welcome Splash', category: 'System', icon: '✨' },
      home: { name: 'ViewSync Home', category: 'System', icon: '🏠' },
      games: { name: 'Game Zone', category: 'Gaming', icon: '🎮' },
      social: { name: 'Social Feed', category: 'Social', icon: '👥' },
      profile: { name: 'Profile Hub', category: 'Account', icon: '👤' },
      parental_control: { name: 'Parental Controls', category: 'Security', icon: '🛡️' },
      settings: { name: 'Settings', category: 'System', icon: '⚙️' },
    };

    const target = tabAppNames[tab];
    if (target) {
      const updated = recordAppUsage(target.name, target.category, target.icon);
      setDailyActivity(updated);
    }
  };

  const handleTrackGameApp = (appName: string, category: string, icon: string) => {
    const updated = recordAppUsage(appName, category, icon);
    setDailyActivity(updated);
  };

  const handleManualResetToday = () => {
    const todayStr = getLocalDateString();
    const fresh = createFreshDayRecord(todayStr);
    saveDailyActivityRecord(fresh);
    setDailyActivity(fresh);
  };

  // Combine real tracking into unified telemetry
  const effectiveTelemetry: DeviceTelemetry = {
    deviceName: telemetry?.deviceName || 'Galaxy A54',
    osPlatform: telemetry?.osPlatform || 'Android 14',
    browser: telemetry?.browser || 'Google Chrome',
    screenWidth: typeof window !== 'undefined' ? window.screen.width : 1080,
    screenHeight: typeof window !== 'undefined' ? window.screen.height : 2340,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    batteryLevel: realBattery.levelPercent,
    isCharging: realBattery.isCharging,
    batteryHealth: realBattery.levelPercent > 70 ? 'Good' : 'Normal',
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    hasScreenTrack: telemetry?.hasScreenTrack ?? false,
    hasCameraTrack: telemetry?.hasCameraTrack ?? false,
    hasMicTrack: telemetry?.hasMicTrack ?? false,
    lastActiveTime: Date.now(),
    lastUpdated: Date.now(),
    location: telemetry?.location,
    screenTimeMinutes: Math.floor(dailyActivity.screenTimeSeconds / 60),
    screenTimeSeconds: dailyActivity.screenTimeSeconds,
    screenTimeFormatted: formatScreenTime(dailyActivity.screenTimeSeconds),
    usedApps: dailyActivity.appsUsed,
  };

  // If user is on Splash screen
  if (currentTab === 'splash') {
    return (
      <ViewSyncSplashScreen
        onGetStarted={() => handleNavigateTab('home')}
        onOpenParentMode={onOpenSupervisorLive}
      />
    );
  }

  return (
    <div className="relative w-full max-w-sm mx-auto bg-gradient-to-b from-[#0b0c26] via-[#140e3d] to-[#1d0b45] text-white rounded-none sm:rounded-[36px] shadow-2xl border-0 sm:border sm:border-indigo-500/30 overflow-hidden flex flex-col justify-between min-h-[760px] select-none">
      {/* Top Mobile Status Bar (9:41, 5G, Real Battery) */}
      <div className="flex items-center justify-between text-xs text-indigo-200/80 font-medium px-5 pt-3 pb-1 z-20">
        <span className="font-bold tracking-tight">9:41</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold">5G</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold">{realBattery.levelPercent}%</span>
            <div className="w-5 h-2.5 rounded-sm border border-indigo-200/80 p-0.5 flex items-center relative">
              <div
                className="h-full bg-emerald-400 rounded-2xs transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(10, realBattery.levelPercent))}%` }}
              />
              {realBattery.isCharging && (
                <Zap className="w-2.5 h-2.5 text-amber-300 fill-amber-300 absolute -right-3" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dynamic Screen Content */}
      <div className="flex-1 px-4 py-2 overflow-y-auto scrollbar-none">
        {currentTab === 'home' && (
          <ViewSyncHomeScreen
            telemetry={effectiveTelemetry}
            userName={userName}
            userEmail={userEmail}
            onUpdateUserName={onUpdateUserName}
            onNavigateTab={handleNavigateTab}
            onOpenDeviceDetails={() => setShowDeviceModal(true)}
            onOpenNotifications={() => setShowNotificationsModal(true)}
            onOpenLocationMap={() => setShowLocationModal(true)}
            onOpenMoreActions={() => setShowMoreActionsModal(true)}
            onResetTodayActivityManually={handleManualResetToday}
          />
        )}

        {currentTab === 'games' && (
          <ViewSyncGameZone
            onBack={() => handleNavigateTab('home')}
            coins={coins}
            onUpdateCoins={(c) => setCoins(c)}
            onTrackApp={handleTrackGameApp}
          />
        )}

        {currentTab === 'social' && <ViewSyncSocialFeed userName={userName} />}

        {currentTab === 'profile' && (
          <ViewSyncProfileScreen
            onNavigateTab={(tab) => handleNavigateTab(tab)}
            onSignOut={onSignOut}
            userName={userName}
          />
        )}

        {currentTab === 'parental_control' && (
          <ViewSyncParentalControlScreen
            onBack={() => handleNavigateTab('home')}
            onOpenLiveSupervisor={onOpenSupervisorLive}
            onSendAlertRing={onSendAlertRing}
          />
        )}

        {currentTab === 'settings' && (
          <ViewSyncSettingsScreen
            onBack={() => handleNavigateTab('home')}
            onSignOut={onSignOut}
            userName={userName}
            userEmail={userEmail}
          />
        )}
      </div>

      {/* Bottom Navigation Bar matching Mockup (Home, Games, Social, Profile) */}
      <nav className="bg-[#0b0a24]/90 backdrop-blur-xl border-t border-indigo-500/20 px-3 py-2 flex items-center justify-around z-20">
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => handleNavigateTab('home')}
          className={`flex flex-col items-center gap-1 transition ${
            currentTab === 'home'
              ? 'text-blue-400 scale-105'
              : 'text-indigo-300/60 hover:text-indigo-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-extrabold">Home</span>
        </button>

        {/* Tab 2: Games */}
        <button
          type="button"
          onClick={() => handleNavigateTab('games')}
          className={`flex flex-col items-center gap-1 transition ${
            currentTab === 'games'
              ? 'text-blue-400 scale-105'
              : 'text-indigo-300/60 hover:text-indigo-200'
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[10px] font-extrabold">Games</span>
        </button>

        {/* Tab 3: Social */}
        <button
          type="button"
          onClick={() => handleNavigateTab('social')}
          className={`flex flex-col items-center gap-1 transition ${
            currentTab === 'social'
              ? 'text-blue-400 scale-105'
              : 'text-indigo-300/60 hover:text-indigo-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-extrabold">Social</span>
        </button>

        {/* Tab 4: Profile */}
        <button
          type="button"
          onClick={() => handleNavigateTab('profile')}
          className={`flex flex-col items-center gap-1 transition ${
            currentTab === 'profile'
              ? 'text-blue-400 scale-105'
              : 'text-indigo-300/60 hover:text-indigo-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-extrabold">Profile</span>
        </button>
      </nav>

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120e36] border border-indigo-500/40 rounded-3xl p-5 w-full max-w-xs shadow-2xl text-white">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Notifications (3)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNotificationsModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <p className="font-bold text-emerald-400">Guardian Connected</p>
                <p className="text-[10px] text-indigo-200">Device linked to Parent Dashboard.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <p className="font-bold text-amber-400">Daily Challenge</p>
                <p className="text-[10px] text-indigo-200">Play Ludo to earn 50 Coins today.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <p className="font-bold text-blue-400">Real Screen Time</p>
                <p className="text-[10px] text-indigo-200">
                  {effectiveTelemetry.screenTimeFormatted} active today • Resets at 12:00 AM.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Device Details Modal with Real Telemetry */}
      {showDeviceModal && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120e36] border border-indigo-500/40 rounded-3xl p-5 w-full max-w-xs shadow-2xl text-white space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Device Telemetry</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowDeviceModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Model:</span>
                <span className="font-bold">{effectiveTelemetry.deviceName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-400">🟢 Online</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Real Battery:</span>
                <span className="font-bold text-emerald-300">
                  {effectiveTelemetry.batteryLevel}% {effectiveTelemetry.isCharging ? '(⚡ Charging)' : '(Normal Health)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Screen Time Today:</span>
                <span className="font-bold text-indigo-300">
                  {effectiveTelemetry.screenTimeFormatted} (Resets 12 AM)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Apps Opened:</span>
                <span className="font-bold text-purple-300">
                  {dailyActivity.appsUsed.length} Apps Today
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowDeviceModal(false);
                onOpenSupervisorLive();
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              Open Guardian Controls
            </button>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120e36] border border-indigo-500/40 rounded-3xl p-5 w-full max-w-xs shadow-2xl text-white space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span>GPS Location</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-indigo-200">
              Current Location: <strong className="text-white">Pokhara, Nepal</strong>
            </p>
            <div className="h-32 rounded-2xl bg-slate-900 border border-slate-700 p-2 flex flex-col items-center justify-center text-center">
              <MapPin className="w-6 h-6 text-pink-500 animate-bounce" />
              <span className="text-[11px] font-bold text-white mt-1">Pokhara Lakeside</span>
              <span className="text-[9px] text-slate-400">Lat: 28.2096, Lon: 83.9856 (±12m)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowLocationModal(false)}
              className="w-full py-2 rounded-xl bg-white/10 text-xs font-bold hover:bg-white/15"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* More Actions Modal */}
      {showMoreActionsModal && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120e36] border border-indigo-500/40 rounded-3xl p-5 w-full max-w-xs shadow-2xl text-white space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-extrabold text-sm">Quick Remote Actions</h3>
              <button
                type="button"
                onClick={() => setShowMoreActionsModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowMoreActionsModal(false);
                  handleNavigateTab('parental_control');
                }}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-2 font-bold text-left"
              >
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Parental Control Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMoreActionsModal(false);
                  onOpenSupervisorLive();
                }}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-2 font-bold text-left"
              >
                <Tv className="w-4 h-4 text-emerald-400" />
                <span>Live Screen &amp; Camera Feed</span>
              </button>

              {onSendAlertRing && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreActionsModal(false);
                    onSendAlertRing();
                  }}
                  className="w-full p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 flex items-center gap-2 font-bold text-left"
                >
                  <Bell className="w-4 h-4 text-rose-400" />
                  <span>Ring Monitored Phone</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
