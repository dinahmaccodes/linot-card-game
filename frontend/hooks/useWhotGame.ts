import { useState, useEffect, useCallback, useRef } from "react";
import { queryPlayChain, mutateUserChain, loadConfig } from "@/lib/graphql";
import type { GameDataResponse, PlayerView } from "@/lib/types";

export function useWhotGame(playerNumber: 1 | 2) {
  const [gameState, setGameState] = useState<PlayerView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use ref to prevent duplicate fetches
  const isFetching = useRef(false);
  const isSubscribed = useRef(false);

  const fetchState = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      const config = await loadConfig();

      // Get current player's owner from config
      const currentEndpoint = config.endpoints.find(
        (e) => e.playerNumber === playerNumber
      );
      const currentOwner = currentEndpoint?.owner || "";

      // Query PLAY_CHAIN for match state (authoritative source)
      const data = await queryPlayChain<any>(
        `
        query GameData($owner:  AccountOwner!) {
          matchState {
            status
            currentPlayerIndex
            discardPile { suit value }
            deckSize
            pendingDrawStack
            activeDemandSuit
            winnerIndex
            players {
              owner
              nickname
              handSize
              calledLastCard
            }
            maxPlayers
          }
          myHand(owner: $owner) { suit value }
        }
      `,
        { owner: currentOwner }
      );

      // Check if match exists
      if (!data.matchState) {
        // No match created yet - clear state to show join screen
        setGameState(null);
        setLoading(false);
        setError(null);
        return;
      }

      // Transform to PlayerView
      // Filter opponents by excluding the current player based on their position
      // Player 1 is at index 0, Player 2 is at index 1
      const myPlayerIndex = playerNumber - 1;
      const allPlayers = data.matchState.players || [];

      const transformed: PlayerView = {
        myCards: data.myHand || [],
        myCardCount: data.myHand?.length || 0,
        calledLastCard: allPlayers[myPlayerIndex]?.calledLastCard || false,
        opponents: allPlayers
          .map((p: any, index: number) =>
            p
              ? {
                  // ← Check if p is not null
                  nickname: p.nickname,
                  cardCount: p.handSize || 0,
                  calledLastCard: p.calledLastCard,
                  owner: p.owner,
                  isActive: p.isActive || false,
                  index: index,
                }
              : null
          )
          .filter((p: any) => p !== null && p.index !== myPlayerIndex), // Filter nulls and current player
        topCard:
          data.matchState.discardPile?.[
            data.matchState.discardPile.length - 1
          ] || null,
        deckSize: data.matchState.deckSize || 0,
        currentPlayerIndex: data.matchState.currentPlayerIndex || 0,
        status: data.matchState.status || "WAITING",
        activeShapeDemand: data.matchState.activeDemandSuit || null,
        pendingPenalty: data.matchState.pendingDrawStack || 0,
        winnerIndex:
          data.matchState.winnerIndex !== undefined
            ? data.matchState.winnerIndex
            : null,
      };

      setGameState(transformed);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("[useWhotGame] Fetch error:", err);
      setError(err as Error);
      setLoading(false);
    } finally {
      isFetching.current = false;
    }
  }, [playerNumber]);

  // Poll every 500ms (Linera pattern)
  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout;

    const startPolling = async () => {
      if (mounted) await fetchState();
      if (mounted) {
        intervalId = setInterval(() => {
          if (mounted) fetchState();
        }, 500);
      }
    };

    startPolling();

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchState]);

  // Mutations (use mutateUserChain)
  const playCard = useCallback(
    async (cardIndex: number, chosenSuit?: string) => {
      try {
        await mutateUserChain(
          `
        mutation PlayCard($cardIndex: Int!, $chosenSuit: String) {
          playCard(cardIndex: $cardIndex, chosenSuit: $chosenSuit)
        }
      `,
          { cardIndex, chosenSuit },
          playerNumber
        );

        await fetchState();
      } catch (err) {
        console.error("[useWhotGame] playCard error:", err);
        throw err;
      }
    },
    [playerNumber, fetchState]
  );

  const drawCard = useCallback(async () => {
    try {
      await mutateUserChain(`mutation { drawCard }`, {}, playerNumber);
      await fetchState();
    } catch (err) {
      console.error("[useWhotGame] drawCard error:", err);
      throw err;
    }
  }, [playerNumber, fetchState]);

  const callLastCard = useCallback(async () => {
    try {
      await mutateUserChain(`mutation { callLastCard }`, {}, playerNumber);
      await fetchState();
    } catch (err) {
      console.error("[useWhotGame] callLastCard error:", err);
      throw err;
    }
  }, [playerNumber, fetchState]);

  // UPDATED: Inspo subscribe pattern - Player 1 subscribes, Player 2 auto-subscribes via joinMatch
  const joinGame = useCallback(
    async (nickname: string, maxPlayers: number = 2) => {
      try {
        const config = await loadConfig();

        if (playerNumber === 1) {
          // Player 1 Flow: Subscribe → CreateMatch

          // STEP 1: Subscribe to PLAY_CHAIN (required for createMatch)
          if (!isSubscribed.current) {
            console.log("[Player 1] Subscribing to PLAY_CHAIN...");
            await mutateUserChain(
              `
            mutation Subscribe($playChainId: String!) {
              subscribe(playChainId: $playChainId)
            }
          `,
              { playChainId: config.playChain },
              playerNumber
            );
            isSubscribed.current = true;
            console.log("[Player 1] ✅ Subscribed");
          }

          // STEP 2: Create match
          console.log("[Player 1] Creating match...");
          console.log(
            `[Player 1] Max players: ${maxPlayers}, Nickname: ${nickname}`
          );
          await mutateUserChain(
            `
          mutation CreateMatch($maxPlayers: Int!, $nickname: String!) {
            createMatch(maxPlayers: $maxPlayers, nickname: $nickname)
          }
        `,
            { maxPlayers, nickname },
            playerNumber
          );
          console.log("[Player 1] ✅ Match creation requested");

          // Wait for PLAY_CHAIN message processing
          console.log(
            "[Player 1] Waiting for cross-chain message processing..."
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          // Player 2 Flow: JoinMatch (auto-subscribes via backend confirmation)

          console.log("[Player 2] Joining match...");
          console.log(
            `[Player 2] PLAY_CHAIN: ${config.playChain}, Nickname: ${nickname}`
          );

          // joinMatch sends RequestJoin → PLAY_CHAIN confirms → auto-subscribe
          await mutateUserChain(
            `
          mutation JoinMatch($playChainId: String!, $nickname: String!) {
            joinMatch(playChainId: $playChainId, nickname: $nickname)
          }
        `,
            { playChainId: config.playChain, nickname },
            playerNumber
          );

          isSubscribed.current = true; // Backend handles subscription
          console.log(
            "[Player 2] ✅ Join requested (backend will auto-subscribe)"
          );

          // Wait for PLAY_CHAIN message processing
          console.log(
            "[Player 2] Waiting for cross-chain message processing..."
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // STEP 3: Fetch and verify state
        console.log("[useWhotGame] Fetching game state...");
        await fetchState();

        // Verify player joined (check if game state was populated)
        if (gameState) {
          console.log("[useWhotGame] ✅ Game state fetched - player in match");
        } else {
          console.warn(
            "[useWhotGame] Game state not yet available - messages may still be processing"
          );
        }
      } catch (err) {
        console.error("[useWhotGame] joinGame error:", err);
        isSubscribed.current = false; // Reset on error
        throw err;
      }
    },
    [playerNumber, fetchState, gameState]
  );

  const startGame = useCallback(async () => {
    try {
      await mutateUserChain(`mutation { startMatch }`, {}, playerNumber);
      await fetchState();
    } catch (err) {
      console.error("[useWhotGame] startGame error:", err);
      throw err;
    }
  }, [playerNumber, fetchState]);

  return {
    gameState,
    loading,
    error,
    playCard,
    drawCard,
    callLastCard,
    joinGame,
    startGame,
    refresh: fetchState,
    playerNumber,
  };
}
