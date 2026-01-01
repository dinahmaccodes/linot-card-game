import React from "react";
import GameButton from "./GameButton";

interface DrawPileProps {
  deckSize: number;
  onDraw: () => void;
}

export default function DrawPile({ deckSize, onDraw }: DrawPileProps) {
  return (
    <div className="flex flex-col items-center absolute bottom-70 gap-1.5">
      <div>
        <img src="/drawcard.svg" alt="drawcard" />
      </div>
      <GameButton onClick={onDraw} backgroundColor="#E65150">
        Draw Pile ({deckSize})
      </GameButton>
    </div>
  );
}
