import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  BatteryCharging,
  Layers,
  Wifi,
  Sparkles,
  Zap,
} from 'lucide-react';

interface ChildBackgroundRunningScreenProps {
  onBack: () => void;
}

export const ChildBackgroundRunningScreen: React.FC<ChildBackgroundRunningScreenProps> = ({
  onBack,
}) => {
  const [autoStart, setAutoStart] = useState(true);
  const [batteryOptimization, setBatteryOptimization] = useState(true);
  const [recentTasksLock, setRecentTasksLock] = useState(true);
  const [backgroundData, setBackgroundData] = useState(true);
  const [testingSync, setTestingSync] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestSync = () => {
    setTestingSync(true);
    setTestResult(null);
    setTimeout(() => {
      setTestingSync(false);
      setTestResult('Background sync is healthy! Device is communicating seamlessly with guardian.');
    }, 1200);
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-[720px] bg-white text-slate-800 flex flex-col justify-between overflow-hidden shadow-2xl select-none sm:rounded-[36px] sm:border sm:border-slate-300">
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center gap-4 px-4 py-4 pt-5 border-b border-slate-100 bg-white">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="p-1.5 -ml-1.5 rounded-full text-slate-800 hover:bg-slate-100 transition active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Keep Running in Background</h1>
        </div>

        {/* Info Banner */}
        <div className="p-4 bg-emerald-50/60 border-b border-emerald-100/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-900">Ensure Uninterrupted Protection</h4>
            <p className="text-[11.5px] text-emerald-700 mt-0.5 leading-relaxed">
              Android may automatically close apps running in the background to save battery. Enable these settings so ViewSync Kids continues protecting this phone.
            </p>
          </div>
        </div>

        {/* Toggles List */}
        <div className="divide-y divide-slate-100 px-4 py-2 space-y-1">
          {/* 1. Auto Start */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-start gap-3.5 pr-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Auto-Start Permission</h4>
                <p className="text-xs text-slate-500 mt-0.5">Allow app to launch automatically when device restarts</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={autoStart}
              onClick={() => setAutoStart(!autoStart)}
              className={`w-12 h-6.5 rounded-full p-0.5 transition-colors relative flex items-center shrink-0 ${
                autoStart ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  autoStart ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* 2. Battery Optimization */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-start gap-3.5 pr-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Battery Optimization (Unrestricted)</h4>
                <p className="text-xs text-slate-500 mt-0.5">Prevent OS from suspending app during sleep</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={batteryOptimization}
              onClick={() => setBatteryOptimization(!batteryOptimization)}
              className={`w-12 h-6.5 rounded-full p-0.5 transition-colors relative flex items-center shrink-0 ${
                batteryOptimization ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  batteryOptimization ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* 3. Lock in Recents */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-start gap-3.5 pr-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Lock in Recent Tasks</h4>
                <p className="text-xs text-slate-500 mt-0.5">Keeps ViewSync Kids pinned in memory task list</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={recentTasksLock}
              onClick={() => setRecentTasksLock(!recentTasksLock)}
              className={`w-12 h-6.5 rounded-full p-0.5 transition-colors relative flex items-center shrink-0 ${
                recentTasksLock ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  recentTasksLock ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* 4. Background Data */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-start gap-3.5 pr-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Background Data &amp; WiFi</h4>
                <p className="text-xs text-slate-500 mt-0.5">Allow real-time location and screen time sync</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={backgroundData}
              onClick={() => setBackgroundData(!backgroundData)}
              className={`w-12 h-6.5 rounded-full p-0.5 transition-colors relative flex items-center shrink-0 ${
                backgroundData ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                  backgroundData ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Test Connection Button */}
        <div className="px-5 py-4 mt-auto">
          <button
            type="button"
            onClick={handleTestSync}
            disabled={testingSync}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${testingSync ? 'animate-spin' : ''}`} />
            <span>{testingSync ? 'Checking Background Status...' : 'Test Background Connection'}</span>
          </button>

          {testResult && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium text-center">
              {testResult}
            </div>
          )}
        </div>
      </div>

      {/* Android Bottom Navigation */}
      <div className="bg-white border-t border-slate-100 py-2.5 px-10 flex items-center justify-around text-slate-400">
        <button type="button" className="p-1 hover:text-slate-600 transition" aria-label="Recent apps">
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current stroke-2 fill-none">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
        <button type="button" onClick={onBack} className="p-1 hover:text-slate-600 transition" aria-label="Home">
          <div className="w-3.5 h-3.5 rounded-sm border-2 border-current" />
        </button>
        <button type="button" onClick={onBack} className="p-1 hover:text-slate-600 transition" aria-label="Back">
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current stroke-2 fill-none">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
