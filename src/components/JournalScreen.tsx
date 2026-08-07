import React, { useState } from 'react';
import { JournalEntry, ChakraNode } from '../types';
import { Send, Mic, Type, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

interface JournalScreenProps {
  entries: JournalEntry[];
  onSubmitEntry: (text: string, modality: 'text' | 'voice') => Promise<void>;
  preseededNode?: ChakraNode | null;
  onClearPreseed?: () => void;
  isSubmitting?: boolean;
}

export const JournalScreen: React.FC<JournalScreenProps> = ({
  entries,
  onSubmitEntry,
  preseededNode,
  onClearPreseed,
  isSubmitting = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [modality, setModality] = useState<'text' | 'voice'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [justSaved, setJustSaved] = useState(false);

  // Handle voice recording simulation
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText('');
    if (onClearPreseed) onClearPreseed();

    await onSubmitEntry(textToSend, modality);

    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  };

  const handleVoiceToggle = () => {
    if (modality === 'text') {
      setModality('voice');
      setIsRecording(true);
    } else {
      if (isRecording) {
        setIsRecording(false);
        if (!inputText) {
          setInputText('Voice note: I felt the tension move out of my chest after taking deep breaths.');
        }
      } else {
        setIsRecording(true);
      }
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 text-[#E9ECF5] px-5 pt-4">
      {/* Header */}
      <div className="mb-4">
        <div className="font-mono text-[10px] tracking-[0.2em] text-[#E8B23D] uppercase mb-1">
          JOURNAL · AMBER SURFACE
        </div>
        <h1 className="font-disp font-bold text-2xl text-[#E9ECF5]">
          A single sentence is enough.
        </h1>
        <p className="font-mono text-xs text-[#8A90A6] mt-0.5">
          Your words shift the field. Text or voice.
        </p>
      </div>

      {/* Preseeded Node Nudge */}
      {preseededNode && (
        <div className="mb-3 p-2.5 rounded-xl bg-[#E8B23D]/10 border border-[#E8B23D]/30 flex items-center justify-between text-xs font-mono text-[#E8B23D]">
          <span>Reflecting on {preseededNode.name} node ({preseededNode.solfeggioHz} Hz)</span>
          <button
            onClick={onClearPreseed}
            className="text-[#8A90A6] hover:text-[#E9ECF5]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Composer Container */}
      <div className="p-4 rounded-2xl bg-[#111726] border border-[#1E2535] mb-6 shadow-xl relative">
        <div className="flex items-center justify-between mb-3 border-b border-[#1E2535] pb-2">
          <span className="font-mono text-[10px] tracking-widest text-[#8A90A6] uppercase">
            WHAT ARE YOU NOTICING RIGHT NOW?
          </span>

          {/* Text / Voice Mode Toggle */}
          <div className="flex items-center bg-[#0E1420] p-0.5 rounded-lg border border-[#1E2535]">
            <button
              onClick={() => {
                setModality('text');
                setIsRecording(false);
              }}
              className={`px-2.5 py-1 rounded-md font-mono text-[10px] flex items-center gap-1 transition-colors ${
                modality === 'text'
                  ? 'bg-[#E8B23D] text-[#0A0E18] font-bold'
                  : 'text-[#8A90A6] hover:text-[#E9ECF5]'
              }`}
            >
              <Type className="w-3 h-3" />
              <span>TEXT</span>
            </button>
            <button
              onClick={handleVoiceToggle}
              className={`px-2.5 py-1 rounded-md font-mono text-[10px] flex items-center gap-1 transition-colors ${
                modality === 'voice'
                  ? 'bg-[#E8B23D] text-[#0A0E18] font-bold'
                  : 'text-[#8A90A6] hover:text-[#E9ECF5]'
              }`}
            >
              <Mic className="w-3 h-3" />
              <span>VOICE</span>
            </button>
          </div>
        </div>

        {/* Text Input Area */}
        {modality === 'text' ? (
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="I felt the tension move out of my chest tonight..."
            className="w-full bg-transparent text-[#E9ECF5] font-serif italic text-base placeholder:text-[#565C72] outline-none resize-none min-h-[90px] leading-relaxed"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        ) : (
          <div className="py-4 flex flex-col items-center justify-center text-center min-h-[90px]">
            {isRecording ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#E8B23D]/20 border border-[#E8B23D] flex items-center justify-center animate-pulse">
                  <Mic className="w-6 h-6 text-[#E8B23D]" />
                </div>
                <div className="font-mono text-xs text-[#E8B23D] animate-pulse">
                  RECORDING VOICE NOTE · {recordingSeconds}s
                </div>
                <div className="text-[11px] font-mono text-[#8A90A6]">
                  Tap VOICE to finish & transcribe
                </div>
              </div>
            ) : (
              <div className="w-full">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Transcribed voice entry..."
                  className="w-full bg-transparent text-[#E9ECF5] font-serif italic text-base outline-none resize-none min-h-[60px]"
                />
              </div>
            )}
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1E2535]">
          <span className="font-mono text-[10px] text-[#565C72]">
            AWARENESS AGENT TAGS & RESCORES LIVE
          </span>

          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E8B23D] text-[#0A0E18] font-mono font-bold text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E8B23D]/90 transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Rescoring...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Save & Rescore</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {justSaved && (
        <div className="mb-4 p-3 rounded-xl bg-[#3DDC97]/15 border border-[#3DDC97]/40 text-[#3DDC97] font-mono text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>FIELD RESCORED! Inner body nodes updated in real-time.</span>
        </div>
      )}

      {/* Entries Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-[#8A90A6] uppercase">
          <span>THIS WEEK · {entries.length} ENTRIES</span>
          <span>AWARENESS SIGNALS</span>
        </div>

        {entries.map((entry) => (
          <div
            key={entry.id}
            className="p-4 rounded-xl bg-[#0E1420] border border-[#1E2535] hover:border-[#2A3346] transition-colors"
          >
            <div className="flex items-center justify-between font-mono text-[10px] text-[#565C72] mb-2">
              <span>{entry.timestamp}</span>
              <span className="uppercase text-[#8A90A6]">
                {entry.modality}
              </span>
            </div>

            <p className="font-serif italic text-sm text-[#E9ECF5] leading-relaxed mb-3">
              "{entry.body}"
            </p>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1E2535]">
              {entry.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded bg-[#0A0E18] border border-[#1E2535] text-[#E8B23D]"
                >
                  {tag.chakraKey} · {tag.theme} ({tag.weight > 0 ? `+${tag.weight}` : tag.weight})
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
