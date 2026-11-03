import React, { useState } from 'react';
import {
  ArrowLeft,
  MoreHorizontal,
  Key,
  Binoculars,
  MapPin,
  Shield,
  CheckCircle2,
  HelpCircle,
  X,
  ExternalLink,
} from 'lucide-react';

interface ChildPermissionsScreenProps {
  onBack: () => void;
  onScreenMirroringToggle?: (enabled: boolean) => void;
  onLocationToggle?: (enabled: boolean) => void;
  onAccessibilityToggle?: (enabled: boolean) => void;
  onSocialDetectionToggle?: (enabled: boolean) => void;
  isScreenSharing?: boolean;
}

export const ChildPermissionsScreen: React.FC<ChildPermissionsScreenProps> = ({
  onBack,
  onScreenMirroringToggle,
  onLocationToggle,
  onAccessibilityToggle,
  onSocialDetectionToggle,
  isScreenSharing = false,
}) => {
  // Permission switch states
  const [usageLimitsGranted, setUsageLimitsGranted] = useState(false);
  const [screenMirroringGranted, setScreenMirroringGranted] = useState(isScreenSharing);
  const [locationGranted, setLocationGranted] = useState(false);
  const [socialDetectionGranted, setSocialDetectionGranted] = useState(false);

  // Modal / Toast
  const [showMenu, setShowMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleUsageLimits = () => {
    const next = !usageLimitsGranted;
    setUsageLimitsGranted(next);
    onAccessibilityToggle?.(next);
    triggerToast(next ? 'Accessibility: Usage Limits granted' : 'Usage Limits permission disabled');
  };

  const handleToggleScreenMirroring = () => {
    const next = !screenMirroringGranted;
    setScreenMirroringGranted(next);
    onScreenMirroringToggle?.(next);
    triggerToast(next ? 'Screen Mirroring authorized for guardian' : 'Screen Mirroring permission paused');
  };

  const handleToggleLocation = () => {
    const next = !locationGranted;
    if (next && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationGranted(true);
          onLocationToggle?.(true);
          triggerToast('Location Tracker permission granted & GPS locked');
        },
        (err) => {
          console.warn('Geolocation prompt rejected or unavailable:', err);
          setLocationGranted(true); // fall back to granted state
          onLocationToggle?.(true);
          triggerToast('Location Tracker permission activated');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setLocationGranted(next);
      onLocationToggle?.(next);
      triggerToast(next ? 'Location Tracker permission activated' : 'Location Tracker turned off');
    }
  };

  const handleToggleSocialDetection = () => {
    const next = !socialDetectionGranted;
    setSocialDetectionGranted(next);
    onSocialDetectionToggle?.(next);
    triggerToast(next ? 'Social Content Detection filter enabled' : 'Social Content Detection paused');
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-[720px] bg-white text-slate-800 flex flex-col justify-between overflow-hidden shadow-2xl select-none sm:rounded-[36px] sm:border sm:border-slate-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200 text-center max-w-[90%]">
          {toastMessage}
        </div>
      )}

      {/* Screen Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* TOP BAR matching IMG-20261101-WA0002 */}
        <div className="flex items-center justify-between px-4 py-4 pt-5 bg-white">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="p-1.5 -ml-1.5 rounded-full text-slate-800 hover:bg-slate-100 transition active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Options"
              className="p-1.5 rounded-full text-slate-800 hover:bg-slate-100 transition"
            >
              <MoreHorizontal className="w-6 h-6 stroke-[2.2]" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-9 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setShowHelpModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-slate-50 rounded-xl transition text-left"
                >
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>Permission Guide</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUsageLimitsGranted(true);
                    setScreenMirroringGranted(true);
                    setLocationGranted(true);
                    setSocialDetectionGranted(true);
                    setShowMenu(false);
                    triggerToast('All protection permissions granted');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 rounded-xl transition text-left"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Grant All</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* HERO ILLUSTRATION BANNER matching IMG-20261101-WA0002 */}
        <div className="px-6 py-2 flex items-center justify-center">
          <div className="relative w-full max-w-[280px] h-[155px] flex items-center justify-center">
            {/* SVG Banner: Support agent avatar + Tilted phone with green/blue switches + hand flipping toggle */}
            <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
              {/* Soft yellow backdrop highlight */}
              <ellipse cx="170" cy="95" rx="85" ry="60" fill="#FEF3C7" opacity="0.65" />

              {/* Sparkle starbursts */}
              <path d="M102 44L105 39L108 44L113 46L108 48L105 53L102 48L97 46L102 44Z" fill="#34D399" />
              <path d="M228 50L230 46L232 50L236 51L232 53L230 57L228 53L224 51L228 50Z" fill="#60A5FA" />
              <path d="M245 120L247 116L249 120L253 121L249 123L247 127L245 123L241 121L245 120Z" fill="#FBBF24" />
              {/* Playful ribbon curl */}
              <path
                d="M90 120 C85 110 95 105 105 115 C115 125 105 135 98 128"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* 1. SUPPORT AGENT AVATAR CIRCLE (Left) */}
              <g transform="translate(24, 20)">
                <circle cx="28" cy="28" r="28" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
                <clipPath id="agentClip">
                  <circle cx="28" cy="28" r="26" />
                </clipPath>
                <g clipPath="url(#agentClip)">
                  {/* Sky blue background */}
                  <rect x="0" y="0" width="56" height="56" fill="#BAE6FD" />
                  {/* Agent Woman Illustration */}
                  {/* Blue Uniform */}
                  <path d="M8 56 C8 42 16 38 28 38 C40 38 48 42 48 56 Z" fill="#0284C7" />
                  <rect x="23" y="32" width="10" height="9" fill="#FED7AA" rx="3" />
                  {/* Face */}
                  <circle cx="28" cy="24" r="13" fill="#FED7AA" />
                  {/* Brown Hair */}
                  <path
                    d="M15 22 C15 12 21 9 28 9 C35 9 41 12 41 22 C41 27 38 31 38 31 C35 24 35 18 28 18 C21 18 21 24 18 31 C18 31 15 27 15 22 Z"
                    fill="#78350F"
                  />
                  {/* Eyes & smile */}
                  <circle cx="24" cy="23" r="1.5" fill="#1E293B" />
                  <circle cx="32" cy="23" r="1.5" fill="#1E293B" />
                  <path d="M26 29 C27.5 31 28.5 31 30 29" stroke="#BE185D" strokeWidth="1.2" strokeLinecap="round" />
                  {/* Headset with mic */}
                  <path d="M15 24 C14 16 19 12 28 12 C37 12 42 16 41 24" stroke="#64748B" strokeWidth="2" fill="none" />
                  <circle cx="15" cy="24" r="3" fill="#334155" />
                  <path d="M15 24 L22 30" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="23" cy="30" r="1.5" fill="#0284C7" />
                </g>
              </g>

              {/* 2. TILTED PHONE IN CENTER */}
              <g transform="translate(115, 20) rotate(-6 45 65)">
                {/* Phone body */}
                <rect x="0" y="0" width="86" height="135" rx="16" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
                {/* Screen inner */}
                <rect x="5" y="8" width="76" height="119" rx="12" fill="#FFFFFF" />

                {/* Top Toggle Switch 1 (Blue) */}
                <g transform="translate(10, 22)">
                  <rect x="0" y="0" width="66" height="28" rx="8" fill="#60A5FA" />
                  <rect x="5" y="6" width="30" height="4" rx="2" fill="#FFFFFF" opacity="0.8" />
                  <rect x="5" y="14" width="20" height="4" rx="2" fill="#FFFFFF" opacity="0.6" />
                  {/* Toggle button circle */}
                  <circle cx="50" cy="14" r="9" fill="#FFFFFF" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.2))" />
                </g>

                {/* Bottom Toggle Switch 2 (Green with checkmark) */}
                <g transform="translate(10, 60)">
                  <rect x="0" y="0" width="66" height="28" rx="8" fill="#34D399" />
                  {/* Checkmark circle on left */}
                  <circle cx="13" cy="14" r="7" fill="#FFFFFF" opacity="0.9" />
                  <path d="M10 14L12 16L16 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  {/* White bar */}
                  <rect x="24" y="12" width="18" height="4" rx="2" fill="#FFFFFF" opacity="0.8" />
                  {/* Active Toggle circle on right */}
                  <circle cx="50" cy="14" r="9" fill="#FFFFFF" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.2))" />
                </g>
              </g>

              {/* 3. CARTOON HAND TOUCHING / FLIPPING TOGGLE (Right) */}
              <g transform="translate(198, 86)">
                {/* Arm / sleeve */}
                <path d="M45 42 L25 15" stroke="#F43F5E" strokeWidth="18" strokeLinecap="round" />
                {/* Hand pointing index finger */}
                <path
                  d="M10 2 C6 0 0 5 0 10 C0 14 4 18 10 18 L25 18 C28 18 30 14 30 10 C30 6 28 2 25 2 Z"
                  fill="#FED7AA"
                />
                <circle cx="5" cy="8" r="7" fill="#FED7AA" />
                {/* Index finger tip tapping switch */}
                <path d="M6 8 L-8 4" stroke="#FED7AA" strokeWidth="8" strokeLinecap="round" />
                {/* Tap vibration ripples */}
                <path d="M-14 -2 C-18 4 -18 10 -14 16" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M-20 -5 C-25 3 -25 12 -20 20" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>
            </svg>
          </div>
        </div>

        {/* INSTRUCTION TEXT matching IMG-20261101-WA0002 */}
        <div className="px-6 py-2">
          <p className="text-[14px] text-slate-700 font-semibold leading-snug">
            To ensure ViewSync Kids functions properly, please grant the following permissions
          </p>
        </div>

        {/* PERMISSIONS LIST matching IMG-20261101-WA0002 */}
        <div className="divide-y divide-slate-100 px-5 pb-4 space-y-1">
          {/* 1. USAGE LIMITS */}
          <div className="pt-3 pb-4">
            <div className="flex items-start gap-3.5 mb-2.5">
              {/* Red rounded square with keyhole icon */}
              <div className="w-10 h-10 rounded-2xl bg-[#f43f5e] flex items-center justify-center text-white shrink-0 shadow-xs">
                <Key className="w-5 h-5 fill-white stroke-none" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 leading-snug">Usage Limits</h3>
                <p className="text-[12.5px] text-slate-500 font-normal mt-0.5 leading-snug">
                  Limit app usage and screen time on this device
                </p>
              </div>
            </div>

            {/* Sub-row: Accessibility Permission + Toggle */}
            <div className="flex items-center justify-between pl-13 pr-1">
              <span className="text-[13.5px] font-medium text-slate-700">Accessibility Permission</span>
              <button
                type="button"
                role="switch"
                aria-checked={usageLimitsGranted}
                onClick={handleToggleUsageLimits}
                className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out relative flex items-center ${
                  usageLimitsGranted ? 'bg-[#3b82f6]' : 'bg-[#e2e8f0]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    usageLimitsGranted ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 2. SCREEN MIRRORING */}
          <div className="pt-3.5 pb-4">
            <div className="flex items-start gap-3.5 mb-2.5">
              {/* Blue rounded square with binoculars icon */}
              <div className="w-10 h-10 rounded-2xl bg-[#3b82f6] flex items-center justify-center text-white shrink-0 shadow-xs">
                <Binoculars className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 leading-snug">Screen Mirroring</h3>
                <p className="text-[12.5px] text-slate-500 font-normal mt-0.5 leading-snug">
                  Remotely view the screen of this device
                </p>
              </div>
            </div>

            {/* Sub-row: Accessibility Permission + Toggle */}
            <div className="flex items-center justify-between pl-13 pr-1">
              <span className="text-[13.5px] font-medium text-slate-700">Accessibility Permission</span>
              <button
                type="button"
                role="switch"
                aria-checked={screenMirroringGranted}
                onClick={handleToggleScreenMirroring}
                className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out relative flex items-center ${
                  screenMirroringGranted ? 'bg-[#3b82f6]' : 'bg-[#e2e8f0]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    screenMirroringGranted ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 3. LOCATION TRACKER */}
          <div className="pt-3.5 pb-4">
            <div className="flex items-start gap-3.5 mb-2.5">
              {/* Green rounded square with map pin icon */}
              <div className="w-10 h-10 rounded-2xl bg-[#10b981] flex items-center justify-center text-white shrink-0 shadow-xs">
                <MapPin className="w-5 h-5 fill-white stroke-none" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 leading-snug">Location Tracker</h3>
                <p className="text-[12.5px] text-slate-500 font-normal mt-0.5 leading-snug">
                  Find this device and set a geofence on it
                </p>
              </div>
            </div>

            {/* Sub-row: Location Permission + Toggle */}
            <div className="flex items-center justify-between pl-13 pr-1">
              <span className="text-[13.5px] font-medium text-slate-700">Location Permission</span>
              <button
                type="button"
                role="switch"
                aria-checked={locationGranted}
                onClick={handleToggleLocation}
                className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out relative flex items-center ${
                  locationGranted ? 'bg-[#3b82f6]' : 'bg-[#e2e8f0]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    locationGranted ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 4. SOCIAL CONTENT DETECTION */}
          <div className="pt-3.5 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3.5 pr-3">
                {/* Green badge with white 'A' */}
                <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center text-white font-black text-lg shrink-0 shadow-xs">
                  A
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900 leading-snug">Social Content Detection</h3>
                  <p className="text-[12.5px] text-slate-500 font-normal mt-0.5 leading-snug">
                    Monitor social media apps for specific keywords
                  </p>
                </div>
              </div>

              {/* Direct Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={socialDetectionGranted}
                onClick={handleToggleSocialDetection}
                className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out relative flex items-center shrink-0 ${
                  socialDetectionGranted ? 'bg-[#3b82f6]' : 'bg-[#e2e8f0]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    socialDetectionGranted ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Android Bottom Navigation Bar */}
      <div className="bg-white border-t border-slate-100 py-2.5 px-10 flex items-center justify-around text-slate-400">
        <button type="button" className="p-1 hover:text-slate-600 transition" aria-label="Recent apps">
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current stroke-2 fill-none">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
        <button type="button" onClick={onBack} className="p-1 hover:text-slate-600 transition" aria-label="Home">
          <div className="w-3.5 h-3.5 rounded-sm border-2 border-current" />
        </button>
        <button type="button" onClick={onBack} className="p-1 hover:text-slate-600 transition" aria-label="Back">
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current stroke-2 fill-none">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">Why are these permissions required?</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-3 text-xs text-slate-600">
              <p>
                <strong>Usage Limits:</strong> Enables your guardian to set daily screen time caps and block dangerous apps.
              </p>
              <p>
                <strong>Screen Mirroring:</strong> Allows your parent to view your screen in real time to guide homework or help solve problems.
              </p>
              <p>
                <strong>Location Tracker:</strong> Lets your guardian find your phone in case it is lost or in emergencies.
              </p>
              <p>
                <strong>Social Content Detection:</strong> Automatically scans messages for cyberbullying and harmful keywords.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
