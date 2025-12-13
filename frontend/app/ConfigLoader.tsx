"use client";

import { useEffect, useState } from "react";
import { loadConfig } from "@/lib/lineraClient";

export default function ConfigLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [configLoaded, setConfigLoaded] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig()
      .then(() => {
        console.log("✓ Game configuration loaded");
        setConfigLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to load configuration:", error);
        setConfigError(error?.message || "Failed to load game configuration");
      });
  }, []);

  if (configError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Configuration Error
          </h1>
          <p className="text-gray-700 mb-4">{configError}</p>
          <p className="text-sm text-gray-500">
            Please ensure the backend is running and config.json is accessible.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!configLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game configuration...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
