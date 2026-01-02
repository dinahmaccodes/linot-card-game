"use client";
import React from "react";
import { PlayerView } from "../lib/types";
import { ChevronDown } from "lucide-react";
import { useUserProfile } from "@/lib/UserProfileContext";

interface GamePlayersTabProps {
  playerNumber: 1 | 2;
  gameState: PlayerView;
}

export default function GamePlayersTab({
  playerNumber,
  gameState,
}: GamePlayersTabProps) {
  const { userProfile } = useUserProfile();
  const currentPlayerName = userProfile?.username || `Player ${playerNumber}`;

  return (
    <div className="w-80 bg-transparent rounded-lg p-4 shadow-lg text-[#01626F] border border-[#B8F7FF] ">
      <div className="flex justify-between px-5">
        <h3 className="font-bold mb-2">Players</h3>
        <ChevronDown />
      </div>
      <div className="bg-[#B8F7FF0D] px-4 pt-5 pb-10  border-t border-[#B8F7FF]">
        <div className="flex justify-between px-3 border-[0.4px] py-4 border-[#D0EEF5] rounded-2xl">
          <span>{currentPlayerName} (you)</span>
          <span>{gameState.myCardCount} cards</span>
        </div>
        <div className="border-b border-[#F9F9F9] rounded-br-xl rounded-bl-xl px-3 pb-5 space-y-4 mt-5">
          {gameState.opponents.map((opp, idx) => (
            <div key={idx} className="flex justify-between text-gray-600">
              <span>{opp.nickname} (opponent)</span>
              <span>{opp.cardCount} cards</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
