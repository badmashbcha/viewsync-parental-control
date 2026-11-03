import React, { useState } from 'react';
import { ParentHomeScreen } from './ParentHomeScreen';
import { ParentLocationScreen } from './ParentLocationScreen';
import { ParentFamilyTab } from './ParentFamilyTab';
import { ParentMyProfileTab } from './ParentMyProfileTab';
import { ParentRemoteViewerModals } from './ParentRemoteViewerModals';
import { DeviceTelemetry } from '../../types';
import { subscribeToChildDevice, updateRemoteControlInCloud, CloudDeviceData } from '../../services/firebase';

interface ParentDashboardContainerProps {
  telemetry?: DeviceTelemetry | null;
  childDeviceName?: string;
  userEmail?: string;
  userName?: string;
  screenStream?: MediaStream | null;
  cameraStream?: MediaStream | null;
  ambientAudioStream?: MediaStream | null;
  onSwitchCamera?: () => void;
  onRequestRemoteCamera?: () => void;
  onRequestRemoteScreen?: () => void;
  onRequestRemoteMic?: () => void;
  onRefreshLocation?: () => void;
  onSendAlertRing?: () => void;
  onSignOut?: () => void;
}

export const ParentDashboardContainer: React.FC<ParentDashboardContainerProps> = ({
  telemetry,
  childDeviceName = 'Realme RMX5313',
  userEmail = 'badmashbcha0@gmail.com',
  userName = 'Badmash Bcha',
  screenStream,
  cameraStream,
  ambientAudioStream,
  onSwitchCamera,
  onRequestRemoteCamera,
  onRequestRemoteScreen,
  onRequestRemoteMic,
  onRefreshLocation,
  onSendAlertRing,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<'device' | 'location' | 'family' | 'my'>('device');
  const [tabStack, setTabStack] = useState<Array<'device' | 'location' | 'family' | 'my'>>(['device']);
  const [activeRemoteModal, setActiveRemoteModal] = useState<'camera' | 'screen' | 'audio' | null>(null);
  const [selectedDevice, setSelectedDevice] = useState(childDeviceName);

  // Real-time Cloud Firestore child device listener
  const [cloudChildData, setCloudChildData] = useState<CloudDeviceData | null>(null);

  React.useEffect(() => {
    const unsub = subscribeToChildDevice('realme-rmx5313', (data) => {
      setCloudChildData(data);
    });
    return () => unsub();
  }, []);

  // Merge local signaling telemetry with cloud Firestore telemetry
  const mergedTelemetry: DeviceTelemetry | null = React.useMemo(() => {
    if (!telemetry && !cloudChildData) return null;
    return {
      deviceName: cloudChildData?.deviceName || telemetry?.deviceName || 'Realme RMX5313',
      osPlatform: telemetry?.osPlatform || 'Android 14 (Realme UI 5.0)',
      browser: telemetry?.browser || 'Chrome Mobile',
      screenWidth: telemetry?.screenWidth || 1080,
      screenHeight: telemetry?.screenHeight || 2400,
      userAgent: telemetry?.userAgent || 'Mozilla/5.0 (Linux; Android 14; Realme RMX5313)',
      batteryLevel: cloudChildData?.realBatteryLevel ?? telemetry?.batteryLevel ?? 36,
      isCharging: cloudChildData?.isCharging ?? telemetry?.isCharging ?? false,
      online: true,
      hasScreenTrack: telemetry?.hasScreenTrack ?? false,
      hasCameraTrack: telemetry?.hasCameraTrack ?? false,
      hasMicTrack: telemetry?.hasMicTrack ?? false,
      lastActiveTime: cloudChildData?.lastSeen ?? telemetry?.lastActiveTime ?? Date.now(),
      lastUpdated: cloudChildData?.lastSeen ?? telemetry?.lastUpdated ?? Date.now(),
      screenTimeMinutes: cloudChildData?.screenTimeSeconds
        ? Math.round(cloudChildData.screenTimeSeconds / 60)
        : telemetry?.screenTimeMinutes ?? 102,
      screenTimeSeconds: cloudChildData?.screenTimeSeconds ?? telemetry?.screenTimeSeconds ?? 6120,
      location: telemetry?.location ?? (cloudChildData?.lastLocation ? {
        latitude: cloudChildData.lastLocation.latitude,
        longitude: cloudChildData.lastLocation.longitude,
        address: cloudChildData.lastLocation.address,
        accuracy: 10,
        timestamp: cloudChildData.lastLocation.timestamp,
        permissionGranted: true,
      } : undefined),
    };
  }, [telemetry, cloudChildData]);

  // Navigate to tab with history tracking
  const handleNavigateTab = (tab: 'device' | 'location' | 'family' | 'my') => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setTabStack((prev) => [...prev, tab]);
    window.history.pushState({ parentTab: tab }, '');
  };

  // Open remote live modal (camera/screen/audio) with history tracking
  const handleOpenRemoteModal = (type: 'camera' | 'screen' | 'audio') => {
    setActiveRemoteModal(type);
    window.history.pushState({ remoteModal: type }, '');
  };

  const handleCloseRemoteModal = () => {
    setActiveRemoteModal(null);
  };

  // Back button handling across Parent dashboard (popstate)
  React.useEffect(() => {
    const handlePopState = () => {
      // 1. If remote modal is open, close it first
      if (activeRemoteModal) {
        setActiveRemoteModal(null);
        return;
      }
      // 2. If on a sub-tab (location, family, my), go back to previous tab
      setTabStack((prev) => {
        if (prev.length > 1) {
          const nextStack = prev.slice(0, prev.length - 1);
          const previousTab = nextStack[nextStack.length - 1];
          setActiveTab(previousTab);
          return nextStack;
        }
        return prev;
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeRemoteModal]);

  return (
    <div className="w-full flex flex-col items-center justify-start p-0 sm:py-2">
      {/* Tab Screen Content */}
      {activeTab === 'device' && (
        <ParentHomeScreen
          telemetry={mergedTelemetry}
          childDeviceName={selectedDevice}
          onOpenRemoteCamera={() => handleOpenRemoteModal('camera')}
          onOpenScreenMirroring={() => handleOpenRemoteModal('screen')}
          onOpenOneWayAudio={() => handleOpenRemoteModal('audio')}
          onNavigateTab={handleNavigateTab}
          activeBottomTab={activeTab}
          onSwitchDevice={(name) => setSelectedDevice(name)}
        />
      )}

      {activeTab === 'location' && (
        <ParentLocationScreen
          telemetry={mergedTelemetry}
          childDeviceName={selectedDevice}
          onNavigateTab={handleNavigateTab}
          onRefreshLocation={onRefreshLocation}
        />
      )}

      {activeTab === 'family' && (
        <ParentFamilyTab
          childDeviceName={selectedDevice}
          onNavigateTab={handleNavigateTab}
          onSendAlertRing={onSendAlertRing}
        />
      )}

      {activeTab === 'my' && (
        <ParentMyProfileTab
          userEmail={userEmail}
          userName={userName}
          onNavigateTab={handleNavigateTab}
          onSignOut={onSignOut || (() => {})}
        />
      )}

      {/* Working Remote Modals (Remote Camera, Screen Mirroring, One-Way Audio) */}
      <ParentRemoteViewerModals
        modalType={activeRemoteModal}
        onClose={() => setActiveRemoteModal(null)}
        screenStream={screenStream}
        cameraStream={cameraStream}
        ambientAudioStream={ambientAudioStream}
        onSwitchCamera={onSwitchCamera}
        onRequestRemoteCamera={onRequestRemoteCamera}
        onRequestRemoteScreen={onRequestRemoteScreen}
        onRequestRemoteMic={onRequestRemoteMic}
        childDeviceName={selectedDevice}
      />
    </div>
  );
};
