import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  EyeOff,
  Check,
  X,
  Smartphone,
  AlertTriangle,
} from 'lucide-react';

interface ChildParentalSettingsScreenProps {
  onBack: () => void;
  onOpenFullProtection: () => void;
  onOpenBackgroundRunning: () => void;
  isIconHidden?: boolean;
  onToggleHideIcon?: (hidden: boolean) => void;
}

export const ChildParentalSettingsScreen: React.FC<ChildParentalSettingsScreenProps> = ({
  onBack,
  onOpenFullProtection,
  onOpenBackgroundRunning,
  isIconHidden = false,
  onToggleHideIcon,
}) => {
  const [hideIconActive, setHideIconActive] = useState(isIconHidden);
  const [showHideIconModal, setShowHideIconModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleHideIcon = () => {
    if (!hideIconActive) {
      // Opening confirmation dialog
      setShowHideIconModal(true);
    } else {
      setHideIconActive(false);
      onToggleHideIcon?.(false);
      triggerToast('ViewSync Kids icon restored to launcher');
    }
  };

  const confirmHideIcon = () => {
    setHideIconActive(true);
    onToggleHideIcon?.(true);
    setShowHideIconModal(false);
    triggerToast('ViewSync Kids icon hidden. Dial *#*#842195#*#* to unhide');
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-[720px] bg-white text-slate-800 flex flex-col justify-between overflow-hidden shadow-2xl select-none sm:rounded-[36px] sm:border sm:border-slate-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200 text-center max-w-[90%]">
          {toastMessage}
        </div>
      )}

      {/* Main Screen Content */}
      <div className="flex-1 flex flex-col">
        {/* TOP APP BAR matching IMG-20261101-WA0004 */}
        <div className="flex items-center gap-4 px-4 py-4 pt-5 border-b border-slate-100 bg-white">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="p-1.5 -ml-1.5 rounded-full text-slate-800 hover:bg-slate-100 transition active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Parental Settings</h1>
        </div>

        {/* SETTINGS LIST matching IMG-20261101-WA0004 */}
        <div className="divide-y divide-slate-100/90 px-4 py-2">
          {/* Item 1: Activate Full Protection */}
          <div
            onClick={onOpenFullProtection}
            role="button"
            tabIndex={0}
            className="flex items-start justify-between py-4.5 px-2 hover:bg-slate-50/80 rounded-2xl transition cursor-pointer group active:scale-[0.99]"
          >
            <div className="flex items-start gap-4 pr-3">
              {/* Green shield with white checkmark icon */}
              <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center shrink-0 text-white shadow-xs mt-0.5">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white stroke-none">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.5 14.5l-4-4 1.41-1.41L10.5 13.67l6.59-6.59L18.5 8.5l-8 8z" />
                </svg>
              </div>

              <div>
                <h3 className="text-[15.5px] font-semibold text-slate-900 group-hover:text-blue-600 transition">
                  Activate Full Protection
                </h3>
                <p className="text-[13px] text-slate-500 font-normal mt-0.5 leading-snug">
                  With your child's permission, you can enable more comprehensive protection features.
                </p>
              </div>
            </div>

            {/* Right Chevron */}
            <ChevronRight className="w-5 h-5 text-slate-400 stroke-[2.2] shrink-0 mt-3 group-hover:translate-x-0.5 transition" />
          </div>

          {/* Item 2: Keep Running in Background */}
          <div
            onClick={onOpenBackgroundRunning}
            role="button"
            tabIndex={0}
            className="flex items-start justify-between py-4.5 px-2 hover:bg-slate-50/80 rounded-2xl transition cursor-pointer group active:scale-[0.99]"
          >
            <div className="flex items-start gap-4 pr-3">
              {/* Green circle with sync arrows */}
              <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center shrink-0 text-white shadow-xs mt-0.5">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-white stroke-[2.4] stroke-linecap-round stroke-linejoin-round">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
              </div>

              <div>
                <h3 className="text-[15.5px] font-semibold text-slate-900 group-hover:text-blue-600 transition">
                  Keep Running in Background
                </h3>
                <p className="text-[13px] text-slate-500 font-normal mt-0.5 leading-snug">
                  To ensure ViewSync Kids' features work properly
                </p>
              </div>
            </div>

            {/* Right Chevron */}
            <ChevronRight className="w-5 h-5 text-slate-400 stroke-[2.2] shrink-0 mt-3 group-hover:translate-x-0.5 transition" />
          </div>

          {/* Item 3: Hide Icon */}
          <div className="flex items-start justify-between py-4.5 px-2 hover:bg-slate-50/80 rounded-2xl transition">
            <div className="flex items-start gap-4 pr-3">
              {/* Blue circle with hexagon icon */}
              <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center shrink-0 text-white shadow-xs mt-0.5">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-white stroke-[2.2] stroke-linecap-round stroke-linejoin-round">
                  <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
                  <path d="M12 22V12" />
                  <path d="M12 12L21 7" />
                  <path d="M12 12L3 7" />
                </svg>
              </div>

              <div>
                <h3 className="text-[15.5px] font-semibold text-slate-900">Hide Icon</h3>
                <p className="text-[13px] text-slate-500 font-normal mt-0.5 leading-snug">
                  Hide ViewSync Kids icon on this device
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={hideIconActive}
              onClick={handleToggleHideIcon}
              className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out relative flex items-center shrink-0 mt-2 ${
                hideIconActive ? 'bg-[#3b82f6]' : 'bg-[#e2e8f0]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  hideIconActive ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
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

      {/* Hide Icon Confirmation Modal */}
      {showHideIconModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <EyeOff className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-slate-900 text-base mb-1">
              Hide ViewSync Kids Icon?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              The application icon will be removed from your home screen and app drawer to prevent accidental deletion.
              <br /><br />
              <strong className="text-slate-800">How to open when hidden:</strong>
              <br />
              Dial <code className="bg-slate-100 text-blue-600 px-1.5 py-0.5 rounded font-mono font-bold">*#*#842195#*#*</code> in your phone dialer or open from browser.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowHideIconModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmHideIcon}
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md"
              >
                Confirm Hide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
