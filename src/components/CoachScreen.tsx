import React, { useState } from 'react';
import { CoachMessage, ChakraNode } from '../types';
import { Bot, Send, Play, Wind, PenTool, Sparkles, Loader2 } from 'lucide-react';

interface CoachScreenProps {
  chakras: ChakraNode[];
  fieldIndex: number;
  onLaunchProtocol: (type: 'breath' | 'sound' | 'reflect', chakraKey?: string, hz?: number) => void;
}

export const CoachScreen: React.FC<CoachScreenProps> = ({
  chakras,
  fieldIndex,
  onLaunchProtocol,
}) => {
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'c-1',
      role: 'coach',
      content: `I notice your Third Eye energy is at 41% (down 18% this week), while Heart energy remains elevated at 81%. Your journal entries mention feeling drained late at night. Here are three restorative options for this evening:`,
      timestamp: '21:40',
      protocolCard: {
        id: 'p-1',
        type: 'sound',
        title: 'SOUND · 852 HZ · 12 MIN',
        subtitle: 'Third Eye restoration with alpha binaural tone',
        duration: '12 min',
        chakraKey: 'third',
        hz: 852,
      },
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!inputMsg.trim()) return;
    const userText = inputMsg;
    setInputMsg('');

    const newMsg: CoachMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: 'NOW',
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/coach/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, currentChakras: chakras, fieldIndex }),
      });
      const data = await res.json();

      const coachMsg: CoachMessage = {
        id: `c-${Date.now()}`,
        role: 'coach',
        content: data.reply || 'I hear you. Let us return to breathing and centering.',
        timestamp: 'NOW',
        protocolCard: data.protocol
          ? {
              id: 'p-2',
              type: 'breath',
              title: 'BREATHWORK · 5 MIN',
              subtitle: 'Box breathing 4-4-4-4 for nervous system calming',
              duration: '5 min',
              chakraKey: 'heart',
            }
          : undefined,
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `c-err`,
          role: 'coach',
          content: 'Your field is showing resilience. Consider taking 5 minutes to ground with Root energy.',
          timestamp: 'NOW',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden text-[#E9ECF5]">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-[#1E2535] bg-[#0A0E18]">
        <div className="font-mono text-[10px] tracking-[0.2em] text-[#3DDC97] uppercase">
          AWARENESS · MEMORY · FREQUENCY
        </div>
        <h1 className="font-disp font-bold text-2xl text-[#E9ECF5] flex items-center gap-2">
          <span>Coach Agent</span>
          <span className="w-2 h-2 rounded-full bg-[#3DDC97] shadow-[0_0_8px_#3DDC97]" />
        </h1>
        <p className="font-mono text-xs text-[#8A90A6]">
          Cites your real field data & recommends tailored protocols.
        </p>
      </div>

      {/* Chat Thread */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-28">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#565C72] mb-1">
              <span>{msg.role === 'coach' ? 'COACH AGENT' : 'YOU'}</span>
              <span>·</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`p-4 rounded-2xl max-w-[90%] text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#3DDC97]/15 border border-[#3DDC97]/40 text-[#E9ECF5]'
                  : 'bg-[#111726] border border-[#1E2535] text-[#E9ECF5]'
              }`}
            >
              <p>{msg.content}</p>

              {/* Protocol Card if attached */}
              {msg.protocolCard && (
                <div className="mt-3 pt-3 border-t border-[#1E2535]">
                  <div className="font-mono text-[9px] tracking-widest text-[#3DDC97] uppercase mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>SUGGESTED · TAP TO BEGIN</span>
                  </div>

                  <button
                    onClick={() =>
                      onLaunchProtocol(
                        msg.protocolCard!.type,
                        msg.protocolCard!.chakraKey,
                        msg.protocolCard!.hz
                      )
                    }
                    className="w-full text-left p-3 rounded-xl bg-[#0E1420] border border-[#2A3346] hover:border-[#3DDC97] transition-all group flex items-center justify-between"
                  >
                    <div>
                      <div className="font-mono font-bold text-xs text-[#3DDC97]">
                        {msg.protocolCard.title}
                      </div>
                      <div className="text-xs text-[#8A90A6] mt-0.5">
                        {msg.protocolCard.subtitle}
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-[#3DDC97]/20 border border-[#3DDC97]/50 flex items-center justify-center text-[#3DDC97] group-hover:scale-110 transition-transform">
                      {msg.protocolCard.type === 'sound' && <Play className="w-4 h-4 fill-current" />}
                      {msg.protocolCard.type === 'breath' && <Wind className="w-4 h-4" />}
                      {msg.protocolCard.type === 'reflect' && <PenTool className="w-4 h-4" />}
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#3DDC97] bg-[#111726] p-3 rounded-xl w-fit border border-[#1E2535]">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Coach Agent synthesizing field patterns...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-[#0A0E18] border-t border-[#1E2535] fixed bottom-14 left-0 right-0 max-w-lg mx-auto z-20">
        <div className="flex items-center gap-2 bg-[#111726] p-2 rounded-2xl border border-[#1E2535]">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask, or just notice..."
            className="flex-1 bg-transparent px-3 py-1 text-sm font-disp text-[#E9ECF5] outline-none placeholder:text-[#565C72]"
          />
          <button
            onClick={handleSend}
            disabled={!inputMsg.trim()}
            className="p-2.5 rounded-xl bg-[#3DDC97] text-[#0A0E18] disabled:opacity-30 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
