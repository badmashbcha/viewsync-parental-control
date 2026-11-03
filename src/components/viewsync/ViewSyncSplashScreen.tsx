import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface ViewSyncSplashScreenProps {
  onGetStarted: () => void;
  onOpenParentMode?: () => void;
}

export const ViewSyncSplashScreen: React.FC<ViewSyncSplashScreenProps> = ({
  onGetStarted,
  onOpenParentMode,
}) => {
  return (
    <div className="relative min-h-[720px] w-full max-w-sm mx-auto bg-gradient-to-b from-[#090a21] via-[#120d3b] to-[#1c0b42] text-white flex flex-col justify-between p-6 rounded-3xl shadow-2xl border border-indigo-500/30 overflow-hidden select-none">
      {/* Background Starry Glow Effects */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Status Bar Simulation */}
      <div className="flex items-center justify-between text-xs text-indigo-200/80 font-medium px-2 z-10">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]">5G</span>
          <div className="w-5 h-2.5 rounded-sm border border-indigo-200/80 p-0.5 flex items-center">
            <div className="h-full w-full bg-emerald-400 rounded-2xs" />
          </div>
        </div>
      </div>

      {/* Center Branding Area matching the mockup */}
      <div className="flex flex-col items-center text-center my-auto py-4 z-10">
        {/* Crown & Eye Glowing 3D Emblem */}
        <div className="relative mb-3 flex items-center justify-center">
          <img
            src="/assets/aistudio/file_00000000da108211b0e62540220f79da_6786b4ce.png"
            alt="ViewSync"
            className="w-28 h-28 object-contain drop-shadow-[0_0_35px_rgba(59,130,246,0.6)]"
          />
        </div>

        {/* 3D Glowing Text Title */}
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-amber-200 bg-clip-text text-transparent drop-shadow-lg">
            ViewSync
          </h1>
          <p className="text-sm font-bold tracking-widest text-indigo-200/90 uppercase flex items-center justify-center gap-2">
            <span>Play</span>
            <span className="text-amber-400">•</span>
            <span>Connect</span>
            <span className="text-amber-400">•</span>
            <span>Grow</span>
          </p>
        </div>

        {/* Character Art Illustration: Boy & Girl with phones and glowing shield */}
        <div className="mt-6 relative w-64 h-56 flex items-center justify-center">
          <svg viewBox="0 0 280 240" className="w-full h-full drop-shadow-xl" fill="none">
            {/* Ambient Background Aura */}
            <circle cx="140" cy="120" r="100" fill="url(#ambientGlow)" opacity="0.6" />

            {/* Glowing Shield in the Middle */}
            <path
              d="M140 70C160 70 175 75 175 95C175 135 150 160 140 170C130 160 105 135 105 95C105 75 120 70 140 70Z"
              fill="url(#shieldGrad)"
              stroke="#60A5FA"
              strokeWidth="3"
            />
            {/* White Checkmark inside Shield */}
            <path
              d="M130 115L138 123L152 105"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Boy on Left (Blue Hoodie holding smartphone) */}
            <g id="boySplash">
              {/* Blue Hoodie Body */}
              <path d="M40 230C40 175 60 160 95 160C110 160 120 168 125 180L40 230Z" fill="#2563EB" />
              {/* Face */}
              <circle cx="85" cy="125" r="24" fill="#FED7AA" />
              {/* Curly Hair */}
              <path
                d="M60 125C60 105 70 95 90 95C105 95 115 105 115 120C108 112 100 110 90 110C78 110 70 115 60 125Z"
                fill="#1E293B"
              />
              <circle cx="70" cy="105" r="7" fill="#1E293B" />
              <circle cx="85" cy="100" r="8" fill="#1E293B" />
              <circle cx="100" cy="102" r="7" fill="#1E293B" />
              {/* Face features */}
              <circle cx="78" cy="122" r="2.5" fill="#1E293B" />
              <circle cx="94" cy="122" r="2.5" fill="#1E293B" />
              <path d="M82 133C85 136 90 136 93 133" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
              {/* Smartphone */}
              <rect x="90" y="155" width="22" height="36" rx="4" fill="#1E1B4B" stroke="#60A5FA" strokeWidth="1.5" />
            </g>

            {/* Girl on Right (Pink Hoodie holding smartphone) */}
            <g id="girlSplash">
              {/* Pink Hoodie Body */}
              <path d="M240 230C240 175 220 160 185 160C170 160 160 168 155 180L240 230Z" fill="#EC4899" />
              {/* Face */}
              <circle cx="195" cy="125" r="24" fill="#FED7AA" />
              {/* Brown long hair */}
              <path
                d="M170 125C170 105 180 95 200 95C215 95 225 105 225 120C225 145 220 160 215 170C210 150 205 110 195 110C185 110 180 120 175 140Z"
                fill="#854D0E"
              />
              <circle cx="185" cy="102" r="8" fill="#854D0E" />
              <circle cx="205" cy="100" r="8" fill="#854D0E" />
              {/* Face features */}
              <circle cx="186" cy="122" r="2.5" fill="#1E293B" />
              <circle cx="202" cy="122" r="2.5" fill="#1E293B" />
              <path d="M190 133C193 136 198 136 201 133" stroke="#DB2777" strokeWidth="2" strokeLinecap="round" />
              {/* Smartphone */}
              <rect x="168" y="155" width="22" height="36" rx="4" fill="#1E1B4B" stroke="#F472B6" strokeWidth="1.5" />
            </g>

            <defs>
              <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4338CA" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="shieldGrad" x1="105" y1="70" x2="175" y2="170" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="space-y-3 z-10 pb-2">
        <button
          type="button"
          onClick={onGetStarted}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-base shadow-xl shadow-indigo-600/40 flex items-center justify-center gap-2.5 transition active:scale-[0.98] group"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
        </button>

        {onOpenParentMode && (
          <button
            type="button"
            onClick={onOpenParentMode}
            className="w-full text-center text-xs text-indigo-300/80 hover:text-white font-semibold py-1 transition"
          >
            Guardian or Supervisor? Switch to Parental Control &gt;
          </button>
        )}
      </div>
    </div>
  );
};
