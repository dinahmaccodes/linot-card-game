import React from "react";
import { Card as CardType } from "../lib/types";
import Card from "./Card";
import GameButton from "./GameButton";
import UserBar from "./UserBar";

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
      <div className="flex items-center">
        <div className="mt-15">
          <UserBar />
        </div>
        <div
          className="flex justify-center items-end ml-15"
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
                  card.suit as
                    | "CIRCLE"
                    | "TRIANGLE"
                    | "CROSS"
                    | "STAR"
                    | "SQUARE"
                }
                value={card.value}
                onClick={() => onPlayCard(idx)}
                isPlayable={isMyTurn}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-10">
        <div>
          <GameButton
            backgroundColor={isMyTurn ? "#111010" : "#0FB6C640"}
            customShadow={isMyTurn ? "-1.24px -1.86px 4.34px 0px rgba(44, 40, 40, 0.3) inset, 3.72px 1.86px 4.34px 0px rgba(45, 43, 43, 0.1) inset" : "-1.24px -1.86px 4.34px 0px #269DB2 inset, 3.72px 1.86px 4.34px 0px #6AE9FF40 inset"}
            backdropBlur="blur(309.74px)"
            width="w-250"
            disabled={!isMyTurn}
          >
            Action Card
          </GameButton>
        </div>
        <div className="flex gap-5 items-center mt-2">
          <GameButton
            backgroundColor={isMyTurn ? "#0FB6C6" : "#0FB6C640"}
            customShadow={isMyTurn ? "-1.24px -1.86px 4.34px 0px rgba(38, 157, 178, 1) inset, 3.72px 1.86px 4.34px 0px rgba(106, 233, 255, 0.25) inset" : "-1.24px -1.86px 4.34px 0px #269DB2 inset, 3.72px 1.86px 4.34px 0px #6AE9FF40 inset"}
            backdropBlur="blur(309.74px)"
            width="w-80"
            disabled={!isMyTurn}
          >
            Special move!!
          </GameButton>
          <GameButton
            backgroundColor={isMyTurn ? "#0FB6C6" : "#0FB6C640"}
            customShadow={isMyTurn ? "-1.24px -1.86px 4.34px 0px rgba(38, 157, 178, 1) inset, 3.72px 1.86px 4.34px 0px rgba(106, 233, 255, 0.25) inset" : "-1.24px -1.86px 4.34px 0px #269DB2 inset, 3.72px 1.86px 4.34px 0px #6AE9FF40 inset"}
            backdropBlur="blur(309.74px)"
            width="w-80"
            disabled={!isMyTurn}
          >
            Ask for card?
          </GameButton>
          <GameButton
            backgroundColor="#111010" 
            customShadow={"-1.24px -1.86px 4.34px 0px rgba(44, 40, 40, 0.3) inset, 3.72px 1.86px 4.34px 0px rgba(45, 43, 43, 0.1) inset"}
            backdropBlur="blur(309.74px)"
            width="w-80"
          >
            Quit
          </GameButton>
        </div>
      </div>
    </div>
  );
}
