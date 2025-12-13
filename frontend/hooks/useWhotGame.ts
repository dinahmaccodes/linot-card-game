import { useState, useEffect, useCallback } from "react";
import { LineraClient } from "@/lib/lineraClient";
import { Card, PlayerView } from "@/lib/types";

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
 * Hook for Whot game state with event-driven polling 
 * Polls every 500ms for real-time updates
 */
export function useWhotGame() {
  const [gameState, setGameState] = useState<PlayerView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [client, setClient] = useState<LineraClient | null>(null);

  // Initialize client for this player
  const [playerNumber, setPlayerNumber] = useState<number>(1);

  useEffect(() => {
    import('@/lib/lineraClient').then(({ createLineraClient, getGlobalConfig }) => {
      try {
          const config = getGlobalConfig();
          setPlayerNumber(config.playerNumber || 1);
          const playerClient = createLineraClient();
          setClient(playerClient);
      } catch (e) {
          console.error("Config not ready yet", e);
      }
    });
  }, []);

  const fetchState = useCallback(async () => {
    if (!client) return;

    try {
      const config = await import("@/lib/lineraClient").then((m) => m.getGlobalConfig());
      const playerAccount = client.getOwner();
      const result = await client.query<{ playerView: PlayerView }>(
        PLAYER_VIEW_QUERY,
        { player: playerAccount },
        config.playChain // <--- Force query against Host Chain
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

  // Event-driven polling 500ms 
  useEffect(() => {
    if (!client) return;

    fetchState();
    const interval = setInterval(fetchState, 500);
    return () => clearInterval(interval);
  }, [fetchState, client]);

  const joinGame = useCallback(
    async (nickname: string, maxRetries = 3) => {
      if (!client) return;
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const config = await import("@/lib/lineraClient").then((m) => m.getGlobalConfig());
          
          // INSPO PATTERN: Execute on USER_CHAIN, send cross-chain message to PLAY_CHAIN
          // This is how INSPO works: RequestTableSeat operation on user chain
          // sends RequestTableSeat message to play chain
          await client.mutate(
            `
            mutation JoinFromChain($hostChainId: String!, $nickname: String!) {
              joinFromChain(hostChainId: $hostChainId, nickname: $nickname)
            }
          `,
            { hostChainId: config.playChain, nickname },
            config.endpoints[0].chainId // Execute on USER_CHAIN
          );
          
          await fetchState();
          return; // Success!
          
        } catch (err) {
          console.error(`Join attempt ${attempt + 1}/${maxRetries} failed:`, err);
          
          if (attempt === maxRetries - 1) {
            // Last attempt - throw error to caller
            throw err;
          }
          
          // Exponential backoff: 1s, 2s, 4s
          const backoffMs = 1000 * Math.pow(2, attempt);
          console.log(`Retrying in ${backoffMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    },
    [client, fetchState]
  );

  const startGame = useCallback(async () => {
    if (!client) return;
    try {
      const config = await import("@/lib/lineraClient").then((m) => m.getGlobalConfig());
      // Execute on USER_CHAIN (will send message to PLAY_CHAIN if needed)
      await client.mutate(
        `mutation { startMatch }`,
        {},
        config.endpoints[0].chainId
      );
      await fetchState();
    } catch (err) {
      console.error("Failed to start game:", err);
      throw err;
    }
  }, [client, fetchState]);

  const playCard = useCallback(
    async (cardIndex: number, chosenSuit?: string) => {
      if (!client) return;
      try {
        const config = await import("@/lib/lineraClient").then((m) => m.getGlobalConfig());
        // Execute on USER_CHAIN (will send message to PLAY_CHAIN)
        await client.mutate(
          `
        mutation PlayCard($cardIndex: Int!, $chosenSuit: String) {
          playCard(cardIndex: $cardIndex, chosenSuit: $chosenSuit)
        }
      `,
          { cardIndex, chosenSuit },
          config.endpoints[0].chainId
        );
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
      const config = await import("@/lib/lineraClient").then((m) => m.getGlobalConfig());
      // Execute on USER_CHAIN
      await client.mutate(
        `mutation { drawCard }`,
        {},
        config.endpoints[0].chainId
      );
      await fetchState();
    } catch (err) {
      console.error("Failed to draw card:", err);
      throw err;
    }
  }, [client, fetchState]);

  const callLastCard = useCallback(async () => {
    if (!client) return;
    try {
      const config = await import("@/lib/lineraClient").then((m) => m.getGlobalConfig());
      // Execute on USER_CHAIN
      await client.mutate(
        `mutation { callLastCard }`,
        {},
        config.endpoints[0].chainId
      );
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
    joinGame,
    startGame,
    playCard,
    drawCard,
    callLastCard,
    refresh: fetchState,
    playerNumber,
  };
}
