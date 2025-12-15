import React from "react";

interface DrawPileProps {
  deckSize: number;
  onDraw: () => void;
}

export default function DrawPile({ deckSize, onDraw }: DrawPileProps) {
  return (
    <div 
      className="w-32 h-44 bg-[#01626F] rounded-xl border-4 border-white flex items-center justify-center cursor-pointer shadow-xl transform transition active:scale-95"
      onClick={onDraw}
    >
      <div className="text-white text-center">
        <p className="font-lilitaone text-xl">DRAW</p>
        <p className="font-bold text-sm">{deckSize} Cards</p>
      </div>
    </div>
  );
}
