import React from "react";
import { Card as CardType } from "../lib/types";
import Card from "./Card";
import GameButton from "./GameButton";

interface PlayerOneProps {
  myCards: CardType[];
  isMyTurn: boolean;
  onPlayCard: (index: number) => void;
  onDrawCard: () => void;
  onCallLastCard: () => void;
}

export default function PlayerOne({
  myCards,
  isMyTurn,
  onPlayCard,
  onDrawCard,
  onCallLastCard,
}: PlayerOneProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {isMyTurn && (
        <div className="text-xl text-[#EA463D] font-bold animate-bounce">
          YOUR TURN!
        </div>
      )}

      {/* Card Hand */}
      <div
        className="flex justify-center items-end ml-20"
        style={{ minHeight: "160px" }}
      >
        {myCards.map((card, idx) => (
          <div
            key={idx}
            style={{
              marginLeft: idx > 0 ? "-35px" : "0",
              zIndex: idx,
            }}
          >
            <Card
              suit={
                card.suit as "CIRCLE" | "TRIANGLE" | "CROSS" | "STAR" | "SQUARE"
              }
              value={card.value}
              onClick={() => onPlayCard(idx)}
              isPlayable={isMyTurn}
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mb-10">
        <div>
          <GameButton
            backgroundColor="#111010"
            customShadow="-1.24px -1.86px 4.34px 0px rgba(44, 40, 40, 0.3) inset, 3.72px 1.86px 4.34px 0px rgba(45, 43, 43, 0.1) inset"
            backdropBlur="blur(309.74px)"
            width="w-220"
          >
            Action Card
          </GameButton>
        </div>
        <div className="flex gap-8 items-center mt-2">
          <GameButton
            backgroundColor="#0FB6C6"
            customShadow="-1.24px -1.86px 4.34px 0px rgba(38, 157, 178, 1) inset, 3.72px 1.86px 4.34px 0px rgba(106, 233, 255, 0.25) inset"
            backdropBlur="blur(309.74px)"
          >
            Special move
          </GameButton>
          <GameButton
            backgroundColor="#0FB6C6"
            customShadow="-1.24px -1.86px 4.34px 0px rgba(38, 157, 178, 1) inset, 3.72px 1.86px 4.34px 0px rgba(106, 233, 255, 0.25) inset"
            backdropBlur="blur(309.74px)"
          >
            Ask for card?
          </GameButton>
          <GameButton
            backgroundColor="#111010"
            customShadow="-1.24px -1.86px 4.34px 0px rgba(44, 40, 40, 0.3) inset, 3.72px 1.86px 4.34px 0px rgba(45, 43, 43, 0.1) inset"
            backdropBlur="blur(309.74px)"
          >
            Quit
          </GameButton>
        </div>
      </div>
    </div>
  );
}
