"use client";

import { useState } from "react";

export default function ColorInput() {
  const [color, setColor] = useState("#f97316");

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-neutral-500 block">
        Select Color
      </label>

      <div className="flex items-center gap-4 p-3 border rounded-lg bg-white dark:bg-neutral-900 group hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer relative overflow-hidden">
        {/* Native color input */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />

        {/* Custom UI */}
        <div className="flex items-center gap-3 w-full">
          <div
            className="w-10 h-10 rounded-md border shadow-sm ring-2 ring-white dark:ring-neutral-800"
            style={{ backgroundColor: color }}
          />

          <div className="flex-1">
            <p className="text-sm font-mono font-bold uppercase">{color}</p>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
              Click to change
            </p>
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
  );
}