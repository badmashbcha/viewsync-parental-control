import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Shield,
  Layers,
  RefreshCw,
  ExternalLink,
  Wifi,
  Sparkles,
  Tv,
} from 'lucide-react';
import { ChildHomeScreen } from './ChildHomeScreen';
import { ChildParentalSettingsScreen } from './ChildParentalSettingsScreen';
import { ChildPermissionsScreen } from './ChildPermissionsScreen';
import { ChildBackgroundRunningScreen } from './ChildBackgroundRunningScreen';
import { ChildFamilyScreen } from './ChildFamilyScreen';
import { DeviceTelemetry } from '../../types';
import { subscribeToRealBattery, loadTodayActivityRecord, formatScreenTime } from '../../utils/childActivityTracker';
import { syncDeviceToCloud, subscribeToChildDevice, saveActivityLogToCloud } from '../../services/firebase';

export type ChildScreenRoute =
  | 'home'
  | 'parental_settings'
  | 'permissions'
  | 'background_run'
  | 'family';

interface ChildPhoneContainerProps {
  telemetry?: DeviceTelemetry | null;
  guardianEmail?: string;
  initialDeviceName?: string;
  onStartScreenShare?: () => void;
  onStopScreenShare?: () => void;
  isScreenSharing?: boolean;
  onRefreshLocation?: () => void;
  onSendSOSAlert?: () => void;
}

