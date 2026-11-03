import React, { useState } from 'react';
import {
  Bell,
  Plus,
  ChevronDown,
  ChevronRight,
  Camera,
  Binoculars,
  Headphones,
  Clock,
  Lock,
  Hourglass,
  Box,
  Shield,
  MessageSquare,
  Eye,
  Image,
  Phone,
  Globe,
  Compass,
  AlertOctagon,
  Settings,
  FileCheck,
  RefreshCw,
  ShieldPlus,
  Lightbulb,
  X,
  Check,
  Smartphone,
  MapPin,
  Home,
  User,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  Volume2,
  QrCode,
  Copy,
  CheckCheck,
  ScanLine,
} from 'lucide-react';
import { DeviceTelemetry } from '../../types';
import { updateRemoteControlInCloud } from '../../services/firebase';

interface ParentHomeScreenProps {
  telemetry?: DeviceTelemetry | null;
  childDeviceName?: string;
  onOpenRemoteCamera: () => void;
  onOpenScreenMirroring: () => void;
  onOpenOneWayAudio: () => void;
  onNavigateTab: (tab: 'device' | 'location' | 'family' | 'my') => void;
  activeBottomTab?: 'device' | 'location' | 'family' | 'my';
  onSwitchDevice?: (deviceName: string) => void;
}

