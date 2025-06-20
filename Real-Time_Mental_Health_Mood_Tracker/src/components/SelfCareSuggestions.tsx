import React, { useMemo } from 'react';
import { useMoodStore } from '../store/moodStore';
import { Heart, Lightbulb, Activity } from 'lucide-react';
import { getEmotionEmoji, getEmotionDisplayName } from '../utils/emotionUtils';
import { selfCareSuggestions } from '../data/selfCareSuggestions';
import type { Emotion, SelfCareSuggestion } from '../types';
import { calculateDominantEmotion } from '../utils/emotionUtils';

export const SelfCareSuggestions: React.FC = () => {
  const { currentEmotion, emotionHistory } = useMoodStore();
  
  // Get the most relevant suggestion based on current emotion or recent history
  const suggestion = useMemo((): SelfCareSuggestion | null => {
    // If we have a current emotion, use that
    if (currentEmotion) {
      const matchingSuggestions = selfCareSuggestions.filter(
        s => s.emotion === currentEmotion.emotion
      );
      return matchingSuggestions[0] || null;
    }
    
    // If we have history but no current emotion, use the dominant emotion from today
    if (emotionHistory.length > 0) {
      const todayData = emotionHistory[emotionHistory.length - 1];
      if (todayData && todayData.emotions.length > 0) {
        const dominantEmotion = calculateDominantEmotion(todayData.emotions);
        const matchingSuggestions = selfCareSuggestions.filter(
          s => s.emotion === dominantEmotion
        );
        return matchingSuggestions[0] || null;
      }
    }
    
    // Default suggestion for neutral state
    return selfCareSuggestions.find(s => s.emotion === 'neutral') || null;
  }, [currentEmotion, emotionHistory]);

  if (!suggestion) {
    return null;
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden p-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <Lightbulb className="w-6 h-6 text-secondary-400 mr-2" />
        <h2 className="text-xl font-semibold text-neutral-800">Self-Care Suggestions</h2>
      </div>
      
      <div className="bg-primary-50 rounded-lg p-4 mb-4 border border-primary-100">
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">
            {getEmotionEmoji(suggestion.emotion as Emotion)}
          </span>
          <h3 className="font-medium text-primary-800">
            {suggestion.title}
          </h3>
        </div>
        <p className="text-neutral-700 mb-3">{suggestion.description}</p>
        
        <h4 className="font-medium text-primary-700 flex items-center mb-2">
          <Activity className="w-4 h-4 mr-1" />
          Try these activities:
        </h4>
        <ul className="space-y-2">
          {suggestion.activities.map((activity, index) => (
            <li key={index} className="flex items-start">
              <Heart className="w-4 h-4 text-accent-400 mt-1 mr-2 flex-shrink-0" />
              <span className="text-neutral-700">{activity}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <p className="text-sm text-neutral-500 italic">
        These suggestions are based on your {currentEmotion 
          ? 'current' 
          : 'recent'} emotional state.
      </p>
    </div>
  );
};