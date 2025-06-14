
import React, { useRef, useState, useCallback } from 'react';
import { Camera, RotateCcw, ArrowLeft, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PhotoCaptureProps {
  onCapture: (photoDataUrl: string) => void;
  onBack: () => void;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onCapture, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 1280, 
          height: 720,
          facingMode: 'user'
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    // Start countdown
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          
          // Capture the photo
          const canvas = canvasRef.current!;
          const video = videoRef.current!;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(video, 0, 0);
          
          const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
          stopCamera();
          onCapture(photoDataUrl);
          
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  }, [onCapture, stopCamera]);

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-pink-300 text-pink-600 hover:bg-pink-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Capture Your Photo</h1>
          <div className="w-20"></div>
        </div>

        {/* Camera Interface */}
        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-pink-200 overflow-hidden">
          <div className="relative">
            {/* Video Stream */}
            <div className="relative aspect-video bg-gray-900 rounded-t-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              
              {/* Countdown Overlay */}
              {countdown && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-8xl font-bold animate-pulse">
                    {countdown}
                  </div>
                </div>
              )}

              {/* Camera Frame Overlay */}
              <div className="absolute inset-4 border-2 border-white/50 rounded-lg">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-pink-400 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-pink-400 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-pink-400 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-pink-400 rounded-br-lg"></div>
              </div>

              {/* Instructions */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                Position yourself in the frame and click capture
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 bg-white">
              <div className="flex items-center justify-center space-x-8">
                <Button
                  onClick={startCamera}
                  variant="outline"
                  size="lg"
                  disabled={isStreaming}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Restart Camera
                </Button>

                {/* Capture Button */}
                <Button
                  onClick={capturePhoto}
                  disabled={!isStreaming || countdown !== null}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white w-20 h-20 rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {countdown ? (
                    <div className="text-2xl font-bold">{countdown}</div>
                  ) : (
                    <Circle className="h-8 w-8 fill-current" />
                  )}
                </Button>

                <div className="w-24"></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Hidden Canvas for Photo Capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default PhotoCapture;
