import React, { useState } from 'react';
import { Mail, Check, ExternalLink, X, Shield, Lock, ChevronRight, User } from 'lucide-react';

interface OnboardingWelcomeScreenProps {
  onContinueWithGoogle: (email?: string, name?: string) => void;
  onSignUpWithEmail: (email: string) => void;
  onSignIn: () => void;
  onSkip: () => void;
}

export const OnboardingWelcomeScreen: React.FC<OnboardingWelcomeScreenProps> = ({
  onContinueWithGoogle,
  onSignUpWithEmail,
  onSignIn,
  onSkip,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showEmailSignUpModal, setShowEmailSignUpModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');

  // 5 feature carousel slides explaining ViewSync Parental Control
  const slides = [
    {
      id: 'monitor',
      title: "Remotely Monitor Your Child's Device",
      description:
        "Remotely view screen activity and check surroundings via camera and microphone of the child's device.",
    },
    {
      id: 'activity',
      title: 'Real-Time Screen & App Activity',
      description:
        'Check what apps are running live, monitor screen time usage, and receive instant alert notifications.',
    },
    {
      id: 'audio',
      title: 'Surrounding Sound & Ambient Audio',
      description:
        'Listen to real-time ambient room audio with 300% Whisper Boost to protect your child from harm anywhere.',
    },
    {
      id: 'location',
      title: 'Live Location & Safe Geofencing',
      description:
        'Accurately track child GPS location on map with route history, safe-zone geofences, and arrival alerts.',
    },
    {
      id: 'limits',
      title: 'Screen Time & Instant App Lock',
      description:
        'Set daily app limits, enforce bedtime downtime, and instantly lock games or the whole device with one tap.',
    },
  ];

  // Touch and mouse drag swipe handlers
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      const currentX = e.touches[0].clientX;
      setTouchDeltaX(currentX - touchStartX);
    }
  };

  const onTouchEnd = () => {
    if (touchStartX !== null) {
      if (touchDeltaX < -45) {
        handleNextSlide();
      } else if (touchDeltaX > 45) {
        handlePrevSlide();
      }
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setTouchStartX(e.clientX);
    setTouchDeltaX(0);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging && touchStartX !== null) {
      setTouchDeltaX(e.clientX - touchStartX);
    }
  };

  const onMouseUp = () => {
    if (isDragging && touchStartX !== null) {
      if (touchDeltaX < -45) {
        handleNextSlide();
      } else if (touchDeltaX > 45) {
        handlePrevSlide();
      }
    }
    setIsDragging(false);
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f7faff] to-[#edf4fc] text-slate-800 flex flex-col justify-between max-w-md mx-auto relative px-6 py-5 select-none shadow-2xl rounded-none sm:rounded-3xl border sm:border-slate-200/80 my-0 sm:my-6 overflow-hidden">
      {/* Top Bar - Skip removed per user request */}
      <div className="flex items-center justify-between pt-2">
        {/* Brand pill */}
        <div className="flex items-center gap-2">
          <img
            src="/assets/aistudio/file_00000000da108211b0e62540220f79da_6786b4ce.png"
            alt="ViewSync"
            className="w-6 h-6 rounded-lg object-cover shadow-xs"
          />
          <span className="text-sm font-black text-slate-700 tracking-tight">ViewSync</span>
        </div>
        <div className="text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
          Parental Shield
        </div>
      </div>

      {/* Center Hero Area with Character Illustration and Swipe Gestures */}
      <div
        className="my-auto py-3 flex flex-col items-center text-center touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Interactive Illustration Box */}
        <div
          className={`relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-200 ${
            Math.abs(touchDeltaX) > 10 ? 'scale-[0.98]' : ''
          }`}
          style={{
            transform: touchDeltaX !== 0 ? `translateX(${touchDeltaX * 0.25}px)` : undefined,
          }}
          title="Swipe left or right to explore ViewSync features"
        >
          {/* Background Soft Blobs */}
          <div className="absolute inset-0 bg-blue-100/60 rounded-full blur-2xl transform scale-90" />

          {/* Left / Right mini navigation buttons on hover */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevSlide();
            }}
            className="absolute -left-2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-blue-600 transition opacity-80 hover:opacity-100"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNextSlide();
            }}
            className="absolute -right-2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-blue-600 transition opacity-80 hover:opacity-100"
            aria-label="Next slide"
          >
            ›
          </button>

          {/* Slide 0: Boy character with headphones, phone, camera, binoculars */}
          {currentSlide === 0 && (
            <svg
              viewBox="0 0 320 320"
              className="w-full h-full relative z-10 drop-shadow-sm animate-in fade-in zoom-in-95 duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Soft decorative background cloud/oval */}
              <path
                d="M160 30C230 30 290 85 290 155C290 220 230 270 160 270C90 270 30 220 30 155C30 85 90 30 160 30Z"
                fill="#EBF3FE"
              />

              {/* Background bushes */}
              <path
                d="M50 250C50 225 70 205 95 205C105 205 114 209 120 215C126 200 142 190 160 190C178 190 194 200 200 215C206 209 215 205 225 205C250 205 270 225 270 250L50 250Z"
                fill="#4ADE80"
                opacity="0.35"
              />
              <path
                d="M70 255C70 235 88 220 108 220C118 220 128 224 135 230C142 222 152 216 165 216C178 216 188 222 195 230C202 224 212 220 222 220C242 220 260 235 260 255L70 255Z"
                fill="#22C55E"
                opacity="0.5"
              />

              {/* Sparkles / Stars */}
              <path
                d="M95 110L98 100L101 110L111 113L101 116L98 126L95 116L85 113L95 110Z"
                fill="#F472B6"
              />
              <path
                d="M235 95L237 87L239 95L247 97L239 99L237 107L235 99L227 97L235 95Z"
                fill="#F472B6"
                opacity="0.8"
              />

              {/* Floating Camera icon (Top Left) */}
              <g transform="translate(48, 110) rotate(-12)">
                <rect x="0" y="8" width="46" height="34" rx="10" fill="#3B82F6" />
                <rect x="14" y="2" width="18" height="8" rx="3" fill="#60A5FA" />
                <circle cx="23" cy="25" r="11" fill="#FBBF24" />
                <circle cx="23" cy="25" r="7" fill="#1E3A8A" />
                <circle cx="36" cy="16" r="3" fill="#F87171" />
              </g>

              {/* Floating Headphones icon (Top Center) */}
              <g transform="translate(130, 26) rotate(6)">
                <path
                  d="M10 38C10 18 24 6 44 6C64 6 78 18 78 38"
                  stroke="#10B981"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <rect x="3" y="32" width="14" height="22" rx="7" fill="#3B82F6" />
                <rect x="7" y="36" width="6" height="14" rx="3" fill="#FBBF24" />
                <rect x="71" y="32" width="14" height="22" rx="7" fill="#3B82F6" />
                <rect x="75" y="36" width="6" height="14" rx="3" fill="#FBBF24" />
              </g>

              {/* Floating Binoculars icon (Top Right) */}
              <g transform="translate(230, 112) rotate(15)">
                <rect x="0" y="8" width="16" height="28" rx="8" fill="#FBBF24" />
                <circle cx="8" cy="30" r="10" fill="#3B82F6" />
                <circle cx="8" cy="30" r="5" fill="#1E3A8A" />
                <rect x="22" y="8" width="16" height="28" rx="8" fill="#FBBF24" />
                <circle cx="30" cy="30" r="10" fill="#3B82F6" />
                <circle cx="30" cy="30" r="5" fill="#1E3A8A" />
                <rect x="14" y="16" width="10" height="6" rx="2" fill="#64748B" />
              </g>

              {/* Boy Character */}
              <g id="boy">
                <path
                  d="M90 270C90 225 115 205 160 205C205 205 230 225 230 270L90 270Z"
                  fill="#3B82F6"
                />
                <path
                  d="M130 215C138 235 152 245 160 245C168 245 182 235 190 215C180 210 160 206 130 215Z"
                  fill="#22C55E"
                />
                <line x1="148" y1="225" x2="148" y2="255" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <line x1="172" y1="225" x2="172" y2="255" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <rect x="145" y="185" width="30" height="25" rx="6" fill="#FBCFE8" />
                <circle cx="160" cy="155" r="36" fill="#FED7AA" />
                <circle cx="123" cy="155" r="9" fill="#FED7AA" />
                <circle cx="197" cy="155" r="9" fill="#FED7AA" />
                <path
                  d="M125 150C120 140 125 125 135 120C140 110 155 105 165 108C175 105 190 110 195 120C202 125 206 138 200 150C192 135 185 130 170 130C155 130 140 135 125 150Z"
                  fill="#EA580C"
                />
                <circle cx="132" cy="128" r="11" fill="#EA580C" />
                <circle cx="148" cy="118" r="13" fill="#EA580C" />
                <circle cx="168" cy="116" r="14" fill="#EA580C" />
                <circle cx="188" cy="125" r="11" fill="#EA580C" />
                <circle cx="158" cy="132" r="10" fill="#EA580C" />
                <path d="M142 144C145 142 150 142 153 144" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M167 144C170 142 175 142 178 144" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="147" cy="152" r="5" fill="#1E293B" />
                <circle cx="148.5" cy="150.5" r="1.5" fill="white" />
                <circle cx="173" cy="152" r="5" fill="#1E293B" />
                <circle cx="174.5" cy="150.5" r="1.5" fill="white" />
                <path d="M160 157C161 160 162 161 160 163" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
                <circle cx="138" cy="162" r="6" fill="#F472B6" opacity="0.4" />
                <circle cx="182" cy="162" r="6" fill="#F472B6" opacity="0.4" />
                <path
                  d="M152 167C155 172 165 172 168 167"
                  stroke="#1E293B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <g transform="translate(138, 205)">
                  <rect x="0" y="0" width="44" height="65" rx="8" fill="#1E293B" />
                  <rect x="2" y="3" width="40" height="59" rx="6" fill="#60A5FA" />
                  <circle cx="22" cy="22" r="10" fill="white" opacity="0.9" />
                  <rect x="10" y="38" width="24" height="4" rx="2" fill="white" opacity="0.8" />
                  <rect x="14" y="46" width="16" height="3" rx="1.5" fill="white" opacity="0.6" />
                </g>
                <circle cx="134" cy="235" r="10" fill="#FED7AA" />
                <rect x="130" y="228" width="14" height="12" rx="5" fill="#FED7AA" />
                <circle cx="186" cy="235" r="10" fill="#FED7AA" />
                <rect x="176" y="228" width="14" height="12" rx="5" fill="#FED7AA" />
                <path d="M110 250C115 238 126 230 135 238L126 265Z" fill="#2563EB" />
                <path d="M210 250C205 238 194 230 185 238L194 265Z" fill="#2563EB" />
              </g>
            </svg>
          )}

          {/* Slide 1: Real-Time Screen & App Activity */}
          {currentSlide === 1 && (
            <svg
              viewBox="0 0 320 320"
              className="w-full h-full relative z-10 drop-shadow-sm animate-in fade-in zoom-in-95 duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="160" cy="160" r="120" fill="#EFF6FF" />
              <circle cx="160" cy="160" r="95" fill="#DBEAFE" opacity="0.6" />

              {/* Smartphone mockup showing live mirrored screen */}
              <g transform="translate(100, 50)">
                <rect x="0" y="0" width="120" height="210" rx="22" fill="#1E293B" />
                <rect x="4" y="4" width="112" height="202" rx="18" fill="#F8FAFC" />
                {/* Speaker pill notch */}
                <rect x="45" y="10" width="30" height="5" rx="2.5" fill="#CBD5E1" />

                {/* Simulated live app UI */}
                <rect x="12" y="26" width="96" height="50" rx="10" fill="#3B82F6" />
                <circle cx="34" cy="51" r="14" fill="#FFFFFF" opacity="0.9" />
                <path d="M31 44L41 51L31 58V44Z" fill="#2563EB" />
                <rect x="56" y="42" width="42" height="6" rx="3" fill="#FFFFFF" />
                <rect x="56" y="54" width="28" height="5" rx="2.5" fill="#BFDBFE" />

                {/* App grid icons on child screen */}
                <g transform="translate(14, 88)">
                  {/* YouTube style */}
                  <rect x="0" y="0" width="26" height="26" rx="8" fill="#EF4444" />
                  <polygon points="10,8 19,13 10,18" fill="white" />

                  {/* Chat style */}
                  <rect x="33" y="0" width="26" height="26" rx="8" fill="#10B981" />
                  <circle cx="46" cy="13" r="6" fill="white" />

                  {/* Gamepad style */}
                  <rect x="66" y="0" width="26" height="26" rx="8" fill="#8B5CF6" />
                  <path d="M74 13H84M79 8V18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Browser */}
                  <rect x="0" y="34" width="26" height="26" rx="8" fill="#3B82F6" />
                  <circle cx="13" cy="47" r="7" stroke="white" strokeWidth="2" />

                  {/* Music */}
                  <rect x="33" y="34" width="26" height="26" rx="8" fill="#EC4899" />
                  <path d="M43 42V52M43 45H51V51" stroke="white" strokeWidth="2" strokeLinecap="round" />

                  {/* Photos */}
                  <rect x="66" y="34" width="26" height="26" rx="8" fill="#F59E0B" />
                  <circle cx="79" cy="47" r="5" fill="white" />
                </g>

                {/* Bottom Screen Time bar */}
                <rect x="14" y="162" width="92" height="26" rx="8" fill="#E2E8F0" />
                <text x="24" y="179" fontSize="11" fontWeight="bold" fill="#334155">
                  Live: 1h 42m
                </text>
              </g>

              {/* Floating Shield Badge */}
              <g transform="translate(40, 110)">
                <circle cx="28" cy="28" r="28" fill="#22C55E" opacity="0.15" />
                <circle cx="28" cy="28" r="22" fill="#22C55E" />
                <path d="M28 14L37 18V26C37 32 33 37 28 39C23 37 19 32 19 26V18L28 14Z" fill="white" />
              </g>

              {/* Floating Live Indicator Pill */}
              <g transform="translate(205, 95)">
                <rect x="0" y="0" width="75" height="28" rx="14" fill="#EF4444" />
                <circle cx="14" cy="14" r="5" fill="white" className="animate-pulse" />
                <text x="26" y="18" fill="white" fontSize="11" fontWeight="bold">
                  LIVE
                </text>
              </g>
            </svg>
          )}

          {/* Slide 2: Surrounding Sound & Whisper Boost */}
          {currentSlide === 2 && (
            <svg
              viewBox="0 0 320 320"
              className="w-full h-full relative z-10 drop-shadow-sm animate-in fade-in zoom-in-95 duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="160" cy="160" r="120" fill="#F0FDF4" />
              <circle cx="160" cy="160" r="90" fill="#DCFCE7" opacity="0.7" />

              {/* Big Acoustic Sound Wave Rings */}
              <circle cx="160" cy="155" r="70" stroke="#10B981" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.4" />
              <circle cx="160" cy="155" r="95" stroke="#10B981" strokeWidth="2" strokeDasharray="4 8" opacity="0.25" />

              {/* Giant Pro Audio Headphones */}
              <g transform="translate(85, 75)">
                {/* Headband */}
                <path
                  d="M15 90C15 35 45 10 75 10C105 10 135 35 135 90"
                  stroke="#1E293B"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M15 90C15 35 45 10 75 10C105 10 135 35 135 90"
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Left Earcup */}
                <rect x="0" y="75" width="28" height="52" rx="14" fill="#1E293B" />
                <rect x="4" y="80" width="20" height="42" rx="10" fill="#10B981" />
                <circle cx="14" cy="101" r="5" fill="#FEF08A" />

                {/* Right Earcup */}
                <rect x="122" y="75" width="28" height="52" rx="14" fill="#1E293B" />
                <rect x="126" y="80" width="20" height="42" rx="10" fill="#10B981" />
                <circle cx="136" cy="101" r="5" fill="#FEF08A" />

                {/* Sound wave Equalizer in Center */}
                <g transform="translate(42, 70)">
                  <rect x="0" y="25" width="6" height="25" rx="3" fill="#3B82F6" />
                  <rect x="10" y="12" width="6" height="38" rx="3" fill="#10B981" />
                  <rect x="20" y="5" width="6" height="45" rx="3" fill="#F59E0B" />
                  <rect x="30" y="16" width="6" height="34" rx="3" fill="#8B5CF6" />
                  <rect x="40" y="8" width="6" height="42" rx="3" fill="#EF4444" />
                  <rect x="50" y="20" width="6" height="30" rx="3" fill="#10B981" />
                  <rect x="60" y="28" width="6" height="22" rx="3" fill="#3B82F6" />
                </g>
              </g>

              {/* Floating 300% Whisper Boost Badge */}
              <g transform="translate(190, 65)">
                <rect x="0" y="0" width="95" height="30" rx="15" fill="#10B981" />
                <text x="10" y="19" fill="white" fontSize="11" fontWeight="bold">
                  ⚡ 300% Boost
                </text>
              </g>

              {/* Ambient Sound text badge */}
              <g transform="translate(40, 205)">
                <rect x="0" y="0" width="105" height="28" rx="14" fill="#1E293B" />
                <text x="14" y="18" fill="#A7F3D0" fontSize="10.5" fontWeight="bold">
                  🎙️ Room Audio
                </text>
              </g>
            </svg>
          )}

          {/* Slide 3: Live Location & Safe Geofencing */}
          {currentSlide === 3 && (
            <svg
              viewBox="0 0 320 320"
              className="w-full h-full relative z-10 drop-shadow-sm animate-in fade-in zoom-in-95 duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="160" cy="160" r="120" fill="#FEF3C7" opacity="0.7" />
              <circle cx="160" cy="160" r="95" fill="#FFFBEB" />

              {/* Map Canvas Background */}
              <g transform="translate(50, 60)">
                <rect x="0" y="0" width="220" height="170" rx="20" fill="#E2E8F0" />

                {/* Roads and paths */}
                <path d="M0 60 Q 60 70 120 40 T 220 80" stroke="#CBD5E1" strokeWidth="18" fill="none" />
                <path d="M120 0 V 170" stroke="#CBD5E1" strokeWidth="16" fill="none" />
                <path d="M0 130 H 220" stroke="#CBD5E1" strokeWidth="14" fill="none" />

                {/* Safe Geofence Ring (Home Zone) */}
                <circle cx="120" cy="85" r="45" fill="#10B981" opacity="0.2" />
                <circle cx="120" cy="85" r="45" stroke="#10B981" strokeWidth="2" strokeDasharray="5 5" />

                {/* Navigation Track / Breadcrumb Dots */}
                <circle cx="45" cy="62" r="5" fill="#3B82F6" />
                <circle cx="75" cy="67" r="5" fill="#3B82F6" />
                <circle cx="100" cy="55" r="5" fill="#3B82F6" />
                <line x1="45" y1="62" x2="100" y2="55" stroke="#3B82F6" strokeWidth="3" strokeDasharray="4 4" />

                {/* Big Pin on child position */}
                <g transform="translate(105, 55)">
                  <circle cx="15" cy="15" r="14" fill="#EF4444" />
                  <path d="M15 28L8 16H22L15 28Z" fill="#EF4444" />
                  <circle cx="15" cy="14" r="6" fill="white" />
                </g>

                {/* Safe Zone Tag */}
                <rect x="75" y="138" width="90" height="22" rx="11" fill="#10B981" />
                <text x="86" y="153" fill="white" fontSize="10" fontWeight="bold">
                  ✓ Safe at School
                </text>
              </g>

              {/* Floating Radar Ping */}
              <g transform="translate(210, 70)">
                <circle cx="20" cy="20" r="18" fill="#3B82F6" opacity="0.2" />
                <circle cx="20" cy="20" r="10" fill="#2563EB" />
                <text x="14" y="24" fill="white" fontSize="11" fontWeight="bold">
                  📍
                </text>
              </g>
            </svg>
          )}

          {/* Slide 4: Screen Time & Instant App Lock */}
          {currentSlide === 4 && (
            <svg
              viewBox="0 0 320 320"
              className="w-full h-full relative z-10 drop-shadow-sm animate-in fade-in zoom-in-95 duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="160" cy="160" r="120" fill="#F5F3FF" />
              <circle cx="160" cy="160" r="95" fill="#EDE9FE" opacity="0.6" />

              {/* 3D Hourglass Vector */}
              <g transform="translate(110, 60)">
                {/* Top / Bottom Wooden Bars */}
                <rect x="10" y="0" width="80" height="12" rx="6" fill="#7C3AED" />
                <rect x="10" y="160" width="80" height="12" rx="6" fill="#7C3AED" />

                {/* Glass Curves */}
                <path
                  d="M20 12C20 60 45 80 50 86C55 80 80 60 80 12H20Z"
                  fill="#DDD6FE"
                  opacity="0.6"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                />
                <path
                  d="M20 160C20 112 45 92 50 86C55 92 80 112 80 160H20Z"
                  fill="#DDD6FE"
                  opacity="0.6"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                />

                {/* Flowing Gold Sand */}
                <path d="M32 20C32 45 46 65 50 72C54 65 68 45 68 20H32Z" fill="#FBBF24" />
                <line x1="50" y1="72" x2="50" y2="130" stroke="#FBBF24" strokeWidth="3" strokeDasharray="3 3" />
                <path d="M30 156C30 142 42 130 50 130C58 130 70 142 70 156H30Z" fill="#FBBF24" />
              </g>

              {/* Big Shiny Lock Padlock */}
              <g transform="translate(180, 140)">
                {/* Shackle */}
                <path
                  d="M16 24V14C16 7 22 2 30 2C38 2 44 7 44 14V24"
                  stroke="#F59E0B"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Body */}
                <rect x="4" y="22" width="52" height="42" rx="12" fill="#3B82F6" />
                <circle cx="30" cy="40" r="6" fill="white" />
                <rect x="28" y="42" width="4" height="10" rx="2" fill="white" />
              </g>

              {/* Downtime Moon Badge */}
              <g transform="translate(50, 85)">
                <circle cx="22" cy="22" r="20" fill="#6366F1" />
                <path
                  d="M26 12C21 13 17 18 17 23C17 29 22 34 28 34C31 34 33 33 35 31C30 31 25 26 25 20C25 16 27 13 26 12Z"
                  fill="#FEF08A"
                />
              </g>

              {/* Instant Block Pill */}
              <g transform="translate(90, 240)">
                <rect x="0" y="0" width="140" height="28" rx="14" fill="#EF4444" />
                <text x="18" y="18" fill="white" fontSize="11" fontWeight="bold">
                  🔒 Instant Block Active
                </text>
              </g>
            </svg>
          )}
        </div>

        {/* Headline & Description with smooth slide key animation */}
        <div className="mt-2 min-h-[110px] flex flex-col justify-center transition-all duration-300">
          <h2 className="text-[22px] sm:text-[24px] font-extrabold text-slate-900 tracking-tight leading-snug px-2">
            {slides[currentSlide].title}
          </h2>
          <p className="mt-2 text-[13.5px] text-slate-500 font-normal leading-relaxed max-w-xs mx-auto px-1">
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Exactly 5 Carousel Pagination Dots matching user request */}
        <div className="flex items-center justify-center gap-2 mt-3 mb-2" role="tablist">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={currentSlide === idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}: ${slide.title}`}
              className={`transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-6 h-2 bg-blue-600 rounded-full shadow-xs'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400 rounded-full'
              }`}
            />
          ))}
        </div>

        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
          Swipe left or right to explore ({currentSlide + 1} of 5)
        </p>
      </div>

      {/* Bottom Actions Area */}
      <div className="space-y-4 pt-2 pb-2">
        {/* Two Main Auth Buttons matching Screenshot 1 */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Google Button */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-bold text-sm shadow-sm transition active:scale-[0.98]"
          >
            {/* Google official 'G' SVG Logo */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          {/* Sign up Button */}
          <button
            type="button"
            onClick={() => setShowEmailSignUpModal(true)}
            className="flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-bold text-sm shadow-sm transition active:scale-[0.98]"
          >
            <Mail className="w-5 h-5 text-slate-700 stroke-[2.2]" />
            <span>Sign up</span>
          </button>
        </div>

        {/* Terms of Service and Privacy Policy */}
        <p className="text-[11.5px] text-slate-500 text-center leading-normal px-2">
          By signing up, you agree to the{' '}
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="text-blue-600 hover:underline font-medium inline"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="text-blue-600 hover:underline font-medium inline"
          >
            Privacy Policy
          </button>
        </p>

        {/* Already have an account? Sign in */}
        <div className="text-center pt-1 pb-1">
          <span className="text-[13px] text-slate-600">
            Already have a ViewSync account?{' '}
          </span>
          <button
            type="button"
            onClick={onSignIn}
            className="text-[13px] text-blue-600 font-bold hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>

      {/* Google Account Selector Dialog */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="font-bold text-slate-800 text-sm">Choose Google Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-3 mb-4">
              To continue to ViewSync Parental Control, choose an account:
            </p>

            <div className="space-y-2.5">
              {/* Primary User Account from session */}
              <button
                type="button"
                onClick={() => {
                  onContinueWithGoogle('badmashbcha0@gmail.com', 'Badmash Bcha');
                  setShowGoogleModal(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  B
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 truncate">
                    Badmash Bcha
                  </p>
                  <p className="text-xs text-slate-500 truncate">badmashbcha0@gmail.com</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </button>

              {/* Alternate Demo Account */}
              <button
                type="button"
                onClick={() => {
                  onContinueWithGoogle('parent.guardian@gmail.com', 'Parent Guardian');
                  setShowGoogleModal(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  P
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 truncate">
                    Parent Guardian
                  </p>
                  <p className="text-xs text-slate-500 truncate">parent.guardian@gmail.com</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-500" /> Secure 256-bit OAuth
              </span>
              <button
                type="button"
                onClick={() => {
                  onContinueWithGoogle('user@google.com', 'Google User');
                  setShowGoogleModal(false);
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                Add another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Sign-up Modal */}
      {showEmailSignUpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Create an Account</h3>
              <button
                type="button"
                onClick={() => setShowEmailSignUpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSignUpWithEmail(customEmail || 'parent@viewsync.app');
                setShowEmailSignUpModal(false);
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition mt-2"
              >
                Sign up & Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Terms & Privacy Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 sticky top-0 bg-white">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-base">Terms & Privacy Policy</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 text-xs text-slate-600 space-y-3 leading-relaxed">
              <p className="font-semibold text-slate-800">
                1. Consensual Parental Supervision
              </p>
              <p>
                ViewSync Parental Control is designed specifically for parents and legal guardians
                to ensure the safety and digital well-being of their children. All screen sharing,
                camera access, ambient audio monitoring, and location services require explicit
                in-app consent and browser permission prompts on the monitored device.
              </p>

              <p className="font-semibold text-slate-800">
                2. Privacy & Peer-to-Peer Encryption
              </p>
              <p>
                Audio, video, and screen data are transmitted directly between the connected devices
                using encrypted WebRTC streams. No live video or audio is stored on public servers
                without parental consent.
              </p>

              <p className="font-semibold text-slate-800">
                3. One-by-One Permission Model
              </p>
              <p>
                Every hardware feature (Screen capture, Camera, Microphone, Geolocation, Battery
                telemetry) is governed by transparent per-feature switches that the child device
                confirms.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="w-full mt-5 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
