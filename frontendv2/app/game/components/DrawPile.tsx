"use client";

import React from "react";
import { Card as WhotCard } from "@/lib/types";

interface DrawPileProps {
  pile: WhotCard[]; // Comes from global game state
  onDraw?: () => void; // Optional draw handler
}

export default function DrawPile({ pile, onDraw }: DrawPileProps) {
  const topCard = pile?.[0] ?? null;

  return (
    <div className="flex flex-col items-center gap-y-8 w-full font-lilitaone text-[#F9F9F9]">
      {/* --- Pile Stack --- */}
      <div
        className="relative w-[141px] h-[193px] cursor-pointer"
        onClick={onDraw}
      >
        {/* Background cards – card back only */}
        {pile.slice(1, 4).map((card, idx) => (
          <div
            key={card.id}
            className={`absolute top-0 left-0 w-full h-full z-${idx} translate-x-${idx}`}
          >
            <CardBack />
          </div>
        ))}

        {/* Top card */}
        <div className="absolute top-0 left-0 w-full h-full z-10">
          {topCard ? <CardFront card={topCard} /> : <CardBack />}
        </div>
      </div>

      {/* Button label */}
      <button className="py-[13px] w-full bg-[#E65150] border-[0.3px] text-xl rounded-[9px] border-[#D0EEF5] active:scale-95 transition-transform duration-100">
        Draw Pile
      </button>
    </div>
  );
}

function CardBack() {
  return (
    <div className="p-[0.7px] rounded-[14px] bg-[linear-gradient(155.21deg,#AE2C21_13.44%,rgba(68,52,47,0)_38.7%,#AE2C21_92.32%)] shadow-2xl h-full w-full">
      <div className="w-full h-full bg-[#111010] rounded-[13px]"></div>
    </div>
  );
}

function CardFront({ card }: { card: WhotCard }) {
  return (
    <div className="p-[0.7px] rounded-[14px] bg-[linear-gradient(155.21deg,#AE2C21_13.44%,rgba(68,52,47,0)_38.7%,#AE2C21_92.32%)] shadow-2xl h-full w-full">
      <div className="w-full h-full bg-[#111010] rounded-[13px] flex flex-col justify-center items-center">
        <h3 className="text-[53px]">{card.number}</h3>
        <p className="text-xl opacity-60 uppercase tracking-wide">
          {card.shape}
        </p>
      </div>
    </div>
  );
}
