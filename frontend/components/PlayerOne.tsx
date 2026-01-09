"use client";
import React, { useState } from "react";
import { Card as CardType } from "../lib/types";
import Card from "./Card";
import GameButton from "./GameButton";
import UserBar from "./UserBar";
import SuitSelector from "./SuitSelector";
import CardModal from "./CardModal";
import RulesModal from "./RulesModal";

interface PlayerOneProps {
  myCards: CardType[];
  isMyTurn: boolean;
  topCard: CardType | null;
  activeDemandSuit: string | null;
  opponentName?: string;
  onPlayCard: (index: number, chosenSuit?: string) => void;
  onDrawCard: () => void;
  onCallLastCard: () => void;
}

export default function PlayerOne({
  myCards,
  isMyTurn,
  topCard,
  activeDemandSuit,
  opponentName,
  onPlayCard,
  onDrawCard,
  onCallLastCard,
}: PlayerOneProps) {
  const [showSuitSelector, setShowSuitSelector] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );
  const [viewCardModal, setViewCardModal] = useState<{
    isOpen: boolean;
    card: CardType | null;
  }>({ isOpen: false, card: null });
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Card validation logic - MATCHES BACKEND (play_chain.rs:337-339)
  const canPlayCard = (card: CardType, top: CardType | null): boolean => {
    if (!top) return true; // First card of the game

    // WHOT cards can always be played
    if (card.value === "20" || card.suit === "WHOT") return true;

    // If a suit has been demanded by a WHOT card, only that suit can be played
    if (activeDemandSuit) {
      return card.suit === activeDemandSuit;
    }

    // Normal rules: match suit or value
    return card.suit === top.suit || card.value === top.value;
  };

  // Handle card click
  const handleCardClick = (index: number) => {
    if (!isMyTurn) return;

    const card = myCards[index];
    console.log("[PlayerOne] Card clicked:", { index, card, topCard });

    // Validate card can be played
    if (!canPlayCard(card, topCard)) {
      alert(
        `Invalid play! Must match suit (${topCard?.suit}) or value (${topCard?.value})`
      );
      return;
    }

    // Log special card detection
    const isSpecialCard = ["1", "2", "5", "14", "20"].includes(card.value);
    const isPickThree = card.value === "5" && card.suit !== "STAR";
    const isStar5 = card.value === "5" && card.suit === "STAR";

    console.log("[PlayerOne] Card is valid!", {
      isSpecialCard,
      isPickThree,
      isStar5,
      expectedEffect:
        card.value === "1"
          ? "Hold On"
          : card.value === "2"
          ? "Pick Two"
          : isPickThree
          ? "Pick Three"
          : isStar5
          ? "NONE (Star 5 is regular card)"
          : card.value === "14"
          ? "General Market"
          : card.value === "20"
          ? "Whot/Wild"
          : "None",
    });

    // If Whot card, show suit selector
    if (card.suit === "WHOT") {
      console.log("[PlayerOne] WHOT card detected! Showing suit selector");
      setSelectedCardIndex(index);
      setShowSuitSelector(true);
    } else {
      console.log("[PlayerOne] Regular card, playing immediately");
      // Play regular card immediately
      onPlayCard(index);
    }
  };

  // Handle suit selection for Whot cards
  const handleSuitSelect = (suit: string) => {
    if (selectedCardIndex !== null) {
      onPlayCard(selectedCardIndex, suit);
    }
    setShowSuitSelector(false);
    setSelectedCardIndex(null);
  };

  const handleSuitCancel = () => {
    setShowSuitSelector(false);
    setSelectedCardIndex(null);
  };

  return (
    <div className="flex flex-col items-center gap-6 relative">
      {/* Turn Status */}
      {isMyTurn ? (
        <div className="text-xl text-[#EA463D] font-bold animate-bounce">
          YOUR TURN!
        </div>
      ) : (
        <div className="text-lg text-gray-500">
          Waiting for {opponentName || "Opponent"}...
        </div>
      )}

      {/* Active Demand Suit Alert */}
      {activeDemandSuit && (
        <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-6 py-3 rounded-lg font-bold text-center animate-pulse">
          ⚠️ Play {activeDemandSuit} cards only! ⚠️
        </div>
      )}

      {/* Card Hand - Scrollable on small screens with overflow visible for hover */}
      <div className="flex items-center gap-4 w-full max-w-full overflow-visible">
        <div className="mt-15">
          <UserBar />
        </div>
        <div className="flex-1 overflow-x-auto overflow-y-visible pb-3 pt-4">
          <div
            className="flex justify-center items-end ml-15"
            style={{
              gap: "0.25rem",
              flexWrap: "nowrap",
            }}
          >
            {myCards.map((card, index) => {
              const isPlayable = canPlayCard(card, topCard);
              const canClick = isMyTurn && isPlayable;

              return (
                <div
                  key={index}
                  onClick={() => canClick && handleCardClick(index)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setViewCardModal({ isOpen: true, card });
                  }}
                  className={`transform transition-all duration-200 ${
                    canClick
                      ? "cursor-pointer hover:scale-110 hover:-translate-y-8 hover:z-50"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  style={{
                    flex: "0 0 auto",
                    opacity: !isMyTurn ? 0.6 : isPlayable ? 1 : 0.5,
                  }}
                >
                  <Card suit={card.suit as any} value={card.value} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons - Scrollable on small screens */}
      <div className="mb-10 w-full max-w-full overflow-x-auto">
        <div className="min-w-max flex flex-col items-center gap-3">
          <div>
            <GameButton
              backgroundColor="#111010"
              customShadow="-1.24px -1.86px 4.34px 0px rgba(44, 40, 40, 0.3) inset, 3.72px 1.86px 4.34px 0px rgba(45, 43, 43, 0.1) inset"
              backdropBlur="blur(309.74px)"
              width="w-250"
              onClick={() => setShowRulesModal(true)}
            >
              Rules
            </GameButton>
          </div>
        </div>
      </div>

      {/* Suit Selector Modal */}
      {showSuitSelector && (
        <>
          {console.log("[PlayerOne] Rendering SuitSelector modal")}
          <SuitSelector
            onSelect={handleSuitSelect}
            onCancel={handleSuitCancel}
          />
        </>
      )}

      {/* Card View Modal */}
      {viewCardModal.isOpen && viewCardModal.card && (
        <CardModal
          isOpen={viewCardModal.isOpen}
          onClose={() => setViewCardModal({ isOpen: false, card: null })}
          suit={viewCardModal.card.suit as any}
          value={viewCardModal.card.value}
        />
      )}

      {/* Rules Modal */}
      <RulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />
    </div>
  );
}
