"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ColorAnalyzer from "@/app/features/models-page/outputs/color-analyzer-output";
import EdgeDetector from "@/app/features/models-page/outputs/edge-detector-output";
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

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [model, setModel] = useState<any>(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [colorInput, setColorInput] = useState("#f97316");

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/models/${modelId}`);
        if (!res.ok) throw new Error("Model not exist");
        const data = await res.json();
        setModel(data);
      } catch {
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
      } else {
        const payload = {
          data: model.inputType === "color" ? colorInput : textInput,
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

  const renderOutput = () => {
    if (!result) {
      return (
        <div className="flex-1 border rounded-lg bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-neutral-400">
          {loading ? "Processing..." : "Results will appear here after running the model"}
        </div>
      );
    }

    if (modelId === "color-analyzer") return <ColorAnalyzer result={result} />;
    if (modelId === "edge-detector") return <EdgeDetector result={result} />;

    return (
      <div className="flex-1 border rounded-lg bg-neutral-50 dark:bg-neutral-900 p-4">
        <pre className="text-xs overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  if (loadingModel) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 min-h-screen">
      <header className="mb-10">
        <div className="mb-2">
          <Link
            href="/models"
            className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            ← Back to Models
          </Link>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-full border">
            {model.type}
          </span>
          <span className="text-sm text-neutral-500">v{model.version}</span>
        </div>

        <h1 className="text-4xl font-black text-neutral-900 dark:text-white">
          {model.name}
        </h1>

        <p className="mt-3 text-neutral-600 dark:text-neutral-400 max-w-2xl">
          {model.description}
        </p>
      </header>

      <section className="flex flex-col gap-8">
        {/* Output Panel */}
        <div className="border rounded-xl p-6 flex flex-col min-h-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Output</h2>
            <span className="text-xs text-neutral-500 uppercase tracking-wide">
              Live Preview
            </span>
          </div>

          {renderOutput()}
        </div>

        {/* Input Panel */}
        <div className="border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Controls</h2>

          {model.inputType === "image" && (
            <div className="space-y-4">
              {previewUrl && (
                <div className="border rounded-lg overflow-hidden max-h-64">
                  <Image
                    src={previewUrl}
                    alt="Selected image"
                    width={800}
                    height={600}
                    unoptimized
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <label className="border-dashed border-2 rounded-lg p-6 text-center text-neutral-500 hover:border-neutral-400 cursor-pointer block transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile ? (
                  <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                    {selectedFile.name}
                  </span>
                ) : (
                  <span>Click to upload image</span>
                )}
              </label>
            </div>
          )}

          {model.inputType === "text" && (
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your text here..."
              className="w-full min-h-30 border rounded-lg p-3 resize-none focus:outline-none focus:ring-2"
            />
          )}

          {model.inputType === "color" && (
            <ColorInput value={colorInput} onChange={setColorInput} />
          )}

          <button
            onClick={handleRunModel}
            disabled={loading || (model.inputType === "image" && !selectedFile)}
            className="mt-6 px-6 py-2 font-semibold rounded-lg border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Run Model"}
          </button>
        </div>
      </section>
    </div>
  );
}