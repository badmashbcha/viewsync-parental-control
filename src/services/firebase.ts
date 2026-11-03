/**
 * ViewSync Firebase Cloud Database & Authentication Service
 * 
 * Provides:
 * 1. Persistent cross-device state synchronization via Firestore
 * 2. Real-time child device telemetry streaming to Firestore
 * 3. Real-time listener for parent dashboard
 * 4. Instant block & downtime sync across devices
 * 5. Daily historical activity logging
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as fbSignOut } from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  onSnapshot,
  collection,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with custom Database ID
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Connection test helper
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'devices', 'health-check'));
    return true;
  } catch (err: any) {
    if (err?.message?.includes('the client is offline')) {
      console.warn('Firestore offline:', err.message);
      return false;
    }
    // Connection works even if document doesn't exist
    return true;
  }
}

// Immediate connection test on boot
testFirestoreConnection();

export interface CloudDeviceData {
  deviceId: string;
  deviceName: string;
  guardianEmail: string;
  guardianPin?: string;
  bindingCode: string;
  realBatteryLevel: number;
  isCharging: boolean;
  screenTimeSeconds: number;
  isInstantBlocked: boolean;
  downtimeActive: boolean;
  downtimeSchedule?: { start: string; end: string; days: string[] };
  managedApps?: Array<{ name: string; category: string; limit: string; blocked: boolean; icon: string }>;
  blockedWebsites?: string[];
  lastLocation?: {
    latitude: number;
    longitude: number;
    address: string;
    timestamp: number;
  };
  activeRemoteControl?: {
    type: 'tap' | 'back' | 'home' | 'recents' | 'scroll_up' | 'scroll_down' | 'type_text' | 'wake_screen';
    payload?: any;
    timestamp: number;
  };
  lastSeen: number;
}

/**
 * Parent Device: Send remote control command to child phone (AnyDesk Mode)
 */
export async function sendRemoteCommandToDevice(
  deviceId: string,
  command: {
    type: 'tap' | 'back' | 'home' | 'recents' | 'scroll_up' | 'scroll_down' | 'type_text' | 'wake_screen';
    payload?: any;
  }
): Promise<void> {
  try {
    const ref = doc(db, 'devices', deviceId);
    await setDoc(
      ref,
      {
        activeRemoteControl: {
          ...command,
          timestamp: Date.now(),
        },
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Failed to send remote command to cloud:', err);
  }
}

/**
 * Child Device: Sync live telemetry & state to Firestore
 */
export async function syncDeviceToCloud(data: Partial<CloudDeviceData> & { deviceId: string }): Promise<void> {
  try {
    const ref = doc(db, 'devices', data.deviceId);
    await setDoc(
      ref,
      {
        ...data,
        lastSeen: Date.now(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Failed to sync device to cloud:', err);
  }
}

/**
 * Parent Device: Subscribe to real-time updates for child device
 */
export function subscribeToChildDevice(
  deviceId: string,
  onUpdate: (data: CloudDeviceData) => void
): () => void {
  const ref = doc(db, 'devices', deviceId);
  const unsubscribe = onSnapshot(
    ref,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as CloudDeviceData);
      }
    },
    (err) => {
      console.warn('Child device subscription error:', err);
    }
  );
  return unsubscribe;
}

/**
 * Parent Device: Update remote controls in cloud (Instant Block / Downtime / PIN / Apps)
 */
export async function updateRemoteControlInCloud(
  deviceId: string,
  controls: {
    isInstantBlocked?: boolean;
    downtimeActive?: boolean;
    guardianPin?: string;
    downtimeSchedule?: { start: string; end: string; days: string[] };
    managedApps?: Array<{ name: string; category: string; limit: string; blocked: boolean; icon: string }>;
    blockedWebsites?: string[];
  }
): Promise<void> {
  try {
    const ref = doc(db, 'devices', deviceId);
    await setDoc(ref, controls, { merge: true });
  } catch (err) {
    console.warn('Failed to update remote control in cloud:', err);
  }
}

/**
 * Child / Parent: Save daily activity record to subcollection
 */
export async function saveActivityLogToCloud(
  deviceId: string,
  dateStr: string,
  screenTimeSeconds: number,
  appsSummary: string
): Promise<void> {
  try {
    const ref = doc(db, 'devices', deviceId, 'activityLogs', dateStr);
    await setDoc(
      ref,
      {
        logId: dateStr,
        deviceId,
        date: dateStr,
        screenTimeSeconds,
        appsUsedSummary: appsSummary,
        lastUpdated: Date.now(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Failed to save activity log to cloud:', err);
  }
}

/**
 * Child Device: Save GPS Location coordinates to subcollection
 */
export async function saveLocationLogToCloud(
  deviceId: string,
  location: { latitude: number; longitude: number; address: string }
): Promise<void> {
  try {
    const timestamp = Date.now();
    const locId = `loc_${timestamp}`;
    const ref = doc(db, 'devices', deviceId, 'locations', locId);
    await setDoc(ref, {
      locationId: locId,
      deviceId,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
      timestamp,
    });

    // Also update parent device doc's lastLocation
    await setDoc(
      doc(db, 'devices', deviceId),
      {
        lastLocation: {
          ...location,
          timestamp,
        },
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Failed to save location log to cloud:', err);
  }
}
