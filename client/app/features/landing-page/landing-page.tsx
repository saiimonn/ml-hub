

const LandingPage = () => {
  
  const features = [
      { title: "Real-time Detection", desc: "Process live video streams and detect objects using optimized computer vision models." },
      { title: "Intelligent Classification", desc: "Classify visual data using trained machine learning models built with OpenCV and scikit-learn." },
      { title: "Live AI Sessions", desc: "Stream data through WebSockets for low-latency, real-time AI inference." }
    ];
  
  return (
    <div className = "w-full">
      <div className="px-8 py-32">
        <div className = "flex flex-col justify-center items-center gap-4">
          <h1 className="text-5xl font-semibold">Welcome to the Playground</h1>
          <p className="text-xl max-w-xl text-center">
            Run computer vision models directly in your browser, and explore real-time detection, classification, and visual understanding 
            <span className = "font-extrabold underline"> without any setup. </span>
          </p>
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
    </div>
  )
}

export default LandingPage;