import React, { useState } from 'react';
import { X, Trophy, Dices, RotateCcw, Volume2, Sparkles } from 'lucide-react';

interface InteractiveLudoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWinReward?: (coins: number) => void;
}

export const InteractiveLudoModal: React.FC<InteractiveLudoModalProps> = ({
  isOpen,
  onClose,
  onWinReward,
}) => {
  const [diceValue, setDiceValue] = useState<number>(6);
  const [isRolling, setIsRolling] = useState(false);
  const [playerScore, setPlayerScore] = useState(24);
  const [botScore, setBotScore] = useState(18);
  const [turn, setTurn] = useState<'player' | 'bot'>('player');
  const [tokenPosition, setTokenPosition] = useState(6);
  const [gameMessage, setGameMessage] = useState('Roll the dice to move your Red Token!');
  const [won, setWon] = useState(false);

  if (!isOpen) return null;

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    let rollCount = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount > 8) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalRoll);
        setIsRolling(false);

        // Player turn move
        if (turn === 'player') {
          const nextPos = tokenPosition + finalRoll;
          if (nextPos >= 28) {
            setWon(true);
            setGameMessage('🎉 You reached the Home triangle! YOU WON 50 COINS!');
            if (onWinReward) onWinReward(50);
          } else {
            setTokenPosition(nextPos);
            setPlayerScore((prev) => prev + finalRoll * 5);
            setGameMessage(`You rolled ${finalRoll}! Token advanced.`);

            // Bot turn after short delay
            setTimeout(() => {
              setTurn('bot');
              simulateBotTurn();
            }, 900);
          }
        }
      }
    }, 80);
  };

  const simulateBotTurn = () => {
    const botRoll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(botRoll);
    setBotScore((prev) => prev + botRoll * 4);
    setGameMessage(`Bot rolled ${botRoll}! Your turn now.`);
    setTurn('player');
  };

  const resetGame = () => {
    setTokenPosition(0);
    setPlayerScore(0);
    setBotScore(0);
    setWon(false);
    setTurn('player');
    setGameMessage('Game reset! Roll the dice to start.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-[#1b174a] via-[#141238] to-[#0c0a24] rounded-3xl w-full max-w-md p-5 border border-indigo-500/40 shadow-2xl text-white relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-indigo-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Dices className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>Ludo Classic</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Live Play
                </span>
              </h3>
              <p className="text-xs text-indigo-300/80">Roll 6 to open tokens & reach home!</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Board Simulation */}
        <div className="my-4 relative bg-[#0e0c24] rounded-2xl p-3 border border-indigo-500/20">
          {/* Ludo 4 Quadrants layout */}
          <div className="aspect-square w-full max-w-[280px] mx-auto grid grid-cols-3 grid-rows-3 gap-1 rounded-xl bg-slate-900/90 p-1.5 border border-slate-700/60 shadow-inner">
            {/* Red Base (Player) */}
            <div className="bg-rose-600/90 rounded-lg p-2 flex flex-col items-center justify-center relative border border-rose-400/40">
              <div className="w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-rose-600 font-black text-xs">
                🔴
              </div>
              <span className="text-[10px] font-bold text-white mt-1">You</span>
            </div>

            {/* Top track */}
            <div className="bg-slate-800/80 rounded-lg flex flex-col justify-around items-center p-1">
              <div className="w-4 h-4 rounded-full bg-emerald-500/30 border border-emerald-400/50" />
              <div className="w-4 h-4 rounded-full bg-emerald-500/60" />
              <div className="w-4 h-4 rounded-full bg-emerald-500/30 border border-emerald-400/50" />
            </div>

            {/* Green Base (Bot 1) */}
            <div className="bg-emerald-600/90 rounded-lg p-2 flex flex-col items-center justify-center relative border border-emerald-400/40">
              <div className="w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-emerald-600 font-black text-xs">
                🟢
              </div>
              <span className="text-[10px] font-bold text-white mt-1">Bot 1</span>
            </div>

            {/* Left track */}
            <div className="bg-slate-800/80 rounded-lg flex justify-around items-center p-1">
              <div className="w-4 h-4 rounded-full bg-rose-500/60" />
              <div className="w-4 h-4 rounded-full bg-rose-500/30 border border-rose-400/50" />
            </div>

            {/* Center Home Triangle */}
            <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 rounded-lg flex flex-col items-center justify-center shadow-md relative overflow-hidden border border-white/20">
              <Trophy className="w-6 h-6 text-amber-300 drop-shadow animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-wider text-white">HOME</span>
            </div>

            {/* Right track */}
            <div className="bg-slate-800/80 rounded-lg flex justify-around items-center p-1">
              <div className="w-4 h-4 rounded-full bg-amber-500/60" />
              <div className="w-4 h-4 rounded-full bg-amber-500/30 border border-amber-400/50" />
            </div>

            {/* Blue Base (Bot 2) */}
            <div className="bg-blue-600/90 rounded-lg p-2 flex flex-col items-center justify-center relative border border-blue-400/40">
              <div className="w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-blue-600 font-black text-xs">
                🔵
              </div>
              <span className="text-[10px] font-bold text-white mt-1">Bot 2</span>
            </div>

            {/* Bottom track */}
            <div className="bg-slate-800/80 rounded-lg flex flex-col justify-around items-center p-1">
              <div className="w-4 h-4 rounded-full bg-blue-500/30 border border-blue-400/50" />
              <div className="w-4 h-4 rounded-full bg-blue-500/60" />
            </div>

            {/* Yellow Base (Bot 3) */}
            <div className="bg-amber-500/90 rounded-lg p-2 flex flex-col items-center justify-center relative border border-amber-300/40">
              <div className="w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-amber-600 font-black text-xs">
                🟡
              </div>
              <span className="text-[10px] font-bold text-white mt-1">Bot 3</span>
            </div>
          </div>

          {/* Player Token Progress Bar towards Home */}
          <div className="mt-3 bg-slate-900/80 p-2.5 rounded-xl border border-indigo-500/20">
            <div className="flex items-center justify-between text-xs text-indigo-200 mb-1">
              <span className="font-bold flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Red Token Progress
              </span>
              <span className="font-mono font-bold text-amber-300">{tokenPosition} / 28 steps</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (tokenPosition / 28) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Message Banner */}
        <div className="text-center py-1.5 px-3 rounded-xl bg-indigo-950/60 border border-indigo-800/50 text-xs font-medium text-indigo-200 min-h-[34px] flex items-center justify-center">
          {gameMessage}
        </div>

        {/* Dice & Roll Action */}
        <div className="flex items-center justify-between gap-4 mt-4 pt-2">
          {/* Dice Display */}
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center border-2 border-indigo-300 transition transform ${
                isRolling ? 'rotate-180 scale-105' : 'hover:scale-105'
              }`}
            >
              <span className="text-3xl font-black text-slate-900 font-mono">
                {diceValue}
              </span>
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                {turn === 'player' ? 'Your Roll' : 'Opponent'}
              </p>
              <p className="text-sm font-extrabold text-amber-300">
                Score: {playerScore}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetGame}
              title="Reset"
              className="p-3 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={rollDice}
              disabled={isRolling || turn !== 'player'}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Dices className="w-5 h-5 text-slate-950" />
              <span>{isRolling ? 'Rolling...' : 'ROLL DICE'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
