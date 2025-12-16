# Frontend Fix Plan - December 16, 2025

## Current Issues

### 1. **Missing Subscribe Mutation**
The hook doesn't call `subscribe` before `createMatch` or `joinMatch`. This is **required** for the backend to work.

### 2. **Wrong Query Endpoint**
Queries are hitting USER_CHAIN instead of PLAY_CHAIN

### 3. **Missing Max Players Selection**
Create match flow needs max players input (currently hardcoded to 2)

### 4. **No Auto-Subscription**
Subscribe should happen behind the scenes automatically

---

## Solution: Three-Step Fix

### Step 1: Fix GraphQL Config & Endpoints

**Problem:** `graphqlQuery` and `graphqlMutate` use wrong endpoint

**Solution:** Create two separate helpers:
- `queryPlayChain()` - For queries (uses PLAY_CHAIN)
- `mutateUserChain()` - For mutations (uses USER_CHAIN)

---

### Step 2: Add Auto-Subscribe to Hook

**Flow:**
```
Player enters nickname → Subscribe (behind scenes) →create Match/Join Match →Start polling
```

**Player 1 Flow:**
1. Subscribe to PLAY_CHAIN ✅ (auto)
2. CreateMatch ✅
3. Poll PLAY_CHAIN for state ✅

**Player 2 Flow:**
1. Subscribe to PLAY_CHAIN ✅ (auto)
2. JoinMatch ✅
3. Poll PLAY_CHAIN for state ✅

---

### Step 3: Update Registration Flow

**Add:**
- Max players input (for Player 1)
- Better player selection messaging
- Auto-subscribe on player selection

**Remove:**
- Manual subscription step (do it behind the scenes)

---

## Implementation

### File 1: `lib/graphql.ts` - Add Separate Endpoint Functions

```typescript
// Query PLAY_CHAIN (for match state)
export async function queryPlayChain<T>(query: string, variables?: any): Promise<T> {
  const config = await loadConfig();
  const url = `${config.endpoints[0].graphqlUrl}/chains/${config.playChain}/applications/${config.applicationId}`;
  
  // ... rest of implementation
}

// Mutate USER_CHAIN (for actions)
export async function mutateUserChain(mutation: string, variables?: any, playerNumber: 1 | 2): Promise<any> {
  const config = await loadConfig();
  const endpoint = config.endpoints.find(e => e.playerNumber === playerNumber);
  const url = `${endpoint.graphqlUrl}/chains/${endpoint.chainId}/applications/${config.applicationId}`;
  
  // ... rest of implementation
}
```

---

### File 2: `hooks/useWhotGame.ts` - Add Auto-Subscribe

```typescript
const joinGame = useCallback(async (nickname: string, maxPlayers: number = 2) => {
  try {
    const config = await loadConfig();
    
    // STEP 1: Auto-subscribe (behind the scenes)
    console.log('[useWhotGame] Auto-subscribing to PLAY_CHAIN...');
    await mutateUserChain(`
      mutation Subscribe($playChainId: String!) {
        subscribe(playChainId: $playChainId)
      }
    `, { playChainId: config.playChain }, playerNumber);
    
    // STEP 2: Create or Join
    if (playerNumber === 1) {
      console.log('[useWhotGame] Player 1: Creating match...');
      await mutateUserChain(`
        mutation CreateMatch($maxPlayers: Int!, $nickname: String!) {
          createMatch(maxPlayers: $maxPlayers, nickname: $nickname)
        }
      `, { maxPlayers, nickname }, playerNumber);
    } else {
      console.log('[useWhotGame] Player 2: Joining match...');
      await mutateUserChain(`
        mutation JoinMatch($playChainId: String!, $nickname: String!) {
          joinMatch(playChainId: $playChainId, nickname: $nickname)
        }
      `, { playChainId: config.playChain, nickname }, playerNumber);
    }
    
    // STEP 3: Start polling
    await fetchState();
  } catch (err) {
    console.error('[useWhotGame] joinGame error:', err);
    throw err;
  }
}, [playerNumber, fetchState]);
```

---

### File 3: `app/register/page.tsx` - Add Max Players

```typescript
const [maxPlayers, setMaxPlayers] = useState<number>(2);

// In Player 1 section, add:
{playerNumber === 1 && (
  <div className="space-y-3 mb-5">
    <label className="text-[#01626F] font-lilitaone block py-2">
      Number of Players
    </label>
    <select
      value={maxPlayers}
      onChange={(e) => setMaxPlayers(Number(e.target.value))}
      className="py-3 px-[22px] text-lg rounded-lg border w-full"
    >
      <option value={2}>2 Players</option>
      <option value={3}>3 Players</option>
      <option value={4}>4 Players</option>
      <option value={5}>5 Players</option>
      <option value={6}>6 Players</option>
    </select>
  </div>
)}

// Update localStorage to include maxPlayers
const profile = {
  username,
  avatar: AVATARS[selectedAvatar],
  color: COLORS[selectedColor],
  playerNumber: player,
  maxPlayers: player === 1 ? maxPlayers : 2, // Only Player 1 sets this
};
```

---

### File 4: `app/game/page.tsx` - Call joinGame with maxPlayers

```typescript
const handleJoinGame = async () => {
  const profile = localStorage.getItem(`whot_player_profile_${playerNumber}`);
  if (profile) {
    const { username, maxPlayers } = JSON.parse(profile);
    await joinGame(username, maxPlayers || 2);
  }
};
```

---

## Testing Checklist

### Player 1 (Create):
- [ ] Enter nickname
- [ ] Select avatar & color
- [ ] Select number of players (2-6)
- [ ] Click "Player 1 (Create)"
- [ ] Subscribe happens automatically ✅
- [ ] Match created ✅
- [ ] Can see match in PLAY_CHAIN query ✅

### Player 2 (Join):
- [ ] Enter nickname
- [ ] Select avatar & color  
- [ ] Click "Player 2 (Join)"
- [ ] Subscribe happens automatically ✅
- [ ] Join match ✅
- [ ] Both players visible in PLAY_CHAIN query ✅

### Start Match:
- [ ] Either player can click "Start Match"
- [ ] Status changes to "IN_PROGRESS"
- [ ] Cards dealt (handSize = 6)
- [ ] Game playable ✅

---

## Key Differences from MicroChess

**MicroChess:**
- Uses centralized matching system
- Has game hash for friendly matches
- Complex match-making flow

**Linot (Simplified):**
- Direct PLAY_CHAIN subscription
- Player makes the end-points
- Simple create/join flow
- Auto-subscribe behind the scenes

---

## Next Steps

1. ✅ Fix `lib/graphql.ts` - Add separate endpoint functions
2. ✅ Fix `hooks/useWhotGame.ts` - Add auto-subscribe
3. ✅ Fix `app/register/page.tsx` - Add max players selection
4. ✅ Test full flow end-to-end
5. ✅ Move to start game functionality

