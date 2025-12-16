# Backend Operations - ACTUAL GraphQL Mutations

## Real Operations (from backend/src/lib.rs)

Your backend defines these **actual** operations:

```rust
pub enum Operation {
    Subscribe { play_chain_id: ChainId },      // ❌ NOT exposed as GraphQL mutation
    Unsubscribe { play_chain_id: ChainId },    // ❌ NOT exposed as GraphQL mutation
    CreateMatch { max_players: u8, nickname: String },
    JoinMatch { play_chain_id: ChainId, nickname: String },
    StartMatch,
    PlayCard { card_index: usize, chosen_suit: Option<CardSuit> },
    DrawCard,
    CallLastCard,
    ChallengeLastCard { player_index: usize },
    CheckTimeout,
    LeaveMatch,
}
```

## The Problem

**Subscribe/Unsubscribe** are defined in the Operation enum BUT they are likely:
1. Internal operations for cross-chain messaging setup
2. NOT exposed as GraphQL mutations (that's why you get "Unknown field")
3. Handled automatically by the contract internally

## Real Multiplayer Flow (Based on Backend Contract)

### Player 1 Flow:
1. **CreateMatch** - Creates a match on their chain
2. **StartMatch** - Starts the game when ready

### Player 2 Flow:
1. **JoinMatch** - Joins the match by sending cross-chain message to play chain

