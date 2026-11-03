import React, { useState } from 'react';
import {
  Smartphone,
  Home,
  Heart,
  ShieldCheck,
  AlertCircle,
  PhoneCall,
  MessageSquare,
  Clock,
  Battery,
  MapPin,
  CheckCircle,
  Send,
} from 'lucide-react';

interface ChildFamilyScreenProps {
  onBackToHome: () => void;
  guardianEmail?: string;
  deviceName?: string;
  realBatteryLevel?: number;
  screenTimeFormatted?: string;
  onSendSOS?: () => void;
}

export const ChildFamilyScreen: React.FC<ChildFamilyScreenProps> = ({
  onBackToHome,
  guardianEmail = 'badmashbcha1@gmail.com',
  deviceName = 'Realme RMX5313',
  realBatteryLevel = 21,
  screenTimeFormatted = '2h 18m',
  onSendSOS,
}) => {
  const [sosSent, setSosSent] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [sentNotes, setSentNotes] = useState<string[]>([]);

  const handleTriggerSOS = () => {
    setSosSent(true);
    onSendSOS?.();
    setTimeout(() => setSosSent(false), 4000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      setSentNotes((prev) => [...prev, chatMessage.trim()]);
      setChatMessage('');
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-[720px] bg-[#f8faff] text-slate-800 flex flex-col justify-between overflow-hidden shadow-2xl select-none sm:rounded-[36px] sm:border sm:border-slate-300">
      {/* Header */}
      <div className="bg-white px-5 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Family Supervision</h1>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Active Bond
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 space-y-4 overflow-y-auto">
        {/* Guardian Profile Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
              🛡️
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Primary Guardian</p>
              <h3 className="text-base font-bold text-slate-900">Parent / Supervisor</h3>
              <p className="text-xs font-semibold text-blue-600 truncate">{guardianEmail}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-400 block text-[11px]">Device Bound</span>
              <span className="font-bold text-slate-800 truncate">{deviceName}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-400 block text-[11px]">Battery Level</span>
              <span className="font-bold text-slate-800">{realBatteryLevel}%</span>
            </div>
          </div>
        </div>

        {/* SOS Emergency Alert Button */}
        <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-3xl p-5 text-white shadow-md text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-90" />
          <h3 className="text-base font-bold">Need Immediate Help?</h3>
          <p className="text-xs text-rose-100 mt-1 mb-4 leading-relaxed">
            Press SOS to immediately alert your guardian ({guardianEmail}) with high-priority audio alert and your live GPS location.
          </p>

          <button
            type="button"
            onClick={handleTriggerSOS}
            disabled={sosSent}
            className="w-full py-3 rounded-2xl bg-white text-rose-600 font-extrabold text-sm shadow-md hover:bg-rose-50 transition active:scale-95 disabled:opacity-80"
          >
            {sosSent ? '🚨 SOS Alert Sent to Guardian!' : 'SEND EMERGENCY SOS'}
          </button>
        </div>

        {/* Quick Message to Guardian */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-800">Quick Note to Parent</h4>
          </div>

          {sentNotes.length > 0 && (
            <div className="space-y-1.5 mb-3 max-h-28 overflow-y-auto">
              {sentNotes.map((note, idx) => (
                <div key={idx} className="text-xs bg-blue-50 text-blue-900 p-2 rounded-xl flex items-center justify-between">
                  <span>{note}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="e.g. Done with homework, can I play?"
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center shadow"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-white border-t border-slate-200/90 pt-1 pb-1 relative z-20">
        <div className="grid grid-cols-2 max-w-[280px] mx-auto py-1">
          {/* Home Tab */}
          <button
            type="button"
            onClick={onBackToHome}
            className="flex flex-col items-center justify-center gap-1 group py-0.5"
          >
            <div className="w-16 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 transition">
              <Smartphone className="w-4 h-4 text-slate-400 group-hover:text-slate-600 stroke-[2.2]" />
            </div>
            <span className="text-[11.5px] font-medium text-slate-500 group-hover:text-slate-700">Home</span>
          </button>

          {/* Family Tab (Selected) */}
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-1 group py-0.5"
          >
            <div className="w-16 h-7 rounded-full bg-[#dbeafe] flex items-center justify-center transition">
              <div className="relative">
                <Home className="w-5 h-5 text-[#2563eb] stroke-[2]" />
                <Heart className="w-2.5 h-2.5 text-[#2563eb] fill-[#2563eb] absolute top-1.5 left-1.5" />
              </div>
            </div>
            <span className="text-[11.5px] font-bold text-[#2563eb]">Family</span>
          </button>
        </div>

        {/* Android bottom system navigation buttons */}
        <div className="flex items-center justify-around py-2.5 px-10 text-slate-400 border-t border-slate-100/60">
          <button type="button" className="p-1 hover:text-slate-600 transition" aria-label="Recent apps">
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current stroke-2 fill-none">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
          <button type="button" onClick={onBackToHome} className="p-1 hover:text-slate-600 transition" aria-label="Home">
            <div className="w-3.5 h-3.5 rounded-sm border-2 border-current" />
          </button>
          <button type="button" onClick={onBackToHome} className="p-1 hover:text-slate-600 transition" aria-label="Back">
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current stroke-2 fill-none">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
