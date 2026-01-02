// Game Types (matching backend schema)
export interface Card {
  suit: string;
  value: string;
}

export interface Player {
  owner: string;
  nickname: string;
  cardCount: number;
  isActive: boolean;
  calledLastCard: boolean;
}

export interface MatchState {
  status: string;
  currentPlayerIndex: number;
  topCard: Card | null;
  deckSize: number;
  activeShapeDemand: string | null;
  pendingPenalty: number;
  players: Player[];
}

export interface MyHand {
  hand: Card[];
}

// GraphQL Query Response Types
export interface MatchStateResponse {
  matchState: MatchState;
}

export interface MyHandResponse {
  myHand: MyHand;
}

export interface GameDataResponse extends MatchStateResponse, MyHandResponse {}

// UI State (transformed for components)
export interface PlayerView {
  myCards: Card[];
  myCardCount: number;
  calledLastCard: boolean;
  opponents: Player[];
  topCard: Card | null;
  deckSize: number;
  currentPlayerIndex: number;
  status: string;
  activeShapeDemand: string | null;
  pendingPenalty: number;
}


// Re-export Player as OpponentView for backward compatibility
export type OpponentView = Player;

// User Profile (from registration)
export interface UserProfile {
  username: string;
  avatar: string;
  color: string;
  playerNumber: 1 | 2;
  maxPlayers?: number;
}

