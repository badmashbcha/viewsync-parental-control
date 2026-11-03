import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RemotePointer, PingMarker, DrawStroke } from '../types';
import { Maximize2, Minimize2, ZoomIn, Eye, Sparkles } from 'lucide-react';

interface InteractiveVideoOverlayProps {
  stream: MediaStream | null;
  mode: 'viewer' | 'host';
  isMuted?: boolean;
  pointer: RemotePointer | null;
  pings: PingMarker[];
  drawStrokes: DrawStroke[];
  activeTool?: 'pointer' | 'ping' | 'draw' | 'none';
  drawColor?: string;
  drawWidth?: number;
  onSendPointer?: (x: number, y: number, active: boolean) => void;
  onSendPing?: (x: number, y: number) => void;
  onSendDrawStroke?: (stroke: DrawStroke) => void;
  label?: string;
  showControls?: boolean;
}

export const InteractiveVideoOverlay: React.FC<InteractiveVideoOverlayProps> = ({
  stream,
  mode,
  isMuted = true,
  pointer,
  pings,
  drawStrokes,
  activeTool = 'none',
  drawColor = '#ef4444',
  drawWidth = 3,
  onSendPointer,
  onSendPing,
  onSendDrawStroke,
  label = 'Live Feed',
  showControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

  // Drawing state for viewer
  const [isDrawing, setIsDrawing] = useState(false);
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([]);

  // Attach stream to video element
  useEffect(() => {
    if (videoRef.current) {
      if (stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => {
          console.warn('Video auto-play interrupted', err);
        });
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  // Track video metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDimensions({
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
    }
  };

  // Redraw annotations on canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw saved strokes
    drawStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const first = stroke.points[0];
      ctx.moveTo(first.x * canvas.width, first.y * canvas.height);

      for (let i = 1; i < stroke.points.length; i++) {
        const pt = stroke.points[i];
        ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
      }
      ctx.stroke();
    });

    // Draw active drawing stroke if in progress
    if (isDrawing && currentStrokeRef.current.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = drawWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const first = currentStrokeRef.current[0];
      ctx.moveTo(first.x * canvas.width, first.y * canvas.height);

      for (let i = 1; i < currentStrokeRef.current.length; i++) {
        const pt = currentStrokeRef.current[i];
        ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
      }
      ctx.stroke();
    }
  }, [drawStrokes, isDrawing, drawColor, drawWidth]);

  // Resize canvas to match container size
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updateSize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      renderCanvas();
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [renderCanvas]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas, drawStrokes]);

  // Convert mouse event to normalized 0..1 coordinates
  const getNormalizedCoords = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    return { x, y };
  };

  // Mouse handlers for Viewer interactions
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'viewer') return;
    const coords = getNormalizedCoords(e);

    if (activeTool === 'pointer' && onSendPointer) {
      onSendPointer(coords.x, coords.y, true);
    }

    if (activeTool === 'draw' && isDrawing) {
      currentStrokeRef.current.push(coords);
      renderCanvas();
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'viewer') return;
    if (activeTool === 'pointer' && onSendPointer) {
      const coords = getNormalizedCoords(e);
      onSendPointer(coords.x, coords.y, true);
    }
  };

  const handleMouseLeave = () => {
    if (mode !== 'viewer') return;
    if (activeTool === 'pointer' && onSendPointer) {
      onSendPointer(0, 0, false);
    }
    if (isDrawing) {
      handleMouseUp();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'viewer') return;
    const coords = getNormalizedCoords(e);

    if (activeTool === 'ping' && onSendPing) {
      onSendPing(coords.x, coords.y);
    } else if (activeTool === 'draw') {
      setIsDrawing(true);
      currentStrokeRef.current = [coords];
    }
  };

  const handleMouseUp = () => {
    if (mode !== 'viewer' || !isDrawing) return;
    setIsDrawing(false);
    if (currentStrokeRef.current.length > 1 && onSendDrawStroke) {
      onSendDrawStroke({
        color: drawColor,
        width: drawWidth,
        points: [...currentStrokeRef.current],
      });
    }
    currentStrokeRef.current = [];
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`relative w-full h-full bg-slate-950 rounded-2xl overflow-hidden select-none border border-slate-800 shadow-2xl flex items-center justify-center ${
        mode === 'viewer' && activeTool === 'pointer'
          ? 'cursor-none'
          : mode === 'viewer' && activeTool === 'draw'
          ? 'cursor-crosshair'
          : mode === 'viewer' && activeTool === 'ping'
          ? 'cursor-cell'
          : 'cursor-default'
      }`}
    >
      {/* Video Element */}
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          onLoadedMetadata={handleLoadedMetadata}
          className={`w-full h-full transition-all duration-200 ${
            fitMode === 'contain' ? 'object-contain' : 'object-cover'
          }`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-500 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-400">
            <Eye className="w-8 h-8 opacity-60 animate-pulse" />
          </div>
          <p className="font-semibold text-slate-300 text-lg">No Live Feed Available</p>
          <p className="text-sm text-slate-500 max-w-sm mt-1">
            Waiting for target device to grant permissions and initiate stream...
          </p>
        </div>
      )}

      {/* Drawing Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      />

      {/* Ping Radar Markers */}
      {pings.map((ping) => (
        <div
          key={ping.id}
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${ping.x * 100}%`, top: `${ping.y * 100}%` }}
        >
          {/* Animated radar rings */}
          <span className="absolute -inset-4 rounded-full bg-amber-500/30 animate-ping" />
          <span className="absolute -inset-8 rounded-full border border-amber-400/50 animate-ping duration-1000" />
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/90 text-slate-950 font-bold shadow-lg border-2 border-white scale-110">
            🎯
          </div>
          <div className="mt-1 px-2 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md text-amber-300 text-xs font-semibold whitespace-nowrap border border-amber-500/40 shadow">
            {ping.label || 'Look here!'}
          </div>
        </div>
      ))}

      {/* Laser Pointer / Spotlight */}
      {pointer && pointer.active && (
        <div
          className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
          style={{ left: `${pointer.x * 100}%`, top: `${pointer.y * 100}%` }}
        >
          {/* Glowing laser dot */}
          <div className="relative flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-rose-500/40 animate-ping absolute" />
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 to-red-400 shadow-[0_0_15px_#f43f5e] border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            {/* Observer badge */}
            <div className="absolute left-6 top-0 px-2 py-0.5 rounded-md bg-rose-950/90 border border-rose-500/60 text-[11px] font-semibold text-rose-200 whitespace-nowrap shadow-md backdrop-blur-sm">
              {pointer.senderName || 'Supervisor'}
            </div>
          </div>
        </div>
      )}

      {/* Top Overlay Badge / Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-xs font-medium text-slate-200 shadow-md">
            <span className={`w-2 h-2 rounded-full ${stream ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="font-semibold">{label}</span>
            {videoDimensions.width > 0 && (
              <span className="text-slate-400 border-l border-slate-700 pl-2">
                {videoDimensions.width}x{videoDimensions.height}
              </span>
            )}
          </div>
        </div>

        {/* View Controls */}
        {showControls && stream && (
          <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/85 backdrop-blur-md border border-slate-700/60 p-1 rounded-lg shadow-md">
            <button
              type="button"
              onClick={() => setFitMode((m) => (m === 'contain' ? 'cover' : 'contain'))}
              title={`Switch fit: ${fitMode === 'contain' ? 'Fill Screen' : 'Fit Entire Screen'}`}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span className="text-[11px] capitalize">{fitMode}</span>
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
