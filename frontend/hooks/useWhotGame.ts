import { useState, useEffect, useCallback } from "react";
import { LineraClient } from "@/lib/lineraClient";

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

const PLAYER_VIEW_QUERY = `
  query PlayerView($player: String!) {
    playerView(player: $player) {
      myCards { suit value }
      myCardCount
      calledLastCard
      opponents {
        owner
        nickname
        cardCount
        isActive
        calledLastCard
      }
      topCard { suit value }
      deckSize
      currentPlayerIndex
      status
      activeShapeDemand
      pendingPenalty
    }
  }
`;

/**
 * Hook for Whot game state with event-driven polling (Inspo pattern)
 * Polls every 500ms for real-time updates
 * @param playerNumber - Player number (1 or 2)
 */
export function useWhotGame(playerNumber: 1 | 2) {
  const [gameState, setGameState] = useState<PlayerView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [client, setClient] = useState<LineraClient | null>(null);

  // Initialize client for this player
  useEffect(() => {
    import('@/lib/lineraClient').then(({ createLineraClient }) => {
      const playerClient = createLineraClient(playerNumber);
      setClient(playerClient);
    });
  }, [playerNumber]);

  const fetchState = useCallback(async () => {
    if (!client) return;

    try {
      const playerAccount = client.getOwner();
      const result = await client.query<{ playerView: PlayerView }>(
        PLAYER_VIEW_QUERY,
        { player: playerAccount }
      );
      setGameState(result.playerView);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch game state:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [client]);

  // Event-driven polling (500ms like Inspo)
  useEffect(() => {
    if (!client) return;

    fetchState();
    const interval = setInterval(fetchState, 500);
    return () => clearInterval(interval);
  }, [fetchState, client]);

  const playCard = useCallback(
    async (cardIndex: number, chosenSuit?: string) => {
      if (!client) return;
      try {
        await client.mutate(
          `
        mutation PlayCard($cardIndex: Int!, $chosenSuit: String) {
          playCard(cardIndex: $cardIndex, chosenSuit: $chosenSuit)
        }
      `,
          { cardIndex, chosenSuit }
        );
        // Immediate refetch after mutation
        await fetchState();
      } catch (err) {
        console.error("Failed to play card:", err);
        throw err;
      }
    },
    [client, fetchState]
  );

  const drawCard = useCallback(async () => {
    if (!client) return;
    try {
      await client.mutate(`mutation { drawCard }`);
      await fetchState();
    } catch (err) {
      console.error("Failed to draw card:", err);
      throw err;
    }
  }, [client, fetchState]);

  const callLastCard = useCallback(async () => {
    if (!client) return;
    try {
      await client.mutate(`mutation { callLastCard }`);
      await fetchState();
    } catch (err) {
      console.error("Failed to call last card:", err);
      throw err;
    }
  }, [client, fetchState]);

  return {
    gameState,
    loading,
    error,
    playCard,
    drawCard,
    callLastCard,
    refresh: fetchState,
  };
}
