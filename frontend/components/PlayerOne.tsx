import React from "react";
import { Card } from "../lib/types";

interface PlayerOneProps {
  myCards: Card[];
  isMyTurn: boolean;
  onPlayCard: (index: number) => void;
  onDrawCard: () => void;
  onCallLastCard: () => void;
}

// Simple card mapping or placeholder
const getCardColor = (suit: string) => {
  switch (suit?.toUpperCase()) {
    case "CIRCLE": return "text-red-500";
    case "TRIANGLE": return "text-green-500";
    case "CROSS": return "text-blue-500";
    case "SQUARE": return "text-orange-500";
    case "STAR": return "text-purple-500"; // Whot usually
    default: return "text-black";
  }
};

export default function PlayerOne({ myCards, isMyTurn, onPlayCard, onDrawCard, onCallLastCard }: PlayerOneProps) {
  return (
    <div className="flex flex-col items-center gap-6">
       {isMyTurn && <div className="text-xl text-[#EA463D] font-bold animate-bounce">YOUR TURN!</div>}
       
       <div className="flex flex-wrap justify-center gap-[-40px]">
          {myCards.map((card, idx) => (
            <div 
              key={idx}
              onClick={() => isMyTurn && onPlayCard(idx)}
              className={`w-24 h-36 bg-white rounded-xl border-2 border-gray-200 shadow-xl flex flex-col items-center justify-center cursor-pointer hover:-translate-y-4 transition-transform ${!isMyTurn && 'opacity-70 cursor-not-allowed'}`}
              style={{ marginLeft: idx > 0 ? '-40px' : '0' }}
            >
               <span className={`text-3xl font-bold ${getCardColor(card.suit)}`}>{card.value}</span>
               <span className="text-xs text-gray-400">{card.suit}</span>
            </div>
          ))}
       </div>

       <div className="flex gap-4">
         <button 
           onClick={onCallLastCard}
           className="px-6 py-2 bg-[#EA463D] text-white rounded-full font-bold shadow-lg hover:bg-[#d63a32] transition"
         >
           LAST CARD!
         </button>
       </div>
    </div>
  );
}
