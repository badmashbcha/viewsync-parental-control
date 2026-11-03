import React, { useState } from 'react';
import {
  Monitor,
  Video,
  VideoOff,
  Mic,
  MicOff,
  StopCircle,
  ShieldAlert,
  Smartphone,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Bell,
  Share2,
  Copy,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { InteractiveVideoOverlay } from './InteractiveVideoOverlay';
import { OneByOnePermissionWizard } from './OneByOnePermissionWizard';
import { RemotePointer, PingMarker, DrawStroke, RoomState } from '../types';

interface HostScreenSharePanelProps {
  roomId: string;
  roomState: RoomState | null;
  screenStream: MediaStream | null;
  cameraStream: MediaStream | null;
  isScreenSharing: boolean;
  isCameraActive: boolean;
  isMicActive: boolean;
  cameraFacingMode: 'user' | 'environment';
  pendingCameraRequest: boolean | null;
  pendingScreenRequest: boolean;
  pendingMicRequest: boolean | null;
  pendingLocationRequest: boolean | null;
  deviceLocation: any;
  isHighSensitivity: boolean;
  remotePointer: RemotePointer | null;
  pingMarkers: PingMarker[];
  drawStrokes: DrawStroke[];
  guidanceAlert: { text: string; severity: string; senderName: string } | null;
  onDismissGuidance: () => void;
  onStartScreen: () => void;
  onStopScreen: () => void;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onSwitchCamera: () => void;
  onToggleMic: () => void;
  onToggleSensitivity: () => void;
  onAcceptCameraRequest: () => void;
  onDeclineCameraRequest: () => void;
  onAcceptScreenRequest: () => void;
  onDeclineScreenRequest: () => void;
  onAcceptMicRequest: () => void;
  onDeclineMicRequest: () => void;
  onAcceptLocationRequest: () => void;
  onDeclineLocationRequest: () => void;
  onCopyInviteLink: () => void;
  copied: boolean;
}

export const HostScreenSharePanel: React.FC<HostScreenSharePanelProps> = ({
  roomId,
  roomState,
  screenStream,
  cameraStream,
  isScreenSharing,
  isCameraActive,
  isMicActive,
  cameraFacingMode,
  pendingCameraRequest,
  pendingScreenRequest,
  pendingMicRequest,
  pendingLocationRequest,
  deviceLocation,
  isHighSensitivity,
  remotePointer,
  pingMarkers,
  drawStrokes,
  guidanceAlert,
  onDismissGuidance,
  onStartScreen,
  onStopScreen,
  onStartCamera,
  onStopCamera,
  onSwitchCamera,
  onToggleMic,
  onToggleSensitivity,
  onAcceptCameraRequest,
  onDeclineCameraRequest,
  onAcceptScreenRequest,
  onDeclineScreenRequest,
  onAcceptMicRequest,
  onDeclineMicRequest,
  onAcceptLocationRequest,
  onDeclineLocationRequest,
  onCopyInviteLink,
  copied,
}) => {
  const viewerCount = roomState?.viewerCount || 0;
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* ViewSync One-by-One Permission Setup Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/70 border border-indigo-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src="/assets/aistudio/file_00000000da108211b0e62540220f79da_6786b4ce.png"
            alt="ViewSync"
            className="w-12 h-12 rounded-2xl shadow-lg border border-indigo-500/40 object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-white text-base">
                ViewSync Device Setup
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Step-by-Step
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              One-by-one saare permissions grant karein (Screen, Camera, Voice & GPS Location)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsWizardOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/60"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>One-by-One Permission Wizard</span>
        </button>
      </div>

      {/* One-by-One Permission Modal Wizard */}
      <OneByOnePermissionWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        isScreenSharing={isScreenSharing}
        isCameraActive={isCameraActive}
        isMicActive={isMicActive}
        hasLocation={!!deviceLocation?.permissionGranted}
        onGrantScreen={onStartScreen}
        onGrantCamera={() => onStartCamera()}
        onGrantMic={onToggleMic}
        onGrantLocation={onAcceptLocationRequest}
      />
      {/* Guidance Alert Banner from Supervisor */}
      {guidanceAlert && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 animate-bounce shadow-xl ${
            guidanceAlert.severity === 'urgent'
              ? 'bg-rose-950/90 border-rose-500 text-rose-200'
              : guidanceAlert.severity === 'warning'
              ? 'bg-amber-950/90 border-amber-500 text-amber-200'
              : 'bg-indigo-950/90 border-indigo-500 text-indigo-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Message from {guidanceAlert.senderName || 'Supervisor'}
              </div>
              <div className="text-base font-bold mt-0.5">{guidanceAlert.text}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onDismissGuidance}
            className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-semibold transition"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Pending Camera Request Modal/Prompt */}
      {pendingCameraRequest !== null && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-950/90 border-2 border-indigo-500/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-400 flex items-center justify-center text-indigo-300">
              <Video className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">
                Supervisor Requested Camera Feed
              </h4>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                The supervisor wants to view your live camera. Grant permission to turn it on.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onAcceptCameraRequest}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Allow Camera
            </button>
            <button
              type="button"
              onClick={onDeclineCameraRequest}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Pending Screen Request Prompt */}
      {pendingScreenRequest && !isScreenSharing && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/90 border-2 border-emerald-500/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-emerald-300">
              <Monitor className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">
                Supervisor Requested Screen Share
              </h4>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Please select and share your screen to allow live remote monitoring.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onAcceptScreenRequest}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Share Screen Now
            </button>
            <button
              type="button"
              onClick={onDeclineScreenRequest}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Pending Ambient Microphone Request Prompt */}
      {pendingMicRequest !== null && !isMicActive && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-2 border-amber-500/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-600/30 border border-amber-400 flex items-center justify-center text-amber-300">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">
                Supervisor Requested Ambient Room Audio
              </h4>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Supervisor wants to listen to surrounding voices & room audio. Grant permission to stream microphone.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onAcceptMicRequest}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Allow Microphone
            </button>
            <button
              type="button"
              onClick={onDeclineMicRequest}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Pending Location Request Prompt (सहमति व अनुमति) */}
      {pendingLocationRequest !== null && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/90 via-slate-900 to-rose-950/90 border-2 border-rose-500/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-600/30 border border-rose-400 flex items-center justify-center text-rose-300">
              <span className="text-2xl">📍</span>
            </div>
            <div>
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <span>Supervisor Requested GPS Location</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full">
                  Consent Required
                </span>
              </h4>
              <p className="text-xs text-rose-200/80 mt-0.5">
                Supervisor / Parent requested your live location for child safety and supervision.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onAcceptLocationRequest}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Share My Location
            </button>
            <button
              type="button"
              onClick={onDeclineLocationRequest}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Status Bar & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Screen Status Card */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isScreenSharing
              ? 'bg-slate-900/90 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isScreenSharing
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm">Screen Sharing</h5>
                <p className="text-xs text-slate-400">
                  {isScreenSharing ? 'Transmitting Live Screen' : 'Screen Not Shared'}
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isScreenSharing
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isScreenSharing ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
              {isScreenSharing ? 'Active' : 'Offline'}
            </span>
          </div>

          {isScreenSharing ? (
            <button
              type="button"
              onClick={onStopScreen}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <StopCircle className="w-4 h-4" />
              Stop Screen Share
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartScreen}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <Monitor className="w-4 h-4" />
              <span>
                {typeof navigator !== 'undefined' && (!navigator.mediaDevices || typeof navigator.mediaDevices.getDisplayMedia !== 'function')
                  ? 'Start Live Screen Sync'
                  : 'Start Screen Share'}
              </span>
            </button>
          )}
        </div>

        {/* Camera Status Card */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isCameraActive
              ? 'bg-slate-900/90 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isCameraActive
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm">Parental Camera Feed</h5>
                <p className="text-xs text-slate-400">
                  {isCameraActive
                    ? `Active (${cameraFacingMode === 'user' ? 'Selfie' : 'Back'})`
                    : 'Camera Disabled'}
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isCameraActive
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isCameraActive ? 'bg-indigo-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
              {isCameraActive ? 'Live' : 'Off'}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            {isCameraActive ? (
              <>
                <button
                  type="button"
                  onClick={onStopCamera}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <VideoOff className="w-4 h-4" />
                  Turn Off
                </button>
                <button
                  type="button"
                  onClick={onSwitchCamera}
                  title="Switch Front/Back Camera"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onStartCamera}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40"
              >
                <Video className="w-4 h-4" />
                Enable Camera
              </button>
            )}
          </div>
        </div>

        {/* Ambient Room Audio & Supervision Info Card */}
        <div
          className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
            isMicActive
              ? 'bg-slate-900/90 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                <span>Ambient Voice Access</span>
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isMicActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isMicActive ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'
                  }`}
                />
                {isMicActive ? 'Transmitting Audio' : 'Mic Muted'}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              {isMicActive
                ? isHighSensitivity
                  ? 'High Sensitivity: Ambient room sounds & speech are being transmitted'
                  : 'Standard Voice: Direct speech transmitted'
                : 'Microphone is closed. Supervisor cannot hear room voices.'}
            </p>

            {/* Live sound indicator wave when active */}
            {isMicActive && (
              <div className="flex items-center gap-1 mt-2.5">
                <span className="h-3 w-1 bg-amber-400 rounded-full animate-bounce" />
                <span className="h-5 w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="h-2 w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="h-6 w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                <span className="h-4 w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="text-[11px] font-mono text-amber-300 font-semibold ml-2">
                  Live Room Sound Active
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onToggleMic}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                isMicActive
                  ? 'bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600/30'
                  : 'bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/40'
              }`}
            >
              {isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isMicActive ? 'Mute Mic' : 'Turn On Mic'}
            </button>
            <button
              type="button"
              onClick={onToggleSensitivity}
              title={isHighSensitivity ? 'High Sensitivity (Ambient voices & room noise)' : 'Standard Voice Mode'}
              className={`px-3 py-2 rounded-xl text-[11px] font-semibold transition border ${
                isHighSensitivity
                  ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {isHighSensitivity ? '👂 Boosted' : 'Normal'}
            </button>
            <button
              type="button"
              onClick={onCopyInviteLink}
              title="Copy Supervisor Link"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center justify-center"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Dual Previews Grid (Screen + Camera) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Screen Stream Preview */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Monitor className="w-4 h-4 text-emerald-400" />
              <span>Host Screen Monitor & Remote Assist View</span>
            </div>
            {isScreenSharing && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Viewer pointers and pings appear here
              </span>
            )}
          </div>

          <div className="h-[460px] w-full">
            <InteractiveVideoOverlay
              stream={screenStream}
              mode="host"
              pointer={remotePointer}
              pings={pingMarkers}
              drawStrokes={drawStrokes}
              label="Host Screen (Shared)"
              showControls={true}
            />
          </div>
        </div>

        {/* Side Camera Preview & Supervision Guidance Info */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span>Parental Camera Preview</span>
            </div>
          </div>

          <div className="h-[260px] w-full">
            <InteractiveVideoOverlay
              stream={cameraStream}
              mode="host"
              pointer={null}
              pings={[]}
              drawStrokes={[]}
              label="Live Camera"
              showControls={false}
            />
          </div>

          {/* Device Transparency & Privacy Box */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span>Privacy & Control Notice</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              You are sharing your screen and camera with the designated supervisor. 
              The browser displays a system indicator when your camera or screen is captured.
              You can stop the stream at any time using the buttons above.
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Encrypted WebRTC P2P</span>
              <span className="text-emerald-400 font-medium">Safe & Consensual</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
