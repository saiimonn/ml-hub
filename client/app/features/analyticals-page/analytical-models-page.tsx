"use client"
import VidBG from "@/app/components/video-bg";
import ModelCard from "../models-page/components/modelCard";
import Nav from "@/app/components/nav";

const models = [
  {
    id: "edge-detector",
    name: "Edge Detector",
    description: "Detects edges in images using OpenCV Canny edge detection.",
    version: "1.0",
  },
  {
    id: "color-analyzer",
    name: "Color Analyzer",
    description: "Analyzes and extracts dominant colors from images using K-means clustering.",
    version: "1.0",
  },
];

const AnalyticalModelsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 h-screen">
      <VidBG />
      
      <div className="relative z-10">
        <Nav />
        
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">
            Analytical Models Hub
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            Explore ready-to-use computer vision models that instantly analyze images and extract meaningful visual insights. No training required.
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticalModelsPage;