"use client";

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorInput({ value, onChange }: ColorInputProps) {
  return(
    <div className = "space-y-4">
      <label className = "text-sm font-medium text-neutral-500 block">Select Color to Detect</label>
      
      <div className = "flex items-center gap-4 p-3 border rounded-lg group hover:border-neutral-400 transition-colors cursor-pointer relative overflow-hidden">
        <input 
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className = "absolute inset-0 opacity-0 cursor-pointer size-full"
        />
        
        <div className = "flex items-center gap-3 w-full">
          <div className="size-10 rounded-md border shadow-sm ring-2 ring-white" style={{ backgroundColor: value }} />
            
          <div className = "flex-1">
            <p className = "text-sm font-mono font-bold uppercase">{value}</p>
            <p className = "text-[10px] uppercase tracking-widest font-semibold">Click to change</p>
          </div>
          
          <svg
            className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}