import GameClient from "./GameClient";

// Convert to Server Component to allow generateStaticParams export
export default function Page() {
  return <GameClient />;
}

export function generateStaticParams() {
  // Pre-render generic game IDs (e.g. 1 to 4)
  // Since we use client-side logic to determine identity from config.json,
  // the ID here is mostly cosmetic for the URL structure.
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
  ];
}
