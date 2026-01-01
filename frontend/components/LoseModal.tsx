import React from "react";
import GameButton from "./GameButton";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-[500px] rounded-3xl p-8 shadow-2xl"
        style={{
          background: "linear-gradient(180deg, #FC7777 0%, #F91919 100%)",
          border: "3px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        {/* Decorative bubbles */}
        <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 blur-sm" />
        <div className="absolute top-12 right-8 w-6 h-6 rounded-full bg-white/15 blur-sm" />
        <div className="absolute bottom-8 left-12 w-10 h-10 rounded-full bg-white/10 blur-sm" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Title */}
          <h1 className="text-6xl font-lilitaone text-white drop-shadow-lg">
            you lose
          </h1>

          {/* Sad emoji */}
          <div className="text-8xl">😢</div>

          {/* Reason */}
          <p className="text-xl font-satoshi text-white/90 text-center">
            {reason}
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-white/30 my-2" />

          {/* Encouragement */}
          <p className="text-lg font-satoshi text-white/80 text-center">
            Don't give up! Try again and win next time! 💪
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full mt-4">
            <GameButton
              onClick={onReplay}
              backgroundColor="#01626F"
              width="w-full"
              customShadow="-1.4px -2.1px 4.89px 0px rgba(1, 98, 111, 0.8) inset, 4.19px 2.1px 4.89px 0px rgba(119, 240, 252, 0.25) inset"
            >
              replay 🔄
            </GameButton>
            <GameButton
              onClick={onLobby}
              backgroundColor="#4ADE80"
              width="w-full"
              customShadow="-1.4px -2.1px 4.89px 0px rgba(34, 197, 94, 0.8) inset, 4.19px 2.1px 4.89px 0px rgba(134, 239, 172, 0.25) inset"
            >
              lobby 🏠
            </GameButton>
          </div>
        </div>
      </div>
    </div>
  );
}
