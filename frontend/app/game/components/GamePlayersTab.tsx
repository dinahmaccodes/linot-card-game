import ChevronDown from "@/svg/ChevronDown";
import { motion, AnimatePresence } from "framer-motion";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import BetButton from "./BetButton";
import { PlayerView } from "@/lib/types";

interface GamePlayersTabProps {
  playerNumber: 1 | 2;
  gameState: PlayerView;
}

function GamePlayersTab({ playerNumber, gameState }: GamePlayersTabProps) {
  const [isPlayersShow, setIsPlayersShow] = useState(true);

  return (
    <div className="p-3 pt-8 rounded-lg border border-[#F9F9F9] min-w-[272px] text-[#01626F] bg-[#F9F9F903] space-y-[50px]">
      <div
        className={`grid overflow-hidden rounded-lg transition-all duration-300`}
      >
        <button
          onClick={() => setIsPlayersShow((prev) => !prev)}
          className="flex w-full items-center justify-between focus:outline-none text-[#01626F]"
          aria-expanded={isPlayersShow}
        >
          <h3 className={`text-left text-lg font-lilitaone`}>Players</h3>
          <ChevronDown
            className={`transition-transform duration-300 ${
              isPlayersShow ? "rotate-180" : "rotate-0 "
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {isPlayersShow && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-1.5 overflow-hidden"
            >
              <div
                className="p-3 space-y-3 bg-[#B8F7FF0D] border-y border-[#B8F7FF]"
                style={{
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  boxShadow: `
    0px  4px  9px 0px rgba(249, 249, 249, 0.23),
    0px -3px 10px 0px rgba(255, 255, 255, 0.25)
  `,
                }}
              >
                {/* Current Player (You) */}
                <div
                  className="py-1 px-2 rounded-2xl border-[0.4px] border-[#D0EEF5] flex justify-between gap-x-6 items-center"
                  style={{
                    boxShadow: `
    4px  2px 5px 0px rgba(255, 255, 255, 0.25) inset,
    1px -2px 5px 0px rgba(255, 255, 255, 0.3) inset
  `,
                  }}
                >
                  <div className="flex items-center gap-x-1.5">
                    <div className="w-[37px] h-[37px] rounded-full border-[0.8px] border-[#88D0E1]">
                      <img src="/user-pfp.svg" alt="" />
                    </div>
                    <h4 className="font-satoshi font-medium flex items-center gap-x-1.5 font-bold">
                      Player {playerNumber} <span>(You)</span>
                    </h4>
                  </div>

                  <div className="flex items-center gap-x-1">
                    <img src="/coin.svg" className="w-[15px] h-[15px]" alt="" />
                    <h4 className="font-lilitaone text-xl font-bold">1000</h4>
                  </div>
                </div>

                {/* Opponents */}
                {gameState.opponents.map((opp, idx) => (
                    <div
                    key={idx}
                    className="py-1 px-2 rounded-2xl border-[0.4px] border-[#D0EEF5] flex justify-between gap-x-6 items-center opacity-80"
                    style={{
                        boxShadow: `
        4px  2px 5px 0px rgba(255, 255, 255, 0.25) inset,
        1px -2px 5px 0px rgba(255, 255, 255, 0.3) inset
    `,
                    }}
                    >
                    <div className="flex items-center gap-x-1.5">
                        <div className="w-[37px] h-[37px] rounded-full border-[0.8px] border-[#88D0E1]">
                        <img src="/user-pfp.svg" alt="" />
                        </div>
                        <h4 className="font-satoshi font-medium flex items-center gap-x-1.5 font-bold">
                        {opp.nickname} <span>(Opp)</span>
                        </h4>
                    </div>

                    <div className="flex items-center gap-x-1">
                        <img src="/coin.svg" className="w-[15px] h-[15px]" alt="" />
                        <h4 className="font-lilitaone text-xl font-bold">800</h4>
                    </div>
                    </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <div className="flex w-full items-center justify-between focus:outline-none text-[#01626F] mb-1.5">
          <h3 className={`text-left text-lg font-lilitaone`}>Active bets</h3>
          <div className="flex gap-x-2 items-center font-satoshi">
            <h4 className="text-xs">(add a bet)</h4>
            <button>
              <CirclePlus size={24} />
            </button>
          </div>
        </div>

        <div
          className="px-3 py-6 rounded-lg bg-[#8CF2FF0A] border-y border-[#B8F7FF0D] grid grid-cols-1 gap-y-5 divide-[#B8F7FF80]"
          style={{
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            boxShadow: `
    0px  4px  9px 0px rgba(249, 249, 249, 0.28),
    0px -3px 10px 0px rgba(255, 255, 255, 0.28)
  `,
          }}
        >
          <div>
            <h3 className="mb-2 font-satoshi">Your Bets:</h3>
            <div className="grid grid-cols-4 gap-x-2">
              <BetButton value={"25"} />
              <BetButton value={"18"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePlayersTab;
