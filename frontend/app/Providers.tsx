"use client";

import { useEffect, useState } from "react";
import { loadConfig } from "@/lib/lineraClient";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    loadConfig()
      .then(() => {
        setConfigLoaded(true);
        console.log("Linera config loaded successfully");
      })
      .catch((err) => {
        console.error("Failed to load Linera config:", err);
        setConfigLoaded(true); // Continue anyway
      });
  }, []);

  if (!configLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="animate-pulse">Connecting to Linera network...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
