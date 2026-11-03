/**
 * Real Child Device Activity & Telemetry Tracker
 * 
 * Accurately tracks:
 * 1. Real screen time (active in-app duration)
 * 2. Real used apps/features opened by the child
 * 3. Daily 12:00 AM (midnight) automated reset to 0
 * 4. Real hardware battery percentage & charging status via navigator.getBattery()
 */

export interface TrackedApp {
  name: string;
  category: string;
  icon: string;
  firstOpened: number;
  lastOpened: number;
}

export interface DailyActivityRecord {
  date: string; // 'YYYY-MM-DD'
  screenTimeSeconds: number;
  appsUsed: TrackedApp[];
  lastResetTimestamp: number;
}

const STORAGE_KEY_PREFIX = 'viewsync_child_daily_';
const STORAGE_CURRENT_DATE_KEY = 'viewsync_child_current_date';

// Format YYYY-MM-DD for local date
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format seconds into readable "2h 18m" or "14m" or "45s"
export function formatScreenTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const remSec = s % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${remSec}s`;
}

// Default initial state for a fresh day (starts with ViewSync Home)
export function createFreshDayRecord(dateStr: string): DailyActivityRecord {
  return {
    date: dateStr,
    screenTimeSeconds: 0,
    appsUsed: [
      {
        name: 'ViewSync Home',
        category: 'System',
        icon: '📱',
        firstOpened: Date.now(),
        lastOpened: Date.now(),
      },
    ],
    lastResetTimestamp: Date.now(),
  };
}

// Load daily record with automatic 12:00 AM midnight reset check
export function loadTodayActivityRecord(): DailyActivityRecord {
  const todayStr = getLocalDateString();
  const storedDate = localStorage.getItem(STORAGE_CURRENT_DATE_KEY);

  // If new day (midnight crossed), create fresh record
  if (storedDate !== todayStr) {
    const newRecord = createFreshDayRecord(todayStr);
    saveDailyActivityRecord(newRecord);
    localStorage.setItem(STORAGE_CURRENT_DATE_KEY, todayStr);
    return newRecord;
  }

  const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${todayStr}`);
  if (!raw) {
    const fresh = createFreshDayRecord(todayStr);
    saveDailyActivityRecord(fresh);
    return fresh;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.date !== todayStr) {
      const fresh = createFreshDayRecord(todayStr);
      saveDailyActivityRecord(fresh);
      return fresh;
    }
    return parsed;
  } catch (e) {
    const fresh = createFreshDayRecord(todayStr);
    saveDailyActivityRecord(fresh);
    return fresh;
  }
}

// Save daily record to localStorage
export function saveDailyActivityRecord(record: DailyActivityRecord): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${record.date}`, JSON.stringify(record));
    localStorage.setItem(STORAGE_CURRENT_DATE_KEY, record.date);
  } catch (e) {
    console.warn('Failed to save activity record:', e);
  }
}

// Record an app/feature opening
export function recordAppUsage(
  appName: string,
  category: string = 'App',
  icon: string = '🎮'
): DailyActivityRecord {
  let record = loadTodayActivityRecord();
  const todayStr = getLocalDateString();

  // If midnight crossed during session
  if (record.date !== todayStr) {
    record = createFreshDayRecord(todayStr);
  }

  const existingIdx = record.appsUsed.findIndex(
    (a) => a.name.toLowerCase() === appName.toLowerCase()
  );

  if (existingIdx >= 0) {
    record.appsUsed[existingIdx].lastOpened = Date.now();
  } else {
    record.appsUsed.push({
      name: appName,
      category,
      icon,
      firstOpened: Date.now(),
      lastOpened: Date.now(),
    });
  }

  saveDailyActivityRecord(record);
  return record;
}

// Increment active screen time
export function incrementScreenTime(secondsToAdd: number): DailyActivityRecord {
  let record = loadTodayActivityRecord();
  const todayStr = getLocalDateString();

  // Midnight reset check
  if (record.date !== todayStr) {
    record = createFreshDayRecord(todayStr);
  }

  record.screenTimeSeconds += secondsToAdd;
  saveDailyActivityRecord(record);
  return record;
}

// Real Battery Manager
export interface RealBatteryState {
  levelPercent: number; // 0 - 100
  isCharging: boolean;
  isSupported: boolean;
}

export async function fetchRealDeviceBattery(): Promise<RealBatteryState> {
  if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery();
      return {
        levelPercent: Math.round(battery.level * 100),
        isCharging: Boolean(battery.charging),
        isSupported: true,
      };
    } catch (e) {
      console.warn('Battery API call failed:', e);
    }
  }

  // Fallback if browser doesn't support Battery API
  return {
    levelPercent: 78,
    isCharging: false,
    isSupported: false,
  };
}

export function subscribeToRealBattery(
  onUpdate: (battery: RealBatteryState) => void
): () => void {
  let batteryObj: any = null;

  const updateHandler = () => {
    if (batteryObj) {
      onUpdate({
        levelPercent: Math.round(batteryObj.level * 100),
        isCharging: Boolean(batteryObj.charging),
        isSupported: true,
      });
    }
  };

  if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
    (navigator as any)
      .getBattery()
      .then((batt: any) => {
        batteryObj = batt;
        updateHandler();
        batt.addEventListener('levelchange', updateHandler);
        batt.addEventListener('chargingchange', updateHandler);
      })
      .catch(() => {
        onUpdate({ levelPercent: 78, isCharging: false, isSupported: false });
      });
  } else {
    onUpdate({ levelPercent: 78, isCharging: false, isSupported: false });
  }

  return () => {
    if (batteryObj) {
      try {
        batteryObj.removeEventListener('levelchange', updateHandler);
        batteryObj.removeEventListener('chargingchange', updateHandler);
      } catch (_) {}
    }
  };
}
