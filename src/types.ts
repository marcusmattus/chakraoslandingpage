export type NodeKey =
  | 'soul'
  | 'crown'
  | 'third'
  | 'throat'
  | 'heart'
  | 'solar'
  | 'sacral'
  | 'root'
  | 'earth';

export interface ChakraNode {
  key: NodeKey;
  name: string;
  bija: string;
  solfeggioHz: number;
  color: string; // CSS color var or hex
  sign: string;
  attributes: string[];
  energy: number; // 0 - 100
  trend7d: number; // signed % change e.g. -18 or +12
}

export interface JournalTag {
  chakraKey: NodeKey;
  theme: string;
  weight: number; // e.g. +15 or -10
}

export interface JournalEntry {
  id: string;
  body: string;
  modality: 'text' | 'voice';
  timestamp: string;
  tags: JournalTag[];
  surfacedSignals: string[];
}

export interface SurfacedSignal {
  phrase: string;
  count: number;
  chakraKey: NodeKey;
}

export interface AgentObservation {
  quote: string;
  actionChips: {
    label: string;
    action: string;
    targetTab: 'body' | 'journal' | 'coach' | 'sound' | 'you';
  }[];
}

export interface CoachMessage {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: string;
  protocolCard?: {
    id: string;
    type: 'breath' | 'sound' | 'reflect';
    title: string;
    subtitle: string;
    duration: string;
    chakraKey?: NodeKey;
    hz?: number;
  };
}

export interface SoundTrack {
  id: string;
  chakraKey: NodeKey;
  title: string;
  hz: number;
  brainwaveBand: 'delta' | 'theta' | 'alpha' | 'beta';
  durationMin: number;
  tags: string[];
}

export interface UserProfile {
  handle: string;
  level: number;
  xp: number;
  xp7dTrend: number;
  streakDays: number;
  intention: string;
  intentionDay: number;
  totalIntentionDays: number;
  breakthroughs: {
    id: string;
    label: string;
    type: string;
    date: string;
  }[];
}
