# Player Hand Query Patterns

## Current Situation

**`myHand` query works but has a limitation:**
- Returns cards correctly
- Always returns **Player 1's hand** (regardless of which port you query)
- Not filtered by authenticated owner yet

---

## Two Approaches

### 1. Use `myHand` (Current - Local Testing Only)

**Works for testing but not production:**

```graphql
query {
  myHand { suit value }
}
```

**Limitation**: Both Player 1 and Player 2 get the same hand (Player 1's).

---

### 2. Use `matchState` (Production Pattern) ✅

**Filter on frontend by player index or owner:**

```graphql
query {
  matchState {
    players {
      owner       # ← Use this to filter
      nickname
      hand { suit value }
      handSize
    }
  }
}
```

**Get specific player's hand:**

#### By Index (0 = Player 1, 1 = Player 2)
```javascript
// Player 1's hand
const player1Hand = matchState.players[0].hand;

// Player 2's hand  
const player2Hand = matchState.players[1].hand;
```

#### By Owner (Production)
```javascript
const myOwner = "e476..."; // From authenticated signer
const myPlayer = matchState.players.find(p => p.owner === myOwner);
const myHand = myPlayer?.hand || [];
```

---

## For Your Current Testing

### Player 1 (Port 8081)
```graphql
query {
  matchState {
    players {
      nickname
      hand { suit value }
    }
  }
}
```

**To get Player 1's hand:**
```javascript
const player1 = data.matchState.players[0];
const hand = player1.hand;
```

### Player 2 (Port 8082)
**Same query, different filtering:**
```javascript
const player2 = data.matchState.players[1];
const hand = player2.hand;
```

---

## Frontend Integration (Production)

```typescript
import { useLinera } from '@linera/client';

function GameComponent() {
  const { chainId, owner } = useLinera();
  
  const { data } = useQuery(`
    query {
      matchState {
        players {
          owner
          nickname
          hand { suit value }
        }
      }
    }
  `);
  
  // Filter for current player
  const myHand = data.matchState.players.find(
    p => p.owner === owner
  )?.hand || [];
  
  return <Hand cards={myHand} />;
}
```

---

## Recommendation

**For now (local testing):**
- Use `matchState.players[0]` for Player 1
- Use `matchState.players[1]` for Player 2

**For production (frontend):**
- Use `matchState` + filter by authenticated `owner`
- Matches inspo/inspo pattern