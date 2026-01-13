"use client";

import { useEffect, useState } from "react";

export default function Home() {
  // 1️⃣ Create state to hold API data
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((json) => setData(json)) // 2️⃣ Store in state
      .catch((err) => console.error("API error:", err));
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* 3️⃣ Render the data */}
      {data ? (
        <pre className="text-black dark:text-white">{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p className="text-black dark:text-white">Loading...</p>
      )}
    </div>
  );
}
