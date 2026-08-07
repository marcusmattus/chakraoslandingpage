import React from 'react';
import { ChakraNode, UserProfile } from '../types';
import { Shield, Flame, Award, Sparkles, CheckCircle } from 'lucide-react';

interface YouScreenProps {
  chakras: ChakraNode[];
  profile: UserProfile;
}

export const YouScreen: React.FC<YouScreenProps> = ({ chakras, profile }) => {
  // Generate radial 9-node Aura Sigil SVG polygon
  const cx = 120;
  const cy = 120;
  const R = 85;

  const points = chakras.map((node, i) => {
    const angle = -Math.PI / 2 + (i / chakras.length) * Math.PI * 2;
    const r = R * (0.35 + (node.energy / 100) * 0.65);
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      color: node.color,
      energy: node.energy,
    };
  });

  const polygonPointsStr = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 text-[#E9ECF5] px-5 pt-4">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-[#FF5CA8] uppercase mb-0.5">
            YOU · MAGENTA SURFACE
          </div>
          <h1 className="font-disp font-bold text-2xl text-[#E9ECF5]">
            {profile.handle}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FF5CA8]/15 border border-[#FF5CA8]/30 text-[#FF5CA8] font-mono text-xs font-bold">
          <Award className="w-4 h-4" />
          <span>LEVEL {profile.level}</span>
        </div>
      </div>

      {/* Aura Sigil Constellation */}
      <div className="relative p-5 rounded-3xl bg-gradient-to-b from-[#111726] to-[#0E1420] border border-[#1E2535] mb-5 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF5CA8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="font-mono text-[10px] tracking-widest text-[#8A90A6] uppercase mb-2">
          THE AURA SIGIL · FIELD SHAPE
        </div>

        <div className="relative w-60 h-60 flex items-center justify-center">
          <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,92,168,0.3)]">
            {/* Guide Circles */}
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="#1E2535" strokeWidth="1" />
            <circle cx={cx} cy={cy} r={R * 0.5} fill="none" stroke="#161C2B" strokeWidth="1" />

            {/* Radial Spoke Lines */}
            {chakras.map((_, i) => {
              const angle = -Math.PI / 2 + (i / chakras.length) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={cx + Math.cos(angle) * R}
                  y2={cy + Math.sin(angle) * R}
                  stroke="#161C2B"
                  strokeWidth="1"
                />
              );
            })}

            {/* Energy Polygon */}
            <polygon
              points={polygonPointsStr}
              fill="rgba(255,92,168,0.18)"
              stroke="#FF5CA8"
              strokeWidth="2"
            />

            {/* Vertex Nodes */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill={p.color}
                className="animate-pulse"
              />
            ))}

            {/* Core Center Dot */}
            <circle cx={cx} cy={cy} r="3" fill="#EAF0FF" />
          </svg>
        </div>

        <div className="font-mono text-[10px] text-[#8A90A6] mt-1 text-center">
          RADIAL CONSTELLATION DRAWN FROM YOUR 9 ENERGETIC NODES
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="p-3 rounded-xl bg-[#0E1420] border border-[#1E2535] text-center">
          <div className="font-mono text-[9px] tracking-widest text-[#8A90A6] uppercase">
            XP TOTAL
          </div>
          <div className="font-disp font-bold text-lg text-[#FF5CA8] mt-0.5">
            {profile.xp}
          </div>
          <div className="font-mono text-[9px] text-[#3DDC97]">
            +{profile.xp7dTrend} 7D
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0E1420] border border-[#1E2535] text-center">
          <div className="font-mono text-[9px] tracking-widest text-[#8A90A6] uppercase">
            STREAK
          </div>
          <div className="font-disp font-bold text-lg text-[#E8B23D] mt-0.5 flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 fill-current" />
            <span>{profile.streakDays}d</span>
          </div>
          <div className="font-mono text-[9px] text-[#8A90A6]">
            ACTIVE
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0E1420] border border-[#1E2535] text-center">
          <div className="font-mono text-[9px] tracking-widest text-[#8A90A6] uppercase">
            LEVEL
          </div>
          <div className="font-disp font-bold text-lg text-[#36D6E7] mt-0.5">
            {profile.level}
          </div>
          <div className="font-mono text-[9px] text-[#36D6E7]">
            INITIATE
          </div>
        </div>
      </div>

      {/* 30-Day Intention Card */}
      <div className="p-4 rounded-2xl bg-[#111726] border border-[#1E2535] mb-5">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-[#8A90A6] uppercase mb-2">
          <span>30-DAY INTENTION · DAY {profile.intentionDay}</span>
          <span className="text-[#FF5CA8]">{profile.totalIntentionDays - profile.intentionDay} DAYS LEFT</span>
        </div>

        <blockquote className="font-serif italic text-base text-[#E9ECF5] leading-relaxed mb-3">
          "{profile.intention}"
        </blockquote>

        <div className="w-full bg-[#0E1420] h-1.5 rounded-full overflow-hidden border border-[#1E2535]">
          <div
            className="bg-[#FF5CA8] h-full"
            style={{ width: `${(profile.intentionDay / profile.totalIntentionDays) * 100}%` }}
          />
        </div>
      </div>

      {/* Breakthroughs */}
      <div className="p-4 rounded-2xl bg-[#0E1420] border border-[#1E2535]">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-[#8A90A6] uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5CA8]" />
          <span>BREAKTHROUGHS · ORACLE LOG</span>
        </div>

        <div className="space-y-2.5">
          {profile.breakthroughs.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between font-mono text-xs p-2.5 rounded-xl bg-[#0A0E18] border border-[#1E2535]"
            >
              <div className="flex items-center gap-2 text-[#E9ECF5]">
                <CheckCircle className="w-3.5 h-3.5 text-[#3DDC97]" />
                <span>{b.label}</span>
              </div>
              <span className="text-[10px] text-[#565C72]">{b.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
