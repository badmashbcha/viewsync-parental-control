import React, { useState } from 'react';
import { X, Play, Download, Trash2, Film, Clock, HardDrive } from 'lucide-react';
import { RecordedSession } from '../types';

interface RecordedVideosModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordings: RecordedSession[];
  onDelete: (id: string) => void;
  onDownload: (rec: RecordedSession) => void;
}

export const RecordedVideosModal: React.FC<RecordedVideosModalProps> = ({
  isOpen,
  onClose,
  recordings,
  onDelete,
  onDownload,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<RecordedSession | null>(
    recordings[0] || null
  );

  if (!isOpen) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Session Screen Recordings</h3>
              <p className="text-xs text-slate-400">
                {recordings.length} clip{recordings.length === 1 ? '' : 's'} recorded during this supervision session
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

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Active Video Player */}
          <div className="lg:col-span-8 p-5 bg-slate-950 flex flex-col justify-center items-center">
            {selectedRecord ? (
              <div className="w-full space-y-3">
                <video
                  key={selectedRecord.id}
                  src={selectedRecord.url}
                  controls
                  autoPlay
                  className="w-full max-h-[400px] rounded-2xl bg-black shadow-lg border border-slate-800 object-contain"
                />
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="font-semibold text-slate-200">{selectedRecord.title}</div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {formatTime(selectedRecord.durationSeconds)}
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                      {formatBytes(selectedRecord.sizeBytes)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 p-8">
                Select a recording from the playlist to preview
              </div>
            )}
          </div>

          {/* Recordings Playlist */}
          <div className="lg:col-span-4 border-l border-slate-800 p-4 overflow-y-auto space-y-2.5 max-h-[480px]">
            {recordings.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No recordings made yet. Click "Record Screen" in the supervision bar to record.
              </div>
            ) : (
              recordings.map((rec) => {
                const isSelected = selectedRecord?.id === rec.id;
                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedRecord(rec)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-slate-800/90 border-indigo-500/70 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white truncate">
                        {rec.title}
                      </span>
                      <span className="text-[11px] font-mono text-indigo-400">
                        {formatTime(rec.durationSeconds)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      <span>{formatBytes(rec.sizeBytes)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload(rec);
                        }}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedRecord?.id === rec.id) setSelectedRecord(null);
                          onDelete(rec.id);
                        }}
                        title="Delete recording"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Recorded in WebM format (playable in all browsers & media players).</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
