# Complete Whot Game Flow: Queries & Mutations Guide

**Purpose:** This document provides the complete API reference for implementing a full Whot card game from creation to completion, including all GraphQL mutations, queries, and event subscriptions needed.

---

## Table of Contents

1. [Game Flow Overview](#game-flow-overview)
2. [Phase 1: Match Setup](#phase-1-match-setup)
3. [Phase 2: Game Start](#phase-2-game-start)
4. [Phase 3: Gameplay Loop](#phase-3-gameplay-loop)
5. [Phase 4: Special Cards](#phase-4-special-cards)
6. [Phase 5: End Game](#phase-5-end-game)
7. [Complete API Reference](#complete-api-reference)
8. [Event Subscriptions](#event-subscriptions)
9. [Error Handling](#error-handling)

---

## Game Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE GAME LIFECYCLE                       │
└─────────────────────────────────────────────────────────────────┘

1. CREATE MATCH (Player 1)
   │
   ▼
2. PLAYER 2 JOINS
   │
   ▼
3. START GAME (Player 1)
   │
   ▼
4. DEAL CARDS (Backend)
   │
   ▼
5. GAMEPLAY LOOP
   │  ├─► Play Card
   │  ├─► Draw Card  
   │  ├─► Call "Last Card"
   │  └─► Handle Special Cards
   │
   ▼
6. WIN CONDITION MET
   │
   ▼
7. GAME ENDS
```

---

## Phase 1: Match Setup

### Step 1.1: Player 1 Creates Match

**Purpose:** Initialize a new game on Player 1's chain, which becomes the PLAY_CHAIN.

**Mutation:**
```graphql
mutation CreateMatch {
  createMatch(
    maxPlayers: 2,
    nickname: "Alice"
  )
}
```

**Backend Flow:**
```rust
Operation::CreateMatch { max_players: 2, nickname: "Alice" }
  ├─► Validate: 2 <= max_players <= 6
  ├─► Create MatchData with Player 1 as host
  ├─► Set match status: Waiting
  ├─► Emit: GameEvent::MatchCreated
  └─► Return: LinotResponse::Ok
```

**Response:**
```json
{
  "data": {
    "createMatch": "Ok"
  }
}
```

**State After:**
```rust
MatchData {
    players: [Some(Player { nickname: "Alice", ... }), None],
    deck: [],  // Not dealt yet
    discard_pile: [],
    current_player_index: 0,
    status: Waiting,
    max_players: 2,
}
```

**Event Emitted:**
```rust
GameEvent::MatchCreated {
    match_id: PLAY_CHAIN_ID,
    host: "Alice",
    max_players: 2,
}
```

### Step 1.2: Get Match Info (Player 1)

**Purpose:** Retrieve the PLAY_CHAIN_ID to share with Player 2.

**Query:**
```graphql
query GetPlayChain {
  playChain
}
```

**Response:**
```json
{
  "data": {
    "playChain": "e476187f7b35d...a9c1b2d3e4f5"
  }
}
```

**Frontend Action:** Display PLAY_CHAIN_ID for Player 2 to copy.

### Step 1.3: Player 2 Subscribes to Events

**Purpose:** Ensure Player 2 receives all game events from PLAY_CHAIN.

**Mutation:**
```graphql
mutation Subscribe {
  subscribe(
    playChainId: "e476187f7b35d...a9c1b2d3e4f5"
  )
}
```

**Backend Flow:**
```rust
Operation::Subscribe { play_chain_id }
  ├─► runtime.subscribe_to_events(play_chain_id, app_id, GAME_STREAM_NAME)
  ├─► state.subscribed_play_chain.set(Some(play_chain_id))
  └─► Return: LinotResponse::Ok
```

### Step 1.4: Player 2 Joins Match

**Purpose:** Add Player 2 to the game.

**Mutation:**
```graphql
mutation JoinMatch {
  joinMatch(
    playChainId: "e476187f7b35d...a9c1b2d3e4f5",
    nickname: "Bob"
  )
}
```

**Backend Flow:**
```rust
// On Player 2's USER_CHAIN
Operation::JoinMatch { play_chain_id, nickname: "Bob" }
  ├─► Send Message::RequestJoin to PLAY_CHAIN
  ├─► Update local state: subscribed_play_chain, player_nickname
  └─► Return: LinotResponse::Ok

// On PLAY_CHAIN (via execute_message)
Message::RequestJoin { player_owner, player_chain, nickname: "Bob" }
  ├─► Find empty slot in match_data.players
  ├─► Add Player 2: players[1] = Some(Player { nickname: "Bob", ... })
  ├─► Emit: GameEvent::PlayerJoined
  └─► Done
```

**Event Emitted:**
```rust
GameEvent::PlayerJoined {
    nickname: "Bob",
    player_count: 2,
}
```

### Step 1.5: Both Players Query Match Info

**Purpose:** Verify both players are in the lobby.

**Query:**
```graphql
query MatchInfo {
  matchInfo {
    playerCount
    maxPlayers
    status
  }
}
```

**Response:**
```json
{
  "data": {
    "matchInfo": {
      "playerCount": 2,
      "maxPlayers": 2,
      "status": "Waiting"
    }
  }
}
```

---

## Phase 2: Game Start

### Step 2.1: Player 1 Starts the Match

**Purpose:** Deal cards and begin gameplay.

**Mutation:**
```graphql
mutation StartMatch {
  startMatch
}
```

**Backend Flow:**
```rust
Operation::StartMatch
  ├─► Validate: player_count >= 2
  ├─► Create and shuffle deck (59 cards total)
  │   ├─► Circle, Triangle, Cross, Square: 1-14 each (56 cards)
  │   ├─► Star: 1-7 (7 cards)
  │   └─► Whot: 5 cards
  ├─► Deal 6 cards to each player
  ├─► Place 1 card on discard pile (top card)
  ├─► Set status: InProgress
  ├─► Emit: GameEvent::MatchStarted
  └─► Return: LinotResponse::Ok
```

**Event Emitted:**
```rust
GameEvent::MatchStarted {
    players: ["Alice", "Bob"],
    first_player: "Alice",
    top_card: Card { suit: Triangle, value: 8 },
}
```

### Step 2.2: Players Receive Their Hands

**Query (Each Player):**
```graphql
query MyHand {
  myHand {
    suit
    value
  }
}
```

**Response (Player 1 - Alice):**
```json
{
  "data": {
    "myHand": [
      { "suit": "Circle", "value": 3 },
      { "suit": "Triangle", "value": 8 },
      { "suit": "Whot", "value": 20 },
      { "suit": "Cross", "value": 12 },
      { "suit": "Star", "value": 5 },
      { "suit": "Square", "value": 1 }
    ]
  }
}
```

**Note:** Each player only sees their own hand (privacy enforced by backend).

### Step 2.3: Check Current Game State

**Query:**
```graphql
query GameState {
  matchState {
    players {
      nickname
      handSize
      calledLastCard
    }
    status
    currentPlayerIndex
    deckSize
    discardPile {
      suit
      value
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "matchState": {
      "players": [
        {
          "nickname": "Alice",
          "handSize": 6,
          "calledLastCard": false
        },
        {
          "nickname": "Bob",
          "handSize": 6,
          "calledLastCard": false
        }
      ],
      "status": "InProgress",
      "currentPlayerIndex": 0,
      "deckSize": 46,
      "discardPile": [
        { "suit": "Triangle", "value": 8 }
      ]
    }
  }
}
```

---

## Phase 3: Gameplay Loop

### Step 3.1: Play a Valid Card

**Purpose:** Current player plays a card that matches suit or value.

**Preconditions:**
- It's your turn (`currentPlayerIndex` points to you)
- Card matches top card's suit OR value (or is Whot)

**Mutation:**
```graphql
mutation PlayCard {
  playCard(
    cardIndex: 1,      # Index in player's hand
    chosenSuit: null   # Only needed for Whot cards
  )
}
```

**Backend Flow:**
```rust
// Player on USER_CHAIN
Operation::PlayCard { card_index: 1, chosen_suit: None }
  ├─► Send Message::PlayCardAction to PLAY_CHAIN
  └─► Return: LinotResponse::Ok

// On PLAY_CHAIN
Message::PlayCardAction { player_owner, card_index: 1, chosen_suit: None }
  ├─► Verify: current player matches player_owner
  ├─► Validate: card_index < hand.len()
  ├─► Get card: hand[1] = Triangle 8
  ├─► Validate: is_valid_play(Triangle 8, top_card: Triangle 8) ✓
  ├─► Remove card from hand  ├─► Add to discard_pile
  ├─► Check win: hand.is_empty()? → No (still has 5 cards)
  ├─► Determine special effect (if any)
  ├─► Advance to next player
  ├─► Emit: GameEvent::CardPlayed
  └─► Done
```

**Event Emitted:**
```rust
GameEvent::CardPlayed {
    player_nickname: "Alice",
    card: Card { suit: Triangle, value: 8 },
    next_player: "Bob",
    special_effect: None,  // Regular card, no effect
}
```

**State After:**
```rust
match_data.players[0].hand_size = 5  // Alice now has 5 cards
match_data.discard_pile.push(Triangle 8)
match_data.current_player_index = 1  // Bob's turn
```

### Step 3.2: Draw a Card (Can't Play)

**Purpose:** Player has no valid cards, must draw from deck.

**Mutation:**
```graphql
mutation DrawCard {
  drawCard
}
```

**Backend Flow:**
```rust
// On USER_CHAIN
Operation::DrawCard
  ├─► Send Message::DrawCardAction to PLAY_CHAIN
  └─► Return: LinotResponse::Ok

// On PLAY_CHAIN
Message::DrawCardAction { player_owner }
  ├─► Verify: current player matches player_owner
  ├─► Pop card from deck
  ├─► Add to player's hand
  ├─► Update deck_size
  ├─► Advance to next player
  ├─► Emit: GameEvent::CardsDrawn
  └─► Done
```

**Event Emitted:**
```rust
GameEvent::CardsDrawn {
    player_nickname: "Bob",
    count: 1,
    next_player: "Alice",
}
```

### Step 3.3: Call "Last Card"

**Purpose:** Announce when you have one card left (game rule).

**Mutation:**
```graphql
mutation CallLastCard {
  callLastCard
}
```

**When to Call:**
- After playing a card and having exactly 1 card remaining
- Must call before next player's turn

**Backend Flow:**
```rust
Operation::CallLastCard
  ├─► Send Message::CallLastCardAction to PLAY_CHAIN
  └─► Return: LinotResponse::Ok

Message::CallLastCardAction { player_owner }
  ├─► Find player by owner
  ├─► Set player.called_last_card = true
  ├─► Emit: GameEvent::LastCardCalled
  └─► Done
```

**Event Emitted:**
```rust
GameEvent::LastCardCalled {
    player_nickname: "Alice",
}
```

**Penalty Rule (Not fully implemented yet):**
- If you don't call last card and opponent notices, you draw 2 penalty cards

---

## Phase 4: Special Cards

### 4.1: Whot Card (Wild Card)

**Card:** Any card with `suit: Whot, value: 20`

**Mutation:**
```graphql
mutation PlayWhotCard {
  playCard(
    cardIndex: 2,
    chosenSuit: "Circle"  # Player chooses new suit
  )
}
```

**Backend Flow:**
```rust
Message::PlayCardAction { card_index: 2, chosen_suit: Some(Circle) }
  ├─► Card is Whot (always valid to play)
  ├─► Remove from hand
  ├─► Add to discard_pile
  ├─► Special effect: WhotPlayed { chosen_suit: Circle }
  ├─► Next player must play Circle or another Whot
  ├─► Emit: GameEvent::CardPlayed with special_effect
  └─► Done
```

**Event Emitted:**
```rust
GameEvent::CardPlayed {
    player_nickname: "Alice",
    card: Card { suit: Whot, value: 20 },
    next_player: "Bob",
    special_effect: Some(SpecialEffect::WhotPlayed { chosen_suit: Circle }),
}
```

**Frontend Logic:**
```javascript
// After Whot is played, next valid plays are:
// - Any Circle card
// - Another Whot card
```

### 4.2: Pick Two (Value 2)

**Card:** Any card with `value: 2` (except Star suit)

**Effect:** Next player must draw 2 cards OR play another Pick Two to stack.

**Backend Flow:**
```rust
// Special effect detected
get_special_effect(card: Circle 2)
  └─► Some(SpecialEffect::PickTwo)

// Next player's options:
// 1. Play another Pick Two (stacks to Pick Four)
// 2. Draw 2 cards and skip turn
```

**Event:**
```rust
GameEvent::CardPlayed {
    card: Card { suit: Circle, value: 2 },
    special_effect: Some(SpecialEffect::PickTwo),
    ...
}
```

**Implementation Note:** Stacking logic needs enhancement in contract.

### 4.3: Pick Three (Value 5, Non-Star)

**Card:** Any `value: 5` except `Star` suit

**Effect:** Next player draws 3 cards (cannot stack).

**Event:**
```rust
GameEvent::CardPlayed {
    card: Card { suit: Triangle, value: 5 },
    special_effect: Some(SpecialEffect::PickThree),
    ...
}
```

### 4.4: Hold On (Value 1)

**Card:** Any card with `value: 1`

**Effect:** Next player's turn is skipped.

**Event:**
```rust
GameEvent::CardPlayed {
    card: Card { suit: Cross, value: 1 },
    special_effect: Some(SpecialEffect::HoldOn),
    ...
}
```

**Backend Enhancement Needed:**
```rust
// In get_next_player_index(), check for HoldOn effect
// and skip one player
```

### 4.5: General Market (Value 14)

**Card:** Any card with `value: 14`

**Effect:** ALL other players draw 1 card each.

**Event:**
```rust
GameEvent::CardPlayed {
    card: Card { suit: Square, value: 14 },
    special_effect: Some(SpecialEffect::GeneralMarket),
    ...
}
```

**Backend Enhancement Needed:**
```rust
// Loop through all players except current
// Add 1 card to each player's hand
// Emit separate CardsDrawn events
```

---

## Phase 5: End Game

### Step 5.1: Win Condition

**Trigger:** A player's hand becomes empty after playing a card.

**Backend Flow (Automatic):**
```rust
Message::PlayCardAction { ... }
  ├─► Remove card from hand
  ├─► Check: hand.is_empty()? → YES
  ├─► Set status: Finished
  ├─► Set winner_index: current_player_index
  ├─► Emit: GameEvent::MatchEnded
  └─► Return early (game over)
```

**Event Emitted:**
```rust
GameEvent::MatchEnded {
    winner: "Alice",
    winner_index: 0,
}
```

### Step 5.2: Query Final State

**Query:**
```graphql
query FinalState {
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

**Response:**
```json
{
  "data": {
    "matchState": {
      "status": "Finished",
      "winnerIndex": 0,
      "players": [
        { "nickname": "Alice", "handSize": 0 },
        { "nickname": "Bob", "handSize": 3 }
      ]
    }
  }
}
```

### Step 5.3: Leave Match

**Mutation:**
```graphql
mutation LeaveMatch {
  leaveMatch
}
```

**Backend Flow:**
```rust
Operation::LeaveMatch
  ├─► Set user_status: Idle
  ├─► Clear subscribed_play_chain
  ├─► Clear local_match
  └─► Return: LinotResponse::Ok
```

---

## Complete API Reference

### Mutations (Operations)

| Mutation | Parameters | When to Use | Returns |
|----------|-----------|-------------|---------|
| `subscribe` | `playChainId: ChainId` | Before joining a match | `LinotResponse` |
| `unsubscribe` | `playChainId: ChainId` | When leaving | `LinotResponse` |
| `createMatch` | `maxPlayers: u8, nickname: String` | Start new game as host | `LinotResponse` |
| `joinMatch` | `playChainId: ChainId, nickname: String` | Join existing game | `LinotResponse` |
| `startMatch` | None | Host starts game (after all joined) | `LinotResponse` |
| `playCard` | `cardIndex: usize, chosenSuit: CardSuit?` | Play a card on your turn | `LinotResponse` |
| `drawCard` | None | Draw from deck (can't play) | `LinotResponse` |
| `callLastCard` | None | When you have 1 card left | `LinotResponse` |
| `leaveMatch` | None | Exit the game | `LinotResponse` |

### Queries

| Query | Returns | Purpose |
|-------|---------|---------|
| `matchState` | `MatchData` | Full game state (players, deck size, discard pile, etc.) |
| `myHand` | `[Card]` | Your current cards (private) |
| `matchInfo` | `MatchInfo` | Public info (player count, status, top card) |
| `myNickname` | `String?` | Your current nickname |
| `playChain` | `ChainId?` | The PLAY_CHAIN you're connected to |
| `userStatus` | `UserStatus` | Your current state (Idle, InMatch, MatchFinished) |

### Types

```graphql
type Card {
  suit: CardSuit!
  value: Int!
}

enum CardSuit {
  Circle
  Triangle
  Cross
  Square
  Star
  Whot
}

type Player {
  chainId: ChainId!
  owner: AccountOwner!
  nickname: String!
  handSize: Int!
  calledLastCard: Boolean!
}

type MatchData {
  players: [Player]!
  discardPile: [Card]!
  currentPlayerIndex: Int!
  status: MatchStatus!
  winnerIndex: Int
  maxPlayers: Int!
  deckSize: Int!
}

enum MatchStatus {
  Waiting
  InProgress
  Finished
}

type MatchInfo {
  playerCount: Int!
  maxPlayers: Int!
  status: MatchStatus!
  deckSize: Int!
  topCard: Card
}
```

---

## Event Subscriptions

### How to Listen for Events (Frontend)

```javascript
// WebSocket or polling approach
async function subscribeToGameEvents(playChainId) {
  // Poll every 500ms for new events
  setInterval(async () => {
    const response = await fetch(`http://localhost:8081`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            matchState {
              players { nickname handSize }
              currentPlayerIndex
              status
              discardPile { suit value }
            }
          }
        `
      })
    });
    
    const data = await response.json();
    updateUI(data.matchState);
  }, 500);
}
```

### Events to Handle

| Event | When Fired | Frontend Action |
|-------|-----------|-----------------|
| `MatchCreated` | Host creates game | Show lobby, display PLAY_CHAIN_ID |
| `PlayerJoined` | Player joins | Update player list |
| `MatchStarted` | Game begins | Show game board, deal cards |
| `CardPlayed` | Card played | Update discard pile, advance turn |
| `CardsDrawn` | Card(s) drawn | Update hand size, advance turn |
| `LastCardCalled` | Player calls last card | Show notification |
| `MatchEnded` | Game finishes | Show winner screen |

---

## Error Handling

### Common Errors & Solutions

#### 1. "Not your turn"

**Error Response:**
```json
{
  "data": {
    "playCard": "Error(\"Not the current player's turn\")"
  }
}
```

**Solution:** Check `currentPlayerIndex` before allowing play.

```javascript
const isMyTurn = matchState.currentPlayerIndex === myPlayerIndex;
if (!isMyTurn) {
  disablePlayButton();
}
```

#### 2. "Invalid card play"

**Error:** Card doesn't match suit or value.

**Validation (Frontend):**
```javascript
function canPlayCard(card, topCard) {
  // Whot can always be played
  if (card.suit === 'Whot') return true;
  
  // Must match suit or value
  return card.suit === topCard.suit || card.value === topCard.value;
}

// Filter playable cards
const playableCards = myHand.filter(card => 
  canPlayCard(card, matchState.discardPile[matchState.discardPile.length - 1])
);
```

#### 3. "Not enough players"

**Error when starting:**
```json
{
  "data": {
    "startMatch": "Error(\"Not enough players. Need at least 2\")"
  }
}
```

**Solution:** Disable "Start" button until `playerCount >= 2`.

#### 4. "Invalid card index"

**Error:** Card index out of bounds.

**Prevention:**
```javascript
// Ensure index is valid before mutation
if (cardIndex < 0 || cardIndex >= myHand.length) {
  console.error('Invalid card index');
  return;
}
```

---

## Complete Game Flow Example

### Scenario: 2-Player Game

```
Time | Player | Action | Mutation/Query | Event Emitted
-----|--------|--------|----------------|---------------
T0   | Alice  | Create match | createMatch(...) | MatchCreated
T1   | Alice  | Get play chain | playChain | -
T2   | Bob    | Subscribe | subscribe(...) | -
T3   | Bob    | Join match | joinMatch(...) | PlayerJoined
T4   | Alice  | Check lobby | matchInfo | -
T5   | Bob    | Check lobby | matchInfo | -
T6   | Alice  | Start game | startMatch | MatchStarted
T7   | Alice  | Get hand | myHand | -
T8   | Bob    | Get hand | myHand | -
T9   | Alice  | Play Triangle 8 | playCard(1) | CardPlayed
T10  | Bob    | Play Triangle 12 | playCard(3) | CardPlayed
T11  | Alice  | Play Whot (→ Circle) | playCard(2, "Circle") | CardPlayed (Whot)
T12  | Bob    | No Circle - draw | drawCard | CardsDrawn
T13  | Alice  | Play Circle 7 | playCard(0) | CardPlayed
T14  | Bob    | Play Circle 2 (Pick Two) | playCard(1) | CardPlayed (PickTwo)
T15  | Alice  | Must draw 2 | drawCard (×2) | CardsDrawn
T16  | Bob    | Play Star 5 | playCard(2) | CardPlayed
T17  | Alice  | Play Star 1 (Hold On) | playCard(4) | CardPlayed (HoldOn)
T18  | -      | Bob's turn skipped | - | -
T19  | Alice  | Play last card | playCard(0) | CardPlayed
T20  | Alice  | Call last card | callLastCard | LastCardCalled
T21  | Bob    | Play card | playCard(1) | CardPlayed
T22  | Alice  | WIN (play final card) | playCard(0) | MatchEnded
```

---

## Frontend Integration Checklist

- [ ] **Match Creation**
  - [ ] Call `createMatch` mutation
  - [ ] Display PLAY_CHAIN_ID for sharing
  - [ ] Poll `matchInfo` to see when Player 2 joins

- [ ] **Joining**
  - [ ] Call `subscribe` first
  - [ ] Call `joinMatch` with PLAY_CHAIN_ID
  - [ ] Show "Waiting for host to start..."

- [ ] **Game Start**
  - [ ] Enable "Start" button only for host when `playerCount >= 2`
  - [ ] Call `startMatch`
  - [ ] Query `myHand` to get cards
  - [ ] Query `matchState` for game board

- [ ] **Gameplay**
  - [ ] Disable actions when not your turn
  - [ ] Highlight valid cards (suit/value match or Whot)
  - [ ] Show "Draw" button when no valid cards
  - [ ] Prompt "Call Last Card" when `handSize === 1`
  - [ ] Handle special card effects (show UI indicators)

- [ ] **Real-Time Updates**
  - [ ] Poll `matchState` every 500ms
  - [ ] Update UI when `currentPlayerIndex` changes
  - [ ] Update discard pile display
  - [ ] Update all player hand sizes

- [ ] **End Game**
  - [ ] Detect `status === "Finished"`
  - [ ] Show winner screen
  - [ ] Offer "Leave Match" button

---

## Summary

**Minimum Viable Flow:**

1. **Setup:** `createMatch` → `subscribe` → `joinMatch` → `startMatch`
2. **Core Loop:** `playCard` OR `drawCard` (repeat until win)
3. **Optional:** `callLastCard` when 1 card left
4. **End:** Detect `MatchEnded` event, show winner, `leaveMatch`

**Key Queries to Poll:**
- `matchState` - Complete game state (every 500ms during gameplay)
- `myHand` - Your cards (refresh after every action)

**Critical Events:**
- `PlayerJoined` - Update lobby
- `MatchStarted` - Transition to game screen
- `CardPlayed` - Update board
- `MatchEnded` - Show winner

This API provides everything needed for a complete Whot game experience! 🎮