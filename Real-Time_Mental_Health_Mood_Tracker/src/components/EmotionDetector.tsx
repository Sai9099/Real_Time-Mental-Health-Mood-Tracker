import React, { useEffect } from 'react';
import { Camera, CameraOff, Play, Square, Video, VideoOff } from 'lucide-react';
import { useEmotionDetection } from '../hooks/useEmotionDetection';
import { useMoodStore } from '../store/moodStore';

export const EmotionDetector: React.FC = () => {
  const { 
    videoRef, 
    isLoading, 
    error, 
    turnCameraOn, 
    turnCameraOff, 
    cameraPermission, 
    cameraActive 
  } = useEmotionDetection();
  const { isRecording, toggleRecording, currentEmotion } = useMoodStore();

  const handleCameraToggle = async () => {
    if (cameraActive) {
      turnCameraOff();
    } else {
      await turnCameraOn();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl animate-fade-in">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-neutral-800">Real-time Emotion Detection</h2>
          
          <div className="flex gap-3">
            {/* Camera On/Off Button */}
            <button
              onClick={handleCameraToggle}
              disabled={isLoading}
              className={`flex items-center px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
                cameraActive 
                  ? 'bg-secondary-500 hover:bg-secondary-600' 
                  : 'bg-neutral-500 hover:bg-neutral-600'
              } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-md`}
              title={cameraActive ? 'Turn camera off' : 'Turn camera on'}
            >
              {isLoading ? (
                <div className="loader w-4 h-4"></div>
              ) : cameraActive ? (
                <Video className="w-4 h-4" />
              ) : (
                <VideoOff className="w-4 h-4" />
              )}
            </button>

            {/* Recording Start/Stop Button */}
            <button
              onClick={toggleRecording}
              disabled={!cameraActive || isLoading}
              className={`flex items-center px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
                isRecording 
                  ? 'bg-accent-500 hover:bg-accent-600 shadow-lg' 
                  : 'bg-primary-500 hover:bg-primary-600 shadow-lg hover:shadow-xl'
              } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-accent-50 border border-accent-200 text-accent-800 p-4 rounded-lg mb-6 animate-fade-in">
            <p className="font-medium">Camera Error</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={turnCameraOn}
              className="mt-3 px-4 py-2 bg-accent-500 text-white rounded-md hover:bg-accent-600 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="relative bg-neutral-900 rounded-xl overflow-hidden shadow-inner">
          {!cameraPermission && !isLoading ? (
            <div className="aspect-video flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-primary-100 p-6 rounded-full mb-4">
                <Camera className="w-12 h-12 text-primary-500" />
              </div>
              <h3 className="text-lg font-medium text-neutral-800 mb-2">Camera Access Required</h3>
              <p className="text-neutral-600 mb-6 max-w-sm">
                To detect your emotions in real-time, we need access to your camera. 
                Your privacy is protected - all processing happens locally.
              </p>
              <button
                onClick={turnCameraOn}
                className="flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Camera className="w-4 h-4 mr-2" />
                Allow Camera Access
              </button>
            </div>
          ) : !cameraActive && cameraPermission ? (
            <div className="aspect-video flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-neutral-200 p-6 rounded-full mb-4">
                <CameraOff className="w-12 h-12 text-neutral-500" />
              </div>
              <h3 className="text-lg font-medium text-neutral-800 mb-2">Camera is Off</h3>
              <p className="text-neutral-600 mb-6 max-w-sm">
                Turn on your camera to start emotion detection.
              </p>
              <button
                onClick={turnCameraOn}
                className="flex items-center px-6 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Video className="w-4 h-4 mr-2" />
                Turn Camera On
              </button>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 bg-opacity-60 z-10">
                  <div className="text-center text-white">
                    <div className="loader mb-4 mx-auto"></div>
                    <p className="font-medium">Initializing camera...</p>
                  </div>
                </div>
              )}
              
              <video
                ref={videoRef}
                className="w-full aspect-video object-cover bg-neutral-800"
                autoPlay
                playsInline
                muted
                controls={false}
                style={{ 
                  transform: 'scaleX(-1)',
                  minHeight: '300px',
                  display: 'block'
                }}
                onLoadedData={() => {
                  console.log('Video loaded successfully');
                }}
                onError={(e) => {
                  console.error('Video error:', e);
                }}
              />

              {/* Fallback message if video doesn't load */}
              {cameraActive && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-white bg-neutral-800 bg-opacity-50">
                  <div className="text-center">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm opacity-75">Camera feed loading...</p>
                  </div>
                </div>
              )}

              {isRecording && currentEmotion && (
                <div className="absolute bottom-4 right-4 bg-neutral-900 bg-opacity-90 text-white px-4 py-2 rounded-lg animate-scale-in backdrop-blur-sm border border-neutral-700">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse"></div>
                    <p className="text-sm">
                      <span className="font-semibold text-primary-300">
                        {currentEmotion.emotion.charAt(0).toUpperCase() + currentEmotion.emotion.slice(1)}
                      </span>
                      <span className="ml-2 opacity-75">
                        {Math.round(currentEmotion.confidence * 100)}%
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {cameraActive ? (
                <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
              ) : (
                <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
              )}
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {!cameraPermission ? (
                "Grant camera permission to begin real-time emotion detection."
              ) : !cameraActive ? (
                "Camera is off. Turn on the camera to enable emotion detection."
              ) : isRecording ? (
                "🔴 Analyzing your facial expressions to detect emotions in real-time. Your data stays private and secure."
              ) : (
                "Camera is ready. Press Start to begin emotion detection and mood tracking."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};