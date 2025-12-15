export interface Card {
  suit: string;
  value: string;
}

export interface OpponentView {
  owner: string;
  nickname: string;
  cardCount: number;
  isActive: boolean;
  calledLastCard: boolean;
}

export interface PlayerView {
  myCards: Card[];
  myCardCount: number;
  calledLastCard: boolean;
  opponents: OpponentView[];
  topCard: Card | null;
  deckSize: number;
  currentPlayerIndex: number;
  status: string;
  activeShapeDemand: string | null;
  pendingPenalty: number;
}

