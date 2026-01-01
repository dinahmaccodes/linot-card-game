import React from "react";
import { OpponentView, Card } from "../lib/types";

interface PlayerTwoProps {
  opponent: OpponentView;
  topCard: Card | null;
}

export default function PlayerTwo({ opponent, topCard }: PlayerTwoProps) {
  // Show waiting message if no opponent
  if (!opponent) {
    return (
      <div className="h-32 flex items-center justify-center">
        <div className="bg-[#01626F] text-white px-6 py-2 rounded-full font-bold shadow-lg">
          Waiting for opponent...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Opponent Name
      <div className="bg-[#01626F] text-white px-6 py-2 rounded-full font-bold shadow-lg">
        {opponent.nickname} ({opponent.cardCount} cards)
      </div> */}

      {/* Opponent's Card Backs - Overlapping */}
      <div
        className="flex justify-center items-end -ml-40"
        style={{ minHeight: "160px" }}
      >
        {Array.from({ length: opponent.cardCount }).map((_, idx) => (
          <div
            key={idx}
            style={{
              marginLeft: idx > 0 ? "10px" : "0",
              zIndex: idx,
            }}
          >
            <img
              src="/lastcard.svg"
              alt="Card back"
              className="w-30 h-40 transition-transform hover:-translate-y-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
