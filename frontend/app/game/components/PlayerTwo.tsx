import { Card as WhotCard, OpponentView } from "@/lib/types";

interface PlayerTwoProps {
  opponent: OpponentView;
  topCard: WhotCard | null;
}

function PlayerTwo({ opponent, topCard }: PlayerTwoProps) {
  if (!opponent) return <div className="text-white">Waiting for opponent...</div>;

  return (
    <div className={`px-[26px] flex gap-x-3 items-center ${opponent.isActive ? "opacity-100" : "opacity-50"}`}>
      <div className="grid grid-cols-6 gap-x-2 flex-1 justify-items-center">
        {/* Render opponent cards as backs */}
        {Array.from({ length: Math.min(opponent.cardCount, 8) }).map((_, i) => (
             <CardBack key={i} />
        ))}
        {opponent.cardCount > 8 && <div className="text-white font-bold flex items-center">+{opponent.cardCount - 8}</div>}
      </div>
      <div className="flex flex-col items-center">
        <div className="flex">
          <div
            className="py-1 px-[17px] bg-[#DD7496] pr-[30px] w-[180px] border-[0.4px] border-[#D0EEF5] rounded-[10px]"
            style={{
              boxShadow: `
    -2px  -2.99px 6.98px 0px rgba(255, 255, 255, 0.3) inset,
     5.99px 2.99px 6.98px 0px rgba(255, 255, 255, 0.3) inset
  `,
              backdropFilter: "blur(498.86px)",
              WebkitBackdropFilter: "blur(498.86px)",
            }}
          >
            <div className="text-left w-[110px] space-y-1">
              <h3 className="font-satoshi text-[#F9F9F9CC] text-base/5 flex items-center gap-x-1 justify-end font-medium truncate">
                {opponent.nickname}
              </h3>
              <h4 className="text-right flex justify-end items-center gap-x-1 text-[#F9F9F9]">
                <span className="text-xs">{opponent.cardCount} Cards</span>
              </h4>
            </div>
          </div>
          <div className="w-[57px] h-[57px] border-[1.23px] border-[#DD7496] rounded-full -ml-7 z-10 overflow-hidden bg-white">
            <img src="/user-pfp.svg" className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CardBack() {
  return (
    <div className="w-[50px] mx-1 p-[0.7px] rounded-[8px] overflow-hidden bg-[linear-gradient(155.21deg,#AE2C21_13.44%,rgba(68,52,47,0)_38.7%,#AE2C21_92.32%)]">
      <div className="aspect-2/3 bg-[#111010] rounded-[8px] flex justify-center items-center">
        <div className="w-1/2 h-1/2 bg-red-900/50 rounded-full"></div>
      </div>
    </div>
  );
}

export default PlayerTwo;
