export type UserRole = 'host' | 'viewer';

export interface Participant {
  id: string;
  role: UserRole;
  name: string;
}

export interface RoomState {
  roomId: string;
  hostId?: string;
  hasHost: boolean;
  participants: Participant[];
  viewerCount: number;
}

export interface RemotePointer {
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  active: boolean;
  senderName: string;
}

export interface PingMarker {
  id: string;
  x: number;
  y: number;
  label?: string;
  timestamp: number;
}

export interface DrawStroke {
  color: string;
  width: number;
  points: { x: number; y: number }[]; // normalized 0 to 1
}

export interface ChatMessage {
  id: string;
  fromId: string;
  senderName: string;
  role: UserRole;
  text: string;
  timestamp: number;
}

export interface DeviceLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  permissionGranted: boolean;
}

export interface ActivityEvent {
  id: string;
  type: 'screen_share' | 'camera_view' | 'ambient_audio' | 'alert_sent' | 'location_sync' | 'guidance';
  title: string;
  description: string;
  timestamp: number;
  severity?: 'info' | 'warning' | 'urgent';
}

export interface ScreenTimeCategory {
  category: string;
  minutes: number;
  color: string;
  percent: number;
}

export interface ScreenTimeReport {
  totalMinutes: number;
  dailyGoalMinutes: number;
  categories: ScreenTimeCategory[];
  hourlyDistribution: number[]; // 24 hours
}

export interface DeviceTelemetry {
  deviceName: string;
  osPlatform: string;
  browser: string;
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
  batteryLevel?: number | null;
  isCharging?: boolean | null;
  batteryHealth?: string;
  online: boolean;
  hasScreenTrack: boolean;
  hasCameraTrack: boolean;
  hasMicTrack: boolean;
  lastActiveTime: number;
  lastUpdated: number;
  location?: DeviceLocation | null;
  screenTimeMinutes: number;
  screenTimeSeconds?: number;
  screenTimeFormatted?: string;
  usedApps?: { name: string; category: string; icon: string; lastOpened: number }[];
  latencyMs?: number;
}

export interface RecordedSession {
  id: string;
  title: string;
  url: string;
  blob: Blob;
  durationSeconds: number;
  timestamp: number;
  sizeBytes: number;
}
