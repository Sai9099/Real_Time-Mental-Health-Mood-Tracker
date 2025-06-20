import React from 'react';
import { Brain } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Brain className="h-8 w-8 text-primary-500 mr-2" />
          <h1 className="text-2xl font-bold text-neutral-800">MindMirror</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-neutral-500">
            Real-Time Mood Tracking
          </span>
        </div>
      </div>
    </header>
  );
};