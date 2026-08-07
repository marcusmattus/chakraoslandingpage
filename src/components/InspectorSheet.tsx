import React from 'react';
import { ChakraNode } from '../types';
import { X, Play, PenTool, TrendingDown, TrendingUp, Activity, Sparkles } from 'lucide-react';

interface InspectorSheetProps {
  node: ChakraNode;
  onClose: () => void;
  onBeginSession: (node: ChakraNode) => void;
  onReflect: (node: ChakraNode) => void;
  surfacedSignals?: { phrase: string; count: number }[];
}

export const InspectorSheet: React.FC<InspectorSheetProps> = ({
  node,
  onClose,
  onBeginSession,
  onReflect,
  surfacedSignals = [
    { phrase: 'mentions of "tired"/"drained"', count: 4 },
    { phrase: 'late-night sleep entries', count: 3 },
  ],
}) => {
  const isTrendNegative = node.trend7d < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-[#111726] border-t border-[#1E2535] rounded-t-3xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-12 h-1 bg-[#2A3346] rounded-full mx-auto mb-4" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#0E1420] text-[#8A90A6] hover:text-[#E9ECF5] border border-[#1E2535] transition-colors"
          aria-label="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1 font-mono text-[11px] tracking-widest text-[#8A90A6] uppercase">
          <span style={{ color: node.color }}>{node.name}</span>
          <span>·</span>
          <span>{node.bija}</span>
          <span>·</span>
          <span>{node.solfeggioHz} HZ</span>
        </div>

        <h2 className="font-disp font-bold text-2xl text-[#E9ECF5] mb-1">
          {node.name} Node
        </h2>

        <p className="font-mono text-xs text-[#565C72] italic mb-4">
          The sign: {node.sign}
        </p>

        {/* Energy & Trend Metric Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 rounded-xl bg-[#0E1420] border border-[#1E2535]">
            <div className="font-mono text-[10px] tracking-widest text-[#8A90A6] uppercase mb-1">
              ENERGY LEVEL
            </div>
            <div
              className="font-disp font-bold text-2xl"
              style={{ color: node.color }}
            >
              {node.energy}
              <span className="text-xs text-[#565C72] font-normal">/100</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0E1420] border border-[#1E2535]">
            <div className="font-mono text-[10px] tracking-widest text-[#8A90A6] uppercase mb-1">
              7D TREND
            </div>
            <div className="flex items-center gap-1.5 font-mono font-bold text-lg">
              {isTrendNegative ? (
                <span className="text-[#FF4D5E] flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  ↓{Math.abs(node.trend7d)}%
                </span>
              ) : (
                <span className="text-[#3DDC97] flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  ↑{node.trend7d}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="mb-5">
          <div className="font-mono text-[10px] tracking-widest text-[#8A90A6] uppercase mb-2">
            ATTRIBUTES
          </div>
          <div className="flex flex-wrap gap-2">
            {node.attributes.map((attr) => (
              <span
                key={attr}
                className="font-mono text-xs px-3 py-1 rounded-lg bg-[#0A0E18] border border-[#1E2535] text-[#E9ECF5]"
              >
                {attr}
              </span>
            ))}
          </div>
        </div>

        {/* Surfaced in Journal */}
        <div className="mb-6 p-4 rounded-xl bg-[#0E1420] border border-[#1E2535]">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-[#8A90A6] uppercase mb-3">
            <Activity className="w-3.5 h-3.5 text-[#36D6E7]" />
            <span>SURFACED IN JOURNAL · LAST 7D</span>
          </div>

          <div className="space-y-2">
            {surfacedSignals.map((sig, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs font-mono text-[#8A90A6] bg-[#0A0E18] px-3 py-2 rounded-lg border border-[#1E2535]"
              >
                <span className="text-[#E9ECF5] italic">"{sig.phrase}"</span>
                <span className="text-[#36D6E7] font-semibold">×{sig.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onBeginSession(node)}
            className="flex items-center justify-center gap-2 font-mono text-xs font-semibold tracking-wider uppercase py-3 px-4 rounded-xl text-[#0A0E18] transition-all shadow-md hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: node.color }}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>▶ {node.solfeggioHz} Hz Session</span>
          </button>

          <button
            onClick={() => onReflect(node)}
            className="flex items-center justify-center gap-2 font-mono text-xs font-semibold tracking-wider uppercase py-3 px-4 rounded-xl bg-[#0E1420] border border-[#2A3346] text-[#E9ECF5] hover:border-[#36D6E7] hover:text-[#36D6E7] transition-all active:scale-[0.98]"
          >
            <PenTool className="w-4 h-4" />
            <span>Reflect</span>
          </button>
        </div>
      </div>
    </div>
  );
};
