# Linot Multiplayer - Breaking Points & Issues

**Deployment Method:** Docker (local deployment via `docker compose up --build`)  
**Environment:** localhost:3001 (Player 1), localhost:3002 (Player 2)

---

## Critical Breaking Points

### 1. Event Subscription System - **MISSING**

**Location:** `backend/src/contract.rs` - `handle_join_from_chain`

**Problem:** Players cannot see each other's actions because USER_CHAINs don't subscribe to PLAY_CHAIN events.

**Current State:**
- PLAY_CHAIN emits events (line 352-359 in contract.rs) ✓
- USER_CHAINs DO NOT subscribe to these events ✗
- Events have nowhere to go ✗

**Impact:**
- Player 2 can't see when Player 1 plays a card
- Player 1 can't see when Player 2 joins
- No real-time synchronization between players
- Game appears completely stuck after join

**What's Missing:**
```rust
// In handle_join_from_chain, need:
self.runtime.subscribe_to_events(
    play_chain_id,
    app_id,
    StreamName::from(GAME_EVENTS_STREAM)
);
```

**Reference:** Inspo does this in `RequestTableSeat` operation

---

### 2. Event Handler - **MISSING**

**Location:** `backend/src/contract.rs` - `execute_message`

**Problem:** No handler to process incoming events from PLAY_CHAIN

**Current State:**
- USER_CHAIN receives cross-chain messages ✓
- But no handler for `Message::GameEvent` ✗
- Events are ignored ✗

**Impact:**
- Even if events are sent, they're not processed
- USER_CHAIN state stays empty/stale
- Frontend queries return nothing useful

**What's Missing:**
```rust
// In execute_message, need case for:
Message::GameEvent { event } => {
    // Update cached state on USER_CHAIN
}
```

---

### 3. Frontend Queries Wrong Chain

**Location:** `frontend/hooks/useWhotGame.ts` line 63

**Problem:** Frontend queries PLAY_CHAIN directly instead of USER_CHAIN

**Current Code:**
```typescript
const result = await client.query<{ playerView: PlayerView }>(
  PLAYER_VIEW_QUERY,
  { player: playerAccount },
  config.playChain // ← WRONG: Querying PLAY_CHAIN
);
```

