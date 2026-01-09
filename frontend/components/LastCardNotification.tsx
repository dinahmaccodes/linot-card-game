"use client";

import React, { useEffect, useState } from "react";

interface LastCardNotificationProps {
  opponentName: string;
  opponentHandSize: number;
  previousOpponentHandSize: number;
}

export default function LastCardNotification({
  opponentName,
  opponentHandSize,
  previousOpponentHandSize,
}: LastCardNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [hasShownForCurrentState, setHasShownForCurrentState] = useState(false);

  useEffect(() => {
    // Show notification when opponent reaches exactly 1 card
    if (
      opponentHandSize === 1 &&
      previousOpponentHandSize > 1 && // Just went from >1 to 1
      !hasShownForCurrentState // Haven't shown notification for this state yet
    ) {
      console.log("[LastCardNotification] Opponent has 1 card left:", {
        opponentName,
        opponentHandSize,
        previousOpponentHandSize,
      });

      setShowNotification(true);
      setHasShownForCurrentState(true);
    }

    // Reset flag when hand size changes from 1
    if (opponentHandSize !== 1) {
      setHasShownForCurrentState(false);
    }
  }, [
    opponentHandSize,
    previousOpponentHandSize,
    hasShownForCurrentState,
    opponentName,
  ]);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  if (!showNotification) return null;

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-shake">
      <div
        className="relative rounded-2xl shadow-2xl backdrop-blur-sm"
        style={{
          background: "linear-gradient(135deg, #E23A2F 0%, #C62828 50%, #B71C1C 100%)",
          border: "3px solid #6AE4F8",
          animation: "glow-pulse 2s ease-in-out infinite",
        }}
      >
        {/* Content */}
        <div className="relative flex items-center gap-6 px-8 py-5">
          {/* Card Icon */}
          <img
            src="/lastcard.svg"
            alt="Last Card"
            className="w-16 h-20 filter drop-shadow-lg"
          />
          
          {/* Text Content */}
          <div>
            <p className="font-lilitaone text-2xl text-white drop-shadow-lg tracking-wide">
              LAST CARD WARNING!
            </p>
            <p className="text-lg text-white/90 mt-1 font-satoshi font-bold">
              {opponentName} has only 1 card left!
            </p>
            <p className="text-sm text-cyan-200 mt-1 font-satoshi">
              Watch out! They're about to win!
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translate(-50%, 0) translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-50%, 0) translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translate(-50%, 0) translateX(5px); }
        }
        
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(106, 228, 248, 0.5); }
          50% { box-shadow: 0 0 40px rgba(106, 228, 248, 1); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
