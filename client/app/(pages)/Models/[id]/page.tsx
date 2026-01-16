"use client"

import React, { useState } from "react"
import Link from "next/link"

export default function TryModel({ params }: { params: { id: string } }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleProcess = async() => {
    setIsProcessing(true);
    setTimeout(() => {
      setOutput(`Analysis complete for ${params.id}. Predicted result: SUCCESS. (This is a hardcoded result)`);
      setIsProcessing(false);
    }, 1500)
  }
  
  return (
    <div className = "min-h-screen bg-neutral-50 dark:bg-neutral-950">
      
    </div>
  )
}