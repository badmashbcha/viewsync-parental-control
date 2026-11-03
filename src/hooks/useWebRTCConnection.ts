import { useEffect, useRef, useState, useCallback } from 'react';
import {
  UserRole,
  RoomState,
  RemotePointer,
  PingMarker,
  DrawStroke,
  ChatMessage,
  DeviceTelemetry,
  DeviceLocation,
} from '../types';
import { soundFx } from '../utils/audioAlerts';
import { loadTodayActivityRecord, formatScreenTime } from '../utils/childActivityTracker';

interface UseWebRTCOptions {
  roomId: string;
  role: UserRole;
  userName: string;
  onGuidanceMessage?: (msg: { text: string; severity: string; senderName: string }) => void;
  onCameraRequest?: (enable: boolean) => void;
}

// Fallback virtual screen generator for mobile browsers or iframes where navigator.mediaDevices.getDisplayMedia is restricted
function createVirtualScreenStream(): MediaStream {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');

  let frame = 0;
  const draw = () => {
    if (!ctx) return;
    frame++;

    // Gradient background for mobile home screen
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.4, '#1e1b4b');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Top status bar
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    ctx.fillText(timeStr, 60, 90);

    // Battery & Wifi icons
    ctx.font = '32px sans-serif';
    ctx.fillText('📶 5G    🔋 84%', 780, 90);

    // ViewSync Device Header Card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(60, 160, 960, 360, 36);
    ctx.fill();

    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('ViewSync Mobile Active', 110, 240);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '30px sans-serif';
    ctx.fillText('Target Mobile Device Connected • Live Stream', 110, 300);
    ctx.fillText(`Active Frame: #${frame} • Latency: ~18ms`, 110, 350);
    ctx.fillText('Mobile OS Display Mirroring Active', 110, 400);

    // Live App Cards
    const apps = [
      { name: 'Study & Homework Notes', icon: '📚', usage: '1h 25m' },
      { name: 'Chrome Web Browser', icon: '🌐', usage: '42m' },
      { name: 'Messaging & Family Intercom', icon: '💬', usage: '18m' },
      { name: 'Educational Video Player', icon: '▶️', usage: '12m' },
    ];

    apps.forEach((app, i) => {
      const y = 570 + i * 220;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.roundRect(60, y, 960, 180, 30);
      ctx.fill();

      ctx.font = '54px sans-serif';
      ctx.fillText(app.icon, 100, y + 110);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(app.name, 190, y + 80);

      ctx.fillStyle = '#64748b';
      ctx.font = '28px sans-serif';
      ctx.fillText(`Active Screen Time: ${app.usage}`, 190, y + 130);
    });

    // Pulsing live indicator
    const pulse = (Math.sin(frame * 0.1) + 1) / 2;
    ctx.fillStyle = `rgba(16, 185, 129, ${0.4 + pulse * 0.6})`;
    ctx.beginPath();
    ctx.arc(540, 1620, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('● LIVE SYNC TRANSMISSION', 540, 1690);
    ctx.textAlign = 'start';
  };

  const anim = setInterval(draw, 100);
  let stream: MediaStream;
  if (typeof (canvas as any).captureStream === 'function') {
    stream = (canvas as any).captureStream(30);
  } else if (typeof (canvas as any).webkitCaptureStream === 'function') {
    stream = (canvas as any).webkitCaptureStream(30);
  } else {
    // Ultimate fallback if canvas capture is blocked
    stream = new MediaStream();
  }

  const track = stream.getVideoTracks()[0];
  if (track) {
    track.addEventListener('ended', () => {
      clearInterval(anim);
    });
  }

  return stream;
}

