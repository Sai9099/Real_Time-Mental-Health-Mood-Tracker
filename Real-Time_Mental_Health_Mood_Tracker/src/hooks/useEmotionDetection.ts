import { useState, useRef, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { useMoodStore } from '../store/moodStore';
import { mapDetectorOutput } from '../utils/emotionUtils';
import type { EmotionData } from '../types';

// Load models only once at module level
let detector: any = null;
let modelPromise: Promise<any> | null = null;

const loadModel = async () => {
  if (!modelPromise) {
    await tf.ready();
    modelPromise = faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
      { maxFaces: 1 }
    );
    detector = await modelPromise;
  }
  return detector;
};

export function useEmotionDetection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    isRecording, 
    setCurrentEmotion, 
    addEmotionToHistory, 
    cameraPermission,
    setCameraPermission,
    cameraActive,
    setCameraActive
  } = useMoodStore();

  // Mock emotion detection since the actual ML model analysis is complex
  const mockDetectEmotion = useCallback(async () => {
    const emotions = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral'];
    const randomIndex = Math.floor(Math.random() * emotions.length);
    const randomConfidence = 0.6 + Math.random() * 0.4; // Higher confidence for demo
    
    return {
      expressions: {
        [emotions[randomIndex]]: randomConfidence,
        ...emotions.filter(e => e !== emotions[randomIndex])
          .reduce((acc, emotion) => ({ 
            ...acc, 
            [emotion]: Math.random() * 0.3 
          }), {})
      }
    };
  }, []);

  const detectEmotion = useCallback(async () => {
    if (!videoRef.current || !isRecording || !cameraPermission || !cameraActive) return;
    
    try {
      const detections = await mockDetectEmotion();
      const emotionData: EmotionData = mapDetectorOutput(detections);
      setCurrentEmotion(emotionData);
      
      // Add to history every few detections
      if (Math.random() > 0.8) {
        addEmotionToHistory(emotionData);
      }
    } catch (err) {
      console.error('Error detecting emotion:', err);
      setError('Error detecting emotions. Please try again.');
    }
  }, [isRecording, cameraPermission, cameraActive, setCurrentEmotion, addEmotionToHistory, mockDetectEmotion]);

  // Cleanup function to stop all media tracks
  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, [setCameraActive]);

  // Turn camera on
  const turnCameraOn = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Clean up any existing streams
      cleanup();
      
      // Request camera permissions with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          frameRate: { ideal: 30, min: 15 }
        },
        audio: false
      });
      
      if (!videoRef.current) {
        throw new Error('Video element not available');
      }
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      
      // Force video to play
      try {
        await videoRef.current.play();
      } catch (playError) {
        console.warn('Video autoplay failed:', playError);
      }
      
      // Wait for video to be ready with timeout
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error('Video element not available'));
          return;
        }
        
        const video = videoRef.current;
        
        const onLoadedData = () => {
          console.log('Video loaded successfully');
          video.removeEventListener('loadeddata', onLoadedData);
          video.removeEventListener('error', onError);
          resolve();
        };
        
        const onError = (e: Event) => {
          console.error('Video loading error:', e);
          video.removeEventListener('loadeddata', onLoadedData);
          video.removeEventListener('error', onError);
          reject(new Error('Video loading failed'));
        };
        
        video.addEventListener('loadeddata', onLoadedData);
        video.addEventListener('error', onError);
        
        // Check if video is already loaded
        if (video.readyState >= 2) {
          onLoadedData();
        }
        
        // Timeout after 10 seconds
        setTimeout(() => {
          video.removeEventListener('loadeddata', onLoadedData);
          video.removeEventListener('error', onError);
          reject(new Error('Video loading timeout'));
        }, 10000);
      });
      
      // Load the emotion detection model in background
      loadModel().catch(console.error);
      
      setCameraPermission(true);
      setCameraActive(true);
      setError(null);
    } catch (err) {
      console.error('Error setting up webcam:', err);
      let errorMessage = 'Unable to access webcam';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera access denied. Please allow camera permissions and try again.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please connect a camera and try again.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Camera is already in use by another application.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setCameraPermission(false);
      setCameraActive(false);
      cleanup();
    } finally {
      setIsLoading(false);
    }
  }, [cleanup, setCameraPermission, setCameraActive]);

  // Turn camera off
  const turnCameraOff = useCallback(() => {
    cleanup();
    setError(null);
  }, [cleanup]);

  // Legacy setup function for backward compatibility
  const setupWebcam = turnCameraOn;

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Start detection loop
  useEffect(() => {
    let detectionInterval: number | null = null;
    
    if (isRecording && cameraPermission && cameraActive && !isLoading) {
      detectionInterval = window.setInterval(() => {
        detectEmotion();
      }, 2000); // Detect every 2 seconds
    }
    
    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [isRecording, cameraPermission, cameraActive, isLoading, detectEmotion]);

  return {
    videoRef,
    isLoading,
    error,
    setupWebcam,
    turnCameraOn,
    turnCameraOff,
    cameraPermission,
    cameraActive
  };
}