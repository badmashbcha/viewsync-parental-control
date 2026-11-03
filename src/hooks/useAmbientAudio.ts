import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAmbientAudioOptions {
  stream: MediaStream | null;
  initialVolume?: number;
}

export function useAmbientAudio({ stream, initialVolume = 1.0 }: UseAmbientAudioOptions) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(initialVolume);
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 100
  const [isAudioContextRunning, setIsAudioContextRunning] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize or resume AudioContext
  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().then(() => {
        setIsAudioContextRunning(true);
      }).catch(() => {});
    } else if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      setIsAudioContextRunning(true);
    }
    return audioCtxRef.current;
  }, []);

  // Set up audio pipeline when stream changes
  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) {
      setAudioLevel(0);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const ctx = ensureAudioContext();
    if (!ctx) return;

    try {
      // Disconnect previous if any
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }

      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
      gainNodeRef.current = gainNode;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Connect: source -> gain -> analyser -> destination
      source.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(ctx.destination);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      // Meter animation loop
      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Compute average root-mean-square energy
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);

        animFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch (err) {
      console.warn('Error setting up ambient audio pipeline:', err);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch (_) {}
      }
    };
  }, [stream, ensureAudioContext, isMuted, volume]);

  // Adjust volume / gain booster (0 to 3x)
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (gainNodeRef.current && audioCtxRef.current) {
      const targetGain = isMuted ? 0 : newVolume;
      gainNodeRef.current.gain.setValueAtTime(targetGain, audioCtxRef.current.currentTime);
    }
  }, [isMuted]);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setValueAtTime(
          next ? 0 : volume,
          audioCtxRef.current.currentTime
        );
      }
      return next;
    });
  }, [volume]);

  // Resume context on user click (browser autoplay policy)
  const enableAudioPlayback = useCallback(() => {
    ensureAudioContext();
  }, [ensureAudioContext]);

  return {
    isMuted,
    volume,
    audioLevel,
    isAudioContextRunning,
    setVolume,
    toggleMute,
    enableAudioPlayback,
  };
}
