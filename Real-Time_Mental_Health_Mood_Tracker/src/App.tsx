import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EmotionDetector } from './components/EmotionDetector';
import { MoodChart } from './components/MoodChart';
import { SelfCareSuggestions } from './components/SelfCareSuggestions';
import { JournalEntry } from './components/JournalEntry';
import { JournalHistory } from './components/JournalHistory';
import { PrivacyConsent } from './components/PrivacyConsent';
import { useMoodStore } from './store/moodStore';

function App() {
  const { cameraPermission, setCameraPermission } = useMoodStore();
  const [showConsent, setShowConsent] = useState(!cameraPermission);

  const handleAcceptConsent = () => {
    setCameraPermission(true);
    setShowConsent(false);
  };

  const handleDeclineConsent = () => {
    setCameraPermission(false);
    setShowConsent(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">MindMirror</h1>
          <p className="text-neutral-600 mb-8">Track your emotional wellbeing in real-time with facial expression analysis</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <EmotionDetector />
            <MoodChart />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SelfCareSuggestions />
            <div className="space-y-6">
              <JournalEntry />
              <JournalHistory />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {showConsent && (
        <PrivacyConsent 
          onAccept={handleAcceptConsent} 
          onDecline={handleDeclineConsent} 
        />
      )}
    </div>
  );
}

export default App;