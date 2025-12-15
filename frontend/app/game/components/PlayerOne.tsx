import React from "react";
import { Card as WhotCard } from "@/lib/types";

interface PlayerOneProps {
  myCards: WhotCard[];
  isMyTurn: boolean;
  onPlayCard: (index: number) => void;
  onDrawCard: () => void;
  onCallLastCard: () => void;
}

function PlayerOne({ myCards, isMyTurn, onPlayCard, onDrawCard, onCallLastCard }: PlayerOneProps) {
  // Get username from localStorage for display
  const [username, setUsername] = React.useState("You");
  
  React.useEffect(() => {
    try {
        const stored = localStorage.getItem("whot_player_profile");
        if (stored) {
            const profile = JSON.parse(stored);
            if (profile.username) setUsername(`${profile.username} (You)`);
        }
    } catch (e) {}
  }, []);

  return (
    <div className={`flex gap-x-5 items-center ${isMyTurn ? "ring-4 ring-[#E65150] rounded-xl p-2 transition-all" : "opacity-80"}`}>
      <div className="flex flex-col items-center">
        <div className="flex">
          <div className="w-[57px] h-[57px] border-[1.2px] border-[#88D0E1] rounded-full  z-10 overflow-hidden bg-white">
            <img src="/user-pfp.svg" className="w-full h-full" />
          </div>
          <div
            className="py-1 px-[17px] pl-[31px] -ml-7 bg-[#F9F9F905] pr-[30px] w-[180px] border-[0.4px] border-[#D0EEF5] rounded-[10px]"
            style={{
              boxShadow: `
    -2px  -2.99px 6.98px 0px rgba(255, 255, 255, 0.3) inset,
     5.99px 2.99px 6.98px 0px rgba(255, 255, 255, 0.3) inset
  `,
              backdropFilter: "blur(600px)",
              WebkitBackdropFilter: "blur(600px)",
            }}
          >
            <div className="text-left w-[110px] space-y-1">
              <h3 className="font-satoshi text-[#F9F9F9CC] text-base/5 flex items-center gap-x-1 justify-start font-medium truncate">
                {username}
              </h3>
              <div className="text-right flex justify-start items-center gap-x-1 text-[#F9F9F9]">
                <button 
                    onClick={onCallLastCard}
                    className="text-xs bg-yellow-500 px-2 py-0.5 rounded-full hover:bg-yellow-400"
                >
                    Call Last Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-x-2 flex-1 overflow-x-auto pb-2">
        {myCards.map((card, idx) => (
            <div key={idx} onClick={() => isMyTurn && onPlayCard(idx)} className="cursor-pointer hover:-translate-y-2 transition-transform">
                <Card card={card} />
            </div>
        ))}
      </div>
    </div>
  );
}

function Card({ card }: { card: WhotCard }) {
  // Simple mapping for shapes if needed, or just display raw
  return (
    <div className="p-[0.7px] rounded-[14px] overflow-hidden bg-[linear-gradient(155.21deg,#AE2C21_13.44%,rgba(68,52,47,0)_38.7%,#AE2C21_92.32%)]">
      <div className="aspect-2/3 min-w-[80px] bg-[#111010] rounded-[14px] flex flex-col justify-center items-center p-2">
        <h4 className="text-[24px] text-[#F9F9F9] font-lilitaone">{card.value}</h4>
        <div className="text-xs text-white/70 uppercase">{card.suit}</div>
      </div>
    </div>
  );
}
export default PlayerOne;
