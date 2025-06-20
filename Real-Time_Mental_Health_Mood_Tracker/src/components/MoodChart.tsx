import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { useMoodStore } from '../store/moodStore';
import { moodColors, getEmotionDisplayName } from '../utils/emotionUtils';
import type { Emotion, EmotionData } from '../types';
import { format, subDays, startOfDay } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

type ChartDataPoint = {
  x: string;
  y: number;
  emotion: Emotion;
};

const EMOTIONS: Emotion[] = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral'];

export const MoodChart: React.FC = () => {
  const { emotionHistory } = useMoodStore();
  
  const chartData = useMemo(() => {
    // Generate dates for the last 7 days
    const dates = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      return format(date, 'yyyy-MM-dd');
    });

    // Prepare data for each emotion
    const datasets = EMOTIONS.map(emotion => {
      const dataPoints: ChartDataPoint[] = dates.map(date => {
        const dayData = emotionHistory.find(h => h.date === date);
        
        if (!dayData) {
          return { x: date, y: 0, emotion };
        }
        
        const emotionData = dayData.emotions.filter(e => e.emotion === emotion);
        const averageConfidence = emotionData.length 
          ? emotionData.reduce((sum, e) => sum + e.confidence, 0) / emotionData.length 
          : 0;
        
        return {
          x: date,
          y: averageConfidence,
          emotion
        };
      });

      return {
        label: getEmotionDisplayName(emotion),
        data: dataPoints,
        borderColor: moodColors[emotion],
        backgroundColor: `${moodColors[emotion]}50`,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      };
    });

    // Filter out emotions with no data
    const filteredDatasets = datasets.filter(dataset => 
      dataset.data.some(point => point.y > 0)
    );

    return {
      datasets: filteredDatasets.length ? filteredDatasets : datasets.slice(0, 1)
    };
  }, [emotionHistory]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = Math.round(context.parsed.y * 100);
            return `${context.dataset.label}: ${value}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: (value: number) => `${Math.round(value * 100)}%`
        }
      },
      x: {
        type: 'category' as const,
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden p-4 animate-fade-in">
      <h2 className="text-xl font-semibold text-neutral-800 mb-4">Mood Trends</h2>
      
      {emotionHistory.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          <p>No mood data recorded yet. Start the detector to begin tracking.</p>
        </div>
      ) : (
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      )}
      
      <p className="mt-4 text-sm text-neutral-500">
        This chart shows your dominant emotions over the past week.
      </p>
    </div>
  );
};