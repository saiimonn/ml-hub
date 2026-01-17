import Link from "next/link";

const LandingPage = () => {
  
  const features = [
    { title: "Real-time Detection", desc: "Process live video streams and detect objects using optimized computer vision models." },
    { title: "Intelligent Classification", desc: "Classify visual data using trained machine learning models built with OpenCV and scikit-learn." },
    { title: "Live AI Sessions", desc: "Stream data through WebSockets for low-latency, real-time AI inference." }
  ];
  
  const processes = [
    {
      step: 1,
      title: "Enable Camera Access",
      desc: "Grant permission for your camera. All processing runs entirely in your browser—no video data is ever uploaded or stored."
    },
    {
      step: 2,
      title: "Select a Vision Model",
      desc: "Choose from a curated set of optimized computer vision models designed for detection, classification, and tracking."
    },
    {
      step: 3,
      title: "Initialize the Model",
      desc: "The selected model is loaded and optimized using browser-native acceleration such as WebGL or WebGPU."
    },
    {
      step: 4,
      title: "Real-Time Inference",
      desc: "Live camera frames are analyzed in real time, with predictions generated instantly and visualized on-screen."
    },
    {
      step: 5,
      title: "Visualize & Interact",
      desc: "View detection overlays, confidence scores, and results instantly—adjust models or inputs without restarting."
    }
  ];
  
  return (
    <div className = "w-full">
      <div className="px-8 py-32">
        <div className = "flex flex-col justify-center items-center gap-4">
          <h1 className="text-5xl font-semibold">Welcome to the Playground</h1>
          <p className="text-xl max-w-xl text-center">
            Run computer vision models directly in your browser, and explore real-time detection, classification, and visual understanding 
            <span className = "font-extrabold"> without any setup. </span>
          </p>
          
          <div>
            <Link href = "/models">
              <p className = "text-lg hover:underline">Try our models</p>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="px-8 md:px-16 max-w-7xl mx-auto">
        <div className = "flex justify-center">
          <h1 className = "text-4xl font-bold">Features</h1>
        </div>
        
        <div className = "grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className = {`flex flex-col gap-4 p-6 transition-colors ${idx == 2 ? 'border-none' : 'border-r'}`}
            >
              <h3 className="text-2xl font-semibold tracking-tight">{feature.title}</h3>
              <p className="opacity-60 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className = "px-8 md:px-16 py-32 max-w-7xl mx-auto">
        <div className = "flex justify-center">
          <h1 className = "text-4xl font-bold">How it works</h1>
        </div>
        
        <div className = "flex flex-col space-y-4 px-32 pt-8">
          {processes.map((process, idx) => (
            <div
              key={idx}
              className = {`flex space-x-4 py-4 ${process.step == 5 ? 'border-b-0' : 'border-b border-b-white/50'}`}
            >
              <h1 className="text-2xl">[{ process.step }]</h1>
              <div className = "flex flex-col">
                <h1 className = "text-xl font-semibold">{process.title}</h1>
                <p className = "text-lg">{process.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LandingPage;