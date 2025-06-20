import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} MindMirror. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <p className="text-sm text-neutral-500">
              Created with
            </p>
            <Heart className="h-4 w-4 text-accent-500" />
            <p className="text-sm text-neutral-500">
              for mental wellbeing
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-neutral-400">
          <p>
            MindMirror respects your privacy. All emotion data is processed locally and never leaves your device.
          </p>
        </div>
      </div>
    </footer>
  );
};