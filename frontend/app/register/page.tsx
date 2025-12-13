"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWhotGame } from "@/hooks/useWhotGame";

export default function RegisterPage() {
  const router = useRouter();
  const { joinGame, playerNumber } = useWhotGame();
  
  const [nickname, setNickname] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    if (!nickname.trim()) {
      setError("Please enter a nickname");
      return;
    }

    // Clear old cached data
    localStorage.clear();

    setIsJoining(true);
    setError(null);

    try {
      console.log(`Joining game as ${nickname}...`);
      await joinGame(nickname.trim());
      console.log("✓ Successfully joined game");
      
      // Wait a bit for state to sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use hard redirect to ensure page loads
      window.location.href = `/game/${playerNumber}`;
    } catch (err: any) {
      console.error("Failed to join:", err);
      setError(err.message || "Failed to join game. Please try again.");
      setIsJoining(false);
    }
  };

  return (
    <main
      className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(180deg, #77F0FC 0%, #19D3F9 100%)",
      }}
    >
      {/* Background decorations */}
      <img
        src="/water-bubbles.svg"
        className="absolute z-3 top-0 left-[150px] animate-bubbles animation-delay-2000"
        alt=""
      />
      <img src="/sea-walls.png" className="absolute z-3 top-0 left-0" alt="" />
      <img
        src="/reflection-lights.svg"
        className="absolute z-3 top-0 left-0 animate-shimmer"
        alt=""
      />

      {/* Main content */}
      <div className="relative z-20 bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-2 border-[#D0EEF5]"
        style={{
          boxShadow: "0px -3px 4px 0px #FFFFFF40, -3px 0px 4px 0px #FFFFFF40",
        }}
      >
        <h1 className="text-4xl font-bold text-center mb-2 text-[#01626F] font-lilitaone">
          Join Game
        </h1>
        <p className="text-center text-[#6CA0A7] mb-6 text-lg">
          Player {playerNumber}
        </p>

        <div className="mb-6">
          <label className="block text-[#01626F] font-semibold mb-2 text-lg font-lilitaone">
            Enter your nickname:
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isJoining && handleJoin()}
            placeholder="e.g., CardMaster"
            className="w-full px-4 py-3 border-2 border-[#D0EEF5] bg-[#B8F7FF03] rounded-lg focus:outline-none focus:border-[#0FB6C6] text-lg text-[#01626F] placeholder:text-[#6CA0A7]"
            disabled={isJoining}
            maxLength={20}
            autoFocus
            style={{
              boxShadow: "4px 2px 5px 0px #FFFFFF40 inset, 1px -2px 5px 0px #FFFFFF4D inset",
            }}
          />
          <p className="text-xs text-[#6CA0A7] mt-1">Max 20 characters</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleJoin}
          disabled={isJoining || !nickname.trim()}
          className="w-full bg-[#0FB6C6] hover:bg-[#0DA5B5] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors font-lilitaone"
          style={{
            boxShadow: "2.65px 1.33px 3.1px 0px #6CEDFC40 inset",
          }}
        >
          {isJoining ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Joining...
            </span>
          ) : (
            "Join Game"
          )}
        </button>
      </div>

      {/* Bottom decoration */}
      <div
        className="absolute bottom-0 w-full h-[150px] z-10 rounded-t-[50%]"
        style={{
          background:
            "linear-gradient(180deg, #D4FEBC -13.12%, #85F0D9 21.68%, #19E2D5 100%)",
          boxShadow: "0px 12px 18px 0px #E8FABC inset",
        }}
      ></div>
    </main>
  );
}
