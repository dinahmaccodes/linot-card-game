"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LiveChat from "../../components/LiveChat";
import Timer from "../../components/Timer";
import GamePlayersTab from "../../components/GamePlayersTab";
import DrawPile from "../../components/DrawPile";
import PlayerTwo from "../../components/PlayerTwo";
import PlayerOne from "../../components/PlayerOne";
import { useWhotGame } from "../../hooks/useWhotGame";
import { OpponentView } from "../../lib/types";

function GameClient() {
  const searchParams = useSearchParams();
  const playerNumberParam = searchParams.get("player");
  const playerNumber = (playerNumberParam === "2" ? 2 : 1) as 1 | 2;

  const { gameState, loading, error, joinGame, startGame, playCard, drawCard, callLastCard } = useWhotGame(playerNumber);
  const [username, setUsername] = useState<string>("");
  const [maxPlayers, setMaxPlayers] = useState<number>(2);

  useEffect(() => {
    const storedProfile = localStorage.getItem(`whot_player_profile_${playerNumber}`);
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        if (profile.username) {
          setUsername(profile.username);
        }
        if (profile.maxPlayers) {
          setMaxPlayers(profile.maxPlayers);
        }
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
  }, [playerNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#77F0FC]">
        <p className="text-3xl font-lilitaone text-[#01626F] animate-pulse">Loading game...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-[#77F0FC]">
        <p className="text-2xl text-red-600 font-bold">Connection Error</p>
        <p className="text-[#01626F]">{error.message}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#0FB6C6] text-white rounded-lg">Retry</button>
      </div>
    );
  }

  // 1. Join Screen
  if (!gameState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#77F0FC] to-[#19D3F9]">
         <div className="bg-white/30 backdrop-blur-md p-10 rounded-2xl shadow-xl flex flex-col items-center gap-6 border border-white/50">
            <h1 className="text-4xl font-lilitaone text-[#01626F]">Welcome {username || `Player ${playerNumber}`}</h1>
            {playerNumber === 1 ? (
              <>
                <p className="text-[#01626F] text-lg text-center">
                  Create a new game for {maxPlayers} players
                </p>
                <button 
                  onClick={() => joinGame(username || `Player ${playerNumber}`, maxPlayers)}
                  className="px-8 py-4 bg-[#EA463D] hover:bg-[#d63a32] text-white text-2xl font-lilitaone rounded-full shadow-lg transform transition active:scale-95"
                >
                  Create Game ({maxPlayers} Players)
                </button>
              </>
            ) : (
              <>
                <p className="text-[#01626F] text-lg text-center">
                  Join an existing game created by Player 1.
                </p>
                <button 
                  onClick={() => joinGame(username || `Player ${playerNumber}`, maxPlayers)}
                  className="px-8 py-4 bg-[#EA463D] hover:bg-[#d63a32] text-white text-2xl font-lilitaone rounded-full shadow-lg transform transition active:scale-95"
                >
                  Join Game
                </button>
              </>
            )}
         </div>
      </div>
    );
  }

  // 2. Waiting Screen (Status check: Case-insensitive)
  const status = gameState.status.toUpperCase();
  if (status === "WAITING") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#77F0FC] to-[#19D3F9]">
         <div className="bg-white/30 backdrop-blur-md p-10 rounded-2xl shadow-xl flex flex-col items-center gap-6 w-[500px]">
            <h1 className="text-4xl font-lilitaone text-[#01626F]">Lobby</h1>
            <div className="w-full bg-white/50 rounded-lg p-4">
              <h2 className="text-xl font-bold text-[#01626F] mb-2">Players Joined:</h2>
              <ul className="space-y-2">
                {gameState.opponents.map((opp: OpponentView, idx: number) => (
                  <li key={idx} className="flex justify-between items-center text-[#01626F]">
                    <span>{opp.nickname || "Unknown"}</span>
                    <span className="bg-green-400 text-white text-xs px-2 py-1 rounded-full">Ready</span>
                  </li>
                ))}
                <li className="flex justify-between items-center text-[#01626F] font-bold">
                  <span>You (Player {playerNumber})</span>
                   <span className="bg-green-400 text-white text-xs px-2 py-1 rounded-full">Ready</span>
                </li>
              </ul>
            </div>
            
            {playerNumber === 1 ? (
              <button 
                onClick={() => startGame()}
                disabled={gameState.opponents.length < 1}
                className={`px-8 py-4 text-white text-2xl font-lilitaone rounded-full shadow-lg transform transition ${
                  gameState.opponents.length < 1 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#EA463D] hover:bg-[#d63a32] active:scale-95"
                }`}
              >
                Start Match
              </button>
            ) : (
               <div className="text-center">
                 <p className="text-lg text-[#01626F] animate-pulse font-bold">Waiting for host to start...</p>
               </div>
            )}
         </div>
      </div>
    );
  }

  // 3. Game Board (In Progress or Finished)
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex gap-x-[50px] px-5 bg-gradient-to-b from-[#77F0FC] to-[#19D3F9]">
      <div className="space-y-12 pt-10">
        <LiveChat />
        <Timer />
      </div>
      <div className="flex-1 space-y-20 pt-10">
        <PlayerTwo 
          opponent={gameState.opponents[0]} 
          topCard={gameState.topCard}
        />
        <img src="/middle-cards.png" className="mx-auto" alt="" />
        <PlayerOne 
          myCards={gameState.myCards}
          isMyTurn={gameState.currentPlayerIndex === (playerNumber - 1)}
          onPlayCard={(index: number) => playCard(index)}
          onDrawCard={drawCard}
          onCallLastCard={callLastCard}
        />
      </div>
      <div className="space-y-[46px]">
        <GamePlayersTab 
          playerNumber={playerNumber as 1 | 2}
          gameState={gameState}
        />
        <DrawPile 
          deckSize={gameState.deckSize}
          onDraw={drawCard}
        />
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#77F0FC]">
        <p className="text-3xl font-lilitaone text-[#01626F] animate-pulse">Loading...</p>
      </div>
    }>
      <GameClient />
    </Suspense>
  );
}
