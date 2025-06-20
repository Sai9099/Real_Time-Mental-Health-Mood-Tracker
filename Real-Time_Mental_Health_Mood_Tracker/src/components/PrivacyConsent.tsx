import React, { useState } from 'react';
import { Shield, Check, X } from 'lucide-react';

interface PrivacyConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const PrivacyConsent: React.FC<PrivacyConsentProps> = ({ onAccept, onDecline }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="fixed inset-0 bg-neutral-900 bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 mx-auto">
        <div className="flex items-center mb-4">
          <Shield className="h-8 w-8 text-primary-500 mr-2" />
          <h2 className="text-xl font-semibold text-neutral-800">Privacy Consent</h2>
        </div>
        
        <p className="text-neutral-700 mb-4">
          MindMirror needs permission to access your camera for emotion detection. Your privacy is important to us.
        </p>
        
        <div className="mb-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium underline mb-2"
          >
            {expanded ? 'Hide details' : 'Read more about how your data is used'}
          </button>
          
          {expanded && (
            <div className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-md animate-slide-up">
              <ul className="list-disc list-inside space-y-1">
                <li>All emotion detection happens locally on your device</li>
                <li>Your video is never sent to any server</li>
                <li>Emotion data is stored only in your browser's local storage</li>
                <li>You can delete all stored data at any time</li>
                <li>No personal information is collected or shared</li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="flex justify-between gap-4">
          <button
            onClick={onDecline}
            className="flex items-center justify-center w-1/2 py-2 px-4 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Decline
          </button>
          
          <button
            onClick={onAccept}
            className="flex items-center justify-center w-1/2 py-2 px-4 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            <Check className="w-4 h-4 mr-2" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};