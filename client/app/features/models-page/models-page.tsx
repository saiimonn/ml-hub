"use client"
import Nav from "@/app/components/nav";
import ModelCard from "./components/modelCard";

const allModels = [
  {
    id: "edge-detector",
    name: "Edge Detector",
    description: "Simple OpenCV edge detection model.",
    version: "1.0",
    type: "Computer Vision",
    category: "analytical"
  },
  {
    id: "color-analyzer",
    name: "Color Analyzer",
    description: "Detects and analyzes dominant colors in images using K-means clustering.",
    version: "1.2",
    type: "CV/Analytics",
    category: "analytical"
  },
  {
    id: "mnist-digit-classifier", //mock data
    name: "Digit Classifier",
    description: "Trainable neural network for recognizing handwritten digits.",
    version: "2.0",
    type: "Deep Learning",
    category: "trainable"
  }
];

interface ModelsPageProps {
  filter?: "analytical" | "trainable";
}

const ModelsPage = ({ filter }: ModelsPageProps) => {
  const models = filter 
    ? allModels.filter(m => m.category === filter) 
    : allModels;

  const headerContent = {
    analytical: {
      title: "Analytical Models",
      desc: "Ready-to-use computer vision and data processing tools."
    },
    trainable: {
      title: "Trainable Models",
      desc: "Machine learning models that are available for training and experimenting."
    },
    all: {
      title: "Model Hub",
      desc: "Explore every AI and Machine Learning tools/models offered."
    }
  };

  const currentHeader = filter ? headerContent[filter] : headerContent.all;

  return (
    <div className="max-w-7xl mx-auto px-8 py-4 relative z-10">
      <Nav />
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">
          {currentHeader.title}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
          {currentHeader.desc}
        </p>
      </header>

      {models.length > 0 ? (
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
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl">
          <p className="text-neutral-500 italic">No models found in this category yet.</p>
        </div>
      )}
    </div>
  );
};

export default ModelsPage;