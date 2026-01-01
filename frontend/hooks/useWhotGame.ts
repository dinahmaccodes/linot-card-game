import { useState, useEffect, useCallback, useRef } from 'react';
import { queryPlayChain, mutateUserChain, loadConfig } from '@/lib/graphql';
import type { GameDataResponse, PlayerView } from '@/lib/types';

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
      
      // Query PLAY_CHAIN for match state (authoritative source)
      const data = await queryPlayChain<any>(`
        query GameData {
          matchState {
            status
            currentPlayerIndex
            discardPile { suit value }
            deckSize
            pendingDrawStack
            players {
              owner
              nickname
              handSize
              calledLastCard
            }
            maxPlayers
          }
          myHand { suit value }
        }
      `);

      // Get current player's owner from config
      const currentEndpoint = config.endpoints.find(e => e.playerNumber === playerNumber);
      const currentOwner = currentEndpoint?.owner || '';

      // Check if match exists
      if (!data.matchState) {
        // No match created yet - clear state to show join screen
        setGameState(null);
        setLoading(false);
        setError(null);
        return;
      }

      // Transform to PlayerView
      const transformed: PlayerView = {
        myCards: data.myHand || [],
        myCardCount: data.myHand?.length || 0,
        calledLastCard: data.matchState.players?.find((p: any) => p?.owner === currentOwner)?.calledLastCard || false,
        opponents: (data.matchState.players || []).filter((p: any) => p && p.owner !== currentOwner).map((p: any) => ({
          nickname: p.nickname,
          cardCount: p.handSize || 0, // Map handSize to cardCount
          calledLastCard: p.calledLastCard,
          owner: p.owner,
          isActive: p.isActive || false
        })),
        topCard: data.matchState.discardPile?.[data.matchState.discardPile.length - 1] || null,
        deckSize: data.matchState.deckSize || 0,
        currentPlayerIndex: data.matchState.currentPlayerIndex || 0,
        status: data.matchState.status || 'WAITING',
        activeShapeDemand: null, // Not in schema
        pendingPenalty: data.matchState.pendingDrawStack || 0,
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

  // Mutations (use mutateUserChain)
  const playCard = useCallback(async (cardIndex: number, chosenSuit?: string) => {
    try {
      await mutateUserChain(`
        mutation PlayCard($cardIndex: Int!, $chosenSuit: String) {
          playCard(cardIndex: $cardIndex, chosenSuit: $chosenSuit)
        }
      `, { cardIndex, chosenSuit }, playerNumber);
      
      await fetchState();
    } catch (err) {
      console.error('[useWhotGame] playCard error:', err);
      throw err;
    }
  }, [playerNumber, fetchState]);

  const drawCard = useCallback(async () => {
    try {
      await mutateUserChain(`mutation { drawCard }`, {},  playerNumber);
      await fetchState();
    } catch (err) {
      console.error('[useWhotGame] drawCard error:', err);
      throw err;
    }
  }, [playerNumber, fetchState]);

  const callLastCard = useCallback(async () => {
    try {
      await mutateUserChain(`mutation { callLastCard }`, {}, playerNumber);
      await fetchState();
    } catch (err) {
      console.error('[useWhotGame] callLastCard error:', err);
      throw err;
    }
  }, [playerNumber, fetchState]);

  // UPDATED: Auto-subscribe and then create/join match
  const joinGame = useCallback(async (nickname: string, maxPlayers: number = 2) => {
    try {
      const config = await loadConfig();
      
      // STEP 1: Auto-subscribe (behind the scenes) - only once
      if (!isSubscribed.current) {
        console.log('[useWhotGame] Auto-subscribing to PLAY_CHAIN...');
        await mutateUserChain(`
          mutation Subscribe($playChainId: String!) {
            subscribe(playChainId: $playChainId)
          }
        `, { playChainId: config.playChain }, playerNumber);
        isSubscribed.current = true;
        console.log('[useWhotGame] ✅ Subscribed to PLAY_CHAIN');
      }
      
      // STEP 2: Create or Join match
      if (playerNumber === 1) {
        console.log('[useWhotGame] Player 1: Creating match...');
        console.log(`[useWhotGame] Max players: ${maxPlayers}, Nickname: ${nickname}`);
        await mutateUserChain(`
          mutation CreateMatch($maxPlayers: Int!, $nickname: String!) {
            createMatch(maxPlayers: $maxPlayers, nickname: $nickname)
          }
        `, { maxPlayers, nickname }, playerNumber);
        console.log('[useWhotGame] ✅ Match created');
      } else {
        console.log('[useWhotGame] Player 2: Joining match...');
        console.log(`[useWhotGame] PLAY_CHAIN ID: ${config.playChain}, Nickname: ${nickname}`);
        await mutateUserChain(`
          mutation JoinMatch($playChainId: String!, $nickname: String!) {
            joinMatch(playChainId: $playChainId, nickname: $nickname)
          }
        `, { playChainId: config.playChain, nickname }, playerNumber);
        console.log('[useWhotGame] ✅ Joined match');
      }
      
      // STEP 3: Start polling
      await fetchState();
    } catch (err) {
      console.error('[useWhotGame] joinGame error:', err);
      throw err;
    }
  }, [playerNumber, fetchState]);

  const startGame = useCallback(async () => {
    try {
      await mutateUserChain(`mutation { startMatch }`, {}, playerNumber);
      await fetchState();
    } catch (err) {
      console.error('[useWhotGame] startGame error:', err);
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