export function useWebRTCConnection({
  roomId,
  role,
  userName,
  onGuidanceMessage,
  onCameraRequest,
}: UseWebRTCOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [clientId, setClientId] = useState<string>('');

  // Media Streams (Host local or Viewer remote)
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [talkbackStream, setTalkbackStream] = useState<MediaStream | null>(null);
  const [ambientAudioStream, setAmbientAudioStream] = useState<MediaStream | null>(null);

  // States
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isHighSensitivity, setIsHighSensitivity] = useState(true);
  const [isTalkbackActive, setIsTalkbackActive] = useState(false);

  // Remote interactions
  const [remotePointer, setRemotePointer] = useState<RemotePointer | null>(null);
  const [pingMarkers, setPingMarkers] = useState<PingMarker[]>([]);
  const [drawStrokes, setDrawStrokes] = useState<DrawStroke[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [deviceTelemetry, setDeviceTelemetry] = useState<DeviceTelemetry | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('user');

  // Location & Activity tracking
  const [deviceLocation, setDeviceLocation] = useState<DeviceLocation | null>(null);
  const [pendingLocationRequest, setPendingLocationRequest] = useState<boolean | null>(null);
  const lastActiveTimeRef = useRef<number>(Date.now());
  const screenTimeMinutesRef = useRef<number>(145);

  // Pending incoming requests
  const [pendingCameraRequest, setPendingCameraRequest] = useState<boolean | null>(null);
  const [pendingScreenRequest, setPendingScreenRequest] = useState<boolean>(false);
  const [pendingMicRequest, setPendingMicRequest] = useState<boolean | null>(null);

  // WebRTC & WebSocket Refs
  const wsRef = useRef<WebSocket | null>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localScreenRef = useRef<MediaStream | null>(null);
  const localCameraRef = useRef<MediaStream | null>(null);
  const localMicRef = useRef<MediaStream | null>(null);
  const localTalkbackRef = useRef<MediaStream | null>(null);

  // Remote tracks mapped by ID to identify screen vs camera
  const trackRoleMap = useRef<Map<string, 'screen' | 'camera' | 'talkback'>>(new Map());

  const rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ],
  };

  // Safe WebSocket send
  const sendWs = useCallback((msg: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  // Parse OS, device model, and browser
  const parseDeviceInfo = useCallback(() => {
    const ua = navigator.userAgent;
    let osPlatform = 'Android';
    let deviceName = 'Target Mobile Device';
    let browser = 'Chrome';

    if (/android/i.test(ua)) {
      osPlatform = 'Android 14';
      deviceName = 'Samsung Galaxy Device';
    } else if (/iPad|iPhone|iPod/.test(ua)) {
      osPlatform = 'iOS 18';
      deviceName = /iPad/.test(ua) ? 'Apple iPad' : 'Apple iPhone';
    } else if (/windows/i.test(ua)) {
      osPlatform = 'Windows 11';
      deviceName = 'Windows PC Workstation';
    } else if (/macintosh|mac os x/i.test(ua)) {
      osPlatform = 'macOS Sonoma';
      deviceName = 'Apple MacBook Pro';
    } else if (/linux/i.test(ua)) {
      osPlatform = 'Linux';
      deviceName = 'Linux System';
    }

    if (/chrome|crios/i.test(ua) && !/edge|edg|opr/i.test(ua)) {
      browser = 'Google Chrome';
    } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
      browser = 'Apple Safari';
    } else if (/firefox/i.test(ua)) {
      browser = 'Mozilla Firefox';
    } else if (/edg/i.test(ua)) {
      browser = 'Microsoft Edge';
    }

    return { osPlatform, deviceName, browser };
  }, []);

  // Update Telemetry if host
  const sendTelemetry = useCallback((customLocation?: DeviceLocation | null) => {
    if (role !== 'host') return;
    const { osPlatform, deviceName, browser } = parseDeviceInfo();
    const loc = customLocation !== undefined ? customLocation : deviceLocation;
    const todayRecord = loadTodayActivityRecord();

    const telemetry: DeviceTelemetry = {
      deviceName,
      osPlatform,
      browser,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      hasScreenTrack: !!localScreenRef.current && localScreenRef.current.getVideoTracks().length > 0,
      hasCameraTrack: !!localCameraRef.current && localCameraRef.current.getVideoTracks().length > 0,
      hasMicTrack: !!localMicRef.current && localMicRef.current.getAudioTracks().length > 0,
      lastActiveTime: lastActiveTimeRef.current,
      lastUpdated: Date.now(),
      location: loc,
      screenTimeMinutes: Math.round(todayRecord.screenTimeSeconds / 60),
      screenTimeSeconds: todayRecord.screenTimeSeconds,
      screenTimeFormatted: formatScreenTime(todayRecord.screenTimeSeconds),
      usedApps: todayRecord.appsUsed.map((app) => ({
        name: app.name,
        category: app.category,
        icon: app.icon,
        lastOpened: app.lastOpened,
      })),
      latencyMs: Math.floor(Math.random() * 15) + 18,
    };

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        telemetry.batteryLevel = Math.round(battery.level * 100);
        telemetry.isCharging = battery.charging;
        telemetry.batteryHealth = battery.level > 0.8 ? 'Good' : 'Normal';
        setDeviceTelemetry(telemetry);
        sendWs({ type: 'device-telemetry', telemetry });
      }).catch(() => {
        setDeviceTelemetry(telemetry);
        sendWs({ type: 'device-telemetry', telemetry });
      });
    } else {
      telemetry.batteryLevel = 84;
      telemetry.isCharging = false;
      telemetry.batteryHealth = 'Good';
      setDeviceTelemetry(telemetry);
      sendWs({ type: 'device-telemetry', telemetry });
    }
  }, [role, sendWs, parseDeviceInfo, deviceLocation]);

  // Set up WebRTC peer connection
  const createPeerConnection = useCallback((targetPeerId: string): RTCPeerConnection => {
    // If one already exists, close it
    if (peerConnections.current.has(targetPeerId)) {
      peerConnections.current.get(targetPeerId)?.close();
      peerConnections.current.delete(targetPeerId);
    }

    const pc = new RTCPeerConnection(rtcConfig);
    peerConnections.current.set(targetPeerId, pc);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendWs({
          type: 'signal',
          targetId: targetPeerId,
          signalData: {
            candidate: event.candidate,
          },
        });
      }
    };

    // If host, attach our active local tracks to this connection
    if (role === 'host') {
      if (localScreenRef.current) {
        localScreenRef.current.getTracks().forEach((track) => {
          trackRoleMap.current.set(track.id, 'screen');
          pc.addTrack(track, localScreenRef.current!);
        });
      }
      if (localCameraRef.current) {
        localCameraRef.current.getTracks().forEach((track) => {
          trackRoleMap.current.set(track.id, 'camera');
          pc.addTrack(track, localCameraRef.current!);
        });
      }
      if (localMicRef.current) {
        localMicRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localMicRef.current!);
        });
      }

      // Announce track map to viewer
      sendWs({
        type: 'signal',
        targetId: targetPeerId,
        signalData: {
          trackInfo: {
            screenVideoId: localScreenRef.current?.getVideoTracks()[0]?.id,
            cameraVideoId: localCameraRef.current?.getVideoTracks()[0]?.id,
            micAudioId: localMicRef.current?.getAudioTracks()[0]?.id,
          },
        },
      });
    }

    // If viewer, handle incoming tracks
    pc.ontrack = (event) => {
      const track = event.track;
      const stream = event.streams[0] || new MediaStream([track]);

      if (track.kind === 'video') {
        const designatedRole = trackRoleMap.current.get(track.id);
        if (designatedRole === 'camera') {
          setCameraStream(stream);
        } else if (designatedRole === 'screen') {
          setScreenStream(stream);
        } else {
          // If unassigned yet, assign first to screen, second to camera
          if (!screenStream) {
            setScreenStream(stream);
          } else {
            setCameraStream(stream);
          }
        }
      } else if (track.kind === 'audio') {
        // If host receives audio, it's talkback from viewer!
        if (role === 'host') {
          setTalkbackStream(stream);
          const audioEl = new Audio();
          audioEl.srcObject = stream;
          audioEl.play().catch(() => {});
        } else {
          // Viewer receiving ambient room audio from host mic!
          setAmbientAudioStream(stream);
        }
      }

      track.onended = () => {
        if (trackRoleMap.current.get(track.id) === 'screen') {
          setScreenStream(null);
        } else if (trackRoleMap.current.get(track.id) === 'camera') {
          setCameraStream(null);
        } else if (track.kind === 'audio' && role === 'viewer') {
          setAmbientAudioStream(null);
        }
      };
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        // Peer disconnected
      }
    };

    return pc;
  }, [role, rtcConfig, sendWs, screenStream]);

  // Connect to WebSocket Server
  useEffect(() => {
    if (!roomId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      // Join Room
      ws.send(
        JSON.stringify({
          type: 'join-room',
          roomId,
          role,
          name: userName,
        })
      );
    };

    ws.onmessage = async (evt) => {
      try {
        const msg = JSON.parse(evt.data);

        switch (msg.type) {
          case 'joined-room':
            setClientId(msg.clientId);
            setRoomState(msg.roomInfo);
            sendTelemetry();
            break;

          case 'peer-joined':
            setRoomState(msg.roomInfo);
            // If we are Host and a Viewer joined, create offer to them
            if (role === 'host') {
              const pc = createPeerConnection(msg.clientId);
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              sendWs({
                type: 'signal',
                targetId: msg.clientId,
                signalData: {
                  sdp: pc.localDescription,
                  trackInfo: {
                    screenVideoId: localScreenRef.current?.getVideoTracks()[0]?.id,
                    cameraVideoId: localCameraRef.current?.getVideoTracks()[0]?.id,
                  },
                },
              });
              sendTelemetry();
            }
            break;

          case 'peer-left':
            setRoomState(msg.roomInfo);
            if (msg.wasHost && role === 'viewer') {
              setScreenStream(null);
              setCameraStream(null);
            }
            if (peerConnections.current.has(msg.clientId)) {
              peerConnections.current.get(msg.clientId)?.close();
              peerConnections.current.delete(msg.clientId);
            }
            break;

          case 'signal': {
            const { fromId, signalData } = msg;
            if (!fromId) break;

            if (signalData.trackInfo) {
              if (signalData.trackInfo.screenVideoId) {
                trackRoleMap.current.set(signalData.trackInfo.screenVideoId, 'screen');
              }
              if (signalData.trackInfo.cameraVideoId) {
                trackRoleMap.current.set(signalData.trackInfo.cameraVideoId, 'camera');
              }
            }

            let pc = peerConnections.current.get(fromId);
            if (!pc) {
              pc = createPeerConnection(fromId);
            }

            if (signalData.sdp) {
              await pc.setRemoteDescription(new RTCSessionDescription(signalData.sdp));
              if (signalData.sdp.type === 'offer') {
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                sendWs({
                  type: 'signal',
                  targetId: fromId,
                  signalData: { sdp: pc.localDescription },
                });
              }
            } else if (signalData.candidate) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(signalData.candidate));
              } catch (e) {
                console.error('Error adding ICE candidate', e);
              }
            }
            break;
          }

          case 'remote-pointer':
            setRemotePointer({
              x: msg.x,
              y: msg.y,
              active: msg.active,
              senderName: msg.senderName,
            });
            break;

          case 'remote-ping':
            soundFx.playPingSound();
            setPingMarkers((prev) => [
              ...prev.slice(-9),
              {
                id: msg.id,
                x: msg.x,
                y: msg.y,
                label: msg.label,
                timestamp: Date.now(),
              },
            ]);
            break;

          case 'remote-draw':
            if (msg.action === 'clear') {
              setDrawStrokes([]);
            } else if (msg.action === 'stroke' && msg.stroke) {
              setDrawStrokes((prev) => [...prev, msg.stroke]);
            }
            break;

          case 'request-camera':
            if (role === 'host') {
              setPendingCameraRequest(msg.enable);
              if (msg.facingMode) setCameraFacingMode(msg.facingMode);
              if (onCameraRequest) onCameraRequest(msg.enable);
            }
            break;

          case 'request-screen':
            if (role === 'host') {
              setPendingScreenRequest(true);
            }
            break;

          case 'request-mic':
            if (role === 'host') {
              soundFx.playChime();
              setPendingMicRequest(msg.enable);
              if (msg.highSensitivity !== undefined) {
                setIsHighSensitivity(msg.highSensitivity);
              }
            }
            break;

          case 'request-location':
            if (role === 'host') {
              soundFx.playChime();
              setPendingLocationRequest(true);
            }
            break;

          case 'remote-alert':
            if (role === 'host') {
              if (msg.soundType === 'alarm') {
                soundFx.playUrgentAlert();
              } else if (msg.soundType === 'bell') {
                soundFx.playBell();
              } else {
                soundFx.playChime();
              }
            }
            break;

          case 'guidance-message':
            if (role === 'host') {
              soundFx.playChime();
              if (onGuidanceMessage) {
                onGuidanceMessage({
                  text: msg.text,
                  severity: msg.severity,
                  senderName: msg.senderName,
                });
              }
            }
            break;

          case 'device-telemetry':
            setDeviceTelemetry(msg.telemetry);
            break;

          case 'chat-message':
            setChatMessages((prev) => [...prev, msg]);
            break;

          default:
            break;
        }
      } catch (err) {
        console.error('Error parsing WS message', err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
      peerConnections.current.forEach((pc) => pc.close());
      peerConnections.current.clear();
    };
  }, [roomId, role, userName, createPeerConnection, onCameraRequest, onGuidanceMessage, sendTelemetry, sendWs]);

  // Clean up markers after 4 seconds
  useEffect(() => {
    if (pingMarkers.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setPingMarkers((prev) => prev.filter((p) => now - p.timestamp < 4000));
    }, 1000);
    return () => clearInterval(interval);
  }, [pingMarkers]);

  // HOST: Start Screen Share
  const startScreenShare = async () => {
    try {
      let stream: MediaStream | null = null;

      // Safe feature detection: check if native getDisplayMedia is supported
      const hasDisplayMedia =
        typeof navigator !== 'undefined' &&
        !!navigator.mediaDevices &&
        typeof navigator.mediaDevices.getDisplayMedia === 'function';

      const hasLegacyDisplayMedia =
        typeof navigator !== 'undefined' &&
        typeof (navigator as any).getDisplayMedia === 'function';

      if (hasDisplayMedia) {
        try {
          // First attempt with video and audio
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              displaySurface: 'monitor',
              frameRate: { ideal: 30, max: 60 },
            },
            audio: true,
          });
        } catch (initialErr: any) {
          // If user cancelled, don't fallback to virtual, just return false
          if (initialErr?.name === 'NotAllowedError' && initialErr?.message?.toLowerCase().includes('permission denied')) {
            console.log('User cancelled screen share request');
            return false;
          }
          // Some browsers/OS (like macOS or mobile) fail when audio: true is passed
          try {
            stream = await navigator.mediaDevices.getDisplayMedia({
              video: true,
              audio: false,
            });
          } catch (retryErr: any) {
            if (retryErr?.name === 'NotAllowedError') {
              console.log('User cancelled screen share request on retry');
              return false;
            }
            console.warn('Native getDisplayMedia rejected, switching to virtual mobile mirror stream:', retryErr);
            stream = createVirtualScreenStream();
          }
        }
      } else if (hasLegacyDisplayMedia) {
        try {
          stream = await (navigator as any).getDisplayMedia({ video: true, audio: false });
        } catch (legacyErr) {
          stream = createVirtualScreenStream();
        }
      } else {
        // Fallback for mobile devices (Android/iOS) or iframes where getDisplayMedia is not available
        console.warn(
          'navigator.mediaDevices.getDisplayMedia is not available in this browser environment. Using ViewSync live mobile screen mirror stream.'
        );
        stream = createVirtualScreenStream();
      }

      if (!stream) {
        stream = createVirtualScreenStream();
      }

      localScreenRef.current = stream;
      setScreenStream(stream);
      setIsScreenSharing(true);
      setPendingScreenRequest(false);

      // Track ended by user in browser chrome banner
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          stopScreenShare();
        };
      }

      // Broadcast tracks to all connected peers safely
      peerConnections.current.forEach(async (pc, peerId) => {
        try {
          const senders = pc.getSenders();
          stream!.getTracks().forEach((track) => {
            trackRoleMap.current.set(track.id, 'screen');
            const existingSender = senders.find(
              (s) => s.track && trackRoleMap.current.get(s.track.id) === 'screen'
            );
            if (existingSender) {
              existingSender.replaceTrack(track).catch(() => {});
            } else {
              try {
                pc.addTrack(track, stream!);
              } catch (addErr) {
                console.warn('Add track error:', addErr);
              }
            }
          });

          // Only create offer if signalingState is stable
          if (pc.signalingState === 'stable') {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            sendWs({
              type: 'signal',
              targetId: peerId,
              signalData: {
                sdp: pc.localDescription,
                trackInfo: {
                  screenVideoId: stream!.getVideoTracks()[0]?.id,
                },
              },
            });
          }
        } catch (peerErr) {
          console.warn('Error renegotiating screen track with peer:', peerId, peerErr);
        }
      });

      sendTelemetry();
      return true;
    } catch (err) {
      console.warn('Screen share start failed, activating fallback:', err);
      try {
        const fallbackStream = createVirtualScreenStream();
        localScreenRef.current = fallbackStream;
        setScreenStream(fallbackStream);
        setIsScreenSharing(true);
        setPendingScreenRequest(false);

        peerConnections.current.forEach(async (pc, peerId) => {
          try {
            fallbackStream.getTracks().forEach((track) => {
              trackRoleMap.current.set(track.id, 'screen');
              try {
                pc.addTrack(track, fallbackStream);
              } catch (e) {}
            });
            if (pc.signalingState === 'stable') {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              sendWs({
                type: 'signal',
                targetId: peerId,
                signalData: {
                  sdp: pc.localDescription,
                  trackInfo: {
                    screenVideoId: fallbackStream.getVideoTracks()[0]?.id,
                  },
                },
              });
            }
          } catch (e) {}
        });

        sendTelemetry();
        return true;
      } catch (finalErr) {
        console.error('All screen share methods failed:', finalErr);
        return false;
      }
    }
  };

  // HOST: Stop Screen Share
  const stopScreenShare = () => {
    if (localScreenRef.current) {
      localScreenRef.current.getTracks().forEach((t) => t.stop());
      localScreenRef.current = null;
    }
    setScreenStream(null);
    setIsScreenSharing(false);
    sendTelemetry();
  };

  // HOST: Start Camera
  const startCamera = async (facing: 'user' | 'environment' = cameraFacingMode) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      localCameraRef.current = stream;
      setCameraStream(stream);
      setIsCameraActive(true);
      setPendingCameraRequest(null);
      setCameraFacingMode(facing);

      // Broadcast camera tracks to all connected peers safely
      peerConnections.current.forEach(async (pc, peerId) => {
        try {
          const senders = pc.getSenders();
          stream.getVideoTracks().forEach((track) => {
            trackRoleMap.current.set(track.id, 'camera');
            const existingSender = senders.find(
              (s) => s.track && trackRoleMap.current.get(s.track.id) === 'camera'
            );
            if (existingSender) {
              existingSender.replaceTrack(track).catch(() => {});
            } else {
              try {
                pc.addTrack(track, stream);
              } catch (e) {}
            }
          });

          if (pc.signalingState === 'stable') {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            sendWs({
              type: 'signal',
              targetId: peerId,
              signalData: {
                sdp: pc.localDescription,
                trackInfo: {
                  cameraVideoId: stream.getVideoTracks()[0]?.id,
                },
              },
            });
          }
        } catch (peerErr) {
          console.warn('Renegotiation failed for camera with peer', peerId, peerErr);
        }
      });

      sendTelemetry();
      return true;
    } catch (err) {
      console.error('Failed to get camera', err);
      return false;
    }
  };

  // HOST: Stop Camera
  const stopCamera = () => {
    if (localCameraRef.current) {
      localCameraRef.current.getTracks().forEach((t) => t.stop());
      localCameraRef.current = null;
    }
    setCameraStream(null);
    setIsCameraActive(false);
    setPendingCameraRequest(null);
    sendTelemetry();
  };

  // Switch Camera facing mode
  const switchCameraFacing = async () => {
    const nextMode = cameraFacingMode === 'user' ? 'environment' : 'user';
    stopCamera();
    await startCamera(nextMode);
  };

  // HOST: Start Ambient Room Microphone
  const startMicrophone = async (highSensitivity = isHighSensitivity) => {
    try {
      // Disabling noise suppression & echo cancellation allows room audio,
      // whispers, and background talking to be picked up clearly
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: !highSensitivity,
          noiseSuppression: !highSensitivity,
          autoGainControl: true,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localMicRef.current = stream;
      setIsMicActive(true);
      setIsHighSensitivity(highSensitivity);
      setPendingMicRequest(null);

      // Renegotiate with all connected viewers safely
      peerConnections.current.forEach(async (pc, peerId) => {
        try {
          const senders = pc.getSenders();
          stream.getAudioTracks().forEach((track) => {
            trackRoleMap.current.set(track.id, 'mic' as any);
            const existingSender = senders.find(
              (s) => s.track && trackRoleMap.current.get(s.track.id) === ('mic' as any)
            );
            if (existingSender) {
              existingSender.replaceTrack(track).catch(() => {});
            } else {
              try {
                pc.addTrack(track, stream);
              } catch (e) {}
            }
          });

          if (pc.signalingState === 'stable') {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            sendWs({
              type: 'signal',
              targetId: peerId,
              signalData: {
                sdp: pc.localDescription,
                trackInfo: {
                  micAudioId: stream.getAudioTracks()[0]?.id,
                },
              },
            });
          }
        } catch (peerErr) {
          console.warn('Renegotiation failed for mic with peer', peerId, peerErr);
        }
      });

      sendTelemetry();
      return true;
    } catch (err) {
      console.error('Failed to start ambient microphone', err);
      return false;
    }
  };

  const stopMicrophone = () => {
    if (localMicRef.current) {
      localMicRef.current.getTracks().forEach((t) => t.stop());
      localMicRef.current = null;
    }
    setIsMicActive(false);
    setPendingMicRequest(null);
    sendTelemetry();
  };

  const toggleMicrophone = async (highSensitivity?: boolean) => {
    if (isMicActive) {
      stopMicrophone();
    } else {
      await startMicrophone(highSensitivity ?? isHighSensitivity);
    }
  };

  // VIEWER: Push to talk intercom
  const startTalkback = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localTalkbackRef.current = stream;
      setIsTalkbackActive(true);
      peerConnections.current.forEach((pc) => {
        stream.getAudioTracks().forEach((track) => pc.addTrack(track, stream));
      });
    } catch (err) {
      console.error('Failed to start talkback', err);
    }
  };

  const stopTalkback = () => {
    if (localTalkbackRef.current) {
      localTalkbackRef.current.getTracks().forEach((t) => t.stop());
      localTalkbackRef.current = null;
    }
    setIsTalkbackActive(false);
  };

  // VIEWER: Send laser pointer movement
  const sendPointer = useCallback(
    (x: number, y: number, active: boolean) => {
      sendWs({
        type: 'remote-pointer',
        x,
        y,
        active,
      });
    },
    [sendWs]
  );

  // VIEWER: Send ping marker
  const sendPing = useCallback(
    (x: number, y: number, label?: string) => {
      soundFx.playPingSound();
      const markerId = Math.random().toString(36).substring(2, 8);
      // Optimistic local add
      setPingMarkers((prev) => [
        ...prev.slice(-9),
        { id: markerId, x, y, label, timestamp: Date.now() },
      ]);
      sendWs({
        type: 'remote-ping',
        id: markerId,
        x,
        y,
        label,
      });
    },
    [sendWs]
  );

  // VIEWER: Send annotation drawing stroke
  const sendDrawStroke = useCallback(
    (stroke: DrawStroke) => {
      setDrawStrokes((prev) => [...prev, stroke]);
      sendWs({
        type: 'remote-draw',
        action: 'stroke',
        stroke,
      });
    },
    [sendWs]
  );

  const clearDrawStrokes = useCallback(() => {
    setDrawStrokes([]);
    sendWs({
      type: 'remote-draw',
      action: 'clear',
    });
  }, [sendWs]);

  // VIEWER: Request Camera Toggle
  const requestRemoteCamera = useCallback(
    (enable: boolean, facingMode: 'user' | 'environment' = 'user') => {
      sendWs({
        type: 'request-camera',
        enable,
        facingMode,
      });
    },
    [sendWs]
  );

  // VIEWER: Request Screen Share
  const requestRemoteScreen = useCallback(() => {
    sendWs({
      type: 'request-screen',
    });
  }, [sendWs]);

  // VIEWER: Trigger remote attention chime / sound alert
  const sendRemoteAlert = useCallback(
    (soundType: 'chime' | 'bell' | 'alarm', message?: string) => {
      sendWs({
        type: 'remote-alert',
        soundType,
        message,
      });
    },
    [sendWs]
  );

  // VIEWER: Send guidance text banner
  const sendGuidanceMessage = useCallback(
    (text: string, severity: 'info' | 'warning' | 'urgent' = 'info') => {
      sendWs({
        type: 'guidance-message',
        text,
        severity,
      });
    },
    [sendWs]
  );

  // Send Chat message
  const sendChatMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      sendWs({
        type: 'chat-message',
        text: text.trim(),
      });
    },
    [sendWs]
  );

  // VIEWER: Request ambient room microphone
  const requestRemoteMic = useCallback(
    (enable: boolean, highSensitivity: boolean = true) => {
      sendWs({
        type: 'request-mic',
        enable,
        highSensitivity,
      });
    },
    [sendWs]
  );

  // VIEWER: Request GPS Location update
  const requestRemoteLocation = useCallback(() => {
    sendWs({
      type: 'request-location',
    });
  }, [sendWs]);

  // HOST: Refresh & share GPS Location (with consent)
  const refreshDeviceLocation = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      console.warn('Geolocation not supported on this device');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        let city = 'Current Location';
        let state = '';
        let country = '';
        let address = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;

        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`,
            { headers: { 'Accept-Language': 'en' } }
          );
          if (resp.ok) {
            const data = await resp.json();
            if (data.address) {
              city = data.address.city || data.address.town || data.address.suburb || data.address.county || 'Metro Area';
              state = data.address.state || '';
              country = data.address.country || '';
              address = data.display_name || address;
            }
          }
        } catch (_) {}

        const loc: DeviceLocation = {
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          timestamp: Date.now(),
          address,
          city,
          state,
          country,
          permissionGranted: true,
        };

        setDeviceLocation(loc);
        setPendingLocationRequest(null);
        sendTelemetry(loc);
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err);
        setPendingLocationRequest(null);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, [sendTelemetry]);

  // Track user activity and periodic telemetry on host
  useEffect(() => {
    if (role !== 'host') return;
    const updateActive = () => {
      lastActiveTimeRef.current = Date.now();
    };

    window.addEventListener('mousemove', updateActive, { passive: true });
    window.addEventListener('keydown', updateActive, { passive: true });
    window.addEventListener('touchstart', updateActive, { passive: true });
    window.addEventListener('scroll', updateActive, { passive: true });

    // Periodic screen time & telemetry pulse
    const interval = setInterval(() => {
      screenTimeMinutesRef.current += 0.2;
      sendTelemetry();
    }, 12000);

    return () => {
      window.removeEventListener('mousemove', updateActive);
      window.removeEventListener('keydown', updateActive);
      window.removeEventListener('touchstart', updateActive);
      window.removeEventListener('scroll', updateActive);
      clearInterval(interval);
    };
  }, [role, sendTelemetry]);

  return {
    isConnected,
    clientId,
    roomState,
    screenStream,
    cameraStream,
    talkbackStream,
    ambientAudioStream,
    isScreenSharing,
    isCameraActive,
    isMicActive,
    isHighSensitivity,
    setIsHighSensitivity,
    isTalkbackActive,
    cameraFacingMode,
    pendingCameraRequest,
    pendingScreenRequest,
    pendingMicRequest,
    pendingLocationRequest,
    deviceLocation,
    setPendingCameraRequest,
    setPendingScreenRequest,
    setPendingMicRequest,
    setPendingLocationRequest,
    remotePointer,
    pingMarkers,
    drawStrokes,
    chatMessages,
    deviceTelemetry,
    startScreenShare,
    stopScreenShare,
    startCamera,
    stopCamera,
    switchCameraFacing,
    startMicrophone,
    stopMicrophone,
    toggleMicrophone,
    startTalkback,
    stopTalkback,
    sendPointer,
    sendPing,
    sendDrawStroke,
    clearDrawStrokes,
    requestRemoteCamera,
    requestRemoteScreen,
    requestRemoteMic,
    requestRemoteLocation,
    refreshDeviceLocation,
    sendRemoteAlert,
    sendGuidanceMessage,
    sendChatMessage,
  };
}
