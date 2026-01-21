"use client"

import VidBG from "@/app/components/video-bg"
import ModelCard from "../models-page/components/modelCard"
import Nav from "@/app/components/nav"

const models = [
  {
    id: "object-detection",
    name: "Object Detection",
    description: "Detects objects",
    version: "1.0",
    type: "CV"
  }
]

const TrainableModelsPage = () => {
  return(
    <div className = "max-w-7xl mx-auto p-8 h-screen">
      <VidBG />
      
      <div className = "relative z-10">
        <Nav />
        
        <header className = "mb-12 text-center">
          <h1 className = "text-4xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">Model Hub</h1>
          <p className = "text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">            Explore and interact with state-of-the-art machine learning models directly in your browser.</p>
        </header>
        
        <div className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
  )
}

export default TrainableModelsPage