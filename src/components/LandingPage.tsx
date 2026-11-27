import React, { useState } from 'react';
import { MobileFrame } from './MobileFrame';
import { ChakraNode, JournalEntry, UserProfile, AgentObservation } from '../types';
import { Sparkles, ArrowRight, Check, Radio, PenTool, Shield, Cpu, Activity, Heart, Eye } from 'lucide-react';

interface LandingPageProps {
  activeTab: 'body' | 'journal' | 'coach' | 'sound' | 'you';
  onTabChange: (tab: 'body' | 'journal' | 'coach' | 'sound' | 'you') => void;
  chakras: ChakraNode[];
  fieldIndex: number;
  entries: JournalEntry[];
  profile: UserProfile;
  observation: AgentObservation;
  selectedNode: ChakraNode | null;
  onSelectNode: (node: ChakraNode | null) => void;
  onSubmitJournal: (text: string, modality: 'text' | 'voice') => Promise<void>;
  preseededNode: ChakraNode | null;
  onClearPreseed: () => void;
  onLaunchProtocol: (type: 'breath' | 'sound' | 'reflect', chakraKey?: string, hz?: number) => void;
  onSessionComplete: (chakraKey: string, xp: number) => void;
  onOpenFullScreenApp: () => void;
  isSyncing?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = (props) => {
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setEmailError('ENTER A VALID SIGNAL (EMAIL)');
      return;
    }
    setEmailSubmitted(true);
    setEmailError('');
  };

  // Generate SVG Sigil for CTA section
  const cx = 150;
  const cy = 150;
  const R = 110;
  const sigilPts = props.chakras.map((node, i) => {
    const angle = -Math.PI / 2 + (i / props.chakras.length) * Math.PI * 2;
    const r = R * (0.42 + (node.energy / 100) * 0.58);
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      color: node.color,
    };
  });
  const sigilPolyStr = sigilPts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div className="min-h-screen bg-[#0A0E18] text-[#E9ECF5] font-disp selection:bg-[#36D6E7]/25 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0A0E18]/85 backdrop-blur-md border-b border-[#1E2535]/50">
        <a href="#top" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#6B6BFF] via-[#36D6E7] to-[#B14DFF] shadow-[0_0_12px_#36D6E7]" />
          <span>chakra<b className="font-normal text-[#8A90A6]">OS</b></span>
        </a>

        <div className="hidden md:flex items-center gap-8 font-mono text-xs tracking-wider text-[#8A90A6]">
          <a href="#loop" className="hover:text-[#E9ECF5] transition-colors">THE LOOP</a>
          <a href="#surfaces" className="hover:text-[#E9ECF5] transition-colors">SURFACES</a>
          <a href="#agents" className="hover:text-[#E9ECF5] transition-colors">AGENTS</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={props.onOpenFullScreenApp}
            className="font-mono text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-xl bg-[#E9ECF5] text-[#0A0E18] hover:bg-white transition-all shadow-lg hover:shadow-[0_0_20px_rgba(233,236,245,0.3)]"
          >
            Launch Full App
          </button>
        </div>
      </nav>

      {/* Hero Section with Interactive Mobile Phone */}
      <section className="relative pt-28 pb-16 px-6 max-w-7xl mx-auto min-h-screen flex items-center">
        {/* Glowing Background Auras */}
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-[#B14DFF]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#36D6E7]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.24em] text-[#8A90A6] uppercase">
              <span className="w-5 h-[1px] bg-[#8A90A6]" />
              <span>CLINICAL MYSTICISM · FOR THE INNER FIELD</span>
            </div>

            <h1 className="font-bold text-4xl sm:text-5xl xl:text-6xl tracking-tight leading-[1.05]">
              Your inner field,<br />
              <span className="bg-gradient-to-r from-[#6B6BFF] via-[#3DB6FF] to-[#36F5A6] bg-clip-text text-transparent">
                made legible.
              </span>
            </h1>

            <p className="text-[#8A90A6] text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              chakraOS turns a single sentence of journaling into a living map of nine energy centers — read by five quiet agents, tuned by sound, tracked over time.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={props.onOpenFullScreenApp}
                className="font-mono text-xs font-bold tracking-wider uppercase px-6 py-3.5 rounded-xl bg-[#36D6E7] text-[#0A0E18] hover:bg-[#36D6E7]/90 transition-all shadow-[0_0_25px_rgba(54,214,231,0.3)]"
              >
                Launch Fullscreen App
              </button>
              <a
                href="#loop"
                className="font-mono text-xs font-semibold tracking-wider uppercase px-6 py-3.5 rounded-xl border border-[#2A3346] bg-[#111726]/60 text-[#E9ECF5] hover:border-[#36D6E7] transition-all"
              >
                See How It Works
              </a>
            </div>

            <div className="pt-4 font-mono text-[11px] text-[#565C72] flex items-center justify-center lg:justify-start gap-4">
              <span>✦ INTERACTIVE MOBILE APP PREVIEW ON THE RIGHT →</span>
            </div>
          </div>

          {/* Right Mobile Phone Display Frame */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="transform hover:scale-[1.01] transition-transform duration-500">
              <MobileFrame
                activeTab={props.activeTab}
                onTabChange={props.onTabChange}
                chakras={props.chakras}
                fieldIndex={props.fieldIndex}
                entries={props.entries}
                profile={props.profile}
                observation={props.observation}
                selectedNode={props.selectedNode}
                onSelectNode={props.onSelectNode}
                onSubmitJournal={props.onSubmitJournal}
                preseededNode={props.preseededNode}
                onClearPreseed={props.onClearPreseed}
                onLaunchProtocol={props.onLaunchProtocol}
                onSessionComplete={props.onSessionComplete}
                isSyncing={props.isSyncing}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Telemetry Strip */}
      <div className="border-y border-[#1E2535] bg-[#070A12] py-4 px-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[700px] font-mono text-xs tracking-[0.18em] text-[#8A90A6]">
          <span><b className="text-[#E9ECF5]">9</b> NODES</span>
          <span className="text-[#1E2535]">·</span>
          <span><b className="text-[#E9ECF5]">5</b> AGENTS</span>
          <span className="text-[#1E2535]">·</span>
          <span><b className="text-[#E9ECF5]">5</b> SURFACES</span>
          <span className="text-[#1E2535]">·</span>
          <span><b className="text-[#E9ECF5]">174–963</b> HZ</span>
          <span className="text-[#1E2535]">·</span>
          <span>OUTFIT · <b className="text-[#E9ECF5]">JETBRAINS MONO</b> · LORA</span>
        </div>
      </div>

      {/* Section 1: The Loop */}
      <section id="loop" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <span className="font-mono text-xs tracking-[0.24em] text-[#36D6E7] uppercase mb-3 block">
            THE LOOP IS THE PRODUCT
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            One sentence moves the whole field.
          </h2>
          <p className="text-[#8A90A6] text-base leading-relaxed">
            Everything in chakraOS feeds a single closed loop. You write; the field responds; the coach answers from your own data; sound tunes it back.
          </p>
        </div>

        {/* 5 Loop Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E2535] relative overflow-hidden border-l-4 border-l-[#E8B23D]">
            <div className="font-mono text-xs font-bold text-[#E8B23D] mb-1">01</div>
            <h3 className="font-bold text-lg text-[#E9ECF5] mb-2">Journal</h3>
            <p className="text-xs text-[#8A90A6] leading-relaxed">
              A single sentence — text or voice — about what you're noticing right now.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E2535] relative overflow-hidden border-l-4 border-l-[#36D6E7]">
            <div className="font-mono text-xs font-bold text-[#36D6E7] mb-1">02</div>
            <h3 className="font-bold text-lg text-[#E9ECF5] mb-2">Field</h3>
            <p className="text-xs text-[#8A90A6] leading-relaxed">
              Agents re-score each node's energy and the composite Field Index.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E2535] relative overflow-hidden border-l-4 border-l-[#3DDC97]">
            <div className="font-mono text-xs font-bold text-[#3DDC97] mb-1">03</div>
            <h3 className="font-bold text-lg text-[#E9ECF5] mb-2">Coach</h3>
            <p className="text-xs text-[#8A90A6] leading-relaxed">
              Reflects your patterns back and prescribes a targeted protocol.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E2535] relative overflow-hidden border-l-4 border-l-[#A56BFF]">
            <div className="font-mono text-xs font-bold text-[#A56BFF] mb-1">04</div>
            <h3 className="font-bold text-lg text-[#E9ECF5] mb-2">Sound</h3>
            <p className="text-xs text-[#8A90A6] leading-relaxed">
              A solfeggio session tuned to the node that needs alignment.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E2535] relative overflow-hidden border-l-4 border-l-[#FF5CA8]">
            <div className="font-mono text-xs font-bold text-[#FF5CA8] mb-1">05</div>
            <h3 className="font-bold text-lg text-[#E9ECF5] mb-2">You</h3>
            <p className="text-xs text-[#8A90A6] leading-relaxed">
              Renders as an aura sigil constellation that shifts as you do.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Five Surfaces */}
      <section id="surfaces" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#1E2535]">
        <div className="max-w-2xl mb-12">
          <span className="font-mono text-xs tracking-[0.24em] text-[#E8B23D] uppercase mb-3 block">
            FIVE SURFACES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            An instrument with five faces.
          </h2>
          <p className="text-[#8A90A6] text-base leading-relaxed">
            Each surface owns a color and a job. Together they make the inner field something you can actually read.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111726] to-[#0E1420] border border-[#1E2535] flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-[#36D6E7] uppercase mb-2">01 · BODY</div>
              <h3 className="font-bold text-xl mb-2">The nine-node body</h3>
              <p className="text-xs text-[#8A90A6] leading-relaxed">
                Your default home. A living silhouette of nine glowing nodes, Soul to Earth.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111726] to-[#0E1420] border border-[#1E2535] flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-[#E8B23D] uppercase mb-2">02 · JOURNAL</div>
              <h3 className="font-bold text-xl mb-2">A single sentence is enough</h3>
              <p className="text-xs text-[#8A90A6] leading-relaxed">
                Text or voice. No streak guilt, no walls of prose.
              </p>
            </div>
            <p className="font-serif italic text-xs text-[#E9ECF5] pt-3 border-t border-[#1E2535]">
              "I felt the tension move out of my chest tonight."
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111726] to-[#0E1420] border border-[#1E2535] flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-[#3DDC97] uppercase mb-2">03 · COACH</div>
              <h3 className="font-bold text-xl mb-2">It already knows your week</h3>
              <p className="text-xs text-[#8A90A6] leading-relaxed">
                Cites your own data — "stress, four times; Third Eye down 18%" — then hands you a move.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111726] to-[#0E1420] border border-[#1E2535] flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-[#A56BFF] uppercase mb-2">04 · SOUND</div>
              <h3 className="font-bold text-xl mb-2">Frequencies, prescribed</h3>
              <p className="text-xs text-[#8A90A6] leading-relaxed">
                Binaural and solfeggio sessions — 852 Hz, alpha, low drone — matched to your quiet node.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111726] to-[#0E1420] border border-[#1E2535] flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-[#FF5CA8] uppercase mb-2">05 · YOU</div>
              <h3 className="font-bold text-xl mb-2">The shape of your field</h3>
              <p className="text-xs text-[#8A90A6] leading-relaxed">
                An aura sigil, XP, streak, and a thirty-day intention set in your own words.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Five Agents Table */}
      <section id="agents" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#1E2535]">
        <div className="max-w-2xl mb-10">
          <span className="font-mono text-xs tracking-[0.24em] text-[#3DDC97] uppercase mb-3 block">
            QUIET INTELLIGENCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Five agents underneath.
          </h2>
          <p className="text-[#8A90A6] text-base leading-relaxed">
            The math is deterministic; the language is human; nothing is ever a diagnosis.
          </p>
        </div>

        <div className="rounded-2xl border border-[#1E2535] bg-[#0E1420] overflow-hidden">
          <div className="p-5 border-b border-[#1E2535] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8B23D]" />
              <span className="font-bold font-disp">Awareness Agent</span>
            </div>
            <span className="font-mono text-xs text-[#8A90A6]">TAGS & SURFACES</span>
          </div>

          <div className="p-5 border-b border-[#1E2535] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#36D6E7]" />
              <span className="font-bold font-disp">Field Agent</span>
            </div>
            <span className="font-mono text-xs text-[#8A90A6]">SCORING ENGINE</span>
          </div>

          <div className="p-5 border-b border-[#1E2535] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3DDC97]" />
              <span className="font-bold font-disp">Coach Agent</span>
            </div>
            <span className="font-mono text-xs text-[#8A90A6]">MEMORY & PROTOCOLS</span>
          </div>

          <div className="p-5 border-b border-[#1E2535] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A56BFF]" />
              <span className="font-bold font-disp">Frequency Agent</span>
            </div>
            <span className="font-mono text-xs text-[#8A90A6]">SESSION COMPOSER</span>
          </div>

          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5CA8]" />
              <span className="font-bold font-disp">Oracle Agent</span>
            </div>
            <span className="font-mono text-xs text-[#8A90A6]">OBSERVATION & BREAKTHROUGHS</span>
          </div>
        </div>
      </section>

      {/* Full-bleed Journaling Moment */}
      <section className="py-28 px-6 bg-[#070A12] border-y border-[#1E2535] text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#36F5A6]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <span className="font-mono text-xs tracking-[0.24em] text-[#8A90A6] uppercase">
            THIS IS THE WHOLE INTERFACE
          </span>

          <blockquote className="font-serif italic text-3xl sm:text-5xl text-[#E9ECF5] leading-snug">
            "The drums under the breath did something I can't explain."
          </blockquote>

          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="font-mono text-xs tracking-wider uppercase px-3 py-1 rounded-lg bg-[#0A0E18] border border-[#36F5A6]/40 text-[#36F5A6]">
              HEART
            </span>
            <span className="font-mono text-xs tracking-wider uppercase px-3 py-1 rounded-lg bg-[#0A0E18] border border-[#1E2535] text-[#8A90A6]">
              RELEASE
            </span>
            <span className="font-mono text-xs tracking-wider text-[#565C72]">
              TUE · 14 MAY
            </span>
          </div>
        </div>
      </section>

      {/* Closing CTA & Email Capture */}
      <section id="access" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="font-mono text-xs tracking-[0.24em] text-[#36D6E7] uppercase block">
              EARLY ACCESS
            </span>

            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Begin reading your field.
            </h2>

            <p className="text-[#8A90A6] text-lg max-w-lg">
              chakraOS is in private testing. Leave your signal and we'll open a node for you.
            </p>

            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md pt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 bg-[#111726] border border-[#2A3346] rounded-xl px-4 py-3.5 text-sm font-mono text-[#E9ECF5] placeholder:text-[#565C72] outline-none focus:border-[#36D6E7]"
              />
              <button
                type="submit"
                className="font-mono text-xs font-bold tracking-wider uppercase px-6 py-3.5 rounded-xl bg-[#36D6E7] text-[#0A0E18] hover:bg-[#36D6E7]/90 transition-all shadow-lg"
              >
                Join Waitlist
              </button>
            </form>

            {emailError && (
              <div className="font-mono text-xs text-[#FF4D5E]">{emailError}</div>
            )}

            {emailSubmitted && (
              <div className="font-mono text-xs text-[#36F5A6] flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>YOU'RE ON THE FIELD. WE'LL BE IN TOUCH.</span>
              </div>
            )}

            <div className="font-mono text-[11px] text-[#565C72]">
              PRIVATE · YOUR JOURNAL IS YOURS · NO SPAM
            </div>
          </div>

          {/* Aura Sigil SVG Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-80 h-80 flex items-center justify-center">
              <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_0_30px_rgba(107,107,255,0.4)]">
                <circle cx={cx} cy={cy} r={R} fill="none" stroke="#1E2535" strokeWidth="1" />
                <circle cx={cx} cy={cy} r={R * 0.6} fill="none" stroke="#161C2B" strokeWidth="1" />

                {props.chakras.map((_, i) => {
                  const angle = -Math.PI / 2 + (i / props.chakras.length) * Math.PI * 2;
                  return (
                    <line
                      key={i}
                      x1={cx}
                      y1={cy}
                      x2={cx + Math.cos(angle) * R}
                      y2={cy + Math.sin(angle) * R}
                      stroke="#141A28"
                      strokeWidth="1"
                    />
                  );
                })}

                <polygon
                  points={sigilPolyStr}
                  fill="rgba(107,107,255,0.12)"
                  stroke="rgba(124,142,255,0.6)"
                  strokeWidth="1.5"
                />

                {sigilPts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="5" fill={p.color} className="animate-pulse" />
                ))}

                <circle cx={cx} cy={cy} r="3" fill="#EAF0FF" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E2535] py-8 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#565C72]">
        <div className="flex items-center gap-2 font-disp font-bold text-sm text-[#E9ECF5]">
          <span className="w-3 h-3 rounded-full bg-[#36D6E7]" />
          <span>chakra<b>OS</b></span>
        </div>

        <div className="text-center">
          CLINICAL MYSTICISM · 9 NODES · 5 AGENTS · AN INSTRUMENT FOR THE INNER FIELD
        </div>

        <nav className="flex items-center gap-5">
          <a href="/terms/" className="hover:text-[#E9ECF5] transition-colors">TERMS OF USE</a>
          <a href="/privacy/" className="hover:text-[#E9ECF5] transition-colors">PRIVACY POLICY</a>
        </nav>
      </footer>
    </div>
  );
};
