import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  Binoculars,
  Headphones,
  Maximize2,
  RefreshCw,
  Volume2,
  VolumeX,
  Radio,
  Tv,
  Sparkles,
  Download,
  Check,
  Gamepad2,
  MousePointer,
  Hand,
  ArrowLeft,
  Circle,
  Square,
  ChevronUp,
  ChevronDown,
  Keyboard,
  Smartphone,
  Send,
} from 'lucide-react';
import { sendRemoteCommandToDevice } from '../../services/firebase';

interface ParentRemoteViewerModalsProps {
  modalType: 'camera' | 'screen' | 'audio' | null;
  onClose: () => void;
  screenStream?: MediaStream | null;
  cameraStream?: MediaStream | null;
  ambientAudioStream?: MediaStream | null;
  onSwitchCamera?: () => void;
  onRequestRemoteCamera?: () => void;
  onRequestRemoteScreen?: () => void;
  onRequestRemoteMic?: () => void;
  childDeviceName?: string;
}

export const ParentRemoteViewerModals: React.FC<ParentRemoteViewerModalsProps> = ({
  modalType,
  onClose,
  screenStream,
  cameraStream,
  ambientAudioStream,
  onSwitchCamera,
  onRequestRemoteCamera,
  onRequestRemoteScreen,
  onRequestRemoteMic,
  childDeviceName = 'Realme RMX5313',
}) => {
  const [whisperBoost, setWhisperBoost] = useState(true);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [snapshotTakenMsg, setSnapshotTakenMsg] = useState(false);

  // AnyDesk Remote Control State
  const [controlMode, setControlMode] = useState<'control' | 'view'>('control');
  const [touchRipples, setTouchRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [showKeyboardDrawer, setShowKeyboardDrawer] = useState(false);
  const [keyboardText, setKeyboardText] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenContainerRef = useRef<HTMLDivElement | null>(null);

  // Attach streams to video elements
  useEffect(() => {
    if (modalType === 'screen' && videoRef.current && screenStream) {
      videoRef.current.srcObject = screenStream;
    }
  }, [modalType, screenStream]);

  useEffect(() => {
    if (modalType === 'camera' && cameraVideoRef.current && cameraStream) {
      cameraVideoRef.current.srcObject = cameraStream;
    }
  }, [modalType, cameraStream]);

  // Request hardware activation if not active yet
  useEffect(() => {
    if (modalType === 'camera' && !cameraStream) {
      onRequestRemoteCamera?.();
    } else if (modalType === 'screen' && !screenStream) {
      onRequestRemoteScreen?.();
    } else if (modalType === 'audio' && !ambientAudioStream) {
      onRequestRemoteMic?.();
    }
  }, [modalType]);

  const triggerActionFeedback = (text: string) => {
    setActionFeedback(text);
    setTimeout(() => setActionFeedback(null), 2000);
  };

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (controlMode !== 'control') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newRipple = { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top };
    setTouchRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setTouchRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    sendRemoteCommandToDevice('realme-rmx5313', {
      type: 'tap',
      payload: { x, y },
    });
    triggerActionFeedback(`Remote Tap at (${x}%, ${y}%)`);
  };

  const handleSendNavAction = (
    type: 'back' | 'home' | 'recents' | 'scroll_up' | 'scroll_down' | 'wake_screen'
  ) => {
    sendRemoteCommandToDevice('realme-rmx5313', { type });
    const labels: Record<string, string> = {
      back: 'Remote Back ◀ Executed',
      home: 'Remote Home ⭕ Executed',
      recents: 'Remote App Switcher 🔲',
      scroll_up: 'Remote Scroll Up ▲',
      scroll_down: 'Remote Scroll Down ▼',
      wake_screen: 'Remote Screen Wake 💡',
    };
    triggerActionFeedback(labels[type] || 'Action Sent');
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyboardText.trim()) {
      sendRemoteCommandToDevice('realme-rmx5313', {
        type: 'type_text',
        payload: { text: keyboardText.trim() },
      });
      triggerActionFeedback(`Remote Typed: "${keyboardText.trim()}"`);
      setKeyboardText('');
      setShowKeyboardDrawer(false);
    }
  };

  const handleTakeSnapshot = () => {
    // Generate snapshot from video or canvas
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (cameraVideoRef.current && cameraVideoRef.current.videoWidth) {
        ctx.drawImage(cameraVideoRef.current, 0, 0, 640, 480);
      } else {
        // Mock capture placeholder
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(`Realme RMX5313 Remote Snapshot`, 120, 240);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.fillText(new Date().toLocaleTimeString(), 240, 280);
      }
      setCapturedSnapshot(canvas.toDataURL('image/jpeg'));
      setSnapshotTakenMsg(true);
      setTimeout(() => setSnapshotTakenMsg(false), 2500);
    }
  };

  if (!modalType) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      {/* 1. REMOTE CAMERA MODAL */}
      {modalType === 'camera' && (
        <div className="bg-slate-900 rounded-3xl w-full max-w-sm border border-slate-700 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-white font-bold text-sm">Remote Camera ({childDeviceName})</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Preview */}
          <div className="relative aspect-3/4 bg-black flex items-center justify-center overflow-hidden">
            {cameraStream ? (
              <video
                ref={cameraVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto animate-pulse">
                  <Camera className="w-8 h-8" />
                </div>
                <h4 className="text-white font-bold text-sm">Connecting Remote Camera...</h4>
                <p className="text-xs text-slate-400 max-w-[220px]">
                  Requesting front/back lens stream from {childDeviceName}.
                </p>
              </div>
            )}

            {/* Flash feedback */}
            {snapshotTakenMsg && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center animate-out fade-out duration-500">
                <div className="bg-slate-900 text-white font-bold px-4 py-2 rounded-2xl shadow-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Snapshot Saved to Gallery!</span>
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-around">
            <button
              type="button"
              onClick={onSwitchCamera}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4 text-blue-400" />
              <span>Flip Lens</span>
            </button>

            <button
              type="button"
              onClick={handleTakeSnapshot}
              className="p-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition active:scale-95"
              title="Capture Remote Snapshot"
            >
              <Camera className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              Stop View
            </button>
          </div>
        </div>
      )}

      {/* 2. SCREEN MIRRORING MODAL (With AnyDesk Interactive Remote Control) */}
      {modalType === 'screen' && (
        <div className="bg-slate-900 rounded-3xl w-full max-w-sm sm:max-w-md md:max-w-lg border border-slate-700 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 max-h-[92vh]">
          {/* Header */}
          <div className="p-3.5 bg-slate-950 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h3 className="text-white font-bold text-sm">AnyDesk Remote Screen</h3>
                <span className="text-[10px] text-slate-400">{childDeviceName}</span>
              </div>
            </div>

            {/* Mode Switcher: AnyDesk Control vs View Only */}
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setControlMode('control')}
                  className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                    controlMode === 'control'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="AnyDesk Interactive Touch Control"
                >
                  <Gamepad2 className="w-3 h-3" />
                  <span>Control</span>
                </button>
                <button
                  type="button"
                  onClick={() => setControlMode('view')}
                  className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                    controlMode === 'view'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="View Only Mirroring"
                >
                  <Binoculars className="w-3 h-3" />
                  <span>View</span>
                </button>
              </div>

              <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interactive Screen Container with Touch Target */}
          <div
            ref={screenContainerRef}
            onClick={handleScreenClick}
            className={`relative aspect-9/16 bg-slate-950 flex items-center justify-center overflow-hidden select-none ${
              controlMode === 'control' ? 'cursor-crosshair' : 'cursor-default'
            }`}
          >
            {screenStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain pointer-events-none"
              />
            ) : (
              <div className="text-center p-6 space-y-3 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
                  <Binoculars className="w-8 h-8" />
                </div>
                <h4 className="text-white font-bold text-sm">Interactive AnyDesk Session Active</h4>
                <p className="text-xs text-slate-400 max-w-[220px]">
                  Touch anywhere on this screen to remotely tap and navigate the child's phone.
                </p>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 text-left space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Touch Service</span>
                    <span className="font-bold text-emerald-400">Accessibility Service Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Latency</span>
                    <span className="font-bold text-white">&lt;15ms Ultra-Low</span>
                  </div>
                </div>
              </div>
            )}

            {/* Animated Touch Pulse Ripples */}
            {touchRipples.map((ripple) => (
              <div
                key={ripple.id}
                style={{ left: ripple.x, top: ripple.y }}
                className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-blue-400 bg-blue-500/30 animate-ping pointer-events-none z-30"
              />
            ))}

            {/* Action Feedback Toast */}
            {actionFeedback && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-slate-700 backdrop-blur-md z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                {actionFeedback}
              </div>
            )}

            {/* Control mode badge */}
            <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-[10px] text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60 flex items-center gap-1 pointer-events-none z-20">
              <span className={`w-1.5 h-1.5 rounded-full ${controlMode === 'control' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
              <span>{controlMode === 'control' ? 'Touch & Control Active' : 'View Only Mode'}</span>
            </div>
          </div>

          {/* Remote Keyboard Drawer */}
          {showKeyboardDrawer && (
            <form onSubmit={handleSendText} className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={keyboardText}
                onChange={(e) => setKeyboardText(e.target.value)}
                placeholder="Type text to send to child's phone..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <button
                type="submit"
                className="p-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 px-3 shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          )}

          {/* REMOTE ANDROID NAVIGATION DOCK (AnyDesk Hardware Controls) */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex flex-col gap-2">
            {/* Nav row: Back, Home, Recents, Scroll, Keyboard */}
            <div className="grid grid-cols-6 gap-1.5">
              <button
                type="button"
                onClick={() => handleSendNavAction('back')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 active:scale-90"
                title="Remote Back"
              >
                <ArrowLeft className="w-4 h-4 text-blue-400" />
                <span className="text-[9px]">Back</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendNavAction('home')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 active:scale-90"
                title="Remote Home"
              >
                <Circle className="w-4 h-4 text-blue-400" />
                <span className="text-[9px]">Home</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendNavAction('recents')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 active:scale-90"
                title="Remote App Switcher"
              >
                <Square className="w-4 h-4 text-blue-400" />
                <span className="text-[9px]">Apps</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendNavAction('scroll_up')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 active:scale-90"
                title="Scroll Screen Up"
              >
                <ChevronUp className="w-4 h-4 text-amber-400" />
                <span className="text-[9px]">Up</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendNavAction('scroll_down')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 active:scale-90"
                title="Scroll Screen Down"
              >
                <ChevronDown className="w-4 h-4 text-amber-400" />
                <span className="text-[9px]">Down</span>
              </button>

              <button
                type="button"
                onClick={() => setShowKeyboardDrawer(!showKeyboardDrawer)}
                className={`py-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 active:scale-90 ${
                  showKeyboardDrawer ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title="Remote Keyboard"
              >
                <Keyboard className="w-4 h-4 text-purple-400" />
                <span className="text-[9px]">Type</span>
              </button>
            </div>

            {/* Bottom Status bar */}
            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                AnyDesk Remote Session
              </span>

              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] transition"
              >
                Close Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ONE-WAY AUDIO MODAL */}
      {modalType === 'audio' && (
        <div className="bg-slate-900 rounded-3xl w-full max-w-sm border border-slate-700 shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="text-white font-bold text-sm">One-Way Ambient Audio</h3>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ambient Waveform Animation */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 relative">
            <Headphones className="w-10 h-10 animate-bounce" />
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping" />
          </div>

          <h4 className="text-white font-bold text-base">Listening to Surroundings</h4>
          <p className="text-xs text-slate-400 mt-1 mb-5">
            Streaming room sound from {childDeviceName}'s high-sensitivity microphone.
          </p>

          {/* Audio Waveform Simulation */}
          <div className="h-10 flex items-center justify-center gap-1 bg-slate-950/70 p-2 rounded-2xl mb-4 border border-slate-800">
            {[24, 38, 16, 45, 32, 50, 28, 42, 18, 36, 48, 22].map((height, i) => (
              <span
                key={i}
                className="w-1.5 bg-emerald-400 rounded-full animate-pulse"
                style={{ height: `${height}px`, animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>

          {/* 300% Whisper Boost Switch */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs mb-5">
            <div className="text-left">
              <span className="font-bold text-white block">300% Whisper Boost</span>
              <span className="text-[11px] text-slate-400">Amplifies soft background speech</span>
            </div>
            <button
              type="button"
              onClick={() => setWhisperBoost(!whisperBoost)}
              className={`w-12 h-6.5 rounded-full p-0.5 transition-colors relative flex items-center ${
                whisperBoost ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  whisperBoost ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Mute &amp; Close Audio
          </button>
        </div>
      )}
    </div>
  );
};
