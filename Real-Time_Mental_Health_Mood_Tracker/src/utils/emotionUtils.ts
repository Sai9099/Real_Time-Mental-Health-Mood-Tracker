import type { Emotion, EmotionData, MoodColor } from '../types';

// Map emotions to colors for visualization
export const moodColors: MoodColor = {
  happy: '#FFD700', // Gold
  sad: '#6495ED', // Cornflower Blue
  angry: '#DC143C', // Crimson
  surprised: '#9932CC', // Dark Orchid
  fearful: '#8B4513', // Saddle Brown
  disgusted: '#2E8B57', // Sea Green
  neutral: '#808080', // Gray
};

// Map emotions to descriptive text
export const emotionDescriptions: Record<Emotion, string> = {
  happy: 'You seem happy and content. Great job!',
  sad: 'You appear to be feeling down. That\'s okay, we all have those moments.',
  angry: 'You seem frustrated or angry. Taking a moment to breathe can help.',
  surprised: 'You look surprised! Something unexpected happened?',
  fearful: 'You appear anxious or fearful. Remember, it\'s okay to ask for help.',
  disgusted: 'You seem disgusted or displeased with something.',
  neutral: 'You appear calm and neutral right now.',
};

// Convert raw detector output to our emotion type
export const mapDetectorOutput = (detections: any): EmotionData => {
  // This is a placeholder. In reality, you'd map from your ML model's output format
  // to our application's emotion format
  
  const emotions = detections?.expressions || {};
  const emotionEntries = Object.entries(emotions) as [Emotion, number][];
  
  // Find the emotion with highest confidence
  let maxConfidence = 0;
  let dominantEmotion: Emotion = 'neutral';
  
  emotionEntries.forEach(([emotion, confidence]) => {
    if (confidence > maxConfidence) {
      maxConfidence = confidence;
      dominantEmotion = emotion;
    }
  });
  
  return {
    emotion: dominantEmotion,
    confidence: maxConfidence,
    timestamp: Date.now()
  };
};

// Get emoji representation of emotion
export const getEmotionEmoji = (emotion: Emotion): string => {
  switch (emotion) {
    case 'happy': return '😊';
    case 'sad': return '😢';
    case 'angry': return '😠';
    case 'surprised': return '😮';
    case 'fearful': return '😨';
    case 'disgusted': return '🤢';
    case 'neutral': return '😐';
    default: return '❓';
  }
};

// Get a more friendly name for the emotion
export const getEmotionDisplayName = (emotion: Emotion): string => {
  switch (emotion) {
    case 'happy': return 'Happy';
    case 'sad': return 'Sad';
    case 'angry': return 'Angry';
    case 'surprised': return 'Surprised';
    case 'fearful': return 'Anxious';
    case 'disgusted': return 'Disgusted';
    case 'neutral': return 'Neutral';
    default: return 'Unknown';
  }
};

// Calculate the dominant emotion from a set of readings
export const calculateDominantEmotion = (emotionData: EmotionData[]): Emotion => {
  if (!emotionData.length) return 'neutral';
  
  const emotionCounts: Record<Emotion, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    surprised: 0,
    fearful: 0,
    disgusted: 0,
    neutral: 0
  };
  
  emotionData.forEach(data => {
    emotionCounts[data.emotion] += data.confidence;
  });
  
  let dominantEmotion: Emotion = 'neutral';
  let maxCount = 0;
  
  (Object.entries(emotionCounts) as [Emotion, number][]).forEach(([emotion, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantEmotion = emotion;
    }
  });
  
  return dominantEmotion;
};