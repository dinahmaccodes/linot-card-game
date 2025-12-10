"use client";
import React, { useState } from "react";
import LiveChat from "../components/LiveChat";
import Timer from "../components/Timer";
import GamePlayersTab from "../components/GamePlayersTab";
import DrawPile from "../components/DrawPile";
import PlayerTwo from "../components/PlayerTwo";
import PlayerOne from "../components/PlayerOne";
import { Card, GameState } from "@/lib/types";
import { drawFromPile, playCard, startGame } from "@/lib/gameEngine";

function page() {
  const [state, setState] = useState<GameState | null>(null);

  function handleStartGame() {
    const newGame = startGame();
    setState(newGame);
  }

  function handleDraw() {
    if (!state) return;
    const next = drawFromPile(state, "P1");
    setState(next);
  }

  function handlePlay(player: "P1" | "P2", card: Card) {
    if (!state) return;
    const next = playCard(state, player, card);
    setState(next);
  }

  if (!state?.gameStarted) {
    return <button onClick={handleStartGame}>Start Game</button>;
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex gap-x-[50px] px-5">
      <div className="space-y-12">
        <LiveChat />
        <Timer />
      </div>
      <div className="flex-1 space-y-20">
        {/* <PlayerTwo hand={state.playerTwoHand} /> */}
        <img src="/middle-cards.png" className="mx-auto" alt="" />
        {/* <PlayerOne hand={state.playerOneHand} /> */}
      </div>
      <div className="space-y-[46px]">
        <GamePlayersTab />
        <DrawPile pile={state.pile} onDraw={handleDraw} />
      </div>
    </div>
  );
}

export default page;
