import React, { useState, useEffect, useRef } from 'react';
import { ChakraNode } from '../types';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Sparkles, Check } from 'lucide-react';

interface SoundScreenProps {
  chakras: ChakraNode[];
  selectedChakra?: ChakraNode | null;
  onSessionComplete: (chakraKey: string, xp: number) => void;
}

export const SoundScreen: React.FC<SoundScreenProps> = ({
  chakras,
  selectedChakra,
  onSessionComplete,
}) => {
  const currentChakra = selectedChakra || chakras.find((c) => c.key === 'third') || chakras[2];

  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const durationSec = 12 * 60; // 12 min session

  // Web Audio Synthesizer ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsed((prev) => {
          if (prev >= durationSec) {
            setIsPlaying(false);
            setCompleted(true);
            onSessionComplete(currentChakra.key, 120);
            return durationSec;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, durationSec, currentChakra.key, onSessionComplete]);

  // Audio tone generator
  const toggleAudio = () => {
    if (isPlaying) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      setIsPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = audioCtxRef.current || new AudioCtx();
        audioCtxRef.current = ctx;

        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(currentChakra.solfeggioHz, ctx.currentTime);

        gain.gain.setValueAtTime(isMuted ? 0 : 0.15, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        oscRef.current = osc;
        gainRef.current = gain;

        setIsPlaying(true);
      } catch (err) {
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 text-[#E9ECF5] px-5 pt-4">
      {/* Header */}
      <div className="mb-4">
        <div className="font-mono text-[10px] tracking-[0.2em] text-[#A56BFF] uppercase mb-1">
          SOUND · SOLFEGGIO PLAYER
        </div>
        <h1 className="font-disp font-bold text-2xl text-[#E9ECF5]">
          Session 03 · {currentChakra.name} Restoration
        </h1>
        <p className="font-mono text-xs text-[#8A90A6]">
          {currentChakra.solfeggioHz} Hz pure tone + 8 Hz alpha binaural weave.
        </p>
      </div>

      {/* Radial Visualizer Stage */}
      <div className="relative my-4 flex flex-col items-center justify-center min-h-[260px]">
        {/* Animated Radial Waves SVG */}
        <div className="relative w-60 h-60 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Outer Ring */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="#1E2535"
              strokeWidth="1"
            />
            {/* Mid Ring */}
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="#A56BFF"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className={isPlaying ? 'animate-spin' : ''}
              style={{ animationDuration: '20s' }}
            />
            {/* Pulsing Core Wave */}
            <circle
              cx="100"
              cy="100"
              r="40"
              fill="rgba(165,107,255,0.15)"
              stroke="#A56BFF"
              strokeWidth="2"
              className={isPlaying ? 'animate-pulse' : ''}
            />
          </svg>

          {/* Center Frequency Badge */}
          <div className="absolute text-center">
            <div
              className="font-disp font-bold text-3xl"
              style={{ color: currentChakra.color }}
            >
              {currentChakra.solfeggioHz}
              <span className="text-xs font-mono font-normal text-[#8A90A6]">
                Hz
              </span>
            </div>
            <div className="font-mono text-[10px] tracking-widest text-[#8A90A6] uppercase mt-1">
              {currentChakra.bija} · {currentChakra.name}
            </div>
          </div>
        </div>
      </div>

      {/* Track info & Chips */}
      <div className="bg-[#111726] border border-[#1E2535] rounded-2xl p-4 mb-4 text-center">
        <div className="font-mono text-[10px] tracking-widest text-[#8A90A6] uppercase mb-2">
          {currentChakra.solfeggioHz} HZ · LOW DRONE · ALPHA 8 HZ
        </div>

        <div className="flex justify-center gap-1.5 flex-wrap">
          <span className="font-mono text-[9px] uppercase px-2.5 py-1 rounded-lg bg-[#0A0E18] border border-[#1E2535] text-[#A56BFF]">
            {currentChakra.name}
          </span>
          <span className="font-mono text-[9px] uppercase px-2.5 py-1 rounded-lg bg-[#0A0E18] border border-[#1E2535] text-[#3DDC97]">
            RESTORATIVE
          </span>
          <span className="font-mono text-[9px] uppercase px-2.5 py-1 rounded-lg bg-[#0A0E18] border border-[#1E2535] text-[#36D6E7]">
            SOLFEGGIO
          </span>
        </div>
      </div>

      {/* Completion Banner */}
      {completed && (
        <div className="mb-4 p-3 rounded-xl bg-[#A56BFF]/20 border border-[#A56BFF] text-[#A56BFF] font-mono text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>SESSION COMPLETE! +120 XP AWARDED</span>
          </div>
        </div>
      )}

      {/* Scrubber & Controls */}
      <div className="p-4 rounded-2xl bg-[#0E1420] border border-[#1E2535]">
        {/* Scrubber */}
        <div className="mb-3">
          <div className="w-full bg-[#1E2535] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#A56BFF] h-full transition-all duration-300"
              style={{ width: `${(elapsed / durationSec) * 100}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-[10px] text-[#8A90A6] mt-1.5">
            <span>{formatTime(elapsed)}</span>
            <span>-{formatTime(durationSec - elapsed)}</span>
          </div>
        </div>

        {/* Transport Buttons */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setElapsed(0)}
            className="p-2 text-[#8A90A6] hover:text-[#E9ECF5]"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={toggleAudio}
            className="w-14 h-14 rounded-2xl bg-[#A56BFF] text-[#0A0E18] flex items-center justify-center shadow-lg hover:bg-[#A56BFF]/90 transition-transform active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-[#8A90A6] hover:text-[#E9ECF5]"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-[#FF4D5E]" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
