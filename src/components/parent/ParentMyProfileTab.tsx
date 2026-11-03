import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Smartphone,
  Home,
  MapPin,
  RefreshCw,
  LogOut,
  Bell,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download,
} from 'lucide-react';
import { updateRemoteControlInCloud } from '../../services/firebase';

interface ParentMyProfileTabProps {
  userEmail?: string;
  userName?: string;
  onNavigateTab: (tab: 'device' | 'location' | 'family' | 'my') => void;
  onSignOut: () => void;
}

export const ParentMyProfileTab: React.FC<ParentMyProfileTabProps> = ({
  userEmail = 'badmashbcha0@gmail.com',
  userName = 'Badmash Bcha',
  onNavigateTab,
  onSignOut,
}) => {
  const [guardianPin, setGuardianPin] = useState(() => localStorage.getItem('viewsync_parent_pin') || '1234');
  const [showPinEditModal, setShowPinEditModal] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsAppInstalled(true);
        triggerToast('ViewSync Android App installed successfully!');
      }
      setDeferredPrompt(null);
    } else {
      triggerToast('In Chrome: Tap (⋮) -> "Install App" or "Add to Home screen"');
    }
  };

  const handleSavePin = () => {
    if (newPinInput.length === 4) {
      setGuardianPin(newPinInput);
      localStorage.setItem('viewsync_parent_pin', newPinInput);
      updateRemoteControlInCloud('realme-rmx5313', { guardianPin: newPinInput });
      setShowPinEditModal(false);
      setNewPinInput('');
      triggerToast(`Guardian Master PIN changed to ${newPinInput}`);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen bg-[#f3f0fd] text-slate-800 flex flex-col justify-between overflow-hidden select-none sm:rounded-[36px] sm:border sm:border-slate-300 shadow-2xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200 text-center max-w-[90%]">
          {toastMessage}
        </div>
      )}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#2e62f5] to-[#6d51fa] text-white pt-6 pb-8 px-5 rounded-b-[28px] shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-white text-blue-600 font-extrabold text-2xl flex items-center justify-center mx-auto mb-2.5 shadow-md">
            {userName.charAt(0)}
          </div>
          <h2 className="text-lg font-bold text-white">{userName}</h2>
          <p className="text-xs text-white/80">{userEmail}</p>
        </div>

        {/* Profile Options */}
        <div className="p-4 space-y-4 text-xs">
          {/* Subscription / Plan status */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">ViewSync Premium Plan</h4>
                <p className="text-slate-400 text-[11px]">Unlimited Remote Cam, Mirroring &amp; Audio</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              Active
            </span>
          </div>

          {/* Install Android App (WebAPK / PWA) */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-4 shadow-md text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Install ViewSync Android App</h4>
                <p className="text-white/80 text-[11px]">Install on phone home screen &amp; app drawer</p>
              </div>
            </div>
            <a
              href="/downloads/ViewSync-v1.0.apk"
              download="ViewSync-v1.0.apk"
              className="px-3.5 py-2 rounded-xl bg-white text-blue-600 hover:bg-white/90 font-extrabold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download APK (37MB)</span>
            </a>
          </div>

          {/* Settings & controls */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 divide-y divide-slate-100">

            {/* Guardian Security PIN Setting */}
            <button
              type="button"
              onClick={() => setShowPinEditModal(true)}
              className="w-full flex items-center justify-between py-3 text-left hover:bg-slate-50/50 rounded-2xl px-1 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-sm block">Guardian Security PIN</span>
                  <span className="text-[11px] text-slate-400">Protects child phone settings (Current: ••••)</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-600 font-bold font-mono text-xs">{guardianPin}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </button>

            {/* Notification Preferences */}
            <div className="w-full flex items-center justify-between py-3 text-left px-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-sm block">Push Alerts</span>
                  <span className="text-[11px] text-slate-400">Receive alerts when child leaves geofence</span>
                </div>
              </div>
              <span className="text-emerald-600 font-bold text-xs">Enabled</span>
            </div>

            {/* Help & FAQs */}
            <div className="w-full flex items-center justify-between py-3 text-left px-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-sm block">Parent Support &amp; FAQ</span>
                  <span className="text-[11px] text-slate-400">ViewSync Kids v2.4.2</span>
                </div>
              </div>
              <span className="text-slate-400 font-semibold text-xs">Help</span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={onSignOut}
            className="w-full py-3 rounded-2xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out / Switch Account</span>
          </button>
        </div>
      </div>

      {/* PIN Edit Modal */}
      {showPinEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">Guardian Master PIN</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPinEditModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 py-3">
              This 4-digit PIN is required to unlock settings or uninstall ViewSync on your child's phone.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Set 4-Digit Security PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="e.g. 1234"
                  className="w-full text-center text-xl font-mono tracking-widest px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-slate-50 font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinEditModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePin}
                  disabled={newPinInput.length !== 4}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md"
                >
                  Save PIN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div className="w-14 h-7 rounded-full flex items-center justify-center hover:bg-slate-100">
              <MapPin className="w-4 h-4 stroke-[2.2] text-slate-400" />
            </div>
            <span className="text-[11px] font-bold text-slate-400">Location</span>
          </button>

          <button onClick={() => onNavigateTab('family')} className="flex flex-col items-center justify-center gap-1 py-0.5">
            <div className="w-14 h-7 rounded-full flex items-center justify-center hover:bg-slate-100">
              <Home className="w-4 h-4 stroke-[2.2] text-slate-400" />
            </div>
            <span className="text-[11px] font-bold text-slate-400">Family</span>
          </button>

          <button onClick={() => onNavigateTab('my')} className="flex flex-col items-center justify-center gap-1 py-0.5">
            <div className="w-14 h-7 rounded-full bg-[#dbeafe] flex items-center justify-center">
              <User className="w-4 h-4 stroke-[2.4] text-[#2563eb]" />
            </div>
            <span className="text-[11px] font-bold text-[#2563eb]">My</span>
          </button>
        </div>
      </div>
    </div>
  );
};
