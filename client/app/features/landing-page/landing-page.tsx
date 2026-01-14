

const LandingPage = () => {
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
    </div>
  )
}

export default LandingPage;