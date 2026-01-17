import ColorInput from "@/app/features/models-page/components/color-input";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ModelPageProps {
  params: Promise<{
    id: string;
  }>;
}

const models = {
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
    description:
      "Paste text and receive a concise, meaningful summary.",
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

export default async function ModelPage({ params }: ModelPageProps) {
  const { id } = await params;
  const model = models[id as keyof typeof models];

  if (!model) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto p-8 h-screen">
      
      <header className="mb-10">
        <div className = "mb-2">
          <Link href = "/models">
            Back
          </Link>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-full border">
            {model.type}
          </span>
          <span className="text-sm text-neutral-500">
            v{model.version}
          </span>
        </div>

        <h1 className="text-4xl font-black text-neutral-900 dark:text-white">
          {model.name}
        </h1>

        <p className="mt-3 text-neutral-600 dark:text-neutral-400 max-w-2xl">
          {model.description}
        </p>
      </header>

      {/* Main Interaction Area */}
      <section className="flex flex-col gap-8 h-[75vh]">
        
        {/* Output Panel — PRIMARY */}
        <div className="border rounded-xl p-6 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Output
            </h2>
            <span className="text-xs text-neutral-500 uppercase tracking-wide">
              Live Preview
            </span>
          </div>
      
          {/* Visualization Area */}
          <div className="flex-1 border rounded-lg bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-neutral-400">
            {/* Future: <video /> + <canvas /> */}
            Computer vision output will appear here
          </div>
        </div>
      
        {/* Input Panel — CONTROLS BELOW */}
        <div className="border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Controls
          </h2>
      
          {/* Input switch */}
          {model.inputType === "image" && (
            <div className="border-dashed border-2 rounded-lg p-6 text-center text-neutral-500">
              Upload Image
            </div>
          )}
      
          {model.inputType === "text" && (
            <textarea
              placeholder="Paste your text here..."
              className="w-full min-h-30 border rounded-lg p-3 resize-none focus:outline-none focus:ring-2"
            />
          )}
      
          {model.inputType === "color" && <ColorInput />}
      
          <button className="mt-6 px-6 py-2 font-semibold rounded-lg border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            Run Model
          </button>
        </div>
      </section>
    </div>
  );
}