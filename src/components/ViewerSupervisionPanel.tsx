import React, { useState } from 'react';
import {
  Monitor,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  MousePointer,
  Crosshair,
  Edit3,
  Trash2,
  Radio,
  Play,
  Square,
  Pause,
  Download,
  AlertTriangle,
  Send,
  Battery,
  BatteryCharging,
  Wifi,
  Layers,
  HelpCircle,
  Eye,
  Info,
  Headphones,
  Sliders,
  Activity,
} from 'lucide-react';
import { InteractiveVideoOverlay } from './InteractiveVideoOverlay';
import {
  RemotePointer,
  PingMarker,
  DrawStroke,
  RoomState,
  DeviceTelemetry,
  ChatMessage,
  RecordedSession,
} from '../types';
import { useAmbientAudio } from '../hooks/useAmbientAudio';

interface ViewerSupervisionPanelProps {
  roomId: string;
  roomState: RoomState | null;
  screenStream: MediaStream | null;
  cameraStream: MediaStream | null;
  ambientAudioStream: MediaStream | null;
  remotePointer: RemotePointer | null;
  pingMarkers: PingMarker[];
  drawStrokes: DrawStroke[];
  deviceTelemetry: DeviceTelemetry | null;
  chatMessages: ChatMessage[];
  // Recording
  isRecording: boolean;
  isPaused: boolean;
  formattedDuration: string;
  recordings: RecordedSession[];
  onStartRecord: () => void;
  onPauseRecord: () => void;
  onResumeRecord: () => void;
  onStopRecord: () => void;
  onOpenRecordings: () => void;
  // Interactive Controls
  onSendPointer: (x: number, y: number, active: boolean) => void;
  onSendPing: (x: number, y: number) => void;
  onSendDrawStroke: (stroke: DrawStroke) => void;
  onClearDrawStrokes: () => void;
  onRequestCamera: (enable: boolean, facingMode?: 'user' | 'environment') => void;
  onRequestScreen: () => void;
  onRequestMic: (enable: boolean, highSensitivity?: boolean) => void;
  onSendAlert: (type: 'chime' | 'bell' | 'alarm', msg?: string) => void;
  onSendGuidanceMessage: (text: string, severity: 'info' | 'warning' | 'urgent') => void;
  onSendChat: (text: string) => void;
  // Talkback
  isTalkbackActive: boolean;
  onStartTalkback: () => void;
  onStopTalkback: () => void;
}

