import React, { useState } from 'react';
import {
  Smartphone,
  Shield,
  Heart,
  Plus,
  Home,
  User,
  MapPin,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface ParentFamilyTabProps {
  childDeviceName?: string;
  onNavigateTab: (tab: 'device' | 'location' | 'family' | 'my') => void;
  onSendAlertRing?: () => void;
}

export const ParentFamilyTab: React.FC<ParentFamilyTabProps> = ({
  childDeviceName = 'Realme RMX5313',
  onNavigateTab,
  onSendAlertRing,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const pairingCode = '842 195 304';

  const handleCopy = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendRing = () => {
    setAlertSent(true);
    onSendAlertRing?.();
    setTimeout(() => setAlertSent(false), 3000);
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen bg-[#f3f0fd] text-slate-800 flex flex-col justify-between overflow-hidden select-none sm:rounded-[36px] sm:border sm:border-slate-300 shadow-2xl">
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#2e62f5] to-[#6d51fa] text-white pt-4 pb-6 px-5 rounded-b-[28px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">Family Circle</span>
            <h1 className="text-xl font-extrabold text-white">Monitored Family</h1>
          </div>
          <button
            type="button"
            onClick={() => setShowAddChildModal(true)}
            className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Child</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-xs">
          {/* Active Child Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl">
                  🍇
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{childDeviceName}</h3>
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online &amp; Supervised
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl">
                Primary Child
              </span>
            </div>

            <div className="pt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-400 block">Battery Level</span>
                <span className="font-bold text-slate-800">36% (Normal)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-400 block">Screen Time Today</span>
                <span className="font-bold text-slate-800">2h 18m</span>
              </div>
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={handleSendRing}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow"
              >
                <span>{alertSent ? '🔔 Alert Chime Sent to Child!' : 'Ring Child Phone (Find Device)'}</span>
              </button>
            </div>
          </div>

          {/* Quick Binding Code */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
            <h4 className="font-bold text-slate-900 text-sm mb-1">Pair Additional Device</h4>
            <p className="text-slate-500 text-[11px] mb-3">
              Open ViewSync Kids on the target phone and enter this 9-digit pairing code:
            </p>

            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
              <span className="font-mono text-base font-black text-indigo-700 tracking-wider">
                {pairingCode}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] flex items-center gap-1 transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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
            <div className="w-14 h-7 rounded-full bg-[#dbeafe] flex items-center justify-center">
              <Home className="w-4 h-4 stroke-[2.4] text-[#2563eb]" />
            </div>
            <span className="text-[11px] font-bold text-[#2563eb]">Family</span>
          </button>

          <button onClick={() => onNavigateTab('my')} className="flex flex-col items-center justify-center gap-1 py-0.5">
            <div className="w-14 h-7 rounded-full flex items-center justify-center hover:bg-slate-100">
              <User className="w-4 h-4 stroke-[2.2] text-slate-400" />
            </div>
            <span className="text-[11px] font-bold text-slate-400">My</span>
          </button>
        </div>
      </div>
    </div>
  );
};