**Issue:**
- PLAY_CHAIN has full state but can't provide player-specific view
- USER_CHAIN should have cached state (but doesn't, see issues #1 and #2)
- Privacy violation: potentially exposes all cards

**Should Query:** `config.endpoints[0].chainId` (USER_CHAIN)

---

### 4. State Synchronization Gap

**Location:** `backend/src/state.rs`

**Problem:** No mechanism to sync PLAY_CHAIN state to USER_CHAINs

**Current Architecture:**
```
PLAY_CHAIN:
  ├─ players: [Player 1, Player 2]
  ├─ deck: [cards...]
  └─ Full game state

USER_CHAIN_1:
  ├─ players: []  ← EMPTY!
  └─ match_data: default

USER_CHAIN_2:
  ├─ players: []  ← EMPTY!
  └─ match_data: default
```

**Impact:**
- Each chain has separate state
- No sync mechanism between them
- Frontend queries USER_CHAIN but gets empty data

**Needed:** Event handlers that update USER_CHAIN state from PLAY_CHAIN events

---

### 5. Player Chain ID Not Stored

**Location:** `backend/src/state.rs` - Player struct

**Problem:** PLAY_CHAIN doesn't track which USER_CHAIN each player uses

**Current Code:**
```rust
pub struct Player {
    pub owner: AccountOwner,  // 0x123...
    pub nickname: String,
    pub cards: Vec<Card>,
    // Missing: chain_id!
}
```

**Impact:**
- PLAY_CHAIN can't send targeted messages to specific players
- Event propagation has no target
- Can't properly route game updates

**Missing Field:** `pub chain_id: ChainId`

---

### 6. JoinMatch vs JoinFromChain Confusion

**Location:** `backend/src/contract.rs` lines 237-296

**Problem:** Two different join operations with unclear purpose

**Operations:**
- `JoinMatch`: Direct join on local chain
- `JoinFromChain`: Cross-chain join via message

**Issue:**
- Player 1 has both PLAY_CHAIN and USER_CHAIN_1
- Which operation should Player 1 use?
- Current frontend uses `JoinFromChain` for everyone
- But backend has both paths (unnecessary complexity)

---

### 7. GraphQL Privacy Violation

**Location:** `backend/src/service.rs` lines 65-70

**Problem:** `match_state` query exposes all player hands

**Code:**
```rust
async fn match_state(&self, ctx: &Context<'_>) -> MatchData {
    // WARNING: This exposes all player hands!
    state.match_data.get().clone()
}
```

**Issue:**
- Shows ALL cards to ALL players
- No privacy filtering
- Cheating possible

**Should Use:** `player_view` query only (which hides opponent cards)

---

### 8. Config Loading Race Condition

**Location:** `frontend/lib/lineraClient.ts` + `frontend/hooks/useWhotGame.ts`

**Problem:** GameClient might mount before config is loaded

**Flow:**
```
1. App starts
2. ConfigLoader fetches /config.json (async)
3. GameClient mounts
4. useWhotGame runs immediately
5. getGlobalConfig() fails → "Config not ready yet"
```

**Evidence:**
```typescript
// Line 42-50 in useWhotGame
try {
  const config = getGlobalConfig();
} catch (e) {
  console.error("Config not ready yet", e); // ← Happens frequently
}
```

---

## System Design Issues

### Missing Event Flow

**Current (Broken):**
```
Frontend → GraphQL → USER_CHAIN → PLAY_CHAIN
                          ↑
                          |
                    (no events back)
```

**Needed:**
```
PLAY_CHAIN
   │ emits events
   ↓
USER_CHAIN_1 (subscribed) ← Frontend polls this
USER_CHAIN_2 (subscribed) ← Frontend polls this
```

---

### Deployment Architecture (Docker)

**Current Setup (`run.bash`):**
```bash
# Player 1
PLAY_CHAIN      # Hosts the game
USER_CHAIN_1    # Player 1's client chain

# Player 2
USER_CHAIN_2    # Player 2's client chain

# Services
Port 8081: Player 1 GraphQL (sees PLAY_CHAIN + USER_CHAIN_1)
Port 8082: Player 2 GraphQL (sees USER_CHAIN_2)

# Web Frontends
Port 3001: Player 1 UI
Port 3002: Player 2 UI
```

**Issue:** Asymmetric - Player 1 has two chains, Player 2 has one

---

## What Actually Works

✅ Deployment creates chains correctly  
✅ Application is deployed to PLAY_CHAIN  
✅ Player 2 has bytecode (via `request-application`)  
✅ Frontend can send mutations  
✅ Mutations execute on USER_CHAIN  

---

## What's Broken

❌ No event subscription (critical)  
❌ No event handlers (critical)  
❌ Frontend queries wrong chain  
❌ No state sync between chains  
❌ Player chain IDs not tracked  
❌ Config loading race condition  

---

## Testing Flow (Currently Failing)

```bash
# 1. Start system
docker compose up --build

# 2. Player 1 joins (http://localhost:3001)
→ Opens in browser ✓
→ Config loads ✓
→ Clicks "Join Game" ✓
→ Sees "Waiting for players..." ✓

# 3. Player 2 joins (http://localhost:3002)
→ Opens in browser ✓
→ Config loads ✓
→ Clicks "Join Game" ✓
→ Player 1 should see "Player 2 joined!" ✗ FAILS
→ Player 2 should see "Joined game" ✗ FAILS

# 4. Player 1 starts game
→ Clicks "Start Match" (button disabled - needs 2 players)
→ Both players should see "Game started" ✗ FAILS (can't start)

# 5. Game actions
→ Players can't see each other's moves ✗ FAILS
→ Turn doesn't switch ✗ FAILS
→ Cards don't update ✗ FAILS
```

**Root Cause:** Steps 3-5 all fail because of missing event system (issues #1 and #2)

---

## Core Problem Summary

The multiplayer flow has all the pieces **except the event-driven synchronization**:

1. ✅ Chains are created
2. ✅ Cross-chain messages work
3. ❌ **Events are not subscribed to**
4. ❌ **Events are not handled**
5. ❌ **State is not synced**

Without event subscription and handling, players exist in isolated bubbles - they can send messages but never receive updates about the game state.

---

## Key Differences from inspo-code

| Aspect | Inspo-builds | Linot |
|--------|-----------|-------|
| Event Subscription | ✓ Automatic on join | ✗ Not implemented |
| Event Handlers | ✓ Processes events | ✗ Not implemented |
| Frontend Queries | Queries USER_CHAIN | Queries PLAY_CHAIN (wrong) |
| State Sync | ✓ Via events | ✗ No mechanism |
| Player Chain Tracking | ✓ Stored in state | ✗ Not stored |
