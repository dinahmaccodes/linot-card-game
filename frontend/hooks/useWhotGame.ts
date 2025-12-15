import { useState, useEffect, useCallback, useRef } from 'react';
import { graphqlQuery, graphqlMutate, loadConfig } from '@/lib/graphql';
import type { GameDataResponse, PlayerView } from '@/lib/types';

export function useWhotGame(playerNumber: 1 | 2) {
  const [gameState, setGameState] = useState<PlayerView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use ref to prevent duplicate fetches
  const isFetching = useRef(false);

  const fetchState = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      const config = await loadConfig();
      
      // Query both matchState and myHand in one request
      const data = await graphqlQuery<GameDataResponse>(`
        query GameData {
          matchState {
            status
            currentPlayerIndex
            topCard { suit value }
            deckSize
            activeShapeDemand
            pendingPenalty
            players {
              owner
              nickname
              cardCount
              isActive
              calledLastCard
            }
          }
          myHand {
            hand { suit value }
          }
        }
      `);

      // Get current player's owner from config
      const currentEndpoint = config.endpoints.find(e => e.playerNumber === playerNumber);
      const currentOwner = currentEndpoint?.owner || '';

      // Transform to PlayerView
      const transformed: PlayerView = {
        myCards: data.myHand.hand,
        myCardCount: data.myHand.hand.length,
        calledLastCard: data.matchState.players.find(p => p.owner === currentOwner)?.calledLastCard || false,
        opponents: data.matchState.players.filter(p => p.owner !== currentOwner),
        topCard: data.matchState.topCard,
        deckSize: data.matchState.deckSize,
        currentPlayerIndex: data.matchState.currentPlayerIndex,
        status: data.matchState.status,
        activeShapeDemand: data.matchState.activeShapeDemand,
        pendingPenalty: data.matchState.pendingPenalty,
      };

      setGameState(transformed);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('[useWhotGame] Fetch error:', err);
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

  // Mutations
  const playCard = useCallback(async (cardIndex: number, chosenSuit?: string) => {
    try {
      await graphqlMutate(`
        mutation PlayCard($cardIndex: Int!, $chosenSuit: String) {
          playCard(cardIndex: $cardIndex, chosenSuit: $chosenSuit)
        }
      `, { cardIndex, chosenSuit });
      
      await fetchState();
    } catch (err) {
      console.error('[useWhotGame] playCard error:', err);
      throw err;
    }
  }, [fetchState]);

  const drawCard = useCallback(async () => {
    try {
      await graphqlMutate(`mutation { drawCard }`);
      await fetchState();
    } catch (err) {
      console.error('[useWhotGame] drawCard error:', err);
      throw err;
    }
  }, [fetchState]);

  const callLastCard = useCallback(async () => {
    try {
      await graphqlMutate(`mutation { callLastCard }`);
      await fetchState();
    } catch (err) {
      console.error('[useWhotGame] callLastCard error:', err);
      throw err;
    }
  }, [fetchState]);

  const joinGame = useCallback(async (nickname: string) => {
    try {
      const config = await loadConfig();
      await graphqlMutate(`
        mutation JoinGame($playChainId: String!, $nickname: String!) {
          joinMatch(playChainId: $playChainId, nickname: $nickname)
        }
      `, { 
        playChainId: config.playChain, 
        nickname 
      });
      
      await fetchState();
    } catch (err) {
      console.error('[useWhotGame] joinGame error:', err);
      throw err;
    }
  }, [fetchState]);

  const startGame = useCallback(async () => {
    try {
      await graphqlMutate(`mutation { startMatch }`);
      await fetchState();
    } catch (err) {
      console.error('[useWhotGame] startGame error:', err);
      throw err;
    }
  }, [fetchState]);

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