export const ViewerSupervisionPanel: React.FC<ViewerSupervisionPanelProps> = ({
  roomId,
  roomState,
  screenStream,
  cameraStream,
  ambientAudioStream,
  remotePointer,
  pingMarkers,
  drawStrokes,
  deviceTelemetry,
  chatMessages,
  isRecording,
  isPaused,
  formattedDuration,
  recordings,
  onStartRecord,
  onPauseRecord,
  onResumeRecord,
  onStopRecord,
  onOpenRecordings,
  onSendPointer,
  onSendPing,
  onSendDrawStroke,
  onClearDrawStrokes,
  onRequestCamera,
  onRequestScreen,
  onRequestMic,
  onSendAlert,
  onSendGuidanceMessage,
  onSendChat,
  isTalkbackActive,
  onStartTalkback,
  onStopTalkback,
}) => {
  // Active Interactive Tool
  const [activeTool, setActiveTool] = useState<'none' | 'pointer' | 'ping' | 'draw'>('pointer');
  const [drawColor, setDrawColor] = useState<string>('#ef4444');
  const [cameraLayout, setCameraLayout] = useState<'pip' | 'split' | 'camera-only'>('pip');
  const [guidanceInput, setGuidanceInput] = useState('');
  const [chatInput, setChatInput] = useState('');

  // Hook: Ambient Room Audio Listening with Gain Booster & VU Meter
  const {
    isMuted: isAudioMuted,
    volume: audioVolume,
    audioLevel,
    setVolume: setAudioVolume,
    toggleMute: toggleAudioMute,
    enableAudioPlayback,
  } = useAmbientAudio({ stream: ambientAudioStream, initialVolume: 1.5 });

  const quickGuidancePresets = [
    { label: '📚 Focus on Study', text: 'Please focus on your study material now.', severity: 'info' },
    { label: '⏸️ Pause Video / Game', text: 'Please pause what you are doing and check in.', severity: 'warning' },
    { label: '🎯 Check Pointed Area', text: 'Look closely at the highlighted section on screen.', severity: 'info' },
    { label: '🚨 Urgent Attention', text: 'Urgent check requested by parent / supervisor.', severity: 'urgent' },
  ];

  const handleSendCustomGuidance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guidanceInput.trim()) return;
    onSendGuidanceMessage(guidanceInput.trim(), 'warning');
    setGuidanceInput('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChat(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="space-y-5">
      {/* Top Supervision Header & Telemetry Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Host Connection Status & Telemetry */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                roomState?.hasHost ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="font-bold text-white text-sm">
              {roomState?.hasHost ? 'Target Device Connected' : 'Waiting for Target Device'}
            </span>
          </div>

          {deviceTelemetry && (
            <div className="flex items-center gap-3 text-xs text-slate-400 border-l border-slate-700/80 pl-4">
              <span className="flex items-center gap-1">
                <Monitor className="w-3.5 h-3.5 text-slate-300" />
                {deviceTelemetry.screenWidth}x{deviceTelemetry.screenHeight}
              </span>
              {deviceTelemetry.batteryLevel !== undefined && deviceTelemetry.batteryLevel !== null && (
                <span className="flex items-center gap-1 text-slate-300">
                  {deviceTelemetry.isCharging ? (
                    <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {deviceTelemetry.batteryLevel}%
                </span>
              )}
              <span className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                {deviceTelemetry.online ? 'Online' : 'Offline'}
              </span>
            </div>
          )}
        </div>

        {/* Right: Screen Recording & Camera Layout Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Recording Controls */}
          {isRecording ? (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-rose-950/80 border border-rose-500/60 shadow-lg">
              <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-rose-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                REC {formattedDuration}
              </span>
              {isPaused ? (
                <button
                  type="button"
                  onClick={onResumeRecord}
                  title="Resume"
                  className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onPauseRecord}
                  title="Pause"
                  className="p-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 transition"
                >
                  <Pause className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={onStopRecord}
                title="Stop & Save Recording"
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1"
              >
                <Square className="w-3 h-3 fill-current" />
                Save
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onStartRecord}
              disabled={!screenStream && !cameraStream}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-rose-950/40"
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              Record Screen & Audio
            </button>
          )}

          {recordings.length > 0 && (
            <button
              type="button"
              onClick={onOpenRecordings}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recordings ({recordings.length})</span>
            </button>
          )}

          {/* Camera View Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <button
              type="button"
              onClick={() => setCameraLayout('pip')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                cameraLayout === 'pip' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              PiP View
            </button>
            <button
              type="button"
              onClick={() => setCameraLayout('split')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                cameraLayout === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setCameraLayout('camera-only')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                cameraLayout === 'camera-only' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Camera Focus
            </button>
          </div>
        </div>
      </div>

      {/* AMBIENT ROOM VOICE & AUDIO MONITOR BAR (Aas-Pass Ki Awaaz Sunne Ka Panel) */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          ambientAudioStream
            ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border-amber-500/50 shadow-xl'
            : 'bg-slate-900/70 border-slate-800'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status & Live Waveform Indicator */}
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
                ambientAudioStream
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <Headphones className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  {ambientAudioStream
                    ? 'Ambient Room Audio Live (Surrounding Voices)'
                    : 'Surrounding Room Audio Not Streaming'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    ambientAudioStream
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {ambientAudioStream ? 'LIVE AUDIO' : 'MUTED'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                {ambientAudioStream ? (
                  <span>Aas-pass ki baatein aur aawaz live transmit ho rahi hai.</span>
                ) : (
                  <span>Target device ka mic access request karke room audio sun sakte hain.</span>
                )}
              </div>
            </div>
          </div>

          {/* Sound Level VU Meter & Volume Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
            {ambientAudioStream ? (
              <>
                {/* Visual Decibel Activity Meter */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-semibold text-slate-400">Level:</span>
                  <div className="w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-75 ${
                        audioLevel > 65
                          ? 'bg-rose-500'
                          : audioLevel > 30
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.max(5, audioLevel)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-amber-300 font-bold w-7 text-right">
                    {audioLevel}%
                  </span>
                </div>

                {/* Whisper Gain Booster Slider */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-slate-400 text-[11px]">Boost:</span>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.2"
                    value={audioVolume}
                    onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                    className="w-20 accent-amber-500 cursor-pointer"
                    title={`Volume Boost: ${Math.round(audioVolume * 100)}%`}
                  />
                  <span className="font-mono text-indigo-300 font-bold text-[11px]">
                    {Math.round(audioVolume * 100)}%
                  </span>
                </div>

                {/* Speaker Mute/Unmute toggle */}
                <button
                  type="button"
                  onClick={() => {
                    enableAudioPlayback();
                    toggleAudioMute();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isAudioMuted
                      ? 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                      : 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                  }`}
                >
                  {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {isAudioMuted ? 'Unmute Speaker' : 'Listening Active'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onRequestMic(true, true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-amber-950/40"
              >
                <Mic className="w-4 h-4" />
                <span>Request Voice Access (Aas-Pass Ki Baat Sunein)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Remote Control Toolbar */}
      <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Pointer / Draw Tools */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-2 uppercase tracking-wider">
            Assist Tools:
          </span>

          <button
            type="button"
            onClick={() => setActiveTool(activeTool === 'pointer' ? 'none' : 'pointer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTool === 'pointer'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" />
            Laser Pointer
          </button>

          <button
            type="button"
            onClick={() => setActiveTool(activeTool === 'ping' ? 'none' : 'ping')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTool === 'ping'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            Radar Ping
          </button>

          <button
            type="button"
            onClick={() => setActiveTool(activeTool === 'draw' ? 'none' : 'draw')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTool === 'draw'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Draw Annotate
          </button>

          {activeTool === 'draw' && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700">
              {['#ef4444', '#f59e0b', '#06b6d4', '#10b981'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setDrawColor(c)}
                  className={`w-5 h-5 rounded-full border-2 transition ${
                    drawColor === c ? 'scale-125 border-white' : 'border-transparent opacity-70'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <button
                type="button"
                onClick={onClearDrawStrokes}
                title="Clear Drawing Strokes"
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition ml-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Talkback Walkie-Talkie & Alert Sounds */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Push to talk Intercom */}
          <button
            type="button"
            onMouseDown={onStartTalkback}
            onMouseUp={onStopTalkback}
            onTouchStart={onStartTalkback}
            onTouchEnd={onStopTalkback}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isTalkbackActive
                ? 'bg-emerald-600 text-white shadow-lg animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            {isTalkbackActive ? 'Talking (Release to mute)' : 'Hold to Speak (Intercom)'}
          </button>

          {/* Attention Soundboard */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onSendAlert('chime', 'Supervisor Attention Chime')}
              title="Play Gentle Chime on Target Device"
              className="p-1.5 rounded-lg hover:bg-slate-700 text-indigo-300 hover:text-white transition text-xs flex items-center gap-1 font-medium"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Chime</span>
            </button>
            <button
              type="button"
              onClick={() => onSendAlert('bell', 'Supervisor Bell Ring')}
              title="Play Attention Bell on Target Device"
              className="p-1.5 rounded-lg hover:bg-slate-700 text-amber-300 hover:text-white transition text-xs flex items-center gap-1 font-medium"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Bell</span>
            </button>
            <button
              type="button"
              onClick={() => onSendAlert('alarm', 'Urgent Attention Alarm')}
              title="Play Urgent Siren on Target Device"
              className="p-1.5 rounded-lg hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 transition text-xs flex items-center gap-1 font-medium"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Urgent</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Video Stage */}
      {cameraLayout === 'split' ? (
        /* Split View: Screen on Left, Camera on Right */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-[520px]">
          <div className="h-full">
            <InteractiveVideoOverlay
              stream={screenStream}
              mode="viewer"
              pointer={remotePointer}
              pings={pingMarkers}
              drawStrokes={drawStrokes}
              activeTool={activeTool}
              drawColor={drawColor}
              onSendPointer={onSendPointer}
              onSendPing={onSendPing}
              onSendDrawStroke={onSendDrawStroke}
              label="Live Target Screen"
            />
          </div>
          <div className="h-full">
            <InteractiveVideoOverlay
              stream={cameraStream}
              mode="viewer"
              pointer={null}
              pings={[]}
              drawStrokes={[]}
              label="Live Parental Camera Eye"
            />
          </div>
        </div>
      ) : cameraLayout === 'camera-only' ? (
        /* Focused Camera View */
        <div className="h-[520px]">
          <InteractiveVideoOverlay
            stream={cameraStream}
            mode="viewer"
            pointer={null}
            pings={[]}
            drawStrokes={[]}
            label="Live Parental Camera Feed (Direct View)"
          />
        </div>
      ) : (
        /* PiP View: Screen Stream is Main, Camera Stream is Floating in Bottom-Right */
        <div className="relative h-[560px] w-full">
          <InteractiveVideoOverlay
            stream={screenStream}
            mode="viewer"
            pointer={remotePointer}
            pings={pingMarkers}
            drawStrokes={drawStrokes}
            activeTool={activeTool}
            drawColor={drawColor}
            onSendPointer={onSendPointer}
            onSendPing={onSendPing}
            onSendDrawStroke={onSendDrawStroke}
            label="Target Device Screen"
          />

          {/* Floating PiP Camera Card */}
          <div className="absolute bottom-5 right-5 w-64 sm:w-72 h-44 rounded-2xl overflow-hidden border-2 border-indigo-500/80 shadow-2xl z-30 bg-slate-900 group">
            <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-indigo-300 border border-indigo-500/40">
              Live Camera Feed
            </div>
            {cameraStream ? (
              <video
                ref={(el) => {
                  if (el) {
                    el.srcObject = cameraStream;
                    el.play().catch(() => {});
                  }
                }}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-slate-500 bg-slate-950/90">
                <VideoOff className="w-6 h-6 mb-1 text-slate-600" />
                <span className="text-xs font-semibold text-slate-400">Camera Feed Off</span>
                <button
                  type="button"
                  onClick={() => onRequestCamera(true, 'user')}
                  className="mt-2 px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-bold transition shadow"
                >
                  Request Camera
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Remote Action Panels (Camera, Ambient Voice, Guidance Flash & Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Remote Camera & Screen Controls */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Video className="w-4 h-4 text-indigo-400" />
            <span>Camera Controls</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Request front or back camera feed directly from the device.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onRequestCamera(true, 'user')}
              className="py-2 px-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition text-left"
            >
              📹 Selfie Cam
            </button>
            <button
              type="button"
              onClick={() => onRequestCamera(true, 'environment')}
              className="py-2 px-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition text-left"
            >
              📷 Back Cam
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onRequestCamera(false)}
              className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold transition"
            >
              Turn Off Cam
            </button>
            <button
              type="button"
              onClick={onRequestScreen}
              className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition"
            >
              Request Screen
            </button>
          </div>
        </div>

        {/* Ambient Voice Access (Aas-Pass Ki Baat Sunna) */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Mic className="w-4 h-4 text-amber-400" />
            <span>Voice & Room Audio</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Target device ka microphone enable karke aas-pass ki baatein sun sakte hain.
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onRequestMic(true, true)}
              className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40"
            >
              <Mic className="w-4 h-4" />
              <span>Turn On Room Mic (Boosted)</span>
            </button>
            <button
              type="button"
              onClick={() => onRequestMic(false)}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <MicOff className="w-4 h-4" />
              <span>Turn Off Room Mic</span>
            </button>
          </div>
        </div>

        {/* Guidance Quick Presets & Alert Sender */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Guidance Banner</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {quickGuidancePresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSendGuidanceMessage(preset.text, preset.severity as any)}
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-[10px] font-medium text-left truncate transition border border-slate-700/50"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendCustomGuidance} className="flex gap-2">
            <input
              type="text"
              value={guidanceInput}
              onChange={(e) => setGuidanceInput(e.target.value)}
              placeholder="Send alert message..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Supervision Live Notes & Chat */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>Intercom Chat</span>
              </span>
              <span className="text-[11px] text-slate-400">{chatMessages.length} msgs</span>
            </div>

            <div className="h-24 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {chatMessages.length === 0 ? (
                <div className="text-slate-500 text-center py-4">No chat messages</div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 rounded-lg ${
                      msg.role === 'viewer'
                        ? 'bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 ml-4'
                        : 'bg-slate-800/80 text-slate-200 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-75 mb-0.5">
                      <span className="font-semibold">{msg.senderName}</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div>{msg.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type message..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
