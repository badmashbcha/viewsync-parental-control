/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Shield,
  Tv,
  Eye,
  Radio,
  Video,
  Monitor,
  HelpCircle,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  Info,
  Home,
  Film,
  MapPin,
  Smartphone,
} from 'lucide-react';
import { UserRole } from './types';
import { useWebRTCConnection } from './hooks/useWebRTCConnection';
import { useStreamRecorder } from './hooks/useStreamRecorder';
import { HostScreenSharePanel } from './components/HostScreenSharePanel';
import { ViewerSupervisionPanel } from './components/ViewerSupervisionPanel';
import { HomeScreenDashboard } from './components/HomeScreenDashboard';
import { RecordedVideosModal } from './components/RecordedVideosModal';
import { RoomConnectBar } from './components/RoomConnectBar';
import { OnboardingWelcomeScreen } from './components/OnboardingWelcomeScreen';
import { DeviceRoleSelectionScreen } from './components/DeviceRoleSelectionScreen';
import { ViewSyncMobileAppContainer } from './components/viewsync/ViewSyncMobileAppContainer';
import { ViewSyncShowcaseGallery } from './components/viewsync/ViewSyncShowcaseGallery';
import { ChildPhoneContainer } from './components/child/ChildPhoneContainer';
import { ParentDashboardContainer } from './components/parent/ParentDashboardContainer';

// Helper to generate readable 6-character room code
function generateRoomId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'VS-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Local storage keys for persistent authentication and device session
const STORAGE_KEY_AUTH = 'viewsync_auth_status_v1';
const STORAGE_KEY_USER = 'viewsync_user_profile_v1';
const STORAGE_KEY_ROLE = 'viewsync_user_role_v1';
const STORAGE_KEY_FLOW = 'viewsync_app_flow_v1';

export type AppFlowState = 'welcome' | 'role_select' | 'dashboard';

