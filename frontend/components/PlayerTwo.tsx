import React from "react";
import { OpponentView, Card } from "../lib/types";

interface PlayerTwoProps {
  opponent: OpponentView;
  topCard: Card | null;
}

export default function PlayerTwo({ opponent, topCard }: PlayerTwoProps) {
  if (!opponent) return <div className="h-32"></div>;

  return (
    <div className="flex flex-col items-center gap-4">
       <div className="bg-[#01626F] text-white px-6 py-2 rounded-full font-bold shadow-lg">
          {opponent.nickname}
       </div>
       <div className="flex gap-2">
          {Array.from({ length: Math.min(opponent.cardCount, 5) }).map((_, i) => (
             <div key={i} className="w-16 h-24 bg-blue-800 rounded-lg border-2 border-white shadow-md"></div>
          ))}
          {opponent.cardCount > 5 && (
             <div className="w-16 h-24 flex items-center justify-center text-[#01626F] font-bold">
               +{opponent.cardCount - 5}
             </div>
          )}
       </div>
    </div>
  );
}
