import React from 'react';
import { useMoodStore } from '../store/moodStore';
import { Book, Trash2 } from 'lucide-react';
import { getEmotionEmoji } from '../utils/emotionUtils';
import { format, parseISO } from 'date-fns';

export const JournalHistory: React.FC = () => {
  const { journalEntries, deleteJournalEntry } = useMoodStore();

  // Sort entries by date (newest first)
  const sortedEntries = [...journalEntries].sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
  );

  if (sortedEntries.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl shadow-md overflow-hidden p-6 animate-fade-in">
        <div className="flex items-center mb-4">
          <Book className="w-6 h-6 text-primary-500 mr-2" />
          <h2 className="text-xl font-semibold text-neutral-800">Journal History</h2>
        </div>
        
        <div className="text-center py-8 text-neutral-500">
          <p>No journal entries yet. Start writing to track your emotional journey.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden p-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <Book className="w-6 h-6 text-primary-500 mr-2" />
        <h2 className="text-xl font-semibold text-neutral-800">Journal History</h2>
      </div>
      
      <div className="space-y-4">
        {sortedEntries.map((entry) => (
          <div 
            key={entry.id} 
            className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <span className="text-xl mr-2">{getEmotionEmoji(entry.emotion)}</span>
                <span className="text-sm text-neutral-500">
                  {format(parseISO(entry.date), 'PPP p')}
                </span>
              </div>
              
              <button
                onClick={() => deleteJournalEntry(entry.id)}
                className="text-neutral-400 hover:text-accent-500 transition-colors p-1"
                aria-label="Delete entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-neutral-700 whitespace-pre-wrap">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};