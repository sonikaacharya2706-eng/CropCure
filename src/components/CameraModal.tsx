import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Video,
  X,
  RefreshCw,
  Zap,
  ZapOff,
  Check,
  RotateCcw,
  AlertCircle,
  Upload,
  Smartphone,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Play,
  Square,
  Eye,
} from 'lucide-react';
import { playChime } from '../utils/speechHelper';
import { FIELD_SAMPLES } from '../data/sampleFieldData';
import { SupportedLanguage, UI_STRINGS } from '../data/translations';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'photo' | 'video';
  title?: string;
  language?: SupportedLanguage;
  onCapturePhoto?: (dataUrl: string) => void;
  onCaptureVideo?: (videoBlob: Blob, videoUrl: string, sampledFrames: string[]) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  mode = 'photo',
  title,
  language = 'en',
  onCapturePhoto,
  onCaptureVideo,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const [activeMode, setActiveMode] = useState<'photo' | 'video'>(mode);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isSimulatedMode, setIsSimulatedMode] = useState<boolean>(false);
  const [simulatedSampleIdx, setSimulatedSampleIdx] = useState<number>(0);
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);
  const [isShutterFlashing, setIsShutterFlashing] = useState<boolean>(false);
  const [availableVideoDevices, setAvailableVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  // Keep activeMode updated when mode prop changes
  useEffect(() => {
    if (mode) setActiveMode(mode);
  }, [mode]);

  // Photo mode states
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // Video mode states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [videoFrames, setVideoFrames] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);
  const nativeVideoInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const frameSamplingRef = useRef<NodeJS.Timeout | null>(null);

  // Enumerate cameras
  const updateAvailableDevices = async () => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setAvailableVideoDevices(videoInputs);
        if (videoInputs.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoInputs[0].deviceId);
        }
      } catch (e) {
        console.warn('Could not enumerate devices:', e);
      }
    }
  };

  // Progressive resilient camera stream initializer
  const startCamera = async (facing: 'environment' | 'user', specificDeviceId?: string) => {
    // Clean up any existing stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    setCameraError(null);
    setIsStartingCamera(true);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API is not supported in this browser environment. Use Native Device Camera or Simulated Viewfinder.');
      setIsStartingCamera(false);
      setIsSimulatedMode(true);
      return;
    }

    let mediaStream: MediaStream | null = null;

    // Strategy 1: Try specific device or requested facing mode + ideal 720p resolution
    try {
      const constraints: MediaStreamConstraints = specificDeviceId
        ? {
            video: {
              deviceId: { exact: specificDeviceId },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          }
        : {
            video: {
              facingMode: { ideal: facing },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          };
      mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err1) {
      console.warn('Strategy 1 failed, trying fallback without resolution constraints:', err1);

      // Strategy 2: Simple facingMode
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing },
          audio: false,
        });
      } catch (err2) {
        console.warn('Strategy 2 failed, trying universal basic video constraint:', err2);

        // Strategy 3: Universal fallback: bare video: true
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        } catch (err3: any) {
          console.warn('Strategy 3 failed (camera hardware inaccessible or denied):', err3);
          let msg = 'Could not access camera hardware.';
          if (err3.name === 'NotAllowedError' || err3.name === 'PermissionDeniedError') {
            msg = 'Camera access was blocked by browser or iframe permissions.';
          } else if (err3.name === 'NotFoundError' || err3.name === 'DevicesNotFoundError') {
            msg = 'No hardware camera detected on this device.';
          }
          setCameraError(msg);
          setIsStartingCamera(false);
          // Automatically enable Simulated Field Camera so user isn't stuck
          setIsSimulatedMode(true);
          return;
        }
      }
    }

    if (mediaStream) {
      setStream(mediaStream);
      setIsSimulatedMode(false);

      // Check if torch/flashlight or hardware zoom is supported
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack.getCapabilities ? videoTrack.getCapabilities() : {}) as any;
        setHasTorch(Boolean(capabilities && capabilities.torch));
      }

      // Connect stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.muted = true;
        videoRef.current.play().catch((err) => console.warn('Video play error:', err));
      }

      await updateAvailableDevices();
    }

    setIsStartingCamera(false);
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedPhoto(null);
      setRecordedVideoUrl(null);
      setRecordedBlob(null);
      setVideoFrames([]);
      setRecordingSeconds(0);
      setIsRecording(false);
      setZoomLevel(1);
      setFocusPoint(null);
      startCamera(facingMode, selectedDeviceId);
    } else {
      // Clean up stream when closing
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (frameSamplingRef.current) clearInterval(frameSamplingRef.current);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (frameSamplingRef.current) clearInterval(frameSamplingRef.current);
    };
  }, [isOpen, facingMode, selectedDeviceId]);

  // Ensure video element plays when stream or view updates
  useEffect(() => {
    if (videoRef.current && stream && !capturedPhoto && !recordedVideoUrl && !isSimulatedMode) {
      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute('playsinline', 'true');
      videoRef.current.muted = true;
      videoRef.current.play().catch((e) => console.warn('Stream play error:', e));
    }
  }, [stream, capturedPhoto, recordedVideoUrl, isSimulatedMode]);

  // Tap-to-focus indicator
  const handleViewfinderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setFocusPoint({ x, y });
    playChime('click');
    setTimeout(() => {
      setFocusPoint(null);
    }, 1800);
  };

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (track && hasTorch) {
      try {
        await (track as any).applyConstraints({
          advanced: [{ torch: !torchOn }],
        });
        setTorchOn(!torchOn);
        playChime('click');
      } catch (err) {
        console.warn('Torch constraint error:', err);
      }
    }
  };

  // Switch between front and back camera
  const toggleFacingMode = () => {
    playChime('click');
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // 1. Take Snapshot Photo
  const handleSnapPhoto = () => {
    playChime('click');
    setIsShutterFlashing(true);
    setTimeout(() => setIsShutterFlashing(false), 200);

    if (isSimulatedMode || !videoRef.current) {
      // Use high-resolution authentic crop photo from FIELD_SAMPLES
      const sample = FIELD_SAMPLES[simulatedSampleIdx % FIELD_SAMPLES.length];
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          setCapturedPhoto(dataUrl);
          playChime('success');
        }
      };
      img.src = sample.imageUrl;
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Apply zoom crop if zoomed in
      if (zoomLevel > 1) {
        const cropW = canvas.width / zoomLevel;
        const cropH = canvas.height / zoomLevel;
        const cropX = (canvas.width - cropW) / 2;
        const cropY = (canvas.height - cropH) / 2;
        ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedPhoto(dataUrl);
      playChime('success');
    }
  };

  // 2. Start Video Recording
  const handleStartRecording = () => {
    playChime('click');
    recordedChunksRef.current = [];
    setVideoFrames([]);
    setRecordingSeconds(0);
    setIsRecording(true);

    if (isSimulatedMode || !stream) {
      // Simulated video recording with animated field samples
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      frameSamplingRef.current = setInterval(() => {
        const s = FIELD_SAMPLES[Math.floor(Math.random() * FIELD_SAMPLES.length)];
        setVideoFrames((prev) => [...prev, s.imageUrl]);
      }, 1500);
      return;
    }

    try {
      const mimeTypes = ['video/webm;codecs=vp9', 'video/webm', 'video/mp4'];
      const supportedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || '';

      const recorder = new MediaRecorder(stream, supportedMime ? { mimeType: supportedMime } : undefined);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const mime = recorder.mimeType || 'video/webm';
        const blob = new Blob(recordedChunksRef.current, { type: mime });
        const url = URL.createObjectURL(blob);
        setRecordedBlob(blob);
        setRecordedVideoUrl(url);
      };

      recorder.start(1000); // 1-second chunks
      mediaRecorderRef.current = recorder;

      // Timer
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Actively sample video frames every 1.5s for field analysis
      frameSamplingRef.current = setInterval(() => {
        if (videoRef.current) {
          const v = videoRef.current;
          const c = document.createElement('canvas');
          c.width = 320;
          c.height = 240;
          const ctx = c.getContext('2d');
          if (ctx) {
            ctx.drawImage(v, 0, 0, c.width, c.height);
            const frameData = c.toDataURL('image/jpeg', 0.7);
            setVideoFrames((prev) => [...prev, frameData]);
          }
        }
      }, 1500);
    } catch (err) {
      console.error('MediaRecorder error:', err);
    }
  };

  // 3. Stop Video Recording
  const handleStopRecording = () => {
    playChime('success');
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (frameSamplingRef.current) clearInterval(frameSamplingRef.current);

    if (isSimulatedMode || !stream) {
      // Create a mock blob for simulated video
      const fakeBlob = new Blob(['field_video_simulation'], { type: 'video/mp4' });
      const sample = FIELD_SAMPLES[simulatedSampleIdx % FIELD_SAMPLES.length];
      setRecordedBlob(fakeBlob);
      setRecordedVideoUrl(sample.imageUrl);
      return;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  // Confirm photo choice
  const handleConfirmPhoto = () => {
    if (capturedPhoto && onCapturePhoto) {
      onCapturePhoto(capturedPhoto);
      onClose();
    }
  };

  // Confirm video choice
  const handleConfirmVideo = () => {
    if (recordedBlob && recordedVideoUrl && onCaptureVideo) {
      onCaptureVideo(recordedBlob, recordedVideoUrl, videoFrames);
      onClose();
    }
  };

  // Handle direct file input (Device native camera / gallery)
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (activeMode === 'photo') {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setCapturedPhoto(dataUrl);
        playChime('success');
      };
      reader.readAsDataURL(file);
    } else {
      const url = URL.createObjectURL(file);
      setRecordedBlob(file);
      setRecordedVideoUrl(url);
      setVideoFrames([url]);
      playChime('success');
    }
  };

  // Direct trigger to native camera app
  const triggerNativeCamera = () => {
    playChime('click');
    if (activeMode === 'photo') {
      nativeCameraInputRef.current?.click();
    } else {
      nativeVideoInputRef.current?.click();
    }
  };

  const handleSwitchMode = (newMode: 'photo' | 'video') => {
    if (isRecording) {
      handleStopRecording();
    }
    setCapturedPhoto(null);
    setRecordedVideoUrl(null);
    setRecordedBlob(null);
    setVideoFrames([]);
    setRecordingSeconds(0);
    setActiveMode(newMode);
    playChime('click');
  };

  if (!isOpen) return null;

  const currentSample = FIELD_SAMPLES[simulatedSampleIdx % FIELD_SAMPLES.length];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      {/* Hidden native camera inputs that bypass iframe permissions */}
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <input
        ref={nativeVideoInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-xl w-full overflow-hidden flex flex-col shadow-2xl max-h-[95vh]">
        {/* Top Header Bar */}
        <div className="p-3 bg-stone-950 flex items-center justify-between text-white border-b border-stone-800 gap-2">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-stone-900 border border-stone-800 p-0.5 rounded-xl">
            <button
              type="button"
              onClick={() => handleSwitchMode('photo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeMode === 'photo'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{t.takePhoto}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('video')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeMode === 'video'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{t.rowVideo}</span>
            </button>
          </div>

          {/* Quick Native OS Camera & Close Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={triggerNativeCamera}
              className="h-8 px-2.5 bg-stone-800 hover:bg-stone-700 text-emerald-400 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open Device Native Camera App directly"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.osCamera}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Close Camera"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder Area */}
        <div
          onClick={handleViewfinderClick}
          className="relative aspect-4/3 sm:aspect-16/10 bg-black flex items-center justify-center overflow-hidden cursor-crosshair select-none"
        >
          {/* Shutter flash animation overlay */}
          {isShutterFlashing && (
            <div className="absolute inset-0 bg-white z-40 pointer-events-none animate-out fade-out duration-200" />
          )}

          {isStartingCamera && !isSimulatedMode ? (
            /* Loading Camera Hardware */
            <div className="flex flex-col items-center justify-center text-center p-6 text-stone-300">
              <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
              <p className="text-xs font-medium">Connecting to camera sensor...</p>
              <p className="text-[11px] text-stone-500 mt-1">Requesting high-resolution lens access</p>
            </div>
          ) : capturedPhoto ? (
            /* Snapshot Preview */
            <div className="relative w-full h-full">
              <img
                src={capturedPhoto}
                alt="Captured field snapshot"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] text-emerald-400 font-mono">
                PHOTO READY FOR DIAGNOSIS
              </div>
            </div>
          ) : recordedVideoUrl ? (
            /* Recorded Video Preview */
            <div className="relative w-full h-full">
              {isSimulatedMode ? (
                <img
                  src={recordedVideoUrl}
                  alt="Simulated row video"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={recordedVideoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              )}
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] text-rose-400 font-mono">
                VIDEO RECORDED ({videoFrames.length} FRAMES EXTRACTED)
              </div>
            </div>
          ) : isSimulatedMode ? (
            /* Simulated Live Field Camera Viewfinder (Realistic Plant Footage) */
            <div className="relative w-full h-full overflow-hidden bg-stone-950">
              <img
                src={currentSample.imageUrl}
                alt={currentSample.name}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.2s ease-out',
                }}
                className="w-full h-full object-cover"
              />

              {/* Simulation Mode Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-500/90 text-stone-950 font-bold text-[10px] rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  Live Field Lens (Simulated)
                </span>
                <span className="text-[10px] text-white/90 bg-black/60 px-2 py-0.5 rounded-full font-mono">
                  {currentSample.crop}
                </span>
              </div>

              {/* Sample Cycler Button in Simulation Viewfinder */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSimulatedSampleIdx((prev) => prev + 1);
                  playChime('click');
                }}
                className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white text-[11px] px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Cycle crop specimens in simulated camera"
              >
                <RefreshCw className="w-3 h-3 text-emerald-400" />
                <span>Next Plant Specimen</span>
              </button>

              {/* Viewfinder Target Framing Guidelines */}
              <div className="absolute inset-8 border border-white/40 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="w-20 h-20 border border-emerald-400/70 rounded-full animate-pulse" />
                <div className="absolute top-2 left-3 text-[10px] text-white/80 font-mono">
                  {activeMode === 'photo' ? 'MACRO FOCUS: CENTER ON INFECTION' : 'ROW WALK: KEEP PLANTS IN VIEW'}
                </div>
              </div>
            </div>
          ) : (
            /* Hardware Live Camera Stream */
            <div className="relative w-full h-full overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.2s ease-out',
                }}
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Framing Guidelines */}
              <div className="absolute inset-8 border border-white/30 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="w-20 h-20 border border-emerald-400/50 rounded-full" />
                <div className="absolute top-2 left-3 text-[10px] text-white/70 font-mono">
                  {activeMode === 'photo' ? 'ALIGN LEAF CENTER' : 'WALK STEADILY ALONG ROW'}
                </div>
              </div>

              {/* Top Controls: Switch Camera & Torch */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {hasTorch && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTorch();
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      torchOn ? 'bg-amber-400 text-stone-900 shadow-lg shadow-amber-400/30' : 'bg-black/60 text-white'
                    }`}
                    title="Toggle Flash / Torch"
                  >
                    {torchOn ? <Zap className="w-4 h-4 fill-stone-900" /> : <ZapOff className="w-4 h-4" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFacingMode();
                  }}
                  className="w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer"
                  title="Switch Front/Back Camera"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Interactive Tap-To-Focus Square */}
          {focusPoint && (
            <div
              style={{ left: `${focusPoint.x}%`, top: `${focusPoint.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 border-2 border-amber-400 rounded-sm pointer-events-none animate-ping"
            />
          )}

          {/* Live Zoom Level Controller (1x, 2x, 3x) */}
          {!capturedPhoto && !recordedVideoUrl && (
            <div className="absolute bottom-3 right-3 flex items-center bg-black/60 backdrop-blur-xs p-1 rounded-xl border border-white/20 gap-1 z-20">
              {[1, 2, 3].map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLevel(z);
                    playChime('click');
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    zoomLevel === z ? 'bg-emerald-600 text-white' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {z}x
                </button>
              ))}
            </div>
          )}

          {/* Live Video Recording Indicator */}
          {isRecording && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-xs px-3 py-1.5 rounded-full text-white text-xs font-mono z-20">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>REC {recordingSeconds}s</span>
              <span className="text-[10px] text-stone-400">({videoFrames.length} frames)</span>
            </div>
          )}

          {/* Bottom Left Camera Mode Switcher Pill */}
          {!capturedPhoto && !recordedVideoUrl && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-20">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSimulatedMode(!isSimulatedMode);
                  playChime('click');
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 border transition-colors cursor-pointer backdrop-blur-xs ${
                  isSimulatedMode
                    ? 'bg-amber-500/80 text-stone-950 border-amber-400'
                    : 'bg-black/60 text-stone-300 border-white/20 hover:text-white'
                }`}
                title="Toggle between hardware camera and simulated field crop camera"
              >
                <Eye className="w-3 h-3" />
                <span>{isSimulatedMode ? t.simulatedField : t.hardwareSensor}</span>
              </button>
            </div>
          )}
        </div>

        {/* Notice banner if camera had permission restriction */}
        {cameraError && isSimulatedMode && (
          <div className="px-4 py-2 bg-amber-950/70 border-b border-amber-800/50 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] leading-tight">
                Hardware camera restricted in iframe. Using {t.simulatedField} or tap {t.osCamera}.
              </span>
            </div>
            <button
              type="button"
              onClick={triggerNativeCamera}
              className="text-[11px] font-bold text-amber-300 underline hover:text-white ml-2 cursor-pointer shrink-0"
            >
              {t.osCamera}
            </button>
          </div>
        )}

        {/* Bottom Shutter / Action Controls */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-4">
          {capturedPhoto ? (
            /* Confirm or Retake Photo */
            <div className="flex items-center justify-between w-full gap-3">
              <button
                type="button"
                onClick={() => setCapturedPhoto(null)}
                className="h-12 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors active:scale-[0.98] cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.retakePhoto}</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{t.useThisPhoto}</span>
              </button>
            </div>
          ) : recordedVideoUrl ? (
            /* Confirm or Retake Video */
            <div className="flex items-center justify-between w-full gap-3">
              <button
                type="button"
                onClick={() => {
                  setRecordedVideoUrl(null);
                  setRecordedBlob(null);
                  setVideoFrames([]);
                  setRecordingSeconds(0);
                }}
                className="h-12 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors active:scale-[0.98] cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.retakePhoto}</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmVideo}
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{t.useThisPhoto}</span>
              </button>
            </div>
          ) : (
            /* Active Live Capture Controls */
            <div className="flex items-center justify-between w-full">
              {/* Left: Device Native Camera Shutter Direct Trigger */}
              <button
                type="button"
                onClick={triggerNativeCamera}
                className="h-11 px-3 bg-stone-800 hover:bg-stone-700 text-emerald-400 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Launch phone's native camera app directly"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">{t.phoneCamera}</span>
              </button>

              {/* Center Shutter Button */}
              {activeMode === 'photo' ? (
                <button
                  type="button"
                  onClick={handleSnapPhoto}
                  className="w-16 h-16 rounded-full border-4 border-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/50 active:scale-95 transition-transform cursor-pointer"
                  title={t.takePhoto}
                >
                  <div className="w-11 h-11 rounded-full bg-white/30 border border-white/50" />
                </button>
              ) : !isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="h-14 px-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2.5 shadow-lg shadow-rose-900/50 active:scale-95 transition-transform cursor-pointer"
                  title={t.rowVideo}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-white" />
                  <span>{t.rowVideo}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="h-14 px-6 rounded-full bg-stone-800 hover:bg-stone-700 border-2 border-rose-500 text-white font-semibold text-xs flex items-center gap-2.5 shadow-lg active:scale-95 transition-transform animate-pulse cursor-pointer"
                  title="Stop Video Recording"
                >
                  <span className="w-3.5 h-3.5 bg-rose-500 rounded-sm" />
                  <span>{recordingSeconds}s</span>
                </button>
              )}

              {/* Right: File / Gallery Picker */}
              <label className="h-11 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-stone-400" />
                <span className="hidden sm:inline">{t.upload}</span>
                <input
                  type="file"
                  accept={activeMode === 'photo' ? 'image/*' : 'video/*'}
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