export default function App() {
  // Screen flow: persists in localStorage so user NEVER gets logged out unless clicking Sign Out
  const [appFlow, setAppFlow] = useState<AppFlowState>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('direct') === 'true') {
      return 'dashboard';
    }
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      const savedFlow = localStorage.getItem(STORAGE_KEY_FLOW);
      if (savedAuth === 'logged_in') {
        if (savedFlow === 'role_select' || savedFlow === 'dashboard') {
          return savedFlow;
        }
        return 'dashboard';
      }
    } catch {
      // Fallback
    }
    return 'welcome';
  });

  // User profile: persistent in localStorage
  const [userProfile, setUserProfile] = useState<{
    email: string;
    name: string;
  }>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // Fallback
    }
    return {
      email: 'badmashbcha0@gmail.com',
      name: 'Badmash Bcha',
    };
  });

  // Get initial values from URL query parameters or localStorage
  const [roomId, setRoomId] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('room') || generateRoomId();
  });

  const [role, setRole] = useState<UserRole>(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get('role');
    if (r === 'viewer' || r === 'host') {
      return r;
    }
    try {
      const savedRole = localStorage.getItem(STORAGE_KEY_ROLE);
      if (savedRole === 'viewer' || savedRole === 'host') {
        return savedRole;
      }
    } catch {
      // Fallback
    }
    return 'viewer';
  });

  // Supervisor view tabs: 'app_ui' (Mockup design), 'home' (8 metrics), 'live' (video stage), 'showcase' (7 screens)
  const [supervisorTab, setSupervisorTab] = useState<'app_ui' | 'home' | 'live' | 'showcase'>('app_ui');
  // Host view tabs: 'child_phone' (Exact 3 screenshots: Realme RMX5313), 'app_ui' (Mockup games/social), or 'screen_hub'
  const [hostViewMode, setHostViewMode] = useState<'child_phone' | 'app_ui' | 'screen_hub'>('child_phone');

  const [userName, setUserName] = useState<string>(() => {
    return role === 'host' ? 'Target Device' : 'Supervisor / Parent';
  });

  // UI state for guide / modals
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [isRecordingsModalOpen, setIsRecordingsModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeGuidance, setActiveGuidance] = useState<{
    text: string;
    severity: string;
    senderName: string;
  } | null>(null);

  // Sync role and room to URL without reload
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomId);
    url.searchParams.set('role', role);
    window.history.replaceState({}, '', url.toString());
  }, [roomId, role]);

  // Hook: WebRTC & WebSocket Real-time Signaling
  const {
    isConnected,
    clientId,
    roomState,
    screenStream,
    cameraStream,
    ambientAudioStream,
    isScreenSharing,
    isCameraActive,
    isMicActive,
    isHighSensitivity,
    setIsHighSensitivity,
    isTalkbackActive,
    cameraFacingMode,
    pendingCameraRequest,
    pendingScreenRequest,
    pendingMicRequest,
    pendingLocationRequest,
    deviceLocation,
    setPendingCameraRequest,
    setPendingScreenRequest,
    setPendingMicRequest,
    setPendingLocationRequest,
    remotePointer,
    pingMarkers,
    drawStrokes,
    chatMessages,
    deviceTelemetry,
    startScreenShare,
    stopScreenShare,
    startCamera,
    stopCamera,
    switchCameraFacing,
    startMicrophone,
    stopMicrophone,
    toggleMicrophone,
    startTalkback,
    stopTalkback,
    sendPointer,
    sendPing,
    sendDrawStroke,
    clearDrawStrokes,
    requestRemoteCamera,
    requestRemoteScreen,
    requestRemoteMic,
    requestRemoteLocation,
    refreshDeviceLocation,
    sendRemoteAlert,
    sendGuidanceMessage,
    sendChatMessage,
  } = useWebRTCConnection({
    roomId,
    role,
    userName,
    onGuidanceMessage: (msg) => {
      setActiveGuidance(msg);
    },
    onCameraRequest: (enable) => {
      if (enable && !isCameraActive) {
        setPendingCameraRequest(true);
      } else if (!enable && isCameraActive) {
        stopCamera();
      }
    },
  });

  // Hook: Stream Recorder (Screen / Camera recording)
  const {
    isRecording,
    isPaused,
    formattedDuration,
    recordings,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    deleteRecording,
    downloadRecording,
  } = useStreamRecorder();

  // Stream recorder and links
  const handleStartRecord = () => {
    const streamToRecord = screenStream || cameraStream;
    const audioStreamToRecord = ambientAudioStream;
    if (streamToRecord) {
      startRecording(
        streamToRecord,
        audioStreamToRecord,
        role === 'host' ? 'Target_Screen_Session' : 'Supervisor_Live_Session'
      );
    }
  };

  const handleCopyInviteLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomId);
    url.searchParams.set('role', 'viewer');
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Flow State Handlers - Persistent in localStorage
  const handleContinueWithGoogle = (email?: string, name?: string) => {
    const profile = {
      email: email || 'badmashbcha0@gmail.com',
      name: name || (email ? email.split('@')[0] : 'Badmash Bcha'),
    };
    setUserProfile(profile);
    setAppFlow('role_select');
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, 'logged_in');
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
      localStorage.setItem(STORAGE_KEY_FLOW, 'role_select');
    } catch {
      // Ignore
    }
  };

  const handleSignUpWithEmail = (email: string) => {
    const profile = {
      email,
      name: email.split('@')[0],
    };
    setUserProfile(profile);
    setAppFlow('role_select');
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, 'logged_in');
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
      localStorage.setItem(STORAGE_KEY_FLOW, 'role_select');
    } catch {
      // Ignore
    }
  };

  const handleSignIn = () => {
    setAppFlow('role_select');
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, 'logged_in');
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userProfile));
      localStorage.setItem(STORAGE_KEY_FLOW, 'role_select');
    } catch {
      // Ignore
    }
  };

  const handleSkipWelcome = () => {
    setAppFlow('role_select');
  };

  const handleSelectRole = (newRole: UserRole) => {
    setRole(newRole);
    setUserName(newRole === 'host' ? 'Target Device' : 'Supervisor / Parent');
    setAppFlow('dashboard');
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, 'logged_in');
      localStorage.setItem(STORAGE_KEY_ROLE, newRole);
      localStorage.setItem(STORAGE_KEY_FLOW, 'dashboard');
    } catch {
      // Ignore
    }
  };

  // Sign out is EXCLUSIVELY available for Parent / Mine view
  const handleSignOut = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
      localStorage.removeItem(STORAGE_KEY_ROLE);
      localStorage.removeItem(STORAGE_KEY_FLOW);
    } catch {
      // Ignore
    }
    setAppFlow('welcome');
  };

  // Handle popstate on role selection screen to allow step back
  useEffect(() => {
    if (appFlow === 'role_select') {
      window.history.pushState({ screen: 'role_select' }, '');
      const handlePop = () => {
        // Step back to welcome
        setAppFlow('welcome');
      };
      window.addEventListener('popstate', handlePop, { once: true });
      return () => {
        window.removeEventListener('popstate', handlePop);
      };
    }
  }, [appFlow]);

  // FIRST SCREENSHOT: Welcome & Onboarding with Google / Sign up
  if (appFlow === 'welcome') {
    return (
      <div className="min-h-screen bg-slate-900/10 flex flex-col justify-center sm:py-6">
        <OnboardingWelcomeScreen
          onContinueWithGoogle={handleContinueWithGoogle}
          onSignUpWithEmail={handleSignUpWithEmail}
          onSignIn={handleSignIn}
          onSkip={handleSkipWelcome}
        />
      </div>
    );
  }

  // SECOND SCREENSHOT: Role Selection ("Whose device is this?")
  if (appFlow === 'role_select') {
    return (
      <div className="min-h-screen bg-slate-900/10 flex flex-col justify-center sm:py-6">
        <DeviceRoleSelectionScreen
          userEmail={userProfile.email}
          userName={userProfile.name}
          roomId={roomId}
          onSelectRole={handleSelectRole}
          onSignOut={handleSignOut}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Application Header: Clean ViewSync Logo and Name Only - No role switching from header */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto px-4 h-13 flex items-center justify-between">
          {/* Logo & Brand Only as requested */}
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/file_00000000da108211b0e62540220f79da_6786b4ce.png"
              alt="ViewSync"
              className="w-8 h-8 rounded-xl shadow-md border border-indigo-500/30 object-cover"
            />
            <h1 className="font-extrabold text-base tracking-tight text-white">
              ViewSync
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>💻 Laptop &amp; Desktop Console Ready</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-start p-0">
        {role === 'host' ? (
          /* EXACT CHILD MOBILE SCREENSHOT EXPERIENCE (Realme RMX5313) - Separate screen with no switch or logout */
          <ChildPhoneContainer
            telemetry={deviceTelemetry}
            guardianEmail="badmashbcha1@gmail.com"
            initialDeviceName="Realme RMX5313"
            onStartScreenShare={startScreenShare}
            onStopScreenShare={stopScreenShare}
            isScreenSharing={isScreenSharing}
            onRefreshLocation={refreshDeviceLocation}
            onSendSOSAlert={() => sendRemoteAlert('bell', 'Child Emergency SOS Alert from Realme RMX5313')}
          />
        ) : (
          /* EXACT MINE / PARENT MOBILE EXPERIENCE - Separate screen, sign out allowed only here */
          <ParentDashboardContainer
            telemetry={deviceTelemetry}
            childDeviceName="Realme RMX5313"
            userEmail={userProfile.email}
            userName={userProfile.name}
            screenStream={screenStream}
            cameraStream={cameraStream}
            ambientAudioStream={ambientAudioStream}
            onSwitchCamera={switchCameraFacing}
            onRequestRemoteCamera={() => requestRemoteCamera(true, 'user')}
            onRequestRemoteScreen={() => requestRemoteScreen()}
            onRequestRemoteMic={() => requestRemoteMic(true, true)}
            onRefreshLocation={refreshDeviceLocation}
            onSendAlertRing={() => sendRemoteAlert('bell', 'Parent Attention Chime from Supervisor')}
            onSignOut={handleSignOut}
          />
        )}
      </main>

      {/* Recorded Videos Modal */}
      <RecordedVideosModal
        isOpen={isRecordingsModalOpen}
        onClose={() => setIsRecordingsModalOpen(false)}
        recordings={recordings}
        onDelete={deleteRecording}
        onDownload={downloadRecording}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ViewSync • Parental Control & Screen Assist Engine</span>
          <span className="text-slate-400">
            सहमति व अनुमति आधारित: Geolocation, Camera, Mic & Display Capture requires browser consent.
          </span>
        </div>
      </footer>
    </div>
  );
}
