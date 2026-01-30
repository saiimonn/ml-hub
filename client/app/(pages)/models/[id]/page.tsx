"use client";
import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ColorAnalyzer from "@/app/features/models-page/outputs/color-analyzer-output";
import EdgeDetector from "@/app/features/models-page/outputs/edge-detector-output";
import ColorDetector from "@/app/features/models-page/outputs/color-detector-output";
import ColorInput from "@/app/features/models-page/components/color-input";
import Image from "next/image";
import { API_BASE_URL } from "@/app/config/apiConfig";

interface ModelPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ModelPage({ params }: ModelPageProps) {
  const unwrappedParams = use(params);
  const modelId = unwrappedParams.id;

  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [model, setModel] = useState<any>(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [colorInput, setColorInput] = useState("#f97316");
  const [useCameraMode, setUseCameraMode] = useState(false);

  // Handle Hydration by ensuring client-only code runs after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/models/${modelId}`);
        if (!res.ok) throw new Error("Model does not exist");
        const data = await res.json();
        setModel(data);
        
        if (data.outputType === "camera") {
          setUseCameraMode(true);
        }
      } catch (error) {
        console.error("Error fetching model:", error);
        notFound();
      } finally {
        setLoadingModel(false);
      }
    };
    if (modelId) fetchModel();
  }, [modelId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
    }
  };

  const handleRunModel = async () => {
    setLoading(true);
    setResult(null);

    try {
      let response;
      const endpoint = `${API_BASE_URL}/models/${modelId}/infer`;

      if (model.inputType === "image") {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append("file", selectedFile);
        response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
      } else if (model.inputType === "color") {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("data", colorInput);
        response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
      } else {
        const payload = {
          data: model.inputType === "text" ? textInput : colorInput,
        };
        response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) throw new Error("Inference failed");
      const data = await response.json();
      setResult(data.output ?? data);
    } catch (error) {
      console.error("Error running model:", error);
      alert("Error running model. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCameraFrame = useCallback(async (file: File) => {
    if (!model || loading) return;
    try {
      const endpoint = `${API_BASE_URL}/models/${modelId}/infer`;
      const formData = new FormData();
      formData.append("file", file);
      if (model.inputType === "color") {
        formData.append("data", colorInput);
      }
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data.output ?? data);
      }
    } catch (error) {
      console.error("Error processing camera frame:", error);
    }
  }, [model, modelId, colorInput, loading]);

  const renderOutput = () => {
    if (!result && !useCameraMode) {
      return (
        <div className="flex-1 border rounded-lg bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-neutral-400 min-h-[300px]">
          {loading ? "Processing..." : "Results will appear here after running the model"}
        </div>
      );
    }

    if (modelId === "color-analyzer") return <ColorAnalyzer result={result} />;
    if (modelId === "edge-detector") return <EdgeDetector result={result} />;
    if (modelId === "color-detector") {
      return (
        <ColorDetector 
          result={result} 
          colorInput={colorInput}
          onCameraFrame={handleCameraFrame}
        />
      );
    }

    return (
      <div className="flex-1 border rounded-lg bg-neutral-50 dark:bg-neutral-900 p-4">
        <pre className="text-xs overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  if (!isMounted || loadingModel || !model) {
    return <div className="p-8 animate-pulse text-neutral-500">Loading component...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 min-h-screen">
      <header className="mb-10">
        <div className="mb-4">
          <Link
            href="/models"
            className="text-sm font-medium hover:text-purple-600 transition-colors"
          >
            ← Back to Models
          </Link>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 text-xs font-extralight uppercase tracking-tighter rounded-full border ">
            {model.type}
          </span>
          <span className="text-sm text-neutral-400 font-mono">v{model.version}</span>
          {model.outputType === "camera" && (
            <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
              Live Camera
            </span>
          )}
        </div>
        <h1 className="text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
          {model.name}
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
          {model.description}
        </p>
      </header>

      <section className="flex flex-col gap-8">
        {/* Output Section */}
        <div className="border rounded-2xl p-8 bg-white dark:bg-neutral-950 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Inference Output</h2>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
              {useCameraMode ? "Stream active" : "Static Analysis"}
            </span>
          </div>
          {renderOutput()}
        </div>

        {/* Input & Control Section */}
        {!useCameraMode && (
          <div className="flex flex-col gap-6">
            <div className="border rounded-2xl p-8 bg-neutral-950 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Configure Input</h2>

              {model.inputType === "image" && (
                <div className="space-y-6">
                  {previewUrl && (
                    <div className="relative w-full border rounded-xl overflow-hidden bg-neutral-900 flex items-center justify-center min-h-62.5 max-h-150">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={1200}
                        height={900}
                        unoptimized
                        className="max-w-full max-h-150 w-auto h-auto object-contain"
                      />
                    </div>
                  )}

                  <label className="group border-dashed border-2 rounded-xl p-10 text-center text-neutral-400 hover:border-neutral-900 dark:hover:border-white hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer block transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-sm font-semibold group-hover:text-neutral-900 dark:group-hover:text-white">
                        {selectedFile ? selectedFile.name : "Select an image file to begin"}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest opacity-50">Drag & Drop supported</span>
                    </div>
                  </label>
                </div>
              )}

              {/* text input */}
              {model.inputType === "text" && (
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text payload..."
                  className="w-full min-h-37.5 border rounded-xl p-5 bg-neutral-50 focus:ring-2 focus:ring-neutral-200 outline-none transition-all"
                />
              )}

              {/* color input */}
              {model.inputType === "color" && (
                <div className="p-6 border rounded-xl">
                  <ColorInput value={colorInput} onChange={setColorInput} />
                </div>
              )}
            </div>

            {/* seperate run model and input */}
            <div className="flex items-center justify-between border rounded-2xl p-5">
              <span className="text-xs font-bold px-4">
                {(!selectedFile && (model.inputType === "image" || model.inputType === "color")) 
                  ? "Awaiting input file..." 
                  : "Ready for inference"}
              </span>
              <button
                onClick={handleRunModel}
                disabled={loading || ((model.inputType === "image" || model.inputType === "color") && !selectedFile)}
                className="px-10 py-3 font-black text-xs uppercase tracking-widest text-white bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Run model"}
              </button>
            </div>
          </div>
        )}

        {/* Camera mode specific settings */}
        {useCameraMode && model.inputType === "color" && (
          <div className="border rounded-2xl p-8 bg-white dark:bg-neutral-950">
            <h2 className="text-xl font-bold mb-4">Real-time Parameters</h2>
            <ColorInput value={colorInput} onChange={setColorInput} />
            <p className="text-xs text-neutral-500 mt-4 font-medium italic">
              * The engine will continuously scan the video feed for the selected hue.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}