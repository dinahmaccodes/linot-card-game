# Linot - Multiplayer Card Game on Linera

> A fully on-chain multiplayer card game built on the Linera blockchain platform. Play the classic Whot card game across multiple microchains with real-time cross-chain state synchronization.

## Overview

Linot is a decentralized multiplayer card game that demonstrates Linera's multi-chain architecture and cross-application messaging capabilities. Two players on separate chains can create, join, and play synchronized card games with real-time updates powered by Linera's event streaming system.

### Key Features

- **Multi-Chain Gameplay**: Players interact from separate USER_CHAINs while game state runs on a dedicated PLAY_CHAIN
- **Real-Time Synchronization**: Event-driven architecture ensures instant game state updates across all chains
- **Cross-Chain Messaging**: Seamless communication between player chains and the central game chain
- **Special Card Mechanics**: Hold On, Pick Two, Pick Three, General Market, and Whot (wild card) effects
- **Win Detection**: Automatic game-end detection with winner/loser ranking

## Running with Docker

The easiest way to test Linot is using Docker as we are using the docker template:

1. Clone the repository and navigate to the project folder:

   ```bash
   git clone https://github.com/dinahmaccodes/linot-card-game.git
   cd linot-card-game
   ```

2. Start the application with Docker Compose:

   ```bash
   docker compose up --build
   ```

3. Wait for the deployment to complete. You should see the Linera services starting up in the terminal logs.

