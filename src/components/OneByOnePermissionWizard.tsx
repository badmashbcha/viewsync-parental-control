import React, { useState } from 'react';
import {
  Monitor,
  Video,
  Mic,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Shield,
  Sparkles,
  X,
  ChevronRight,
} from 'lucide-react';

interface OneByOnePermissionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  isScreenSharing: boolean;
  isCameraActive: boolean;
  isMicActive: boolean;
  hasLocation: boolean;
  onGrantScreen: () => void;
  onGrantCamera: () => void;
  onGrantMic: () => void;
  onGrantLocation: () => void;
}

export const OneByOnePermissionWizard: React.FC<OneByOnePermissionWizardProps> = ({
  isOpen,
  onClose,
  isScreenSharing,
  isCameraActive,
  isMicActive,
  hasLocation,
  onGrantScreen,
  onGrantCamera,
  onGrantMic,
  onGrantLocation,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (!isScreenSharing) return 1;
    if (!isCameraActive) return 2;
    if (!isMicActive) return 3;
    if (!hasLocation) return 4;
    return 1;
  });

  if (!isOpen) return null;

  const totalSteps = 4;
  const grantedCount = [isScreenSharing, isCameraActive, isMicActive, hasLocation].filter(Boolean).length;
  const allGranted = grantedCount === 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/file_00000000da108211b0e62540220f79da_6786b4ce.png"
              alt="ViewSync"
              className="w-12 h-12 rounded-2xl shadow-lg border border-indigo-500/40 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-lg">
                  ViewSync Setup Wizard
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Saamne wale ke phone par one-by-one saare permissions activate karein
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-emerald-400 to-amber-400 h-full transition-all duration-300"
            style={{ width: `${(grantedCount / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Tabs Navigation */}
        <div className="grid grid-cols-4 border-b border-slate-800 text-xs font-semibold text-center bg-slate-950/60">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`py-3 flex flex-col items-center gap-1 transition ${
              currentStep === 1
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-950/20 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1">
              <Monitor className="w-3.5 h-3.5" />
              <span>1. Screen</span>
            </div>
            {isScreenSharing && (
              <span className="text-[10px] text-emerald-400 font-normal">✓ Allowed</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`py-3 flex flex-col items-center gap-1 transition ${
              currentStep === 2
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-950/20 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1">
              <Video className="w-3.5 h-3.5" />
              <span>2. Camera</span>
            </div>
            {isCameraActive && (
              <span className="text-[10px] text-emerald-400 font-normal">✓ Allowed</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className={`py-3 flex flex-col items-center gap-1 transition ${
              currentStep === 3
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-950/20 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1">
              <Mic className="w-3.5 h-3.5" />
              <span>3. Voice</span>
            </div>
            {isMicActive && (
              <span className="text-[10px] text-emerald-400 font-normal">✓ Allowed</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentStep(4)}
            className={`py-3 flex flex-col items-center gap-1 transition ${
              currentStep === 4
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-950/20 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>4. GPS</span>
            </div>
            {hasLocation && (
              <span className="text-[10px] text-emerald-400 font-normal">✓ Allowed</span>
            )}
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-5">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <Monitor className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Step 1: Screen Share Permission (स्क्रीन शेयर अनुमति)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Supervisor aapke phone ya computer ki screen live dekh sakega.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p>
                  Button click karte hi browser screen picker dialog kholega.
                  Wahan se <strong>"Entire Screen"</strong> ya application chunein aur <strong>"Share"</strong> dabayein.
                </p>
                {typeof navigator !== 'undefined' && (!navigator.mediaDevices || typeof navigator.mediaDevices.getDisplayMedia !== 'function') && (
                  <div className="p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-[11px] leading-relaxed">
                    📱 <strong>Mobile Browser:</strong> Mobile OS (Android/iOS) restrictions ke karan ViewSync automatically live device status, clock, battery & usage stream transmit karega.
                  </div>
                )}
                <div className="flex items-center gap-2 text-emerald-400 font-semibold pt-1">
                  <Shield className="w-4 h-4" />
                  <span>Secure WebRTC Encrypted Stream</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Status:{' '}
                  {isScreenSharing ? (
                    <strong className="text-emerald-400">Screen Active ✓</strong>
                  ) : (
                    <strong className="text-amber-400">Permission Needed</strong>
                  )}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onGrantScreen}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-lg ${
                      isScreenSharing
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    <span>{isScreenSharing ? 'Screen Already Shared' : 'Grant Screen Permission'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/40">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Step 2: Camera Eye Permission (कैमरा अनुमति)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Parental control camera preview enable karein taaki live check-in ho sake.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p>
                  Browser aapse Camera permission mangega. <strong>"Allow"</strong> par click karein.
                  Aap front ya rear camera switch bhi kar sakte hain.
                </p>
                <div className="flex items-center gap-2 text-indigo-400 font-semibold pt-1">
                  <Shield className="w-4 h-4" />
                  <span>Only Streams When Session Active</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Status:{' '}
                  {isCameraActive ? (
                    <strong className="text-emerald-400">Camera Active ✓</strong>
                  ) : (
                    <strong className="text-amber-400">Permission Needed</strong>
                  )}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onGrantCamera}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-lg ${
                      isCameraActive
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/50'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>{isCameraActive ? 'Camera Already Active' : 'Grant Camera Permission'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Step 3: Ambient Voice Access (माइक्रोफोन / वॉइस अनुमति)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Aas-pass ki baatein aur room audio sunne ke liye high-sensitivity mic.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p>
                  Browser Microphone permission mangega. <strong>"Allow"</strong> dabate hi
                  sensitive room audio transmit hona shuru ho jayega.
                </p>
                <div className="flex items-center gap-2 text-amber-400 font-semibold pt-1">
                  <Shield className="w-4 h-4" />
                  <span>High Sensitivity Room Audio</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Status:{' '}
                  {isMicActive ? (
                    <strong className="text-emerald-400">Voice Active ✓</strong>
                  ) : (
                    <strong className="text-amber-400">Permission Needed</strong>
                  )}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onGrantMic}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-lg ${
                      isMicActive
                        ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                        : 'bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-amber-950/50'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{isMicActive ? 'Microphone Active' : 'Grant Voice Permission'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Step 4: Live GPS Location (लोकेशन अनुमति)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Child safety ke liye accurate GPS location share karein.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p>
                  Browser location permission prompt karega. <strong>"Allow Location"</strong> par click karein
                  taaki latitude, longitude aur accuracy radius sync ho sake.
                </p>
                <div className="flex items-center gap-2 text-rose-400 font-semibold pt-1">
                  <Shield className="w-4 h-4" />
                  <span>Consensual Geolocation Tracking</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Status:{' '}
                  {hasLocation ? (
                    <strong className="text-emerald-400">Location Synced ✓</strong>
                  ) : (
                    <strong className="text-amber-400">Permission Needed</strong>
                  )}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onGrantLocation}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-lg ${
                      hasLocation
                        ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{hasLocation ? 'Location Granted' : 'Grant GPS Permission'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">
              {grantedCount} of {totalSteps} Permissions Active
            </span>
            {allGranted && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Ready
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Close Wizard
          </button>
        </div>
      </div>
    </div>
  );
};
