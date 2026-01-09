import React from "react";
import Card from "./Card";
import { X } from "lucide-react";

interface SpecialCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string; // e.g., "Pick 2!!", "General Market!!", "Hold On!!"
  message: string; // e.g., "Oh no they played an action card! you have to pick 2"
  cardSuit?: "CIRCLE" | "CROSS" | "TRIANGLE" | "SQUARE" | "STAR" | "WHOT";
  cardValue?: number;
  isGeneralMarket?: boolean; // If true, show drawcard.svg instead of card
  buttonText?: string; // Deprecated - using X button now
  onAccept?: () => void;
}

export default function SpecialCardModal({
  isOpen,
  onClose,
  title,
  message,
  cardSuit = "CIRCLE",
  cardValue = 2,
  isGeneralMarket = false,
  onAccept,
}: SpecialCardModalProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    if (onAccept) {
      onAccept();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center mt-30">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0101010D]/40 backdrop-blur-[3px]"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10">
        <img
          src="/water-bubbles.svg"
          className="absolute z-0 top-0 left-27.5 animate-bubbles animation-delay-2000 pointer-events-none"
          alt=""
        />
        <div
          className="relative rounded-3xl shadow-2xl z-10"
          style={{
            width: "515px",
            height: "615px",
            padding: "24px",
            background:
              "linear-gradient(191.22deg, #64EAFB 33.3%, #73EBFB 44.03%, #85EDFC 56.54%)",
            backdropFilter: "blur(300px)",
          }}
        >
          {/* Close Button (X) at top-right */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 z-50 text-[#01626F] hover:bg-white/20 rounded-full p-2 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-8 h-8" strokeWidth={3} />
          </button>

          {/* Content */}
          <div
            className="relative z-10 flex flex-col items-center mt-20"
            style={{ gap: "27px" }}
          >
            {/* Title */}
            <h2 className="text-5xl font-lilitaone text-[#01626F] drop-shadow-md">
              {title}
            </h2>

            {/* Message */}
            <p className="text-2xl text-[#01626F] text-center font-satoshi max-w-sm ">
              {message}
            </p>

            {/* Card/Image Display */}
            <div className="my-4 transform scale-110 z-20">
              {isGeneralMarket ? (
                <img
                  src="/drawcard.svg"
                  alt="Draw Pile"
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <Card suit={cardSuit} value={cardValue} isPlayable={false} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
