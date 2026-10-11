import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  Play,
  Square,
  X,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Radio,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";
import { toast } from "sonner";

interface AudioHardwareTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioHardwareTestModal: React.FC<AudioHardwareTestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { triggerVibration } = useHardwarePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<"pass" | "fail" | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setIsRecording(false);
    setIsPlaying(false);
    setCountdown(4);
  };

  const startRecordLoop = async () => {
    setErrorMsg(null);
    setAudioUrl(null);
    setTestResult(null);
    audioChunksRef.current = [];

    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setErrorMsg("Microphone recording not supported on this browser.");
      return;
    }

    try {
      triggerVibration([50, 30, 80]);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsRecording(false);
        triggerVibration([100, 50, 100]);
        toast.success("4s Audio recorded. Tap Play to test playback.");
      };

      recorder.start();
      setIsRecording(true);
      setCountdown(4);

      let left = 4;
      timerRef.current = window.setInterval(() => {
        left--;
        setCountdown(left);
        triggerVibration(20);
        if (left <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (recorder.state === "recording") {
            recorder.stop();
          }
        }
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Microphone permission denied. Please enable mic access.");
      setIsRecording(false);
    }
  };

  const playRecordedAudio = () => {
    if (!audioUrl) return;
    triggerVibration(30);

    const audio = new Audio(audioUrl);
    audioElementRef.current = audio;

    setIsPlaying(true);
    audio.play().catch(() => {
      setErrorMsg("Unable to play recorded audio.");
      setIsPlaying(false);
    });

    audio.onended = () => {
      setIsPlaying(false);
      triggerVibration(40);
    };
  };

  const stopPlayback = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in select-none"
      onClick={() => {
        cleanup();
        onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-[#030712] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Mic className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">
                  Audio Loopback
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded-full border border-emerald-800">
                  100% Offline
                </span>
              </div>
              <h3 className="font-bold text-base text-white mt-0.5">
                Mic &amp; Earpiece Audio Loopback
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              cleanup();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Center Visual Loopback Stage */}
        <div className="flex flex-col items-center justify-center py-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl relative overflow-hidden">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {isRecording ? (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-rose-500 animate-ping opacity-60" />
                <div className="w-20 h-20 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center">
                  <Mic className="h-10 w-10 text-rose-400 animate-pulse" />
                </div>
              </>
            ) : isPlaying ? (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-60" />
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
                  <Volume2 className="h-10 w-10 text-emerald-400 animate-bounce" />
                </div>
              </>
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <Radio className="h-10 w-10 text-slate-500" />
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <span className="font-mono text-lg font-black text-white block">
              {isRecording
                ? `Recording Microphone... (${countdown}s)`
                : isPlaying
                ? "Playing Back Through Speakers..."
                : audioUrl
                ? "Audio Recorded & Ready"
                : "Ready to Test Mic"}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Instant loopback tests for voice IC, muffled microphone &amp; crackling speakers
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="space-y-2">
          {!isRecording && (
            <button
              type="button"
              onClick={startRecordLoop}
              disabled={isPlaying}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Mic className="h-4 w-4" />
              <span>Record 4-Second Test Audio</span>
            </button>
          )}

          {audioUrl && !isRecording && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={isPlaying ? stopPlayback : playRecordedAudio}
                className="py-3 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                {isPlaying ? <Square className="h-4 w-4 fill-slate-950" /> : <Play className="h-4 w-4 fill-slate-950" />}
                <span>{isPlaying ? "Stop Audio" : "Play Back Audio"}</span>
              </button>

              <button
                type="button"
                onClick={startRecordLoop}
                className="py-3 px-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 active:scale-95 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Re-Record</span>
              </button>
            </div>
          )}
        </div>

        {/* Diagnostic Guide */}
        <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <span className="font-bold text-slate-200 block">Engineer Diagnostic Tip:</span>
          <span>
            If recording is completely silent, bottom microphone port is blocked or flex ribbon is torn. If audio is robotic or distorted, main audio codec IC requires reballing.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AudioHardwareTestModal;
