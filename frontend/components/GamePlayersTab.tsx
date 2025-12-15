import React from "react";
import { PlayerView } from "../lib/types";

interface GamePlayersTabProps {
  playerNumber: 1 | 2;
  gameState: PlayerView;
}

export default function GamePlayersTab({ playerNumber, gameState }: GamePlayersTabProps) {
  return (
    <div className="w-64 bg-white/80 rounded-lg p-4 shadow-lg text-[#01626F]">
       <h3 className="font-bold mb-2">Players</h3>
       <div className="flex justify-between">
          <span>You (P{playerNumber})</span>
          <span>{gameState.myCardCount} cards</span>
       </div>
       {gameState.opponents.map((opp, idx) => (
         <div key={idx} className="flex justify-between text-gray-600">
            <span>{opp.nickname}</span>
            <span>{opp.cardCount} cards</span>
         </div>
       ))}
    </div>
  );
}
