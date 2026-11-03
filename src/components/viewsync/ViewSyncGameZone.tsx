import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Coins,
  Sparkles,
  Play,
  Flame,
  Calendar,
  Gamepad,
  Award,
} from 'lucide-react';
import { InteractiveLudoModal } from './InteractiveLudoModal';

interface ViewSyncGameZoneProps {
  onBack: () => void;
  coins?: number;
  onUpdateCoins?: (newCoins: number) => void;
  onTrackApp?: (appName: string, category: string, icon: string) => void;
}

export const ViewSyncGameZone: React.FC<ViewSyncGameZoneProps> = ({
  onBack,
  coins = 125,
  onUpdateCoins,
  onTrackApp,
}) => {
  const [currentCoins, setCurrentCoins] = useState(coins);
  const [isLudoOpen, setIsLudoOpen] = useState(false);
  const [activeGameAlert, setActiveGameAlert] = useState<string | null>(null);

  const handleWinCoins = (reward: number) => {
    const updated = currentCoins + reward;
    setCurrentCoins(updated);
    if (onUpdateCoins) onUpdateCoins(updated);
  };

  const handleLaunchGame = (gameTitle: string, emoji: string = '🎮') => {
    if (onTrackApp) {
      onTrackApp(gameTitle, 'Game Zone', emoji);
    }
    if (gameTitle === 'Ludo Classic' || gameTitle.includes('Ludo')) {
      setIsLudoOpen(true);
    } else {
      setActiveGameAlert(`Loading ${gameTitle}... Ready to play!`);
      setTimeout(() => setActiveGameAlert(null), 2500);
    }
  };

  const games = [
    {
      id: 'ludo',
      title: 'Ludo',
      subtitle: 'Classic',
      color: 'from-blue-600 via-indigo-600 to-rose-500',
      badge: 'POPULAR',
      emoji: '🎲',
      renderIcon: () => (
        <div className="w-12 h-12 rounded-2xl bg-white/20 p-2 flex items-center justify-center shadow-lg border border-white/30">
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect x="2" y="2" width="16" height="16" rx="4" fill="#EF4444" />
            <rect x="22" y="2" width="16" height="16" rx="4" fill="#10B981" />
            <rect x="2" y="22" width="16" height="16" rx="4" fill="#3B82F6" />
            <rect x="22" y="22" width="16" height="16" rx="4" fill="#F59E0B" />
            <circle cx="20" cy="20" r="5" fill="white" />
          </svg>
        </div>
      ),
    },
    {
      id: 'car_race',
      title: 'Car Race',
      subtitle: '3D',
      color: 'from-rose-600 via-red-500 to-amber-500',
      badge: 'HOT',
      emoji: '🏎️',
      renderIcon: () => (
        <div className="w-12 h-12 rounded-2xl bg-white/20 p-2 flex items-center justify-center shadow-lg border border-white/30">
          <span className="text-2xl">🏎️</span>
        </div>
      ),
    },
    {
      id: 'fruit_battery',
      title: 'Fruit',
      subtitle: 'Battery',
      color: 'from-amber-500 via-orange-500 to-yellow-400',
      emoji: '🍎',
      renderIcon: () => (
        <div className="w-12 h-12 rounded-2xl bg-white/20 p-2 flex items-center justify-center shadow-lg border border-white/30">
          <span className="text-2xl">🍊</span>
        </div>
      ),
    },
    {
      id: 'bubble_shooter',
      title: 'Bubble',
      subtitle: 'Shooter',
      color: 'from-purple-600 via-indigo-500 to-pink-500',
      emoji: '🔮',
      renderIcon: () => (
        <div className="w-12 h-12 rounded-2xl bg-white/20 p-2 flex items-center justify-center shadow-lg border border-white/30">
          <span className="text-2xl">🫧</span>
        </div>
      ),
    },
    {
      id: 'subway_runner',
      title: 'Subway',
      subtitle: 'Runner',
      color: 'from-blue-500 via-cyan-500 to-teal-400',
      badge: 'TOP',
      emoji: '🏃',
      renderIcon: () => (
        <div className="w-12 h-12 rounded-2xl bg-white/20 p-2 flex items-center justify-center shadow-lg border border-white/30">
          <span className="text-2xl">🛹</span>
        </div>
      ),
    },
    {
      id: 'stickman_fighter',
      title: 'Stickman',
      subtitle: 'Fighter',
      color: 'from-slate-800 via-indigo-950 to-blue-900',
      emoji: '⚔️',
      renderIcon: () => (
        <div className="w-12 h-12 rounded-2xl bg-white/20 p-2 flex items-center justify-center shadow-lg border border-white/30">
          <span className="text-2xl">🥷</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 select-none pb-4">
      {/* Top Bar with Coins */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition active:scale-95 text-xs font-bold"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-base font-extrabold tracking-tight">Game Zone</span>
        </button>

        {/* Coins Pill matching Mockup */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border border-amber-400/50 shadow-sm text-amber-300 font-extrabold text-sm">
          <span className="text-base">🪙</span>
          <span>{currentCoins}</span>
          <button
            type="button"
            onClick={() => handleWinCoins(25)}
            className="w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-xs font-black flex items-center justify-center ml-0.5 hover:scale-110 active:scale-95 transition"
            title="Earn Free Coins"
          >
            +
          </button>
        </div>
      </div>

      {/* Hero Banner: "Play & Earn Rewards!" with big golden trophy */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white shadow-xl shadow-indigo-950/50 border border-white/20 overflow-hidden">
        {/* Ambient star sparkles */}
        <div className="absolute top-2 right-12 w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
        <div className="absolute bottom-4 left-24 w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />

        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-2 max-w-[170px]">
            <h3 className="text-xl font-black tracking-tight leading-tight drop-shadow-md">
              Play &amp; Earn Rewards!
            </h3>
            <p className="text-[11px] text-indigo-100 font-medium">
              Win coins, climb leaderboards, and unlock game badges.
            </p>
            <button
              type="button"
              onClick={() => handleLaunchGame('Ludo Classic')}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs shadow-md shadow-amber-500/30 flex items-center gap-1.5 transition active:scale-95"
            >
              <span>Start Now</span>
              <Play className="w-3.5 h-3.5 fill-slate-950" />
            </button>
          </div>

          {/* 3D Golden Trophy Artwork matching mockup */}
          <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl" />
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
              {/* Pedestal */}
              <rect x="25" y="80" width="50" height="12" rx="4" fill="#B45309" />
              <rect x="30" y="74" width="40" height="8" rx="2" fill="#F59E0B" />
              {/* Trophy Cup */}
              <path
                d="M32 20H68V48C68 60 58 68 50 68C42 68 32 60 32 48V20Z"
                fill="url(#trophyGrad)"
              />
              {/* Trophy Handles */}
              <path
                d="M32 26C20 26 16 38 24 48C28 54 32 54 34 52"
                stroke="#FBBF24"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M68 26C80 26 84 38 76 48C72 54 68 54 66 52"
                stroke="#FBBF24"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Star on Cup */}
              <path
                d="M50 32L53 40L61 41L55 46L57 54L50 49L43 54L45 46L39 41L47 40L50 32Z"
                fill="#FEF08A"
              />
              <defs>
                <linearGradient id="trophyGrad" x1="32" y1="20" x2="68" y2="68" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FDE047" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {activeGameAlert && (
        <div className="p-3 rounded-2xl bg-emerald-500/90 text-white text-xs font-bold text-center shadow-lg animate-in fade-in zoom-in-95">
          {activeGameAlert}
        </div>
      )}

      {/* Popular Games Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-extrabold text-white tracking-tight">Popular Games</h3>
          <span className="text-xs font-bold text-indigo-300 hover:text-white cursor-pointer flex items-center gap-0.5">
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* 6 Games Grid matching the mockup */}
        <div className="grid grid-cols-3 gap-3">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => handleLaunchGame(`${game.title} ${game.subtitle}`, game.emoji)}
              role="button"
              tabIndex={0}
              className="group p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white flex flex-col items-center text-center cursor-pointer transition active:scale-95 shadow-md relative"
            >
              {game.badge && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-md bg-rose-500 text-white font-black text-[9px] shadow-sm uppercase tracking-wider">
                  {game.badge}
                </span>
              )}

              {/* Game Icon */}
              <div className="mb-1.5 transform group-hover:scale-105 transition">
                {game.renderIcon()}
              </div>

              {/* Game Title */}
              <span className="text-xs font-extrabold text-white leading-tight">
                {game.title}
              </span>
              <span className="text-[10px] text-indigo-200/80 font-medium">
                {game.subtitle}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Challenge Banner matching mockup */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-purple-900/60 border border-purple-500/30 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-300 flex items-center justify-center border border-pink-400/40">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black tracking-tight text-white">Daily Challenge</h4>
            <p className="text-[10px] text-indigo-200 flex items-center gap-1 font-medium">
              <span>Complete &amp; Win</span>
              <span className="text-amber-300 font-bold">50 Coins</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            handleWinCoins(50);
            setActiveGameAlert('🎉 Daily Challenge Completed! You earned 50 Coins!');
            setTimeout(() => setActiveGameAlert(null), 3000);
          }}
          className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs shadow-md transition active:scale-95"
        >
          Go &gt;
        </button>
      </div>

      {/* Interactive Ludo Modal */}
      <InteractiveLudoModal
        isOpen={isLudoOpen}
        onClose={() => setIsLudoOpen(false)}
        onWinReward={handleWinCoins}
      />
    </div>
  );
};
