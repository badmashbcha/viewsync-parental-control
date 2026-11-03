import React, { useState } from 'react';
import {
  Share2,
  Copy,
  ExternalLink,
  Users,
  CheckCircle2,
  Tv,
  Eye,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../types';

interface RoomConnectBarProps {
  roomId: string;
  role: UserRole;
  onChangeRole: (newRole: UserRole) => void;
  onChangeRoom: (newRoomId: string) => void;
  viewerCount: number;
  hasHost: boolean;
}

export const RoomConnectBar: React.FC<RoomConnectBarProps> = ({
  roomId,
  role,
  onChangeRole,
  onChangeRoom,
  viewerCount,
  hasHost,
}) => {
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [tempRoomInput, setTempRoomInput] = useState(roomId);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = (targetRole: UserRole) => {
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomId);
    url.searchParams.set('role', targetRole);
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOpenNewTab = (targetRole: UserRole) => {
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomId);
    url.searchParams.set('role', targetRole);
    window.open(url.toString(), '_blank');
  };

  const handleSubmitRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempRoomInput.trim()) return;
    onChangeRoom(tempRoomInput.trim().toUpperCase());
    setIsEditingRoom(false);
  };

  return (
    <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Role Switcher Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 w-full md:w-auto">
          <button
            type="button"
            onClick={() => onChangeRole('host')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              role === 'host'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Target Device (Share Screen & Cam)</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeRole('viewer')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              role === 'viewer'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Supervisor / Parent (Live View)</span>
          </button>
        </div>

        {/* Center: Room Code Display & Changer */}
        <div className="flex items-center gap-2.5">
          {isEditingRoom ? (
            <form onSubmit={handleSubmitRoom} className="flex items-center gap-2">
              <input
                type="text"
                value={tempRoomInput}
                onChange={(e) => setTempRoomInput(e.target.value)}
                placeholder="Enter Room Code"
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-indigo-500 text-xs font-mono font-bold text-white uppercase focus:outline-none w-32"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
              >
                Join
              </button>
              <button
                type="button"
                onClick={() => setIsEditingRoom(false)}
                className="px-2 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs transition"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 px-3 py-1.5 rounded-xl">
              <span className="text-xs text-slate-400">Session ID:</span>
              <span className="font-mono font-bold text-indigo-400 text-xs tracking-wider">
                {roomId}
              </span>
              <button
                type="button"
                onClick={() => {
                  setTempRoomInput(roomId);
                  setIsEditingRoom(true);
                }}
                className="text-[11px] text-slate-500 hover:text-slate-300 underline ml-1"
              >
                Change
              </button>
            </div>
          )}

          {/* Quick status pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                hasHost ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-300 font-medium">
              {hasHost ? 'Host Online' : 'No Host Yet'}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{viewerCount} Viewer{viewerCount === 1 ? '' : 's'}</span>
          </div>
        </div>

        {/* Right: Instant Test / Sharing Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {role === 'host' ? (
            <button
              type="button"
              onClick={() => handleOpenNewTab('viewer')}
              title="Open Supervisor view in a separate tab to test live monitoring"
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-950/40"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Supervisor Tab</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenNewTab('host')}
              title="Open Target Device view in a separate tab to test screen sharing"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Target Device Tab</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleCopyLink(role === 'host' ? 'viewer' : 'host')}
            title="Copy invite link with session code"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center"
          >
            {copiedLink ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
