import Image from "next/image";


export default function ColorAnalyzer({ result }: { result: any }) {
  return(
    <>
      <div className = "flex-1 space-y-4">
        {result.preview && (
          <div className = "border rounded-lg overflow-hidden">
            <Image
              src={`data:image/png;base64,${result.preview}`}
              alt="Color distribution"
              width={800}
              height={600}
              unoptimized
              className="w-full h-auto"
            />
          </div>
        )}
      </div>
      
      <div className = "space-y-3">
        <div className = "flex items-center justify-between">
          <h3 className = "font-semibold text-sm">Detected Colors</h3>
          <span className = "text-xs text-neutral-500">
            Total: {result.total_colors_detected}
          </span>
        </div>
        
        {result.colors?.map((color: any, idx: number) => (
          <div
            key={idx}
            className = "flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-neutral-900"
          >
            <div
              className="size-12 rounded-md border shadow-sm"
              style={{ backgroundColor: color.hex }}
            />
              <div className = "flex-1">
                <p className = "font-bold text-sm">{color.hex}</p>
                <p className = "text-xs text-neutral-500">RGB: { color.rgb.join(", ") }</p>
              </div>
              
              <div className = "text-right">
                <p className = "font-bold text-sm">{color.percentage}</p>
                <p className = "text-xs text-neutral-500">coverage</p>
              </div>
          </div>
        ))}
      </div>
      
      {result.dominant_color && (
        <div className = "border rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900">
          <p className = "text-xs text-neutral-500 mb-2">Dominant Color</p>
          <div className = "flex items-center gap-3">
            <div
              className="size-16 rounded-lg border shadow-sm"
              style={{ backgroundColor: result.dominant_color }}
            />
            <p className = "font-bold text-lg">{result.dominant_color}</p>
          </div>
        </div>
      )}
    </>
  )
}