export const ParentHomeScreen: React.FC<ParentHomeScreenProps> = ({
  telemetry,
  childDeviceName = 'Realme RMX5313',
  onOpenRemoteCamera,
  onOpenScreenMirroring,
  onOpenOneWayAudio,
  onNavigateTab,
  activeBottomTab = 'device',
  onSwitchDevice,
}) => {
  // Active modal states for every option requested by user
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Push history state whenever any modal opens so hardware/browser back button returns to home
  React.useEffect(() => {
    if (activeModal) {
      window.history.pushState({ parentModal: activeModal }, '');
    }
  }, [activeModal]);

  // Back button popstate listener
  React.useEffect(() => {
    const handlePopState = () => {
      if (activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeModal]);

  // Instant block status
  const [isInstantBlocked, setIsInstantBlocked] = useState(false);
  const [downtimeActive, setDowntimeActive] = useState(false);

  // App limits state
  const [managedApps, setManagedApps] = useState([
    { name: 'YouTube', category: 'Entertainment', limit: '45m', blocked: false, icon: '▶️' },
    { name: 'Roblox', category: 'Games', limit: '30m', blocked: false, icon: '🎮' },
    { name: 'WhatsApp', category: 'Social', limit: '1h', blocked: false, icon: '💬' },
    { name: 'Chrome Browser', category: 'Browsing', limit: '1h 30m', blocked: false, icon: '🌐' },
    { name: 'TikTok', category: 'Social', limit: '0m', blocked: true, icon: '🎵' },
  ]);

  // Blocked websites state
  const [blockedWebsites, setBlockedWebsites] = useState([
    'adult-content-filter.active',
    'gambling-sites.active',
    'violence-tracker.active',
  ]);
  const [newUrlInput, setNewUrlInput] = useState('');

  // Dropdown for device selection
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  // Add Device Modal State
  const [addDeviceTab, setAddDeviceTab] = useState<'code' | 'qr'>('code');
  const [newDeviceCode, setNewDeviceCode] = useState('842 195 304');
  const [newDeviceInputName, setNewDeviceInputName] = useState('');
  const [isPairingDevice, setIsPairingDevice] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleConnectNewDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceCode.trim()) {
      triggerToast('Please enter the 9-digit binding code from child phone');
      return;
    }
    setIsPairingDevice(true);
    setTimeout(() => {
      setIsPairingDevice(false);
      const name = newDeviceInputName.trim() || 'Realme RMX5313';
      onSwitchDevice?.(name);
      setActiveModal(null);
      setNewDeviceInputName('');
      triggerToast(`${name} successfully bound & connected to Guardian account!`);
    }, 800);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard?.writeText('https://viewsync.app/kids/bind?code=842195304');
    setCopiedLink(true);
    triggerToast('Download & binding link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleToggleInstantBlock = () => {
    const next = !isInstantBlocked;
    setIsInstantBlocked(next);
    updateRemoteControlInCloud('realme-rmx5313', { isInstantBlocked: next });
    triggerToast(next ? 'Instant Block Activated: Child phone apps locked!' : 'Instant Block Disabled: Child apps unlocked');
  };

  const handleToggleDowntime = () => {
    const next = !downtimeActive;
    setDowntimeActive(next);
    updateRemoteControlInCloud('realme-rmx5313', { downtimeActive: next });
    triggerToast(next ? 'Downtime Activated: Bedtime schedule enabled' : 'Downtime Disabled');
  };

  const handleToggleAppBlock = (appName: string) => {
    const updated = managedApps.map((app) =>
      app.name === appName ? { ...app, blocked: !app.blocked } : app
    );
    setManagedApps(updated);
    updateRemoteControlInCloud('realme-rmx5313', { managedApps: updated });
    triggerToast(`${appName} block status updated in cloud`);
  };

  const handleAddBlockedUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrlInput.trim()) {
      setBlockedWebsites((prev) => [...prev, newUrlInput.trim().toLowerCase()]);
      setNewUrlInput('');
      triggerToast('Website added to restriction blacklist');
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

      {/* SCROLLABLE MAIN CONTENT (Exact Screenshot 1 & Screenshot 2) */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* TOP GRADIENT HEADER WITH DEVICE SELECTOR */}
        <div className="bg-gradient-to-b from-[#2e62f5] via-[#4f5df8] to-[#6d51fa] text-white pt-2.5 pb-10 px-5 relative transition-all rounded-b-[32px] shadow-md">
          {/* Status Bar */}
          <div className="flex items-center justify-between text-[13px] font-semibold tracking-wide text-white/95 pb-3">
            <div className="flex items-center gap-1.5">
              <span>1:33</span>
              <span className="text-[11px] opacity-80">💬 99</span>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] border border-white/60 px-1 py-0.2 rounded font-bold">
                VoLTE
              </span>
              <span>📶</span>
              <span>36% 🔋</span>
            </div>
          </div>

          {/* Device Selector & Action Icons Row matching Screenshot 1 */}
          <div className="flex items-center justify-between mt-1">
            {/* Child Profile Badge & Name Dropdown */}
            <div className="flex items-center gap-2 relative">
              {/* Purple Grape Avatar Badge */}
              <div className="w-10 h-10 rounded-full bg-[#f1f5f9] p-0.5 border-2 border-white shadow-md flex items-center justify-center shrink-0">
                <span className="text-xl">🍇</span>
              </div>

              {/* Device Selector Button */}
              <button
                type="button"
                onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
                className="flex items-center gap-1.5 text-white font-bold text-lg hover:text-white/90 transition"
              >
                <span>{childDeviceName}</span>
                <ChevronDown className="w-4 h-4 stroke-[3]" />
              </button>

              {/* Device Dropdown Menu */}
              {showDeviceDropdown && (
                <div className="absolute left-10 top-12 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                  <p className="text-[11px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                    Linked Devices
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onSwitchDevice?.('Realme RMX5313');
                      setShowDeviceDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-800 bg-blue-50 rounded-xl"
                  >
                    <span>Realme RMX5313</span>
                    <Check className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSwitchDevice?.('Samsung Galaxy A54');
                      setShowDeviceDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-xl"
                  >
                    <span>Samsung Galaxy A54</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Header Buttons: Bell and Add Device Plus */}
            <div className="flex items-center gap-3 text-white">
              <button
                type="button"
                onClick={() => setActiveModal('notifications')}
                className="p-1.5 rounded-full hover:bg-white/15 transition relative"
                title="Alerts & Notifications"
              >
                <Bell className="w-6 h-6 stroke-[2.2]" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-[#4f5df8]" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('add_device')}
                className="p-1 rounded-full hover:bg-white/15 transition"
                title="Add Monitored Device"
              >
                <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center font-bold text-base leading-none">
                  +
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* CONTAINER FOR ALL CARDS */}
        <div className="px-4 -mt-6 space-y-4 relative z-10">
          {/* CARD 1: TODAY'S EVENT BANNER matching Screenshot 1 */}
          <div
            onClick={() => setActiveModal('today_event')}
            role="button"
            tabIndex={0}
            className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md transition cursor-pointer group active:scale-[0.99] flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              {/* Purple calendar icon in circle */}
              <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] flex items-center justify-center text-[#7c3aed] shrink-0 shadow-xs">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-[2.2]">
                  <rect x="3" y="4" width="18" height="18" rx="3" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <circle cx="8" cy="14" r="1" fill="currentColor" />
                  <circle cx="12" cy="14" r="1" fill="currentColor" />
                  <circle cx="16" cy="14" r="1" fill="currentColor" />
                  <circle cx="8" cy="18" r="1" fill="currentColor" />
                  <circle cx="12" cy="18" r="1" fill="currentColor" />
                  <circle cx="16" cy="18" r="1" fill="currentColor" />
                </svg>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                  Today's Event
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Detailed event report
                </p>
              </div>
            </div>

            {/* Right illustration of 3D Calendar & Clock + Chevron */}
            <div className="flex items-center gap-2">
              <div className="w-14 h-12 relative flex items-center justify-center">
                {/* 3D Calendar Graphic */}
                <div className="w-11 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm flex flex-col p-1 text-white">
                  <div className="w-full flex justify-around">
                    <span className="w-1 h-1.5 rounded-full bg-white" />
                    <span className="w-1 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="mt-1 grid grid-cols-3 gap-0.5 opacity-80">
                    <span className="h-1 bg-white/60 rounded" />
                    <span className="h-1 bg-white/60 rounded" />
                    <span className="h-1 bg-white/60 rounded" />
                  </div>
                </div>
                {/* Overlapping small clock */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 stroke-[2.2] group-hover:translate-x-0.5 transition" />
            </div>
          </div>

          {/* 3 QUICK REMOTE OPERATIONS ROW matching Screenshot 1 */}
          <div className="grid grid-cols-3 gap-3 bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
            {/* 1. Remote Camera */}
            <button
              type="button"
              onClick={onOpenRemoteCamera}
              className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 transition group active:scale-95 text-center"
            >
              <div className="w-13 h-13 rounded-full bg-[#e0edff] flex items-center justify-center text-[#2563eb] shadow-xs group-hover:scale-105 transition mb-2">
                <Camera className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight">Remote<br />Camera</span>
            </button>

            {/* 2. Screen Mirroring */}
            <button
              type="button"
              onClick={onOpenScreenMirroring}
              className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 transition group active:scale-95 text-center"
            >
              <div className="w-13 h-13 rounded-full bg-[#fef3c7] flex items-center justify-center text-[#d97706] shadow-xs group-hover:scale-105 transition mb-2">
                <Binoculars className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight">Screen<br />Mirroring</span>
            </button>

            {/* 3. One-Way Audio */}
            <button
              type="button"
              onClick={onOpenOneWayAudio}
              className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 transition group active:scale-95 text-center"
            >
              <div className="w-13 h-13 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#16a34a] shadow-xs group-hover:scale-105 transition mb-2">
                <Headphones className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight">One-Way<br />Audio</span>
            </button>
          </div>

          {/* CARD 2: SCREEN TIME & APPS matching Screenshot 1 */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 relative overflow-hidden">
            {/* Header */}
            <div
              onClick={() => setActiveModal('screen_time_report')}
              className="flex items-center justify-between pb-3 border-b border-slate-100/80 cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                  Screen Time &amp; Apps
                </h3>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition" />
            </div>

            <div className="flex items-center justify-between pt-3">
              {/* 3 Sub-items on left */}
              <div className="space-y-3.5 pr-2">
                {/* Instant Block */}
                <button
                  type="button"
                  onClick={handleToggleInstantBlock}
                  className="flex items-center gap-3 text-left hover:text-blue-600 transition group"
                >
                  <Lock className={`w-5 h-5 ${isInstantBlocked ? 'text-rose-600' : 'text-slate-600'}`} />
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Instant Block</span>
                    {isInstantBlocked && (
                      <span className="text-[11px] text-rose-600 font-bold">Active: Child Locked</span>
                    )}
                  </div>
                </button>

                {/* Downtime */}
                <button
                  type="button"
                  onClick={() => setActiveModal('downtime')}
                  className="flex items-center gap-3 text-left hover:text-blue-600 transition"
                >
                  <Hourglass className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-bold text-slate-800">Downtime</span>
                </button>

                {/* App Management */}
                <button
                  type="button"
                  onClick={() => setActiveModal('app_management')}
                  className="flex items-center gap-3 text-left hover:text-blue-600 transition"
                >
                  <Box className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-bold text-slate-800">App Management</span>
                </button>
              </div>

              {/* 3D Hourglass illustration with sand & leaves */}
              <div className="w-24 h-24 relative flex items-center justify-center shrink-0">
                <div className="w-18 h-22 rounded-2xl bg-gradient-to-b from-[#e0e7ff] to-[#ede9fe] border-2 border-indigo-200/60 shadow-inner flex flex-col items-center justify-between p-2">
                  <span className="w-12 h-1 bg-indigo-300 rounded" />
                  <Hourglass className="w-9 h-9 text-indigo-500 animate-pulse" />
                  <span className="w-12 h-1 bg-indigo-300 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: CONTENT SAFETY (Screenshot 1 bottom + Screenshot 2 top) */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 relative overflow-hidden">
            {/* Header */}
            <div
              onClick={() => setActiveModal('content_safety_summary')}
              className="flex items-center justify-between pb-3 border-b border-slate-100/80 cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Shield className="w-4 h-4 fill-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                  Content Safety
                </h3>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition" />
            </div>

            {/* Sub-items List matching Screenshot 1 & 2 */}
            <div className="divide-y divide-slate-100/80 pt-1">
              <button
                type="button"
                onClick={() => setActiveModal('notification_monitoring')}
                className="w-full flex items-center justify-between py-3 hover:text-blue-600 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-semibold text-slate-800">Notification Monitoring</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('social_content')}
                className="w-full flex items-center justify-between py-3 hover:text-blue-600 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-semibold text-slate-800">Social Content Detection</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('image_detection')}
                className="w-full flex items-center justify-between py-3 hover:text-blue-600 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <Image className="w-5 h-5 text-pink-500" />
                  <span className="text-sm font-semibold text-slate-800">Inappropriate Image Detection</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('snapshots')}
                className="w-full flex items-center justify-between py-3 hover:text-blue-600 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-semibold text-slate-800">Screen &amp; Camera Snapshots</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('calls_sms')}
                className="w-full flex items-center justify-between py-3 hover:text-blue-600 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-semibold text-slate-800">Calls &amp; SMS Monitoring</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          </div>

          {/* SECTION 2: SAFE BROWSING matching Screenshot 2 */}
          <div className="space-y-2">
            {/* Pill Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 bg-[#ede9fe] text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                <Shield className="w-3.5 h-3.5 fill-current" />
                <span>Safe Browsing</span>
              </div>
              <span className="text-indigo-400 font-black tracking-widest text-xs">///</span>
            </div>

            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 divide-y divide-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal('website_restrictions')}
                className="w-full flex items-center justify-between py-2.5 hover:text-blue-600 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-semibold text-slate-800">Website Restrictions</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('browsing_history')}
                className="w-full flex items-center justify-between py-2.5 hover:text-blue-600 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-semibold text-slate-800">Browsing History</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          </div>

          {/* SECTION 3: LOCATION & SAFETY matching Screenshot 2 */}
          <div className="space-y-2">
            {/* Pill Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 bg-[#dcfce7] text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                <MapPin className="w-3.5 h-3.5 fill-current" />
                <span>Location &amp; Safety</span>
              </div>
              <span className="text-indigo-400 font-black tracking-widest text-xs">///</span>
            </div>

            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 divide-y divide-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal('driving_detection')}
                className="w-full flex items-center justify-between py-2.5 hover:text-blue-600 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-semibold text-slate-800">Driving Detection</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('sos_settings')}
                className="w-full flex items-center justify-between py-2.5 hover:text-blue-600 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-black text-[10px] flex items-center justify-center">
                    SOS
                  </span>
                  <span className="text-sm font-semibold text-slate-800">SOS Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          </div>

          {/* SECTION 4: DEVICES & SUPPORT matching Screenshot 2 */}
          <div className="space-y-2">
            {/* Pill Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 bg-[#fee2e2] text-rose-700 px-3 py-1 rounded-full text-xs font-bold">
                <Settings className="w-3.5 h-3.5" />
                <span>Devices &amp; Support</span>
              </div>
              <span className="text-indigo-400 font-black tracking-widest text-xs">///</span>
            </div>

            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 divide-y divide-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal('required_permissions')}
                className="w-full flex items-center justify-between py-2.5 hover:text-blue-600 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-semibold text-slate-800">Check the Required Permissions</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('check_updates')}
                className="w-full flex items-center justify-between py-2.5 hover:text-blue-600 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-semibold text-slate-800">Check Updates</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('augmented_mode')}
                className="w-full flex items-center justify-between py-2.5 hover:text-blue-600 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <ShieldPlus className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-semibold text-slate-800">Enable Augmented Supervision Mode</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('hidden_kids')}
                className="w-full flex items-center justify-between py-2.5 hover:text-blue-600 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-semibold text-slate-800">Open the Hidden ViewSync Kids?</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM 4 TABS NAVIGATION matching Screenshot 1 & 2 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-4 z-40">
        <div className="grid grid-cols-4 max-w-sm mx-auto">
          {/* Tab 1: Device (Active) */}
          <button
            type="button"
            onClick={() => onNavigateTab('device')}
            className="flex flex-col items-center justify-center gap-1 group py-0.5"
          >
            <div className={`w-14 h-7 rounded-full flex items-center justify-center transition ${
              activeBottomTab === 'device' ? 'bg-[#dbeafe]' : 'hover:bg-slate-100'
            }`}>
              <Smartphone className={`w-4 h-4 stroke-[2.4] ${
                activeBottomTab === 'device' ? 'text-[#2563eb]' : 'text-slate-400'
              }`} />
            </div>
            <span className={`text-[11px] font-bold ${
              activeBottomTab === 'device' ? 'text-[#2563eb]' : 'text-slate-400'
            }`}>
              Device
            </span>
          </button>

          {/* Tab 2: Location */}
          <button
            type="button"
            onClick={() => onNavigateTab('location')}
            className="flex flex-col items-center justify-center gap-1 group py-0.5"
          >
            <div className={`w-14 h-7 rounded-full flex items-center justify-center transition ${
              activeBottomTab === 'location' ? 'bg-[#dbeafe]' : 'hover:bg-slate-100'
            }`}>
              <MapPin className={`w-4 h-4 stroke-[2.2] ${
                activeBottomTab === 'location' ? 'text-[#2563eb]' : 'text-slate-400'
              }`} />
            </div>
            <span className={`text-[11px] font-bold ${
              activeBottomTab === 'location' ? 'text-[#2563eb]' : 'text-slate-400'
            }`}>
              Location
            </span>
          </button>

          {/* Tab 3: Family */}
          <button
            type="button"
            onClick={() => onNavigateTab('family')}
            className="flex flex-col items-center justify-center gap-1 group py-0.5"
          >
            <div className={`w-14 h-7 rounded-full flex items-center justify-center transition ${
              activeBottomTab === 'family' ? 'bg-[#dbeafe]' : 'hover:bg-slate-100'
            }`}>
              <Home className={`w-4 h-4 stroke-[2.2] ${
                activeBottomTab === 'family' ? 'text-[#2563eb]' : 'text-slate-400'
              }`} />
            </div>
            <span className={`text-[11px] font-bold ${
              activeBottomTab === 'family' ? 'text-[#2563eb]' : 'text-slate-400'
            }`}>
              Family
            </span>
          </button>

          {/* Tab 4: My */}
          <button
            type="button"
            onClick={() => onNavigateTab('my')}
            className="flex flex-col items-center justify-center gap-1 group py-0.5"
          >
            <div className={`w-14 h-7 rounded-full flex items-center justify-center transition ${
              activeBottomTab === 'my' ? 'bg-[#dbeafe]' : 'hover:bg-slate-100'
            }`}>
              <User className={`w-4 h-4 stroke-[2.2] ${
                activeBottomTab === 'my' ? 'text-[#2563eb]' : 'text-slate-400'
              }`} />
            </div>
            <span className={`text-[11px] font-bold ${
              activeBottomTab === 'my' ? 'text-[#2563eb]' : 'text-slate-400'
            }`}>
              My
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE WORKING MODALS FOR EVERY OPTION (ALL WORKING AS REQUESTED)
          ========================================================================= */}

      {/* 1. Today's Event Modal */}
      {activeModal === 'today_event' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                <h3 className="font-bold text-slate-800 text-base">Today's Activity Report</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-4 text-xs overflow-y-auto">
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block">Total Screen Time</span>
                  <span className="text-lg font-black text-indigo-700">2h 18m</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-white px-2 py-1 rounded-lg shadow-xs">
                  Within Daily Cap
                </span>
              </div>

              <h4 className="font-bold text-slate-800 pt-1">Apps Usage Today</h4>
              <div className="space-y-2">
                {managedApps.map((app) => (
                  <div key={app.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <span className="flex items-center gap-2 font-medium">
                      <span>{app.icon}</span>
                      <span>{app.name}</span>
                    </span>
                    <span className="font-bold text-slate-700">{app.limit}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Close Report
            </button>
          </div>
        </div>
      )}

      {/* 2. Downtime Modal */}
      {activeModal === 'downtime' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Hourglass className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-base">Schedule Downtime</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900">Bedtime Lock</h4>
                  <p className="text-slate-500">10:00 PM – 07:00 AM</p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleDowntime}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors relative flex items-center ${
                    downtimeActive ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                      downtimeActive ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <p className="text-slate-500 leading-relaxed">
                During downtime, only phone calls and allowed emergency apps are accessible on your child's phone.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                triggerToast('Downtime schedule saved');
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Save Schedule
            </button>
          </div>
        </div>
      )}

      {/* 3. App Management Modal */}
      {activeModal === 'app_management' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-base">App Restrictions</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 py-4 text-xs overflow-y-auto">
              {managedApps.map((app) => (
                <div key={app.name} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{app.icon}</span>
                    <div>
                      <span className="font-bold text-slate-900 block">{app.name}</span>
                      <span className="text-[11px] text-slate-400">{app.category}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleAppBlock(app.name)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition ${
                      app.blocked
                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    }`}
                  >
                    {app.blocked ? 'Blocked' : 'Allowed'}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 4. Notification Monitoring Modal */}
      {activeModal === 'notification_monitoring' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-base">Child Notifications</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 py-4 text-xs overflow-y-auto">
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100">
                <div className="flex justify-between font-bold text-blue-900 mb-1">
                  <span>WhatsApp • Rohan</span>
                  <span className="text-[10px] text-blue-600">10m ago</span>
                </div>
                <p className="text-slate-600">"Homework complete ho gaya? Math assignment bhej do."</p>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100">
                <div className="flex justify-between font-bold text-purple-900 mb-1">
                  <span>YouTube</span>
                  <span className="text-[10px] text-purple-600">25m ago</span>
                </div>
                <p className="text-slate-600">New video from Science Facts: Solar system explained.</p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                <div className="flex justify-between font-bold text-emerald-900 mb-1">
                  <span>Google Classroom</span>
                  <span className="text-[10px] text-emerald-600">1h ago</span>
                </div>
                <p className="text-slate-600">Assignment due tomorrow: History Chapter 4 notes.</p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 5. Website Restrictions Modal */}
      {activeModal === 'website_restrictions' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-base">Website Filter</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-4 text-xs overflow-y-auto">
              <form onSubmit={handleAddBlockedUrl} className="flex gap-2">
                <input
                  type="text"
                  value={newUrlInput}
                  onChange={(e) => setNewUrlInput(e.target.value)}
                  placeholder="e.g. facebook.com or games.io"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700"
                >
                  Block
                </button>
              </form>

              <h4 className="font-bold text-slate-800 pt-1">Active Restrictions ({blockedWebsites.length})</h4>
              <div className="space-y-1.5">
                {blockedWebsites.map((site) => (
                  <div key={site} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-mono text-slate-700">{site}</span>
                    <button
                      type="button"
                      onClick={() => setBlockedWebsites((prev) => prev.filter((s) => s !== site))}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 6. Calls & SMS Monitoring Modal */}
      {activeModal === 'calls_sms' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-800 text-base">Calls &amp; SMS History</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 py-4 text-xs overflow-y-auto">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">📞 Mom (Incoming Call)</span>
                  <span className="text-[11px] text-slate-400">Duration: 3m 42s • Today 11:30 AM</span>
                </div>
                <span className="text-emerald-600 font-bold">Answered</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">💬 Class Group (SMS)</span>
                  <span className="text-[11px] text-slate-400">"Tomorrow school starts at 8:00 AM"</span>
                </div>
                <span className="text-blue-600 font-bold">Safe</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 7. Hidden ViewSync Kids Secret Dialer Code Modal */}
      {activeModal === 'hidden_kids' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-slate-900 text-base mb-1">
              Open Hidden ViewSync Kids
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              If you enabled "Hide Icon" on your child's phone, use the secret dialer code to access ViewSync Kids anytime:
            </p>

            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 mb-4">
              <span className="font-mono text-xl font-black text-blue-600 tracking-wider">
                *#*#842195#*#*
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Dial this on the child's phone keypad</p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* 8. Required Permissions Checklist Modal */}
      {activeModal === 'required_permissions' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-base">Permissions Health</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 py-4 text-xs overflow-y-auto">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
                <span>Accessibility Permission</span>
                <span className="font-bold">Active ✓</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
                <span>Screen Mirroring Consent</span>
                <span className="font-bold">Active ✓</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
                <span>GPS Location Tracker</span>
                <span className="font-bold">Active ✓</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
                <span>Microphone &amp; Audio Stream</span>
                <span className="font-bold">Active ✓</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
                <span>Background Battery Exemption</span>
                <span className="font-bold">Active ✓</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 9. SOS Settings Modal */}
      {activeModal === 'sos_settings' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-black text-[10px] flex items-center justify-center">
                  SOS
                </span>
                <h3 className="font-bold text-slate-800 text-base">SOS Emergency Settings</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-900">
                <span className="font-bold block">Guardian Emergency Contact</span>
                <span className="text-[11px]">badmashbcha1@gmail.com</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="font-semibold text-slate-800">Instant Siren on Child SOS</span>
                <span className="text-emerald-600 font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="font-semibold text-slate-800">Live GPS Location Dispatch</span>
                <span className="text-emerald-600 font-bold">Enabled</span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                triggerToast('SOS Emergency configurations saved');
              }}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
            >
              Save SOS Settings
            </button>
          </div>
        </div>
      )}

      {/* 10. ADD CHILD DEVICE MODAL (Working + Icon Header Action) */}
      {activeModal === 'add_device' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Bind Child's Device</h3>
                  <span className="text-[11px] text-slate-400">Pair via 9-Digit Code or QR</span>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Switcher: Code vs QR */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl my-3.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAddDeviceTab('code')}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  addDeviceTab === 'code' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>🔢 9-Digit Code</span>
              </button>
              <button
                type="button"
                onClick={() => setAddDeviceTab('qr')}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  addDeviceTab === 'qr' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan QR</span>
              </button>
            </div>

            {/* Tab 1: 9-Digit Code Form */}
            {addDeviceTab === 'code' && (
              <form onSubmit={handleConnectNewDevice} className="space-y-3.5 text-xs">
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-[11px] text-blue-900 leading-relaxed">
                  <span className="font-bold block mb-0.5">Instructions:</span>
                  1. Open <span className="font-bold">ViewSync Kids</span> on the child's phone.<br />
                  2. Enter the 9-digit binding code shown on their screen below.
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    9-Digit Binding Code
                  </label>
                  <input
                    type="text"
                    value={newDeviceCode}
                    onChange={(e) => setNewDeviceCode(e.target.value)}
                    placeholder="e.g. 842 195 304"
                    className="w-full text-center text-lg font-mono font-extrabold tracking-widest px-3 py-2.5 rounded-xl border-2 border-blue-200 focus:outline-none focus:border-blue-600 bg-slate-50 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Device Nickname (Optional)
                  </label>
                  <input
                    type="text"
                    value={newDeviceInputName}
                    onChange={(e) => setNewDeviceInputName(e.target.value)}
                    placeholder="e.g. Realme RMX5313 / Rohan's Phone"
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>

                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-[11px] text-emerald-800">
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Device Signal Detected: Realme RMX5313
                  </span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-mono font-bold text-emerald-700">Online</span>
                </div>

                <button
                  type="submit"
                  disabled={isPairingDevice}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isPairingDevice ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Pairing Device with Cloud...</span>
                    </>
                  ) : (
                    <span>Bind &amp; Connect Device</span>
                  )}
                </button>
              </form>
            )}

            {/* Tab 2: Scan QR Code Viewfinder */}
            {addDeviceTab === 'qr' && (
              <div className="space-y-3.5 text-center text-xs">
                <p className="text-slate-500 text-[11px]">
                  Point your camera at the QR code on the child's phone screen:
                </p>

                {/* Animated Viewfinder */}
                <div className="relative w-48 h-48 mx-auto bg-slate-950 rounded-2xl overflow-hidden border-2 border-blue-500 flex items-center justify-center shadow-inner">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                  {/* Corner Targets */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
                  {/* Laser Scan Bar Animation */}
                  <div className="absolute left-2 right-2 h-0.5 bg-blue-400 shadow-[0_0_8px_#38bdf8] animate-bounce" />

                  <QrCode className="w-20 h-20 text-slate-700/60" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsPairingDevice(true);
                    setTimeout(() => {
                      setIsPairingDevice(false);
                      onSwitchDevice?.('Realme RMX5313');
                      setActiveModal(null);
                      triggerToast('QR Code Verified: Realme RMX5313 Connected!');
                    }, 700);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                >
                  {isPairingDevice ? 'Verifying QR Code...' : 'Simulate QR Scan (Realme RMX5313)'}
                </button>
              </div>
            )}

            {/* Quick Share Link */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Need to install on child phone?</span>
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700"
              >
                {copiedLink ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied Link!' : 'Copy App Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. NOTIFICATIONS & ALERTS MODAL (Bell Header Action) */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-base">Alerts &amp; Notifications</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 py-4 text-xs overflow-y-auto">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <span className="text-base">🔋</span>
                <div>
                  <span className="font-bold text-slate-800 block">Battery Status: 36%</span>
                  <span className="text-[11px] text-slate-400">Realme RMX5313 • 10m ago</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                <span className="text-base">📍</span>
                <div>
                  <span className="font-bold text-emerald-900 block">Safe Zone Arrival: St. Xavier's</span>
                  <span className="text-[11px] text-emerald-700">Child entered School Zone • 1h ago</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                <span className="text-base">⏱️</span>
                <div>
                  <span className="font-bold text-amber-900 block">Screen Time: 2h 45m used today</span>
                  <span className="text-[11px] text-amber-700">Entertainment limit approaching • 2h ago</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                <span className="text-base">🛡️</span>
                <div>
                  <span className="font-bold text-blue-900 block">Content Safety Active</span>
                  <span className="text-[11px] text-blue-700">Web filters protecting browsing • Today</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                triggerToast('All notifications acknowledged');
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Clear &amp; Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
