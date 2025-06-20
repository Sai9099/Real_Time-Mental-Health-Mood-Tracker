import type { SelfCareSuggestion } from '../types';

export const selfCareSuggestions: SelfCareSuggestion[] = [
  {
    emotion: 'happy',
    title: 'Maintain Your Positive Mood',
    description: 'You\'re feeling great! Here are some ways to keep that positive energy flowing.',
    activities: [
      'Share your joy with others - call a friend or family member',
      'Express gratitude by writing down 3 things you\'re thankful for',
      'Channel your positive energy into a creative project',
      'Practice mindfulness to fully appreciate this moment',
      'Do something kind for someone else to spread positivity'
    ]
  },
  {
    emotion: 'sad',
    title: 'Gentle Support for Sadness',
    description: 'It\'s okay to feel sad sometimes. These activities may provide comfort.',
    activities: [
      'Allow yourself to feel your emotions without judgment',
      'Take a warm shower or bath',
      'Listen to music that resonates with your feelings',
      'Reach out to someone you trust for support',
      'Practice self-compassion meditation',
      'Step outside for fresh air and gentle movement'
    ]
  },
  {
    emotion: 'angry',
    title: 'Healthy Ways to Process Anger',
    description: 'Anger is a natural emotion. These techniques can help you work through it.',
    activities: [
      'Practice deep breathing: 4 counts in, hold for 4, 6 counts out',
      'Write down your feelings without censoring yourself',
      'Engage in physical activity like a brisk walk or exercise',
      'Try progressive muscle relaxation',
      'Give yourself some space from the triggering situation',
      'Use "I" statements to communicate your feelings'
    ]
  },
  {
    emotion: 'surprised',
    title: 'Processing Unexpected Events',
    description: 'Surprise can be disorienting. Take time to process what\'s happened.',
    activities: [
      'Take a moment to pause and ground yourself',
      'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste',
      'Write about what surprised you and how you feel about it',
      'Talk through the situation with someone you trust',
      'Practice acceptance of things outside your control'
    ]
  },
  {
    emotion: 'fearful',
    title: 'Calming Anxiety and Fear',
    description: 'These techniques can help reduce feelings of anxiety and fear.',
    activities: [
      'Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8',
      'Challenge negative thoughts with evidence-based thinking',
      'Ground yourself using the 5-4-3-2-1 technique',
      'Visualize a safe, peaceful place',
      'Limit caffeine and sugar which can worsen anxiety',
      'Consider reaching out to a mental health professional'
    ]
  },
  {
    emotion: 'disgusted',
    title: 'Processing Feelings of Disgust',
    description: 'Disgust can be a protective emotion. These activities can help you work through it.',
    activities: [
      'Identify the source of your disgust and consider its validity',
      'Practice mindfulness to observe the feeling without judgment',
      'Engage your senses with pleasant stimuli (favorite scent, texture, etc.)',
      'Take slow, deep breaths to calm your physical response',
      'Consider journaling about what triggered this emotion'
    ]
  },
  {
    emotion: 'neutral',
    title: 'Working with Neutral States',
    description: 'Neutral emotions are a good time for self-reflection and mindful awareness.',
    activities: [
      'Practice mindfulness meditation to increase present-moment awareness',
      'Set intentions for your day or week',
      'Check in with your body - are there any sensations you hadn\'t noticed?',
      'Try a new activity that interests you',
      'Reflect on your emotional patterns and triggers',
      'Practice gratitude to potentially boost positive emotions'
    ]
  }
];

export const getRandomSuggestion = (emotion: string): SelfCareSuggestion => {
  const validEmotion = emotion as keyof typeof selfCareSuggestions;
  const matchingSuggestions = selfCareSuggestions.filter(s => s.emotion === validEmotion);
  
  if (matchingSuggestions.length === 0) {
    // Default to neutral if no match
    return selfCareSuggestions.find(s => s.emotion === 'neutral')!;
  }
  
  return matchingSuggestions[Math.floor(Math.random() * matchingSuggestions.length)];
};