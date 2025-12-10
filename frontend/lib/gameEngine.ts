import { shuffleDeck, generateWhotDeck } from "../utils/whotDeck";
import { Card, GameState } from "./types";

export function startGame(): GameState {
  const deck = shuffleDeck(generateWhotDeck());

  const playerOneHand = deck.slice(0, 5);
  const playerTwoHand = deck.slice(5, 10);

  const remainingPile = deck.slice(10);

  const topCard = remainingPile[0]; // first visible card at center
  const pile = remainingPile.slice(1); // actual draw pile after removing topCard

  return {
    pile,
    discardPile: [topCard],
    playerOneHand,
    playerTwoHand,
    currentTurn: "P1",
    gameStarted: true,
    topCard,
  };
}

export function drawFromPile(state: GameState, player: "P1" | "P2"): GameState {
  if (state.pile.length === 0) {
    throw new Error("Pile is empty!");
  }

  const drawnCard = state.pile[0];
  const newPile = state.pile.slice(1);

  if (player === "P1") {
    return {
      ...state,
      pile: newPile,
      playerOneHand: [...state.playerOneHand, drawnCard],
      currentTurn: "P2",
    };
  }

  return {
    ...state,
    pile: newPile,
    playerTwoHand: [...state.playerTwoHand, drawnCard],
    currentTurn: "P1",
  };
}

export function playCard(
  state: GameState,
  player: "P1" | "P2",
  card: Card
): GameState {
  const hand = player === "P1" ? state.playerOneHand : state.playerTwoHand;

  const hasCard = hand.some((c) => c.id === card.id);
  if (!hasCard) throw new Error("Card not in hand!");

  // BASIC WHOT RULE: match shape or number or be Whot 20
  const valid =
    card.shape === state.topCard?.shape ||
    card.number === state.topCard?.number ||
    card.shape === "whot";

  if (!valid) throw new Error("Invalid move!");

  // Remove card from player hand
  const newHand = hand.filter((c) => c.id !== card.id);

  // Update top card + discard pile
  const newState: GameState = {
    ...state,
    discardPile: [...state.discardPile, card],
    topCard: card,
    currentTurn: player === "P1" ? "P2" : "P1",
  };

  if (player === "P1") newState.playerOneHand = newHand;
  else newState.playerTwoHand = newHand;

  return newState;
}
