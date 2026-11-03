import { useState, useRef, useCallback, useEffect } from 'react';
import { RecordedSession } from '../types';

export function useStreamRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordings, setRecordings] = useState<RecordedSession[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const recordingTitleRef = useRef<string>('Live Session');

  // Format seconds into MM:SS
  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = useCallback((stream: MediaStream, audioStream?: MediaStream | null, title = 'Screen Record') => {
    if (!stream || stream.getVideoTracks().length === 0) {
      console.warn('Cannot record: No active video tracks in stream');
      return false;
    }

    try {
      // Combine video and ambient audio tracks if provided
      const recordingStream = new MediaStream();
      stream.getVideoTracks().forEach((track) => recordingStream.addTrack(track));
      
      if (audioStream && audioStream.getAudioTracks().length > 0) {
        audioStream.getAudioTracks().forEach((track) => recordingStream.addTrack(track));
      } else {
        stream.getAudioTracks().forEach((track) => recordingStream.addTrack(track));
      }

      // Pick best supported MIME type
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
      ];
      const selectedMime = mimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || '';

      const recorder = new MediaRecorder(
        recordingStream,
        selectedMime ? { mimeType: selectedMime } : undefined
      );

      recordedChunksRef.current = [];
      recordingTitleRef.current = title;
      startTimeRef.current = Date.now();
      setRecordSeconds(0);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const mime = selectedMime || 'video/webm';
        const blob = new Blob(recordedChunksRef.current, { type: mime });
        const url = URL.createObjectURL(blob);
        const durationSec = Math.round((Date.now() - startTimeRef.current) / 1000);

        const newRec: RecordedSession = {
          id: Math.random().toString(36).substring(2, 9),
          title: recordingTitleRef.current,
          url,
          blob,
          durationSeconds: Math.max(1, durationSec),
          timestamp: Date.now(),
          sizeBytes: blob.size,
        };

        setRecordings((prev) => [newRec, ...prev]);
        setIsRecording(false);
        setIsPaused(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recorder.start(1000); // chunk every 1s
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);

      return true;
    } catch (err) {
      console.error('Failed to start MediaRecorder:', err);
      return false;
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const deleteRecording = useCallback((id: string) => {
    setRecordings((prev) => {
      const target = prev.find((r) => r.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((r) => r.id !== id);
    });
  }, []);

  const downloadRecording = useCallback((record: RecordedSession) => {
    const a = document.createElement('a');
    a.href = record.url;
    const dateStr = new Date(record.timestamp).toISOString().replace(/[:.]/g, '-');
    a.download = `${record.title.toLowerCase().replace(/\s+/g, '_')}_${dateStr}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    isRecording,
    isPaused,
    recordSeconds,
    formattedDuration: formatDuration(recordSeconds),
    recordings,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    deleteRecording,
    downloadRecording,
  };
}
