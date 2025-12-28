# Frontend Screens Guide - Whot Card Game

## Screen Flow Overview

```
┌──────────┐
│   HOME   │ (Player selection: Create or Join)
└────┬─────┘
     │
     ├─► CREATE MATCH ──► LOBBY ──► GAME BOARD for Player 1 ──► WINNER/LOSER
     │
     └─► JOIN MATCH ────► LOBBY ──► GAME BOARD for Player 2 ──► WINNER/LOSER
```

---

## 1. Home Screen [Needs touch up]

**Path:** `/`

**Purpose:** Initial entry point - Play screen pops up [Change play button to Connect], after user clicks that, rules are shown. 

**UI Elements:**
- App title/logo
- Player nickname input


**Actions:**
- Enter details screen  → Navigate to Create Match or Join Match Screens

---

## 2. Create Match Screen (Player 1 Only)

**Path:** `/create`

**Purpose:** Host sets up a new game.

**UI Elements:**
- Nickname display
- Max players selector (2-6)
- "Create Game" button
- Loading indicator

**GraphQL:**
```graphql
mutation {
  createMatch(maxPlayers: 2, nickname: "Alice")
}

query {
  playChain  
  # Get PLAY_CHAIN_ID to share as it's important for player 2 to join the game
}
```

**Actions:**
- Click "Create" → Call mutation → Show PLAY_CHAIN_ID
- Automatically navigate to Lobby

---

## 3. Join Match Screen (Player 2+)

**Path:** `/join`

**Purpose:** Join an existing game using PLAY_CHAIN_ID.

**UI Elements:**
- Nickname display
- PLAY_CHAIN_ID input field (paste from Player 1)
- "Join Game" button
- Loading indicator

**GraphQL:**
```graphql
mutation {
  subscribe(playChainId: "...")
  joinMatch(playChainId: "...", nickname: "Bob")
}
```

**Actions:**
- Paste PLAY_CHAIN_ID → Click "Join" → Navigate to Lobby

---

## 4. Lobby Screen (All Players)

**Path:** `/lobby`

**Purpose:** Waiting room until host starts the game.

**UI Elements:**
- **PLAY_CHAIN_ID** (display for sharing)
- **Player list** with nicknames
- **Player count** (e.g., "2/2 players")
- **"Start Game" button** (host only, enabled when ≥2 players)
- **Status message** ("Waiting for players... - for player 1" or "Waiting to join... - for player 2")

**GraphQL:**
```graphql
# Poll every 1 second
query {
  matchInfo {
    playerCount
    maxPlayers
    status
  }
}
```

---

## 5. Game Board Screen (Main Gameplay)

**Path:** `/game`

**Purpose:** The main game interface where cards are played.

**UI Sections:**

### Top Section
- **Opponent info**: Nickname, hand size, "Last Card!" indicator
- **Deck pile**: Remaining cards count
- **Discard pile**: Top card (large display)

### Middle Section  
- **Turn indicator**: "Your Turn" or "Waiting for [Player Name]..."
- **Special effect banner**: "Pick Two!", "Hold On!", etc.

### Bottom Section
- **Your hand**: Card display with suit/value
  - Playable cards highlighted
  - Non-playable cards greyed out
- **Action buttons**:
  - "Draw Card" (when no valid plays)
  - "Call Last Card!" (when hand size = 1)

### Sidebar (Optional)
- **Game log**: Recent plays
- **Players list**: All players with hand sizes

**GraphQL:**
```graphql
# Poll every 500ms
query {
  matchState {
    players { nickname handSize calledLastCard }
    currentPlayerIndex
    status
    deckSize
    discardPile { suit value }
  }
  
  myHand {
    suit
    value
  }
}

# On actions
mutation {
  playCard(cardIndex: 0, chosenSuit: null)
  # OR
  drawCard
  # OR
  callLastCard
}
```

**Interactions:**
- Click card → If Whot, show suit selector modal → Call `playCard` mutation
- Click "Draw" → Call `drawCard` mutation
- Click "Call Last Card!" → Call `callLastCard` mutation

**Transitions:**
- When [status](file:///home/dinahmaccodes/Documents/linot-card-game/inspo-multi/microcard-master/blackjack/src/service.rs#84-87) changes to `Finished` → Navigate to Winner Screen

---

## 6. Winner Screen

**Path:** `/winner`

**Purpose:** Display game results.

**UI Elements:**
- **Winner announcement**: "🎉 [Winner Name] Wins!"
- **Final standings**: All players with final hand sizes
- **Game stats** (optional): Total cards played, special cards used
- **"Play Again" button** → Back to Home
- **"Leave" button** → Call `leaveMatch`, back to Home

**GraphQL:**
```graphql
query {
  matchState {
    status
    winnerIndex
    players {
      nickname
      handSize
    }
  }
}
```

---

## 7. Whot Card Modal (Overlay)

**Triggered:** When playing a Whot card.

**Purpose:** Let player choose the next suit.

**UI Elements:**
- Modal overlay
- "Choose a suit:" title
- 5 suit buttons: Circle, Triangle, Cross, Square, Star
- Each button shows suit icon

**Action:**
- Click suit → Call `playCard(cardIndex, chosenSuit)` → Close modal

---

## 8. Error/Disconnection Screen (Optional)

**Path:** `/error`

**Purpose:** Handle network issues or invalid states.

**UI Elements:**
- Error message
- "Retry" button
- "Back to Home" button

**Triggers:**
- GraphQL mutation failures
- Network timeout
- Invalid PLAY_CHAIN_ID

---

## Screen State Management

### Shared State Needed Across Screens

```javascript
// Global state (e.g., React Context, Zustand, Redux)
{
  playerNickname: "Alice",
  playChainId: "e476187f...",
  myPlayerIndex: 0,
  isHost: true,
  gameStatus: "InProgress",  // Waiting, InProgress, Finished
}
```

### Navigation Logic

```javascript
// Pseudo-code
if (status === "Waiting") {
  navigate("/lobby");
} else if (status === "InProgress") {
  navigate("/game");
} else if (status === "Finished") {
  navigate("/winner");
}
```

---

## Responsive Design Notes

**Mobile:**
- Stack cards vertically in hand
- Simplified layout for small screens
- Swipe to see all cards

**Desktop:**
- Cards spread horizontally
- Sidebar for game log
- Larger card visuals

---

## Summary Checklist

- [ ] **Home** - Nickname + Create/Join choice
- [ ] **Create Match** - Setup game, get PLAY_CHAIN_ID
- [ ] **Join Match** - Enter PLAY_CHAIN_ID
- [ ] **Lobby** - Wait for players, start game
- [ ] **Game Board** - Main gameplay (play/draw cards)
- [ ] **Winner** - Game over, show results
- [ ] **Whot Modal** - Suit selection overlay
- [ ] **Error** - Handle failures gracefully

**Total Core Screens:** 6 main + 2 overlays = 8 screens

---

## Quick Implementation Order

1. **Home** → Basic routing
2. **Create/Join** → Backend mutations working
3. **Lobby** → Polling + player list
4. **Game Board** → Core gameplay loop
5. **Winner** → End state
6. **Whot Modal** → Special card handling
7. **Polish** → Error handling, animations, responsive design

This covers the complete user journey from start to finish! 🎮