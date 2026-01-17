"use client"
import VidBG from "@/app/components/video-bg";
import ModelCard from "./components/modelCard";
import Nav from "@/app/components/nav";


const models = [
  {
    id: "image-classifier-01",
    name: "Image Classifier",
    description: "Classifies images into multiple categories using deep learning.",
    version: "1.0",
    type: "CV",
  },
  {
    id: "text-summarizer-01",
    name: "Text Summarizer",
    description: "Generates a concise summary for any given text input accurately.",
    version: "2.1",
    type: "NLP",
  },
  {
    id: "object-detector-01",
    name: "Object Detector",
    description: "Detects objects in images with bounding boxes and labels.",
    version: "0.9",
    type: "CV"
  },
];

const ModelsPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-8 h-screen">
      <VidBG />
      
      <div className="relative z-10">
        <Nav />
        
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">
            Model Hub
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            Explore and interact with state-of-the-art machine learning models directly in your browser.
          </p>
        </header>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {models.map((model) => (
            <ModelCard
              key={model.id}
              id={model.id}
              name={model.name}
              desc={model.description}
              version={model.version}
              type={model.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelsPage;