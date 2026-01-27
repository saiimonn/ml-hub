"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

interface ColorDetectorProps {
  result: any;
  isCamera?: boolean;
  colorInput: string;
  onCameraFrame?: (file: File) => void;
}

export default function ColorDetector({ 
  result, 
  isCamera = false, 
  colorInput,
  onCameraFrame 
}: ColorDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setCameraError(null);
        
        // Start sending frames every 500ms
        intervalRef.current = setInterval(() => {
          captureFrame();
        }, 500);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError("Unable to access camera. Please check permissions.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Capture frame and send to parent
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current && onCameraFrame) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-frame.jpg", { type: "image/jpeg" });
            onCameraFrame(file);
          }
        }, "image/jpeg", 0.8);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // If camera mode is enabled
  if (isCamera) {
    return (
      <div className="flex-1 space-y-4">
        {/* Camera Controls */}
        <div className="border rounded-lg p-4 bg-neutral-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Live Camera Feed</h3>
            {isCameraActive ? (
              <button
                onClick={stopCamera}
                className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Stop Camera
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Start Camera
              </button>
            )}
          </div>
          
          {cameraError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {cameraError}
            </div>
          )}

          {/* Video Feed */}
          <div className="relative border rounded-lg overflow-hidden bg-black aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
            />
            {!isCameraActive && (
              <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                Camera not active
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Real-time Detection Results */}
        {result && (
          <>
            <div className={`p-4 border rounded-lg ${result.detection_found ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    {result.detection_found ? 'Color Detected' : 'Color Not Found'}
                  </p>
                  <p className="text-xs text-neutral-600">
                    Searching for: <span className="font-mono font-bold">{result.color_detected}</span>
                  </p>
                </div>
                
                <div className="size-12 rounded-md border-2 shadow-sm" style={{backgroundColor: result.color_detected}} />
              </div>
            </div>
            
            {result.annotated_image && (
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="p-3 border-b bg-neutral-50">
                  <p className="text-xs font-semibold text-neutral-700">Live Detection Result</p>
                </div>
                
                <Image 
                  src={`data:image/png;base64,${result.annotated_image}`}
                  alt="Color detection result"
                  width={800}
                  height={600}
                  unoptimized
                  className="w-full h-auto"
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-500 mb-1">Coverage</p>
                <p className="text-2xl font-bold">{result.coverage_percentage}%</p>
                <p className="text-[10px] text-neutral-400 mt-1">
                  {result.detected_pixels?.toLocaleString()} pixels
                </p>
              </div>
              
              {result.bounding_box && (
                <div className="p-4 border rounded-lg bg-neutral-50">
                  <p className="text-xs text-neutral-500 mb-1">Bounding Box</p>
                  <div className="text-xs font-mono space-y-0.5">
                    <p>x: {result.bounding_box.x1} → {result.bounding_box.x2}</p>
                    <p>y: {result.bounding_box.y1} → {result.bounding_box.y2}</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Static image mode (existing implementation)
  return (
    <div className="flex-1 space-y-4">
      <div className={`p-4 border rounded-lg ${result.detection_found ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{result.detection_found ? 'Color Detected' : 'Color Not Found'}</p>
            <p className="text-xs text-neutral-600">Searching for: <span className="font-mono font-bold">{result.color_detected}</span></p>
          </div>
          
          <div className="size-12 rounded-md border-2 shadow-sm" style={{backgroundColor: result.color_detected}} />
        </div>
      </div>
      
      {result.annotated_image && (
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="p-3 border-b bg-neutral-50">
            <p className="text-xs font-semibold text-neutral-700">Detection Result</p>
          </div>
          
          <Image 
            src={`data:image/png;base64,${result.annotated_image}`}
            alt="Color detection result"
            width={800}
            height={600}
            unoptimized
            className="w-full h-auto"
          />
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-neutral-50">
          <p className="text-xs text-neutral-500 mb-1">Coverage</p>
          <p className="text-2xl font-bold">{result.coverage_percentage}%</p>
          <p className="text-[10px] text-neutral-400 mt-1">{result.detected_pixels?.toLocaleString()} pixels</p>
        </div>
        
        {result.bounding_box && (
          <div className="p-4 border rounded-lg bg-neutral-50">
            <p className="text-xs text-neutral-500 mb-1">Bounding Box</p>
            <div className="text-xs font-mono space-y-0.5">
              <p>x: {result.bounding_box.x1} → {result.bounding_box.x2}</p>
              <p>y: {result.bounding_box.y1} → {result.bounding_box.y2}</p>
            </div>
          </div>
        )}
      </div>
      
      {result.mask && (
        <details className="border rounded-lg bg-neutral-50">
          <summary className="p-3 cursor-pointer hover:bg-neutral-100 transition-colors font-semibold text-sm">
            View Detection Mask
          </summary>
          <div className="p-3 border-t">
            <Image 
              src={`data:image/png;base64,${result.mask}`}
              alt="Detection mask"
              width={800}
              height={600}
              unoptimized
              className="w-full h-auto rounded"
            />
            <p className="text-xs text-neutral-500 mt-2">White areas indicate detected color regions</p>
          </div>
        </details>
      )}
    </div>
  );
}