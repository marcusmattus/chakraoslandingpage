import React from 'react';
import { ChakraNode, AgentObservation } from '../types';
import { Sparkles, ArrowUpRight, Radio, RefreshCw } from 'lucide-react';

interface BodyScreenProps {
  chakras: ChakraNode[];
  fieldIndex: number;
  onSelectNode: (node: ChakraNode) => void;
  observation: AgentObservation;
  onNavigateTab: (tab: 'body' | 'journal' | 'coach' | 'sound' | 'you') => void;
  isSyncing?: boolean;
}

export const BodyScreen: React.FC<BodyScreenProps> = ({
  chakras,
  fieldIndex,
  onSelectNode,
  observation,
  onNavigateTab,
  isSyncing,
}) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 text-[#E9ECF5]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-[#1E2535]">
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-[#8A90A6] uppercase">
            TODAY · TUE / 14 MAY
          </div>
          <div className="font-disp font-semibold text-lg text-[#E9ECF5]">
            Inner Energy Channel
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono text-[9px] tracking-[0.2em] text-[#8A90A6]">
            FIELD INDEX
          </div>
          <div className="flex items-baseline justify-end gap-1 font-disp font-bold text-2xl text-[#36D6E7]">
            <span>{fieldIndex}</span>
            <span className="text-xs text-[#565C72] font-normal">/100</span>
          </div>
        </div>
      </div>

      {/* Syncing Bar if recalculating */}
      {isSyncing && (
        <div className="bg-[#36D6E7]/10 border-b border-[#36D6E7]/30 px-4 py-1.5 flex items-center justify-center gap-2 text-[#36D6E7] font-mono text-xs animate-pulse">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>AWARENESS AGENT RECOMPUTING FIELD HARMONICS...</span>
        </div>
      )}

      {/* Body Silhouette & 9 Energy Nodes Channel */}
      <div className="relative my-4 py-2 flex flex-col items-center justify-center min-h-[380px]">
        {/* Subtle Silhouette Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <svg viewBox="0 0 200 400" className="w-[180px] h-[360px]">
            {/* Meditating body contour path */}
            <path
              d="M100 30 C115 30 125 45 125 60 C125 75 115 85 100 85 C85 85 75 75 75 60 C75 45 85 30 100 30 Z
                 M100 90 C120 95 140 105 155 125 C170 145 180 175 180 200 C180 225 165 245 150 260 C135 275 120 290 120 320 C120 340 145 350 160 360 L40 360 C55 350 80 340 80 320 C80 290 65 275 50 260 C35 245 20 225 20 200 C20 175 30 145 45 125 C60 105 80 95 100 90 Z"
              fill="none"
              stroke="#36D6E7"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        {/* Central Channel Glowing Spine Line */}
        <div className="absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#EAF0FF] via-[#3DB6FF] via-[#36F5A6] via-[#FFD23D] to-[#C0433A] opacity-40 shadow-[0_0_12px_rgba(54,214,231,0.5)]" />

        {/* 9 Nodes Stack */}
        <div className="relative z-10 w-full max-w-[280px] flex flex-col justify-between py-1 h-[370px]">
          {chakras.map((node) => {
            const bloomScale = 0.5 + (node.energy / 100) * 0.9;
            const glowOpacity = 0.4 + (node.energy / 100) * 0.5;

            return (
              <button
                key={node.key}
                onClick={() => onSelectNode(node)}
                className="group relative flex items-center gap-3 w-full pl-[46%] text-left py-0.5 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] focus:outline-none"
              >
                {/* Glowing Node Dot */}
                <div className="absolute left-[calc(50%-7px)] top-1/2 -translate-y-1/2 flex items-center justify-center">
                  {/* Aura Glow Ring */}
                  <div
                    className="absolute rounded-full transition-all duration-500 animate-pulse-slow"
                    style={{
                      width: `${14 * bloomScale * 2.2}px`,
                      height: `${14 * bloomScale * 2.2}px`,
                      backgroundColor: node.color,
                      opacity: glowOpacity * 0.35,
                      filter: `blur(${4 * bloomScale}px)`,
                    }}
                  />

                  {/* Core Node */}
                  <div
                    className="relative rounded-full transition-transform duration-300 group-hover:scale-125"
                    style={{
                      width: '13px',
                      height: '13px',
                      backgroundColor: node.color,
                      boxShadow: `0 0 ${8 * bloomScale}px ${node.color}, inset 0 0 2px rgba(255,255,255,0.8)`,
                    }}
                  />
                </div>

                {/* Node Label & Score */}
                <div className="font-mono text-[10px] tracking-wider text-[#8A90A6] flex items-center gap-1.5 whitespace-nowrap bg-[#0A0E18]/80 px-2 py-0.5 rounded border border-transparent group-hover:border-[#1E2535] group-hover:bg-[#111726]">
                  <span className="font-medium text-[#E9ECF5] uppercase">
                    {node.name}
                  </span>
                  <span className="text-[#565C72]">·</span>
                  <span className="text-[#8A90A6]">{node.bija}</span>
                  <span className="text-[#565C72]">·</span>
                  <span
                    className="font-bold text-[11px]"
                    style={{ color: node.color }}
                  >
                    {node.energy}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Observation Card (Oracle Agent) */}
      <div className="mx-4 mt-2 mb-4 p-4 rounded-2xl bg-gradient-to-b from-[#111726] to-[#0E1420] border border-[#1E2535] relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#36D6E7]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-2 text-[#36D6E7] font-mono text-[10px] tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TODAY'S OBSERVATION · ORACLE AGENT</span>
        </div>

        <p className="font-serif italic text-sm text-[#E9ECF5] leading-relaxed mb-3">
          "{observation.quote}"
        </p>

        {/* Action Chips */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-[#1E2535]">
          {observation.actionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onNavigateTab(chip.targetTab)}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-lg bg-[#0A0E18] border border-[#2A3346] text-[#8A90A6] hover:text-[#36D6E7] hover:border-[#36D6E7]/50 transition-colors"
            >
              <Radio className="w-3 h-3 text-[#36D6E7]" />
              <span>{chip.label}</span>
              <ArrowUpRight className="w-3 h-3 text-[#565C72]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
