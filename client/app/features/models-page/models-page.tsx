"use client"

import Link from "next/link";
import ModelCard from "@/app/features/models-page/components/modelCard";

const models = [
  {
    name: "Image Classifier",
    description: "Classifies images into multiple categories using deep learning.",
    version: "1.0",
    type: "Computer Vision",
  },
  {
    name: "Text Summarizer",
    description: "Generates a concise summary for any given text input.",
    version: "2.1",
    type: "Natural Language Processing",
  },
  {
    name: "Object Detector",
    description: "Detects objects in images with bounding boxes and labels.",
    version: "0.9",
    type: "Computer Vision"
  },
];

const ModelsPage = () => {
  const handleTryModel = (name: string) => {
    alert(`Trying out ${name}`);
  }
  
  return (
    <div className="min-h-screen p-8">
      <div className = "flex justify-between px-3">
        <Link href = "/">Back</Link>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">ML Models</h1>
      </div>

      <h3 className = "text-center text-2xl font-medium py-4">Select a model to start a real-time inference session</h3>
      
      <div className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <ModelCard
            key={model.name}
            name={model.name}
            desc={model.description}
            version={model.version}
            type={model.type}
            onTry={() => handleTryModel(model.name)}
          />
        ))}
      </div>
    </div>
  )
}

export default ModelsPage;