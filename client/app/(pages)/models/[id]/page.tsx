"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ColorAnalyzer from "@/app/features/models-page/outputs/color-analyzer-output";
import EdgeDetector from "@/app/features/models-page/outputs/edge-detector-output";

interface ModelPageProps {
  params: Promise<{
    id: string;
  }>;
}

const models = {
  "edge-detector": {
    name: "Edge Detector",
    description:
      "Upload an image and detect edges using OpenCV Canny edge detection algorithm.",
    type: "Computer Vision",
    version: "1.0",
    inputType: "image",
  },
  "color-analyzer": {
    name: "Color Analyzer",
    description:
      "Upload an image to detect and analyze the dominant colors present in it.",
    type: "Computer Vision",
    version: "1.0",
    inputType: "image",
  },
  "image-classifier-01": {
    name: "Image Classifier",
    description:
      "Upload an image and let the model classify it into predefined categories.",
    type: "Computer Vision",
    version: "1.0",
    inputType: "color",
  },
  "text-summarizer-01": {
    name: "Text Summarizer",
    description: "Paste text and receive a concise, meaningful summary.",
    type: "NLP",
    version: "2.1",
    inputType: "text",
  },
  "object-detector-01": {
    name: "Object Detector",
    description:
      "Detects objects in images and returns bounding boxes with labels.",
    type: "Computer Vision",
    version: "0.9",
    inputType: "image",
  },
};

export default function ModelPage({ params }: ModelPageProps) {
  const [modelId, setModelId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useState(() => {
    params.then((p) => setModelId(p.id));
  });

  const model = models[modelId as keyof typeof models];

  if (modelId && !model) {
    notFound();
  }

  if (!model) {
    return <div>Loading...</div>;
  }

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
    if (!selectedFile) return;

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        `http://localhost:8000/models/${modelId}/infer`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Inference failed");
      }

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

    if (modelId === "color-analyzer") {
      return (
        <ColorAnalyzer result = {result} />
      );
    }

    if (modelId === "edge-detector") {
      return (
        <EdgeDetector result = {result} />
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

      {/* Main Interaction Area */}
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
              {/* Image Preview */}
              {previewUrl && (
                <div className="border rounded-lg overflow-hidden max-h-64">
                  <img
                    src={previewUrl}
                    alt="Selected image"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* File Input */}
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
              placeholder="Paste your text here..."
              className="w-full min-h-30 border rounded-lg p-3 resize-none focus:outline-none focus:ring-2"
            />
          )}

          {model.inputType === "color" && (
            <div className="text-neutral-500 text-sm">
              Color input component (placeholder)
            </div>
          )}

          <button
            onClick={handleRunModel}
            disabled={loading || !selectedFile}
            className="mt-6 px-6 py-2 font-semibold rounded-lg border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Run Model"}
          </button>
        </div>
      </section>
    </div>
  );
}