export type Emotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'fearful' | 'disgusted' | 'neutral';

export interface EmotionData {
  emotion: Emotion;
  confidence: number;
  timestamp: number;
}

export interface EmotionHistory {
  date: string;
  emotions: EmotionData[];
}

export interface SelfCareSuggestion {
  emotion: Emotion;
  title: string;
  description: string;
  activities: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  emotion: Emotion;
  emotionConfidence: number;
}

export type MoodColor = {
  [key in Emotion]: string;
};