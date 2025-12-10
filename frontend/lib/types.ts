export type Shape =
  | "circle"
  | "triangle"
  | "cross"
  | "square"
  | "star"
  | "whot";

export interface Card {
  id: string;
  shape: Shape;
  number: number;
}

export interface GameState {
  pile: Card[]; // the draw pile (shuffled deck)
  discardPile: Card[]; // cards already played
  playerOneHand: Card[]; // 5 initial cards
  playerTwoHand: Card[]; // 5 initial cards
  currentTurn: "P1" | "P2"; // whose turn it is
  gameStarted: boolean;
  topCard: Card | null; // visible center card
}
