import React, { useState } from 'react';
import {
  MoreVertical,
  ChevronRight,
  Shield,
  KeyRound,
  HelpCircle,
  LogOut,
  QrCode,
  Copy,
  Check,
  Smartphone,
  CheckCircle2,
  X,
} from 'lucide-react';
import { UserRole } from '../types';

interface DeviceRoleSelectionScreenProps {
  userEmail?: string;
  userName?: string;
  roomId: string;
  onSelectRole: (role: UserRole) => void;
  onSignOut: () => void;
}

export const DeviceRoleSelectionScreen: React.FC<DeviceRoleSelectionScreenProps> = ({
  userEmail = 'badmashbcha0@gmail.com',
  userName = 'Badmash Bcha',
  roomId,
  onSelectRole,
  onSignOut,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showBindingModal, setShowBindingModal] = useState(false);
  const [showEnterBindingCodeModal, setShowEnterBindingCodeModal] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Formatted numeric binding code for easy child device pairing
  const numericBindingCode = '842 195 304';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`${roomId} (${numericBindingCode})`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8faff] to-[#edf4fc] text-slate-800 flex flex-col justify-between max-w-md mx-auto relative px-6 py-6 select-none shadow-2xl rounded-none sm:rounded-3xl border sm:border-slate-200/80 my-0 sm:my-6 overflow-hidden">
      {/* Top Header with 3-dot overflow menu */}
      <div className="flex items-center justify-between pt-1 relative">
        <div className="flex items-center gap-2">
          <img
            src="/assets/aistudio/file_00000000da108211b0e62540220f79da_6786b4ce.png"
            alt="ViewSync"
            className="w-7 h-7 rounded-lg object-cover shadow-xs"
          />
          <span className="text-xs font-bold text-slate-500">ViewSync</span>
        </div>

        {/* 3-dots Menu Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="More options"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition"
          >
            <MoreVertical className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-10 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-800 truncate">{userName}</p>
                <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowBindingModal(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition text-left"
              >
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>View Binding Code</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowEnterBindingCodeModal(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition text-left"
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Pair with Code</span>
              </button>

              <div className="h-px bg-slate-100 my-1" />

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onSignOut();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out / Switch</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Role Selection Content */}
      <div className="flex-1 flex flex-col justify-center py-6">
        {/* Screen Title matching Screenshot 2 */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center tracking-tight mb-8">
          Whose device is this?
        </h1>

        <div className="space-y-10 sm:space-y-12 max-w-sm mx-auto w-full">
          {/* Card 1: "Mine" (Parent / Supervisor Mode) */}
          <div
            onClick={() => onSelectRole('viewer')}
            role="button"
            tabIndex={0}
            className="group relative bg-[#f2f6fc] hover:bg-[#eaf1fb] border border-slate-200/80 hover:border-blue-400 rounded-3xl p-6 pt-11 text-center transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer active:scale-[0.99]"
          >
            {/* Top Overlapping Avatar: Mom & Dad Illustration matching Screenshot 2 */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-[#fce8d5] p-1 border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                {/* Background pastel cream */}
                <circle cx="50" cy="50" r="48" fill="#FCE8D5" />

                {/* Sparkle star */}
                <path d="M56 12L58 7L60 12L65 14L60 16L58 21L56 16L51 14L56 12Z" fill="#F472B6" />
                <path d="M12 60L13 56L14 60L18 61L14 62L13 66L12 62L8 61L12 60Z" fill="#FBBF24" />

                {/* Father on left */}
                {/* Blue Shirt */}
                <path d="M10 95C10 78 22 72 38 72C50 72 58 78 58 95L10 95Z" fill="#3B82F6" />
                <circle cx="36" cy="52" r="16" fill="#FDE68A" />
                {/* Brown hair & beard */}
                <path
                  d="M20 48C20 36 28 32 38 32C48 32 54 38 54 48C48 42 42 42 38 42C32 42 26 44 20 48Z"
                  fill="#92400E"
                />
                <circle cx="27" cy="40" r="6" fill="#92400E" />
                <circle cx="36" cy="35" r="7" fill="#92400E" />
                {/* Beard */}
                <path
                  d="M24 55C24 64 32 70 38 70C44 70 48 65 48 57C44 60 40 60 38 60C34 60 28 58 24 55Z"
                  fill="#92400E"
                />
                {/* Father Eyes & Smile */}
                <circle cx="32" cy="50" r="2" fill="#1E293B" />
                <circle cx="42" cy="50" r="2" fill="#1E293B" />
                <path d="M34 56C36 58 40 58 42 56" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />

                {/* Mother on right */}
                {/* Green Top */}
                <path d="M48 95C48 76 60 70 76 70C90 70 98 76 98 95L48 95Z" fill="#10B981" />
                {/* Neck */}
                <rect x="62" y="62" width="10" height="12" fill="#FBCFE8" rx="3" />
                {/* Face */}
                <circle cx="66" cy="50" r="15" fill="#FBCFE8" />
                {/* Long wavy brown hair */}
                <path
                  d="M52 46C52 32 62 28 72 28C84 28 92 36 92 50C92 68 86 78 86 78C82 66 84 54 82 46C76 40 68 40 60 44C56 50 54 62 50 68C52 60 52 52 52 46Z"
                  fill="#78350F"
                />
                {/* Hoop earring */}
                <circle cx="82" cy="56" r="3.5" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                {/* Mother Eyes & Smile */}
                <circle cx="62" cy="48" r="2" fill="#1E293B" />
                <circle cx="72" cy="48" r="2" fill="#1E293B" />
                <path d="M63 56C66 60 72 60 74 56" stroke="#BE185D" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Title & Chevron */}
            <div className="flex items-center justify-center gap-1.5 text-lg sm:text-xl font-bold text-slate-800 group-hover:text-blue-600 transition">
              <span>Mine</span>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
            </div>

            {/* Subtitle with bold emphasis matching screenshot */}
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              I want to <span className="font-extrabold text-slate-800">monitor</span> others from this device
            </p>
          </div>

          {/* Card 2: "My Child's" (Monitored / Host Mode) */}
          <div
            onClick={() => onSelectRole('host')}
            role="button"
            tabIndex={0}
            className="group relative bg-[#f2f6fc] hover:bg-[#eaf1fb] border border-slate-200/80 hover:border-blue-400 rounded-3xl p-6 pt-11 text-center transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer active:scale-[0.99]"
          >
            {/* Top Overlapping Avatar: Sister & Brother Kids Illustration matching Screenshot 2 */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-[#e0f2fe] p-1 border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                {/* Background pastel sky blue */}
                <circle cx="50" cy="50" r="48" fill="#E0F2FE" />

                {/* Sparkle star */}
                <path d="M68 12L69 8L71 12L75 13L71 14L69 18L68 14L64 13L68 12Z" fill="#3B82F6" />

                {/* Blonde girl on left */}
                {/* Blue Dress */}
                <path d="M12 95C12 78 24 72 40 72C52 72 58 78 58 95L12 95Z" fill="#60A5FA" />
                {/* White collar & pink bow */}
                <path d="M32 72L40 78L48 72Z" fill="white" />
                <path d="M37 78C35 76 34 74 36 73C38 72 40 74 40 76C40 74 42 72 44 73C46 74 45 76 43 78L40 79L37 78Z" fill="#EC4899" />
                {/* Face */}
                <circle cx="36" cy="50" r="14" fill="#FED7AA" />
                {/* Blonde Hair */}
                <path
                  d="M20 46C20 32 28 26 38 26C48 26 56 32 56 46C56 56 50 64 50 64C48 54 50 42 46 36C42 32 32 32 26 38C24 44 24 54 22 62C22 62 20 54 20 46Z"
                  fill="#FBBF24"
                />
                <circle cx="28" cy="30" r="6" fill="#FBBF24" />
                <circle cx="44" cy="30" r="6" fill="#FBBF24" />
                {/* Girl eyes & smile */}
                <circle cx="32" cy="48" r="1.8" fill="#1E293B" />
                <circle cx="40" cy="48" r="1.8" fill="#1E293B" />
                <path d="M33 54C35 57 39 57 41 54" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />

                {/* Cheerful boy on right */}
                {/* Blue Hoodie */}
                <path d="M46 95C46 78 56 70 74 70C88 70 96 78 96 95L46 95Z" fill="#3B82F6" />
                {/* Face */}
                <circle cx="68" cy="52" r="15" fill="#D97706" />
                {/* Curly brown/dark hair */}
                <path
                  d="M52 46C52 34 60 28 72 28C84 28 88 34 88 46C84 40 78 40 72 40C66 40 58 42 52 46Z"
                  fill="#451A03"
                />
                <circle cx="58" cy="34" r="5" fill="#451A03" />
                <circle cx="68" cy="30" r="6" fill="#451A03" />
                <circle cx="78" cy="32" r="5" fill="#451A03" />
                {/* Boy eyes & big smile with teeth */}
                <circle cx="63" cy="50" r="2" fill="#1E293B" />
                <circle cx="73" cy="50" r="2" fill="#1E293B" />
                <path
                  d="M62 56C64 62 72 62 74 56Z"
                  fill="white"
                  stroke="#451A03"
                  strokeWidth="1.2"
                />
              </svg>
            </div>

            {/* Title & Chevron */}
            <div className="flex items-center justify-center gap-1.5 text-lg sm:text-xl font-bold text-slate-800 group-hover:text-blue-600 transition">
              <span>My Child's</span>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
            </div>

            {/* Subtitle with bold emphasis matching screenshot */}
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              This device will <span className="font-extrabold text-slate-800">be monitored</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Link matching Screenshot 2 */}
      <div className="text-center pt-4 pb-2">
        <p className="text-[12.5px] text-slate-600">
          Already installed ViewSync Kids?{' '}
          <button
            type="button"
            onClick={() => setShowBindingModal(true)}
            className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
          >
            View the binding code
          </button>
        </p>
      </div>

      {/* View Binding Code Modal */}
      {showBindingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">Device Binding Code</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBindingModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-3 mb-4">
              Enter this 9-digit code on the child's device or supervisor device to bind instantly:
            </p>

            {/* Big 9-digit Binding Code */}
            <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200">
              <span className="font-mono text-2xl font-black tracking-widest text-blue-700">
                {numericBindingCode}
              </span>
              <p className="text-[11px] text-blue-600/80 font-medium mt-1">
                Room ID: {roomId}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                type="button"
                onClick={handleCopyCode}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowBindingModal(false);
                  onSelectRole('viewer');
                }}
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
              >
                Proceed as Parent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enter Binding Code Modal */}
      {showEnterBindingCodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Enter Child's Binding Code</h3>
              <button
                type="button"
                onClick={() => setShowEnterBindingCodeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-3 mb-3">
              Open ViewSync Kids on your child's phone and enter the code shown on their screen.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowEnterBindingCodeModal(false);
                onSelectRole('viewer');
              }}
              className="space-y-3"
            >
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="e.g. 842 195 304 or VS-9482"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-center font-mono font-bold tracking-wider text-base focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
              >
                Pair & Monitor Device
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
