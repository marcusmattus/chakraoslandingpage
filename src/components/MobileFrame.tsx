import React from 'react';
import { ChakraNode, JournalEntry, UserProfile, AgentObservation } from '../types';
import { BodyScreen } from './BodyScreen';
import { InspectorSheet } from './InspectorSheet';
import { JournalScreen } from './JournalScreen';
import { CoachScreen } from './CoachScreen';
import { SoundScreen } from './SoundScreen';
import { YouScreen } from './YouScreen';
import {
  Activity,
  PenTool,
  MessageSquareCode,
  Radio,
  User,
  Wifi,
  Battery,
} from 'lucide-react';

interface MobileFrameProps {
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
  isSyncing?: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  activeTab,
  onTabChange,
  chakras,
  fieldIndex,
  entries,
  profile,
  observation,
  selectedNode,
  onSelectNode,
  onSubmitJournal,
  preseededNode,
  onClearPreseed,
  onLaunchProtocol,
  onSessionComplete,
  isSyncing,
}) => {
  // Tabs config
  const tabs = [
    { key: 'body', label: 'Body', icon: Activity, color: '#36D6E7' },
    { key: 'journal', label: 'Journal', icon: PenTool, color: '#E8B23D' },
    { key: 'coach', label: 'Coach', icon: MessageSquareCode, color: '#3DDC97' },
    { key: 'sound', label: 'Sound', icon: Radio, color: '#A56BFF' },
    { key: 'you', label: 'You', icon: User, color: '#FF5CA8' },
  ] as const;

  return (
    <div className="relative mx-auto w-full max-w-[390px] h-[780px] bg-[#0A0E18] rounded-[48px] border-[10px] border-[#111726] shadow-[0_0_60px_rgba(10,14,24,0.9),0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col select-none">
      {/* Top Mobile Notch & Status Bar */}
      <div className="px-7 pt-3 pb-2 flex items-center justify-between text-[#8A90A6] font-mono text-[11px] bg-[#0A0E18] border-b border-[#1E2535]/50 z-20">
        <span className="font-bold text-[#E9ECF5]">9:41</span>

        {/* Dynamic Island Notch */}
        <div className="w-24 h-4 bg-[#070A12] rounded-full border border-[#1E2535] flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#36D6E7] animate-pulse" />
          <span className="text-[8px] tracking-wider text-[#565C72]">chakraOS</span>
        </div>

        <div className="flex items-center gap-2">
          <Wifi className="w-3 h-3 text-[#8A90A6]" />
          <Battery className="w-3.5 h-3.5 text-[#8A90A6]" />
        </div>
      </div>

      {/* Main Screen Content Viewport */}
      <div className="flex-1 relative overflow-hidden bg-[#0A0E18]">
        {activeTab === 'body' && (
          <BodyScreen
            chakras={chakras}
            fieldIndex={fieldIndex}
            onSelectNode={(node) => onSelectNode(node)}
            observation={observation}
            onNavigateTab={onTabChange}
            isSyncing={isSyncing}
          />
        )}

        {activeTab === 'journal' && (
          <JournalScreen
            entries={entries}
            onSubmitEntry={onSubmitJournal}
            preseededNode={preseededNode}
            onClearPreseed={onClearPreseed}
            isSubmitting={isSyncing}
          />
        )}

        {activeTab === 'coach' && (
          <CoachScreen
            chakras={chakras}
            fieldIndex={fieldIndex}
            onLaunchProtocol={onLaunchProtocol}
          />
        )}

        {activeTab === 'sound' && (
          <SoundScreen
            chakras={chakras}
            selectedChakra={preseededNode}
            onSessionComplete={onSessionComplete}
          />
        )}

        {activeTab === 'you' && (
          <YouScreen chakras={chakras} profile={profile} />
        )}

        {/* Inspector Sheet Modal Overlay */}
        {selectedNode && (
          <InspectorSheet
            node={selectedNode}
            onClose={() => onSelectNode(null)}
            onBeginSession={(node) => {
              onSelectNode(null);
              onTabChange('sound');
            }}
            onReflect={(node) => {
              onSelectNode(null);
              onTabChange('journal');
            }}
          />
        )}
      </div>

      {/* Bottom Navigation Tabs with Accent Highlights */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#0E1420]/95 backdrop-blur-md border-t border-[#1E2535] px-3 pt-2 pb-5 flex items-center justify-around z-30">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive ? 'scale-105' : 'opacity-50 hover:opacity-80'
              }`}
            >
              <div
                className="p-1.5 rounded-xl transition-colors"
                style={{
                  backgroundColor: isActive ? `${tab.color}20` : 'transparent',
                }}
              >
                <IconComponent
                  className="w-5 h-5 transition-colors"
                  style={{ color: isActive ? tab.color : '#8A90A6' }}
                />
              </div>

              <span
                className="font-mono text-[9px] tracking-wider uppercase mt-0.5 font-medium"
                style={{ color: isActive ? tab.color : '#8A90A6' }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
