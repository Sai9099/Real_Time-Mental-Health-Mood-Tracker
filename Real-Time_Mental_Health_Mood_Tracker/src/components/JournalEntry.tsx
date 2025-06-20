import React, { useState } from 'react';
import { useMoodStore } from '../store/moodStore';
import { PenTool, Save } from 'lucide-react';
import { formatISO } from 'date-fns';
import { getEmotionEmoji } from '../utils/emotionUtils';

export const JournalEntry: React.FC = () => {
  const { currentEmotion, addJournalEntry } = useMoodStore();
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSaving(true);
    
    // Get current emotion or default to neutral
    const emotion = currentEmotion?.emotion || 'neutral';
    const confidence = currentEmotion?.confidence || 0.5;
    
    // Create new journal entry
    addJournalEntry({
      date: formatISO(new Date()),
      content: content.trim(),
      emotion,
      emotionConfidence: confidence
    });
    
    // Reset form
    setContent('');
    setSaveMessage('Journal entry saved successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSaveMessage('');
      setIsSaving(false);
    }, 3000);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden p-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <PenTool className="w-6 h-6 text-primary-500 mr-2" />
        <h2 className="text-xl font-semibold text-neutral-800">Mood Journal</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="journal-entry" className="block text-sm font-medium text-neutral-700 mb-1">
            How are you feeling right now? {currentEmotion && getEmotionEmoji(currentEmotion.emotion)}
          </label>
          <textarea
            id="journal-entry"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 p-3 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 resize-none"
            placeholder="Write about your current thoughts and feelings..."
          />
        </div>
        
        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={!content.trim() || isSaving}
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Entry
          </button>
          
          {saveMessage && (
            <span className="text-secondary-600 animate-fade-in">
              {saveMessage}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};