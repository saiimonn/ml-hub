"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";

interface ColorDetectorProps {
  result: any; // detection result object
  colorInput: string; // color being detected
  onCameraFrame?: (file: File) => void; // callback for sending frames to model
}

export default function ColorDetector({ result, colorInput, onCameraFrame }: ColorDetectorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastCaptureRef = useRef<number>(0);
  const isProcessingRef = useRef(false);

  const captureFrame = useCallback(() => {
    if (!canvasRef.current || !onCameraFrame || !streamRef.current) return;
    if (isProcessingRef.current) return;

    const now = Date.now();
    if (now - lastCaptureRef.current < 100) return; // ~10 FPS

    lastCaptureRef.current = now;
    isProcessingRef.current = true;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      isProcessingRef.current = false;
      return;
    }

    const videoTrack = streamRef.current.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);
    imageCapture.grabFrame().then((bitmap) => {
      const scale = 0.75;
      canvas.width = bitmap.width * scale;
      canvas.height = bitmap.height * scale;
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          onCameraFrame(new File([blob], "frame.jpg", { type: "image/jpeg" }));
        }
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 50);
      }, "image/jpeg", 0.75);
    }).catch((err) => {
      console.error("Frame capture error:", err);
      isProcessingRef.current = false;
    });
  }, [onCameraFrame]);


  const renderLoop = useCallback(() => {
    captureFrame();
    animationFrameRef.current = requestAnimationFrame(renderLoop);
  }, [captureFrame]);


  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
      });

      streamRef.current = stream;
      setIsCameraActive(true);
      setCameraError(null);
      animationFrameRef.current = requestAnimationFrame(renderLoop);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Unable to access camera. Check permissions.");
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsCameraActive(false);
    isProcessingRef.current = false;
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="flex-1 space-y-4">
      <div className="border rounded-lg p-4 bg-neutral-200 h-full">
        <div className="flex items-center justify-between mb-3 text-black">
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

        {/* Canvas rendering live camera (HIDDEN)*/}
        <div className="relative border rounded-lg overflow-hidden bg-black aspect-video hidden">
          <canvas ref={canvasRef} className="w-full h-full object-contain hidden" />
          {!isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
              Camera not active
            </div>
          )}
        </div>

        {/* Detection Result */}
        {(result && isCameraActive) ? (
          <div
            className={`p-4 mt-4 border rounded-lg ${
              result.detection_found ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-black">
                  {result.detection_found ? "Color Detected" : "Color Not Found"}
                </p>
                <p className="text-xs text-black">
                  Searching for: <span className="font-mono font-bold">{result.color_detected}</span>
                </p>
              </div>

              <div
                className="w-8 h-8 rounded-md border-2 shadow-sm"
                style={{ backgroundColor: result.color_detected }}
              />
            </div>

            {result.annotated_image && (
              <div className="border rounded-lg overflow-hidden bg-white mt-3">
                <Image
                  src={`data:image/png;base64,${result.annotated_image}`}
                  alt="Detection Result"
                  width={800}
                  height={600}
                  unoptimized
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>
        ) : (
          <div className = "w-full h-auto">
            <h1 className = "text-lg font-semibold text-black text-center">Camera not active</h1>
          </div>
        )}
      </div>
    </div>
  );
}