export const ChildPhoneContainer: React.FC<ChildPhoneContainerProps> = ({
  telemetry,
  guardianEmail = 'badmashbcha1@gmail.com',
  initialDeviceName = 'Realme RMX5313',
  onStartScreenShare,
  onStopScreenShare,
  isScreenSharing = false,
  onRefreshLocation,
  onSendSOSAlert,
}) => {
  // Navigation stack for back button step-by-step history
  const [navStack, setNavStack] = useState<ChildScreenRoute[]>(['home']);
  const currentRoute = navStack[navStack.length - 1] || 'home';

  const [deviceName, setDeviceName] = useState(initialDeviceName);
  const [isIconHidden, setIsIconHidden] = useState(false);

  // Cloud Remote Lock State received from Parent via Firestore
  const [isInstantBlockedByParent, setIsInstantBlockedByParent] = useState(false);
  const [downtimeActiveByParent, setDowntimeActiveByParent] = useState(false);
  const [remoteTouchRipple, setRemoteTouchRipple] = useState<{ x: number; y: number } | null>(null);
  const [remoteActionBanner, setRemoteActionBanner] = useState<string | null>(null);
  const lastHandledCmdRef = useRef<number>(0);

  // Navigate forward to a new child subscreen
  const navigateTo = (nextRoute: ChildScreenRoute) => {
    setNavStack((prev) => [...prev, nextRoute]);
    window.history.pushState({ viewsync_child_route: nextRoute }, '');
  };

  // Step back 1 screen to previous option
  const handleGoBack = () => {
    if (navStack.length > 1) {
      setNavStack((prev) => prev.slice(0, prev.length - 1));
      if (window.history.state?.viewsync_child_route) {
        window.history.back();
      }
    }
  };

  // Hardware / Android browser back button handling
  useEffect(() => {
    const handlePopState = () => {
      setNavStack((prev) => {
        if (prev.length > 1) {
          return prev.slice(0, prev.length - 1);
        }
        return prev;
      });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Real hardware battery
  const [batteryState, setBatteryState] = useState<{
    levelPercent: number;
    isCharging: boolean;
  }>({
    levelPercent: telemetry?.batteryLevel != null ? Math.round(telemetry.batteryLevel) : 21,
    isCharging: Boolean(telemetry?.isCharging),
  });

  useEffect(() => {
    const unsub = subscribeToRealBattery((b) => {
      setBatteryState({
        levelPercent: b.levelPercent,
        isCharging: b.isCharging,
      });
    });
    return () => unsub();
  }, []);

  const todayRecord = loadTodayActivityRecord();
  const screenTimeFormatted = formatScreenTime(todayRecord.screenTimeSeconds);

  // Sync to Firebase Cloud every 15 seconds & listen to parent commands
  useEffect(() => {
    const deviceId = 'realme-rmx5313';

    // 1. Initial & interval sync of child state to Firestore
    const pushStateToCloud = () => {
      const record = loadTodayActivityRecord();
      syncDeviceToCloud({
        deviceId,
        deviceName,
        guardianEmail,
        bindingCode: '842 195 304',
        realBatteryLevel: batteryState.levelPercent,
        isCharging: batteryState.isCharging,
        screenTimeSeconds: record.screenTimeSeconds,
        isInstantBlocked: isInstantBlockedByParent,
        downtimeActive: downtimeActiveByParent,
      });
      // Also log daily record
      saveActivityLogToCloud(
        deviceId,
        record.date,
        record.screenTimeSeconds,
        `${record.appsUsed.length} apps active`
      );
    };

    pushStateToCloud();
    const interval = setInterval(pushStateToCloud, 15000);

    // 2. Real-time listener for parent commands from Firestore
    const unsubCloud = subscribeToChildDevice(deviceId, (cloudData) => {
      if (cloudData.isInstantBlocked !== undefined) {
        setIsInstantBlockedByParent(cloudData.isInstantBlocked);
      }
      if (cloudData.downtimeActive !== undefined) {
        setDowntimeActiveByParent(cloudData.downtimeActive);
      }
      if (
        cloudData.activeRemoteControl &&
        cloudData.activeRemoteControl.timestamp > lastHandledCmdRef.current
      ) {
        lastHandledCmdRef.current = cloudData.activeRemoteControl.timestamp;
        const cmd = cloudData.activeRemoteControl;
        if (cmd.type === 'tap' && cmd.payload) {
          setRemoteTouchRipple({ x: cmd.payload.x, y: cmd.payload.y });
          setTimeout(() => setRemoteTouchRipple(null), 1200);
        } else if (cmd.type === 'back') {
          handleGoBack();
          setRemoteActionBanner('Parent sent Remote Back ◀');
          setTimeout(() => setRemoteActionBanner(null), 2200);
        } else if (cmd.type === 'home') {
          setNavStack(['home']);
          setRemoteActionBanner('Parent sent Remote Home ⭕');
          setTimeout(() => setRemoteActionBanner(null), 2200);
        } else if (cmd.type === 'scroll_down') {
          window.scrollBy({ top: 300, behavior: 'smooth' });
          setRemoteActionBanner('Parent scrolled screen ▼');
          setTimeout(() => setRemoteActionBanner(null), 1800);
        } else if (cmd.type === 'scroll_up') {
          window.scrollBy({ top: -300, behavior: 'smooth' });
          setRemoteActionBanner('Parent scrolled screen ▲');
          setTimeout(() => setRemoteActionBanner(null), 1800);
        } else if (cmd.type === 'type_text' && cmd.payload?.text) {
          setRemoteActionBanner(`Parent typed: "${cmd.payload.text}"`);
          setTimeout(() => setRemoteActionBanner(null), 3000);
        }
      }
    });

    return () => {
      clearInterval(interval);
      unsubCloud();
    };
  }, [deviceName, guardianEmail, batteryState, isInstantBlockedByParent, downtimeActiveByParent]);

  return (
    <div className="w-full flex flex-col items-center justify-start p-0 sm:py-2">
      {/* Mobile Device Frame */}
      <div className="w-full max-w-md relative sm:p-2 sm:bg-slate-900 sm:rounded-[44px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] sm:border-4 sm:border-slate-800">
        {/* Subtle camera punch hole on frame top */}
        <div className="hidden sm:block absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border border-slate-800 z-50 pointer-events-none" />

        {/* Remote Action Feedback Banner */}
        {remoteActionBanner && (
          <div className="absolute top-12 left-4 right-4 z-50 bg-blue-600/95 text-white py-2 px-3.5 rounded-2xl shadow-xl backdrop-blur-md border border-blue-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>{remoteActionBanner}</span>
          </div>
        )}

        {/* AnyDesk Remote Touch Ripple on Child Screen */}
        {remoteTouchRipple && (
          <div
            style={{
              left: `${remoteTouchRipple.x}%`,
              top: `${remoteTouchRipple.y}%`,
            }}
            className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 border-blue-500 bg-blue-500/40 animate-ping pointer-events-none z-50 flex items-center justify-center shadow-lg"
          >
            <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
          </div>
        )}

        {/* Remote Instant Lock Warning Banner from Parent Cloud */}
        {isInstantBlockedByParent && (
          <div className="absolute top-12 left-4 right-4 z-50 bg-rose-600/95 text-white p-3 rounded-2xl shadow-xl backdrop-blur-md border border-rose-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-base">
              🔒
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-xs">Device Locked by Guardian</p>
              <p className="text-[11px] text-white/85">Instant Block active. App usage restricted by {guardianEmail}.</p>
            </div>
          </div>
        )}

        {/* Screen Content Rendered According to Current Route */}
        {currentRoute === 'home' && (
          <ChildHomeScreen
            deviceName={deviceName}
            guardianEmail={guardianEmail}
            onOpenParentalSettings={() => navigateTo('parental_settings')}
            onOpenFamilyTab={() => navigateTo('family')}
            onBack={handleGoBack}
            onUpdateDeviceName={(name) => setDeviceName(name)}
            realBatteryLevel={batteryState.levelPercent}
            isCharging={batteryState.isCharging}
          />
        )}

        {currentRoute === 'parental_settings' && (
          <ChildParentalSettingsScreen
            onBack={handleGoBack}
            onOpenFullProtection={() => navigateTo('permissions')}
            onOpenBackgroundRunning={() => navigateTo('background_run')}
            isIconHidden={isIconHidden}
            onToggleHideIcon={(hidden) => setIsIconHidden(hidden)}
          />
        )}

        {currentRoute === 'permissions' && (
          <ChildPermissionsScreen
            onBack={handleGoBack}
            isScreenSharing={isScreenSharing}
            onScreenMirroringToggle={(enabled) => {
              if (enabled) {
                onStartScreenShare?.();
              } else {
                onStopScreenShare?.();
              }
            }}
            onLocationToggle={(enabled) => {
              if (enabled) {
                onRefreshLocation?.();
              }
            }}
          />
        )}

        {currentRoute === 'background_run' && (
          <ChildBackgroundRunningScreen
            onBack={handleGoBack}
          />
        )}

        {currentRoute === 'family' && (
          <ChildFamilyScreen
            onBackToHome={handleGoBack}
            guardianEmail={guardianEmail}
            deviceName={deviceName}
            realBatteryLevel={batteryState.levelPercent}
            screenTimeFormatted={screenTimeFormatted}
            onSendSOS={onSendSOSAlert}
          />
        )}
      </div>
    </div>
  );
};
