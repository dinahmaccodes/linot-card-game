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
      {/* Opponent's Card Backs - Overlapping */}
      <div className="flex items-center">
        <div
          className="flex justify-center items-end -ml-40"
          style={{ minHeight: "160px" }}
        >
          {Array.from({ length: opponent.cardCount }).map((_, idx) => (
            <div
              key={idx}
              style={{
                marginLeft: idx > 0 ? "6px" : "0",
                zIndex: idx,
              }}
            >
              <img
                src="/lastcard.svg"
                alt="Card back"
                className="w-30 h-35 transition-transform hover:-translate-y-2"
              />
            </div>
          ))}
        </div>
        
        
        {/* Opponent's UserBar - name only (no avatar) */}
        <div className="flex items-center ml-10">
          <div
            className="pl-5.5 pr-9.5 rounded-[10px] border-[0.4px] border-[#D0EEF5] text-[27px]/[18px] py-3 text-center text-white font-satoshi"
            style={{
              backgroundColor: "#88D0E1", // Default color since we can't reliably fetch from localStorage
              boxShadow: `
    -1.99px -2.99px 6.97px 0px rgba(255, 255, 255, 0.3) inset,
     5.97px  2.99px 6.97px 0px rgba(255, 255, 255, 0.3) inset,
     0px     2px    5px    0px rgba(0, 0, 0, 0.25)
  `,
              backdropFilter: "blur(497.6px)",
              WebkitBackdropFilter: "blur(497.6px)",
            }}
          >
            <span className="text-3xl">{opponent.nickname}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
