import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { MobileFrame } from './components/MobileFrame';
import { INITIAL_CHAKRAS, INITIAL_JOURNAL_ENTRIES } from './data/staticChakras';
import { ChakraNode, JournalEntry, UserProfile, AgentObservation } from './types';
import { ArrowLeft, Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<'body' | 'journal' | 'coach' | 'sound' | 'you'>('body');

  const [chakras, setChakras] = useState<ChakraNode[]>(INITIAL_CHAKRAS);
  const [fieldIndex, setFieldIndex] = useState<number>(62);
  const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL_ENTRIES);

  const [selectedNode, setSelectedNode] = useState<ChakraNode | null>(null);
  const [preseededNode, setPreseededNode] = useState<ChakraNode | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [observation, setObservation] = useState<AgentObservation>({
    quote: 'Third Eye energy is low while Heart energy remains steady. A quiet shift noticed in evening hours.',
    actionChips: [
      { label: '5 min breath', action: 'breath', targetTab: 'coach' },
      { label: '852 Hz session', action: 'sound', targetTab: 'sound' },
    ],
  });

  const [profile, setProfile] = useState<UserProfile>({
    handle: 'Avani M.',
    level: 3,
    xp: 1420,
    xp7dTrend: 340,
    streakDays: 14,
    intention: 'To feel grounded and open in my daily vocal expression.',
    intentionDay: 14,
    totalIntentionDays: 30,
    breakthroughs: [
      {
        id: 'bt-1',
        label: 'Heart Throat harmonic appeared',
        type: 'harmonic',
        date: '14 MAY',
      },
      {
        id: 'bt-2',
        label: 'First voice journal under 30s',
        type: 'milestone',
        date: '12 MAY',
      },
    ],
  });

  // M1 Core Loop: Submit Journal & Recompute Field
  const handleSubmitJournal = async (text: string, modality: 'text' | 'voice') => {
    setIsSyncing(true);

    try {
      const response = await fetch('/api/journal/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: text,
          modality,
          currentChakras: chakras,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update energy levels of nodes based on returned energy map
        const updatedChakras = chakras.map((node) => {
          if (data.updatedEnergyMap && typeof data.updatedEnergyMap[node.key] === 'number') {
            const newEnergy = data.updatedEnergyMap[node.key];
            const delta = newEnergy - node.energy;
            return {
              ...node,
              energy: newEnergy,
              trend7d: delta >= 0 ? Math.min(25, node.trend7d + 4) : Math.max(-25, node.trend7d - 4),
            };
          }
          return node;
        });

        setChakras(updatedChakras);
        if (typeof data.fieldIndex === 'number') {
          setFieldIndex(data.fieldIndex);
        }

        // Add new entry to feed
        const newEntry: JournalEntry = {
          id: `entry-${Date.now()}`,
          body: text,
          modality,
          timestamp: 'JUST NOW',
          tags: data.tags.map((t: { chakraKey: string; theme: string; weight: number }) => ({
            chakraKey: t.chakraKey as any,
            theme: t.theme,
            weight: t.weight,
          })),
          surfacedSignals: data.surfacedSignals || [],
        };

        setEntries((prev) => [newEntry, ...prev]);

        // Update observation quote
        if (data.observationQuote) {
          setObservation((prev) => ({
            ...prev,
            quote: data.observationQuote,
          }));
        }

        // Award XP for journaling
        setProfile((prev) => ({
          ...prev,
          xp: prev.xp + 50,
          xp7dTrend: prev.xp7dTrend + 50,
        }));
      }
    } catch (err) {
      console.error('Failed to submit journal entry:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLaunchProtocol = (
    type: 'breath' | 'sound' | 'reflect',
    chakraKey?: string,
    hz?: number
  ) => {
    if (type === 'sound') {
      const found = chakras.find((c) => c.key === chakraKey) || null;
      setPreseededNode(found);
      setActiveTab('sound');
    } else if (type === 'reflect') {
      const found = chakras.find((c) => c.key === chakraKey) || null;
      setPreseededNode(found);
      setActiveTab('journal');
    } else if (type === 'breath') {
      setActiveTab('coach');
    }
  };

  const handleSessionComplete = (chakraKey: string, xpGain: number) => {
    // Lift matching chakra energy
    setChakras((prev) =>
      prev.map((c) =>
        c.key === chakraKey
          ? { ...c, energy: Math.min(98, c.energy + 8), trend7d: c.trend7d + 3 }
          : c
      )
    );

    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + xpGain,
      xp7dTrend: prev.xp7dTrend + xpGain,
    }));
  };

  return (
    <div className="min-h-screen bg-[#0A0E18] text-[#E9ECF5] font-disp selection:bg-[#36D6E7]/25">
      {viewMode === 'landing' ? (
        <LandingPage
          activeTab={activeTab}
          onTabChange={setActiveTab}
          chakras={chakras}
          fieldIndex={fieldIndex}
          entries={entries}
          profile={profile}
          observation={observation}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
          onSubmitJournal={handleSubmitJournal}
          preseededNode={preseededNode}
          onClearPreseed={() => setPreseededNode(null)}
          onLaunchProtocol={handleLaunchProtocol}
          onSessionComplete={handleSessionComplete}
          onOpenFullScreenApp={() => setViewMode('app')}
          isSyncing={isSyncing}
        />
      ) : (
        /* Full Screen Mobile View Mode */
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#070A12] to-[#0A0E18] relative">
          {/* View Mode Bar */}
          <div className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-[#111726]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#1E2535]">
            <button
              onClick={() => setViewMode('landing')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-[#8A90A6] hover:text-[#E9ECF5] hover:bg-[#0E1420] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </button>
            <div className="w-[1px] h-4 bg-[#1E2535]" />
            <span className="px-2 text-xs font-mono text-[#36D6E7] font-semibold flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              <span>chakraOS Mobile App</span>
            </span>
          </div>

          <div className="w-full max-w-sm pt-12 pb-6">
            <MobileFrame
              activeTab={activeTab}
              onTabChange={setActiveTab}
              chakras={chakras}
              fieldIndex={fieldIndex}
              entries={entries}
              profile={profile}
              observation={observation}
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
              onSubmitJournal={handleSubmitJournal}
              preseededNode={preseededNode}
              onClearPreseed={() => setPreseededNode(null)}
              onLaunchProtocol={handleLaunchProtocol}
              onSessionComplete={handleSessionComplete}
              isSyncing={isSyncing}
            />
          </div>
        </div>
      )}
    </div>
  );
}
