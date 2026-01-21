import Image from "next/image";


export default function EdgeDetector({ result }: { result: any }) {
  return(
    <div className = "flex-1 space-y-4">
      {result.preview && (
        <div className = "border rounded-lg overflow-hidden bg-white dark:bg-neutral-900">
          <Image 
          src={`data:image/png;base64,${result.preview}`}
          alt="Edge detection result"
          width={800}
          height={600}
          unoptimized
          className="w-full h-auto"
          />
        </div>
      )}
      {result.edge_ratio && (
        <div className = "p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-900">
          <p className = "text-sm text-neutral-500 mb-1">Edge Ratio</p>
          <p className = "text-2xl font-bold">{result.edge_ratio}</p>
        </div>
      )}
    </div>
  )
}