import React, { useState, useEffect } from 'react';
import {
  MoreHorizontal,
  ChevronRight,
  Shield,
  Smartphone,
  Home,
  Heart,
  Wifi,
  Signal,
  Battery,
  AlertCircle,
  X,
  Info,
  LogOut,
  RefreshCw,
  Edit2,
  Check,
} from 'lucide-react';

interface ChildHomeScreenProps {
  deviceName?: string;
  guardianEmail?: string;
  onOpenParentalSettings: () => void;
  onOpenFamilyTab: () => void;
  onBack?: () => void;
  onUpdateDeviceName?: (newName: string) => void;
  realBatteryLevel?: number;
  isCharging?: boolean;
}

export const ChildHomeScreen: React.FC<ChildHomeScreenProps> = ({
  deviceName = 'Realme RMX5313',
  guardianEmail = 'badmashbcha1@gmail.com',
  onOpenParentalSettings,
  onOpenFamilyTab,
  onBack,
  onUpdateDeviceName,
  realBatteryLevel = 21,
  isCharging = false,
}) => {
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeviceInfoModal, setShowDeviceInfoModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentName, setCurrentName] = useState(deviceName);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Current real-time clock formatted like Android status bar
  const [currentTime, setCurrentTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleToggleFocus = () => {
    const nextState = !focusModeActive;
    setFocusModeActive(nextState);
    if (nextState) {
      triggerToast('Focus Mode enabled: Distractions & notifications muted');
    } else {
      triggerToast('Focus Mode turned off');
    }
  };

  const handleSaveDeviceName = () => {
    if (currentName.trim()) {
      onUpdateDeviceName?.(currentName.trim());
      setIsEditingName(false);
      triggerToast(`Device name updated to ${currentName.trim()}`);
    }
  };

  const handleOpenParentalSettingsWithPin = () => {
    setShowMenu(false);
    setEnteredPin('');
    setPinError(false);
    setShowPinModal(true);
  };

  const handlePinDigit = (digit: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      if (nextPin.length === 4) {
        const storedPin = localStorage.getItem('viewsync_parent_pin') || '1234';
        if (nextPin === storedPin) {
          setTimeout(() => {
            setShowPinModal(false);
            setEnteredPin('');
            onOpenParentalSettings();
          }, 200);
        } else {
          setPinError(true);
          setTimeout(() => {
            setEnteredPin('');
            setPinError(false);
          }, 900);
        }
      }
    }
  };

  const handlePinBackspace = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  const handleAndroidBack = () => {
    if (showPinModal) {
      setShowPinModal(false);
      setEnteredPin('');
      return;
    }
    if (showDeviceInfoModal) {
      setShowDeviceInfoModal(false);
      return;
    }
    if (showMenu) {
      setShowMenu(false);
      return;
    }
    if (isEditingName) {
      setIsEditingName(false);
      return;
    }
    if (onBack) {
      onBack();
    } else {
      triggerToast('Supervision active: Device protected by ViewSync Kids');
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-[720px] bg-[#f8faff] text-slate-800 flex flex-col justify-between overflow-hidden shadow-2xl select-none sm:rounded-[36px] sm:border sm:border-slate-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200 text-center max-w-[90%]">
          {toastMessage}
        </div>
      )}

      {/* TOP BLUE HEADER SECTION matching IMG-20261101-WA0003 */}
      <div className="bg-[#3666f2] text-white pt-2.5 pb-20 px-5 relative transition-all">
        {/* Android Status Bar */}
        <div className="flex items-center justify-between text-[13px] font-semibold tracking-wide text-white/95 pb-3">
          {/* Time & system icons */}
          <div className="flex items-center gap-2">
            <span>{currentTime || '1:25'}</span>
            <span className="text-[11px] opacity-80">94</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
          </div>

          {/* Network, VoLTE, Battery */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[10px] border border-white/60 px-1 py-0.2 rounded font-bold">
              VoLTE
            </span>
            <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <div className="flex items-center gap-0.5 ml-0.5">
              <span className="text-[11px] font-bold">{realBatteryLevel}%</span>
              <Battery className="w-4 h-4 fill-white/80 stroke-[2]" />
            </div>
          </div>
        </div>

        {/* Header Greeting Row */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-xs truncate max-w-[280px]">
              Hi, {currentName}
            </h1>
            <button
              type="button"
              onClick={() => setIsEditingName(!isEditingName)}
              title="Edit Device Name"
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Three dots menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Options"
              className="p-1.5 rounded-full hover:bg-white/15 text-white transition active:scale-95"
            >
              <MoreHorizontal className="w-6 h-6 stroke-[2.8]" />
            </button>

            {/* Menu Popup */}
            {showMenu && (
              <div className="absolute right-0 top-9 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800 truncate">{currentName}</p>
                  <p className="text-[11px] text-slate-400">Child Supervised Mode</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowDeviceInfoModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-slate-50 rounded-xl transition text-left"
                >
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Device Information</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenParentalSettingsWithPin}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-slate-50 rounded-xl transition text-left"
                >
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Parental Settings</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick rename inline prompt */}
        {isEditingName && (
          <div className="mt-2 flex items-center gap-2 bg-white/15 backdrop-blur-md p-1.5 rounded-xl">
            <input
              type="text"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              placeholder="Enter device or child name"
              className="bg-transparent text-white placeholder-white/60 text-xs px-2 py-1 outline-none flex-1 font-semibold"
            />
            <button
              type="button"
              onClick={handleSaveDeviceName}
              className="bg-white text-blue-600 px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-white/90"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* OVERLAPPING CLOUD FAMILY CARD matching IMG-20261101-WA0003 */}
      <div className="flex-1 px-5 -mt-16 relative z-10 flex flex-col justify-start pb-4 space-y-4">
        {/* White Card with Cloud Header Shape */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden text-center relative pt-4 pb-6 px-6">
          {/* Cloud border outline effect at top */}
          <div className="relative w-full max-w-[260px] mx-auto h-[160px] flex items-center justify-center">
            {/* Playful Cloud Outline SVG with Family Inside */}
            <svg viewBox="0 0 320 220" className="w-full h-full drop-shadow-xs" fill="none">
              {/* Cloud contour background */}
              <path
                d="M50 170 C30 170 15 150 20 130 C10 115 15 90 35 85 C40 60 70 45 95 55 C120 30 160 30 185 50 C210 35 250 45 265 75 C285 80 295 105 285 125 C295 145 280 170 255 170 Z"
                fill="#F0F6FF"
                stroke="#E2ECFF"
                strokeWidth="3"
              />

              {/* Sparkle Stars & Heart */}
              {/* Pink Heart */}
              <path
                d="M152 40 C152 35 147 30 142 30 C137 30 134 34 134 37 C134 34 131 30 126 30 C121 30 116 35 116 40 C116 48 126 55 134 60 C142 55 152 48 152 40 Z"
                fill="#F472B6"
              />
              {/* Sparkles */}
              <path d="M72 76L75 70L78 76L84 78L78 80L75 86L72 80L66 78L72 76Z" fill="#60A5FA" />
              <path d="M228 72L230 67L233 72L238 74L233 76L230 81L228 76L223 74L228 72Z" fill="#FBBF24" />
              <path d="M54 132L56 128L58 132L62 133L58 135L56 139L54 135L50 133L54 132Z" fill="#F43F5E" />
              <path d="M260 126L262 122L264 126L268 127L264 129L262 133L260 129L256 127L260 126Z" fill="#3B82F6" />

              {/* FAMILY MEMBERS */}
              {/* 1. FATHER (Left back) */}
              {/* Blue Shirt */}
              <path d="M75 170 C75 140 90 125 120 125 C145 125 155 140 155 170 Z" fill="#4F75FF" />
              {/* Face */}
              <circle cx="112" cy="98" r="24" fill="#FCE8D5" />
              {/* Brown hair & beard */}
              <path
                d="M90 92 C90 72 100 66 116 66 C132 66 138 75 138 90 C128 80 120 80 114 80 C104 80 96 84 90 92 Z"
                fill="#92400E"
              />
              <circle cx="98" cy="80" r="8" fill="#92400E" />
              <circle cx="112" cy="74" r="9" fill="#92400E" />
              {/* Beard */}
              <path
                d="M96 102 C96 115 106 124 115 124 C124 124 130 116 130 105 C124 110 118 110 115 110 C109 110 101 107 96 102 Z"
                fill="#92400E"
              />
              {/* Eyes & smile */}
              <circle cx="106" cy="95" r="2.5" fill="#1E293B" />
              <circle cx="120" cy="95" r="2.5" fill="#1E293B" />
              <path d="M109 104 C112 107 116 107 119 104" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />

              {/* 2. MOTHER (Right back) */}
              {/* Green Dress */}
              <path d="M145 170 C145 138 160 122 188 122 C215 122 230 138 230 170 Z" fill="#34D399" />
              {/* Face */}
              <circle cx="180" cy="96" r="23" fill="#FCE8D5" />
              {/* Long brown wavy hair */}
              <path
                d="M156 94 C156 70 172 65 188 65 C208 65 218 78 218 98 C218 126 210 140 210 140 C204 122 206 104 204 94 C195 86 182 86 170 92 C164 100 160 118 154 126 C157 114 156 102 156 94 Z"
                fill="#78350F"
              />
              {/* Gold hoop earring */}
              <circle cx="204" cy="106" r="4.5" stroke="#F59E0B" strokeWidth="2" fill="none" />
              {/* Eyes & smile */}
              <circle cx="174" cy="94" r="2.5" fill="#1E293B" />
              <circle cx="188" cy="94" r="2.5" fill="#1E293B" />
              <path d="M176 104 C180 108 186 108 190 104" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />

              {/* 3. BLONDE GIRL (Front left) */}
              {/* Pink dress */}
              <path d="M85 170 C85 148 100 142 120 142 C135 142 142 148 142 170 Z" fill="#F472B6" />
              <circle cx="106" cy="126" r="17" fill="#FED7AA" />
              {/* Blonde hair with pigtails */}
              <circle cx="91" cy="118" r="8" fill="#FBBF24" />
              <circle cx="121" cy="118" r="8" fill="#FBBF24" />
              <path
                d="M93 120 C93 104 100 98 110 98 C120 98 126 104 126 120 C118 110 114 110 108 110 C102 110 97 114 93 120 Z"
                fill="#FBBF24"
              />
              {/* Rosy cheeks, eyes & smile */}
              <circle cx="101" cy="126" r="2" fill="#1E293B" />
              <circle cx="111" cy="126" r="2" fill="#1E293B" />
              <circle cx="98" cy="130" r="3" fill="#FDA4AF" />
              <circle cx="114" cy="130" r="3" fill="#FDA4AF" />
              <path d="M103 132 C105 135 107 135 109 132" stroke="#BE185D" strokeWidth="1.5" strokeLinecap="round" />

              {/* 4. CHEERFUL BOY (Front right) */}
              {/* Bright blue hoodie */}
              <path d="M128 170 C128 145 140 138 165 138 C186 138 196 145 196 170 Z" fill="#38BDF8" />
              {/* Raised hand waving */}
              <circle cx="204" cy="130" r="7" fill="#FED7AA" />
              <path d="M188 152 C196 145 202 138 204 130" stroke="#38BDF8" strokeWidth="7" strokeLinecap="round" />
              {/* Face */}
              <circle cx="160" cy="124" r="17" fill="#FED7AA" />
              {/* Dark curly hair */}
              <path
                d="M144 118 C144 106 152 100 164 100 C176 100 180 106 180 118 C174 112 168 112 162 112 C156 112 148 114 144 118 Z"
                fill="#451A03"
              />
              <circle cx="150" cy="106" r="6" fill="#451A03" />
              <circle cx="162" cy="102" r="6" fill="#451A03" />
              <circle cx="172" cy="104" r="5" fill="#451A03" />
              {/* Eyes & smile */}
              <circle cx="155" cy="122" r="2" fill="#1E293B" />
              <circle cx="165" cy="122" r="2" fill="#1E293B" />
              <path
                d="M154 128 C156 134 164 134 166 128 Z"
                fill="white"
                stroke="#451A03"
                strokeWidth="1.2"
              />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            Supervision Mode enabled
          </h2>

          {/* Subtitle */}
          <p className="text-[12px] sm:text-[13px] text-slate-500 font-medium leading-relaxed max-w-[270px] mx-auto mt-1">
            The guardian <span className="text-slate-800 font-semibold">({guardianEmail})</span> can manage how this device is used now.
          </p>
        </div>

        {/* CARD 1: FOCUS MODE TOGGLE matching IMG-20261101-WA0003 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between transition hover:border-slate-300">
          <div className="flex items-center gap-3.5">
            {/* Green circular icon with human head/profile */}
            <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center text-white shadow-xs">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white stroke-none">
                <path d="M12 2C8.686 2 6 4.686 6 8c0 2.21 1.196 4.14 2.97 5.185-.562.81-1.258 1.95-1.748 3.327C6.444 18.665 6 21 6 21h12s-.444-2.335-1.222-4.488c-.49-1.377-1.186-2.517-1.748-3.327C16.804 12.14 18 10.21 18 8c0-3.314-2.686-6-6-6z" />
              </svg>
            </div>
            <div>
              <span className="text-[15px] font-semibold text-slate-800">Focus Mode</span>
              {focusModeActive && (
                <p className="text-[11px] text-emerald-600 font-bold">Active • Muting distraction apps</p>
              )}
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={focusModeActive}
            onClick={handleToggleFocus}
            className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out relative flex items-center ${
              focusModeActive ? 'bg-[#3b82f6]' : 'bg-[#e2e8f0]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                focusModeActive ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* CARD 2: PARENTAL SETTINGS NAVIGATION matching IMG-20261101-WA0003 */}
        <button
          type="button"
          onClick={handleOpenParentalSettingsWithPin}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between text-left transition hover:border-blue-300 hover:shadow-md active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            {/* Blue circular icon with person & gear */}
            <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white shadow-xs">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white stroke-none">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                <path
                  d="M19.5 8c0-.28-.05-.55-.13-.81l.88-.68c.08-.06.1-.17.05-.26l-.83-1.44c-.05-.09-.16-.12-.25-.09l-1.04.42c-.22-.17-.46-.3-.72-.41l-.16-1.1c-.01-.1-.1-.18-.2-.18h-1.66c-.1 0-.19.08-.2.18l-.16 1.1c-.26.11-.5.24-.72.41l-1.04-.42c-.09-.03-.2 0-.25.09l-.83 1.44c-.05.09-.03.2.05.26l.88.68c-.08.26-.13.53-.13.81 0 .28.05.55.13.81l-.88.68c-.08.06-.1.17-.05.26l.83 1.44c.05.09.16.12.25.09l1.04-.42c.22.17.46.3.72.41l.16 1.1c.01.1.1.18.2.18h1.66c.1 0 .19-.08.2-.18l.16-1.1c.26-.11.5-.24.72-.41l1.04.42c.09.03.2 0 .25-.09l.83-1.44c.05-.09.03-.2-.05-.26l-.88-.68c.08-.26.13-.53.13-.81zm-2.5 1.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                  fill="#ffffff"
                />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-slate-800">Parental Settings</span>
          </div>

          {/* Chevron */}
          <ChevronRight className="w-5 h-5 text-slate-400 stroke-[2.5]" />
        </button>
      </div>

      {/* BOTTOM NAVIGATION BAR matching IMG-20261101-WA0003 */}
      <div className="bg-white border-t border-slate-200/90 pt-1 pb-1 relative z-20">
        <div className="grid grid-cols-2 max-w-[280px] mx-auto py-1">
          {/* Home Tab (Selected with rounded blue pill) */}
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-1 group py-0.5"
          >
            <div className="w-16 h-7 rounded-full bg-[#dbeafe] flex items-center justify-center transition">
              <Smartphone className="w-4 h-4 text-[#2563eb] stroke-[2.5]" />
            </div>
            <span className="text-[11.5px] font-bold text-[#2563eb]">Home</span>
          </button>

          {/* Family Tab */}
          <button
            type="button"
            onClick={onOpenFamilyTab}
            className="flex flex-col items-center justify-center gap-1 group py-0.5"
          >
            <div className="w-16 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 transition">
              <div className="relative">
                <Home className="w-5 h-5 text-slate-400 group-hover:text-slate-600 stroke-[2]" />
                <Heart className="w-2.5 h-2.5 text-slate-400 fill-slate-400 absolute top-1.5 left-1.5" />
              </div>
            </div>
            <span className="text-[11.5px] font-medium text-slate-500 group-hover:text-slate-700">Family</span>
          </button>
        </div>

        {/* Android bottom system navigation buttons (hamburger, square, triangle) */}
        <div className="flex items-center justify-around py-2.5 px-10 text-slate-400 border-t border-slate-100/60">
          <button type="button" className="p-1 hover:text-slate-600 transition" aria-label="Recent apps">
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current stroke-2 fill-none">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
          <button type="button" className="p-1 hover:text-slate-600 transition" aria-label="Home">
            <div className="w-3.5 h-3.5 rounded-sm border-2 border-current" />
          </button>
          <button
            type="button"
            onClick={handleAndroidBack}
            className="p-1 hover:text-slate-600 transition"
            aria-label="Back"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current stroke-2 fill-none">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Device Info Modal */}
      {showDeviceInfoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">Supervised Device</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDeviceInfoModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 py-4 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Device Name</span>
                <span className="font-bold text-slate-800">{currentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Model</span>
                <span className="font-bold text-slate-800">Realme RMX5313</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Guardian</span>
                <span className="font-bold text-slate-800">{guardianEmail}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Supervised &amp; Protected
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Battery Level</span>
                <span className="font-bold text-slate-800">{realBatteryLevel}%</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDeviceInfoModal(false)}
              className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Guardian Security PIN Pad Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl border border-slate-100 flex flex-col items-center">
            {/* Padlock Icon */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
              pinError ? 'bg-rose-100 text-rose-600 animate-bounce' : 'bg-blue-100 text-blue-600'
            }`}>
              <Shield className="w-6 h-6" />
            </div>

            <h3 className="font-extrabold text-slate-800 text-base">Guardian Security PIN</h3>
            <p className="text-xs text-slate-500 text-center mt-1">
              {pinError ? (
                <span className="text-rose-600 font-bold">Incorrect PIN! Default is 1234</span>
              ) : (
                'Enter 4-digit PIN to access parental settings'
              )}
            </p>

            {/* 4-Dots Display */}
            <div className="flex items-center gap-3 my-5">
              {[0, 1, 2, 3].map((idx) => {
                const filled = enteredPin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      pinError
                        ? 'border-rose-500 bg-rose-500'
                        : filled
                        ? 'border-blue-600 bg-blue-600 scale-110'
                        : 'border-slate-300 bg-slate-100'
                    }`}
                  />
                );
              })}
            </div>

            {/* 0-9 Keypad */}
            <div className="grid grid-cols-3 gap-2.5 w-full max-w-[220px]">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePinDigit(num)}
                  className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-base font-bold text-slate-800 flex items-center justify-center transition active:scale-95 shadow-xs"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setShowPinModal(false);
                  setEnteredPin('');
                }}
                className="h-12 rounded-2xl hover:bg-slate-100 text-xs font-semibold text-slate-500 flex items-center justify-center transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handlePinDigit('0')}
                className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-base font-bold text-slate-800 flex items-center justify-center transition active:scale-95 shadow-xs"
              >
                0
              </button>
              <button
                type="button"
                onClick={handlePinBackspace}
                className="h-12 rounded-2xl hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold text-slate-500 flex items-center justify-center transition"
              >
                ⌫
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
