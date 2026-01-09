import React from "react";
import GameButton from "./GameButton";
import { House, RotateCcw, Star } from "lucide-react";

interface LoseModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
  onReplay?: () => void;
  onLobby?: () => void;
}

export default function LoseModal({
  isOpen,
  onClose,
  reason = "Your opponent won!",
  onReplay,
  onLobby,
}: LoseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center mt-27 ">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0101010D] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="z-20">
        <img
          src="lossbanner.svg"
          alt=""
          className="w-160 h-160 z-30 absolute -top-5 left-1/2 -translate-x-1/2"
        />
        {/* Modal */}
        <div className="border-5 rounded-4xl">
          <div
            className="relative w-[500px] rounded-3xl p-8 shadow-2xl border-10 backdrop-blur-[300px] border-[#6AE4F8] "
            style={{
              background: "rgba(34, 186, 206, 1)",
            }}
          >
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-25">
              {/* Clear Time Badge */}
              {/* <div
                className=" z-5 -mt-10  px-6 py-4  rounded-bl-3xl rounded-br-3xl font-lilitaone text-white text-lg border"
                style={{
                  background: "rgba(39, 159, 175, 1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <p className="mt-10">ran out of time</p>
              </div> */}
              {/* Stars - Empty/Outlined - Overlapping arrangement */}
              <div
                className="relative flex justify-center items-center mt-16 w-full"
                style={{ height: "200px" }}
              >
                {/* Left star */}
                <img
                  src="/empstar.svg"
                  alt="Empty Star"
                  className="absolute"
                  style={{
                    width: "125px",
                    height: "125px",
                    left: "calc(50% - 200px)",
                    zIndex: 10,
                  }}
                />
                {/* Center star (on top) */}
                <img
                  src="/empstar.svg"
                  alt="Empty Star"
                  className="absolute "
                  style={{
                    width: "125px",
                    height: "125px",
                    left: "calc(50% - 70px)",
                    top: "calc(50% - 40px)",
                    zIndex: 20,
                  }}
                />
                {/* Right star */}
                <img
                  src="/empstar.svg"
                  alt="Empty Star"
                  className="absolute "
                  style={{
                    width: "125px",
                    height: "125px",
                    left: "calc(50% - -60px)",
                    zIndex: 10,
                  }}
                />
              </div>
              {/* Divider */}
              {/* <div className="w-full h-px bg-white/30 my-2" /> */}
              {/* Coins Earned */}
              {/* <div className="text-center">
              <h2 className="text-4xl font-lilitaone text-white drop-shadow-md">
                +{coinsEarned} Coins Earned!
              </h2>
            </div> */}
              {/* Stats */}
              {/* <div className="flex gap-4 w-full">
              <div
                className="flex-1 px-4 py-3 rounded-xl text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <p className="text-sm font-satoshi text-white/80">
                  Beat the time
                </p>
                <p className="text-xl font-lilitaone text-white">
                  +{beatTheTime ? "20" : "0"} 💰
                </p>
              </div>
              <div
                className="flex-1 px-4 py-3 rounded-xl text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <p className="text-sm font-satoshi text-white/80">
                  Played {specialCardsPlayed} special cards
                </p>
                <p className="text-xl font-lilitaone text-white">+10 💰</p>
              </div>
            </div> */}
              {/* Action Buttons */}
              <div className="flex gap-4 w-full ">
                <GameButton
                  onClick={onReplay}
                  backgroundColor="#01626F"
                  width="w-full"
                  customShadow="-1.4px -2.1px 4.89px 0px rgba(1, 98, 111, 0.8) inset, 4.19px 2.1px 4.89px 0px rgba(119, 240, 252, 0.25) inset"
                >
                  <p className="flex gap-5">
                    <span>new game</span> <RotateCcw />
                  </p>
                </GameButton>
                <GameButton
                  onClick={onLobby}
                  backgroundColor="#52AD6D"
                  width="w-full"
                  customShadow="-1.4px -2.1px 4.89px 0px rgba(34, 197, 94, 0.8) inset, 4.19px 2.1px 4.89px 0px rgba(134, 239, 172, 0.25) inset"
                >
                  <p className="flex gap-5">
                    <span> lobby </span> <House />
                  </p>
                </GameButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