4. Open two browser windows to access the game:
   - **Player 1**: [http://localhost:5173?player=1](http://localhost:5173?player=1)
   - **Player 2**: [http://localhost:5174?player=2](http://localhost:5174?player=2)

OR

- **Player 1**: [http://localhost:5173](http://localhost:5173)
  - **Player 2**: [http://localhost:5174](http://localhost:5174)

Complete command sequence:

```bash
git clone https://github.com/dinahmaccodes/linot-card-game.git
cd linot-card-game
docker compose up --build
```

## How to Play

### Game Setup Flow

1. **Player 1 Creates a Match**:

   Using this link : <http://localhost:5173>

   - Register with a username
   - Click "Create Game" to initialize a match on the PLAY_CHAIN
   - Wait for Player 2 to join

2. **Player 2 Joins the Match**:

   Open a new tab or new browser and use this link: <http://localhost:5174>

- Register with a username
- Click "Join Game" to connect to Player 1's match
- Wait for Player 1 to start the game

1. **Player 1 Starts the Game**:
      
      Return back to this link [http://localhost:5173](http://localhost:5173) and start the game once player 2 has joined

   - Once Player 2 has joined, click "Start Match"
   - Cards are automatically dealt to both players
   - Gameplay begins with the first player's turn

2. **Gameplay**:
   - Match the **suit** or **number** of the top card on the discard pile
   - Draw a card if you cannot play
   - Use special cards strategically to gain advantage
   - First player to empty their hand wins! or Player with the least amount of card in hands when deck pile is gone wins!

### Game Rules

The game follows classic Whot rules with special card effects:

- **1 (Hold On)**: Skips the next player's turn
- **2 (Pick Two)**: Forces next player to draw 2 cards (can be blocked with another Pick Two)
- **5 (Pick Three)**: Forces next player to draw 3 cards (can be blocked with another Pick Three)
- **14 (General Market)**: All players except the one who played it draw 1 card
- **20 (Whot/Linot)**: Wild card!! - choose which suit must be played next for both players (Use it to your advantage)

Complete rules are displayed in-game via the **Rules** button during gameplay.

## Architecture

### Multi-Chain Design

Linot uses a distributed chain architecture:

1. **USER_CHAINs**: Individual player chains

   - Store player-specific state (hand, turn status)
   - Send game actions (play card, draw card, etc.)
   - Subscribe to PLAY_CHAIN events for updates

2. **PLAY_CHAIN**: Central game execution chain
   - Maintains authoritative game state
   - Validates all moves and enforces rules
   - Broadcasts events to subscribed USER_CHAINs
   - Handles special card effects and win detection

### Message Flow

```
Player 1 (USER_CHAIN) ──┐
                        ├──► PLAY_CHAIN ──► Event Broadcast
Player 2 (USER_CHAIN) ──┘                    │
         ▲                                   │
         └───────────────────────────────────┘
              (Event Subscription)
```

## Technology

### Linera Platform Features

Our implementation leverages core Linera capabilities:

**Cross-Chain Messaging**

- Custom message types for game actions (`RequestJoin`, `PlayCard`, `DrawCard`, etc.)
- Asynchronous message handling between USER_CHAINs and PLAY_CHAIN
- Implicit bytecode propagation for automatic application registration

**Event Streaming**

- Real-time state updates via `runtime.subscribe_to_events()`
- Custom event types (`PlayerJoined`, `CardPlayed`, `TurnChanged`, `MatchStarted`)
- Deferred subscription pattern for reliable multi-chain communication

**State Management**

- `linera_views` for persistent, structured state storage
- Separate state contexts for USER_CHAIN and PLAY_CHAIN logic
- Optimistic UI updates with event-based confirmation

**GraphQL API**

- Schema-driven queries for game state
- Mutations for player actions (playCard, drawCard, callLastCard)
- Chain-specific endpoints with 500ms polling for real-time updates

### Technical Stack

**Backend:**

- Rust with Linera SDK
- WebAssembly compilation target
- Custom game logic implementation

**Frontend:**

- Next.js 15 with TypeScript
- GraphQL client with real-time polling
- Responsive UI with game state visualization

**Infrastructure:**

- Docker & Docker Compose
- Linera local network (multiple validator nodes)
- Multi-chain application deployment

## Project Status

### Implemented Features

- ✅ Cross-chain multiplayer architecture with deferred subscriptions
- ✅ Full game logic (dealing, validation, special cards, win detection)
- ✅ Event-driven state synchronization across chains
- ✅ GraphQL mutations and queries for all game actions
- ✅ Two-player frontend with real-time updates
- ✅ Special card effects (Hold On, Pick Two, Pick Three, General Market, Whot)
- ✅ In-game rules display

### Wave 5 Submission

**Submission Type:** Multiplayer Implementation  
**Repository:** [github.com/dinahmaccodes/linot-card-game](https://github.com/dinahmaccodes/linot-card-game)

#### Wave 5 Achievements

**Backend & Smart Contract Development:**

- Implemented deferred subscription pattern to solve cross-chain messaging reliability
- Fixed errors through proper chain-specific message handling
- Completed full game logic implementation in Rust smart contracts:
- Card dealing and shuffling algorithms
- Move validation (suit/value matching, special card rules)
- Turn management and player state tracking
- Special card effects execution (Hold On, Pick Two, Pick Three, General Market, Whot)
- Win condition detection and game-end handling
- Implemented proper state separation between USER_CHAIN and PLAY_CHAIN contexts
- Created comprehensive GraphQL schema with queries and mutations for all game actions
- Added automatic bytecode propagation handling for seamless multi-chain deployment

**Frontend Development:**

- Built dual-player Next.js frontend with real-time state synchronization
- Implemented GraphQL client with 500ms polling for near-instant updates
- Created comprehensive UI components:
- Player hand display with card validation indicators
- Discard pile and deck visualization
- Opponent hand count and turn indicators
- Special card notification system (Pick 2/3, Hold On, General Market, Draw alerts)
- In-game rules modal for quick reference
- Win/Lose modal flows
- Synced frontend card validation with backend logic for seamless gameplay
- Implemented suit selector modal for Whot (wild card) plays
- Added visual feedback for active suit demands and turn status

**Multiplayer Flow Integration:**

- Created complete game lifecycle: Registration → Create → Join → Start → Play → End
- Implemented event-driven state updates across both player frontends
- Synchronized game state changes (card plays, draws, turn changes) in real-time
- Built proper error handling and edge case management
- Tested and verified full gameplay from start to finish with two players

**Documentation & Deployment:**

- Created Docker-based deployment setup using Linera's template
- Wrote comprehensive documentation for multiplayer architecture patterns
- Documented all special card mechanics and blocking logic
- Created testing guides and troubleshooting resources

#### Previous Waves Summary

Building to this point required foundational work across earlier waves:

**Wave 1-2: Foundation & Planning**

- Project conceptualization and team formation
- Research into Linera's multi-chain architecture
- Initial repository setup and project structure planning
- Technology stack selection (Rust, Next.js, GraphQL)

**Wave 3: Core Development**

- Initial smart contract scaffold in Rust
- Basic game state structures and types definition
- Preliminary GraphQL schema design
- Simple frontend prototype for UI/UX validation
- Local Linera network setup and testing environment

**Wave 4: Logic Implementation & UI Development**

- Card game logic implementation (dealing, basic validation)
- Special card effect rules coding
- Minimalistic UI components development
- Initial attempt at cross-chain messaging (before deferred subscription pattern)
- Frontend-backend integration groundwork
- Debugging early multiplayer synchronization issues

These earlier waves established the groundwork that enabled Wave 5's successful multiplayer implementation. Each iteration built upon previous learnings, ultimately resulting in a fully functional cross-chain card game.

## Team

**Linot** is built with ❤️ by:

- **Dinah Macaulay** - Lead Software Developer & Smart Contract Developer  
  [@dinahmaccodes-on-github](https://github.com/dinahmaccodes) | [dinahmaccodes-on-discord](https://discordapp.com/users/dinahmaccodes)
- **Divine Macaulay Egbezien** - Project Manager & Product Designer  
  [@divine_macaulay](https://x.com/divine_macaulay)
- **Alex Benjamin** - Frontend Developer  
  [@Alex-Benjamin](https://github.com/Benalex8797)

For questions, feedback, or contributions:

- Open an issue on [GitHub](https://github.com/dinahmaccodes/linot-card-game/issues)
- Follow us on X: [@linotgame](https://x.com/linotgame)

## Acknowledgments

A huge thank you to the **Linera team** for:

- Creating an innovative blockchain platform that enables true decentralized multi-player applications
- Providing comprehensive documentation and reference implementations
- Being responsive and helpful on Discord throughout the development process
- Building the infrastructure that makes projects like Linot possible

Your work is enabling the next generation of on-chain applications, and we're excited to be part of this journey!

---

**Built on Linera** | **Deployed Locally** | **Multiplayer Ready**
