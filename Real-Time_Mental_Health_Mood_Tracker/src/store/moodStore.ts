import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Emotion, EmotionData, EmotionHistory, JournalEntry } from '../types';
import { formatISO } from 'date-fns';

interface MoodState {
  currentEmotion: EmotionData | null;
  emotionHistory: EmotionHistory[];
  journalEntries: JournalEntry[];
  isRecording: boolean;
  cameraPermission: boolean;
  cameraActive: boolean;
  setCurrentEmotion: (emotion: EmotionData) => void;
  addEmotionToHistory: (emotion: EmotionData) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  deleteJournalEntry: (id: string) => void;
  toggleRecording: () => void;
  setCameraPermission: (permission: boolean) => void;
  setCameraActive: (active: boolean) => void;
  getEmotionsByDate: (date: string) => EmotionData[];
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      currentEmotion: null,
      emotionHistory: [],
      journalEntries: [],
      isRecording: false,
      cameraPermission: false,
      cameraActive: false,

      setCurrentEmotion: (emotion) => set({ currentEmotion: emotion }),
      
      addEmotionToHistory: (emotion) => {
        const { emotionHistory } = get();
        const today = formatISO(new Date(), { representation: 'date' });
        
        // Check if we already have an entry for today
        const todayIndex = emotionHistory.findIndex(h => h.date === today);
        
        if (todayIndex >= 0) {
          // Add to existing day
          const updatedHistory = [...emotionHistory];
          updatedHistory[todayIndex] = {
            ...updatedHistory[todayIndex],
            emotions: [...updatedHistory[todayIndex].emotions, emotion]
          };
          set({ emotionHistory: updatedHistory });
        } else {
          // Create new day entry
          set({
            emotionHistory: [
              ...emotionHistory,
              { date: today, emotions: [emotion] }
            ]
          });
        }
      },
      
      addJournalEntry: (entry) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: crypto.randomUUID()
        };
        set(state => ({ 
          journalEntries: [...state.journalEntries, newEntry] 
        }));
      },
      
      deleteJournalEntry: (id) => {
        set(state => ({
          journalEntries: state.journalEntries.filter(entry => entry.id !== id)
        }));
      },
      
      toggleRecording: () => set(state => ({ isRecording: !state.isRecording })),
      
      setCameraPermission: (permission) => set({ cameraPermission: permission }),
      
      setCameraActive: (active) => set({ cameraActive: active }),
      
      getEmotionsByDate: (date) => {
        const { emotionHistory } = get();
        const dayData = emotionHistory.find(h => h.date === date);
        return dayData ? dayData.emotions : [];
      }
    }),
    {
      name: 'mood-tracker-storage',
    }
  )
);