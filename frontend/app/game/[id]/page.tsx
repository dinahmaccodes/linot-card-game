"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LiveChat from "../components/LiveChat";
import Timer from "../components/Timer";
import GamePlayersTab from "../components/GamePlayersTab";
import DrawPile from "../components/DrawPile";
import PlayerTwo from "../components/PlayerTwo";
import PlayerOne from "../components/PlayerOne";
import { useWhotGame } from "@/hooks/useWhotGame";

function page() {
  const searchParams = useSearchParams();
  const playerParam = searchParams.get("player");
  const playerNumber = (playerParam === "2" ? 2 : 1) as 1 | 2;
  
  const { gameState, loading, error, playCard, drawCard, callLastCard } = useWhotGame(playerNumber);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-[#01626F]">Loading game...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-[#01626F]">No game state available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex gap-x-[50px] px-5">
      <div className="space-y-12">
        <LiveChat />
        <Timer />
      </div>
      <div className="flex-1 space-y-20">
        <PlayerTwo 
          opponent={gameState.opponents[0]} 
          topCard={gameState.topCard}
        />
        <img src="/middle-cards.png" className="mx-auto" alt="" />
        <PlayerOne 
          myCards={gameState.myCards}
          isMyTurn={gameState.currentPlayerIndex === (playerNumber - 1)}
          onPlayCard={(index) => playCard(index)}
          onDrawCard={drawCard}
          onCallLastCard={callLastCard}
        />
      </div>
      <div className="space-y-[46px]">
        <GamePlayersTab 
          playerNumber={playerNumber}
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

export default page;
