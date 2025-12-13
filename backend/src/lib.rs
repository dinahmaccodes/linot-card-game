use async_graphql::{Request, Response};
use linera_sdk::{
    abi::{ContractAbi, ServiceAbi},
    graphql::GraphQLMutationRoot,
    linera_base_types::AccountOwner,
};
use serde::{Deserialize, Serialize};
use thiserror::Error;

// Re-export ABI types
pub use whot_abi::{
    Card, CardSuit, CardValue, WhotGame, WhotPlayer, 
    PlayerView, OpponentView, GameStatus, Profile, WHOT_STREAM_NAME,
};

// Re-export for potential future use
#[allow(unused_imports)]
pub use whot_abi::WhotEvent;

// ============ Constants ============

/// Stream name for game events (multiplayer synchronization)
pub const GAME_EVENTS_STREAM: &[u8] = WHOT_STREAM_NAME;

/// Turn timeout in microseconds (3 minutes)
pub const TURN_TIMEOUT_MICROS: u64 = 3 * 60 * 1_000_000; // 180 seconds

/// Turn warning in microseconds (2 minutes)
pub const TURN_WARNING_MICROS: u64 = 2 * 60 * 1_000_000; // 120 seconds

// ============ Error Types ============

#[derive(Debug, Error)]
pub enum LinotError {
    #[error("Match already started")]
    MatchAlreadyStarted,
    
    #[error("Match not started")]
    MatchNotStarted,
    
    #[error("Match is full (max {0} players)")]
    MatchFull(u8),
    
    #[error("Player already joined")]
    PlayerAlreadyJoined,
    
    #[error("Only host can start match")]
    OnlyHostCanStart,
    
    #[error("Need at least {0} players to start")]
    NotEnoughPlayers(usize),
    
    #[error("Not your turn")]
    NotYourTurn,
    
    #[error("Invalid card index: {0}")]
    InvalidCardIndex(usize),
    
    #[error("Invalid card play: card doesn't match suit, value, or special requirements")]
    InvalidCardPlay,
    
    #[error("Invalid player index: {0}")]
    InvalidPlayerIndex(usize),
    
    #[error("Match not in progress")]
    MatchNotInProgress,
    
    #[error("No card in discard pile")]
    NoCardInDiscardPile,
    
    #[error("Betting not implemented yet")]
    BettingNotImplemented,
    
    #[error("Caller authentication required")]
    CallerRequired,
    
    #[error("Cannot play Hold On (1) without a second card")]
    HoldOnRequiresSecondCard,
    
    #[error("Must play same shape after Hold On")]
    HoldOnShapeMismatch,
    
    #[error("Cannot stack penalties - different card types")]
    CannotStackPenalties,
    
    #[error("Turn timeout - player took too long")]
    TurnTimeout,
    
    #[error("Invalid chain ID format: {0}")]
    InvalidChainId(String),
}

// ============ ABI Definition ============

pub struct LinotAbi;

impl ContractAbi for LinotAbi {
    type Operation = Operation;
    type Response = ();
}

impl ServiceAbi for LinotAbi {
    type Query = Request;
    type QueryResponse = Response;
}

// ============ Data Types ============
// Card types are now imported from whot-abi

// ============ Match Configuration ============

#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct MatchConfig {
    pub max_players: u8,
    pub host: Option<AccountOwner>,
    pub is_ranked: bool,
    pub strict_mode: bool, // Enforce must draw if no valid move
}

impl Default for MatchConfig {
    fn default() -> Self {
        Self {
            max_players: 2,
            host: None,
            is_ranked: false,
            strict_mode: false,
        }
    }
}

// ============ Operations (GraphQL Mutations) ============

#[derive(Debug, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    /// Join this match instance (local chain)
    JoinMatch {
        nickname: String,
    },

    /// Join a match on another chain (cross-chain)
    JoinFromChain {
        host_chain_id: String,
        nickname: String,
    },

    /// Start the match (host only)
    StartMatch,

    /// Play a card from your hand
    PlayCard {
        card_index: usize,
        chosen_suit: Option<CardSuit>, // Required for Whot card
    },

    /// Draw a card from the deck (when stuck or choosing to draw)
    DrawCard,

    /// Call Last Card when you have exactly 1 card
    CallLastCard,

    /// Challenge someone who forgot to call Last Card
    ChallengeLastCard {
        player_index: usize,
    },

    /// Leave the match (forfeit)
    LeaveMatch,

    /// Check if current player has timed out (anyone can call)
    CheckTimeout,

    // Wave 4-5: Betting (placeholder)
    PlaceBet {
        player_index: usize,
        amount: u64,
    },
}

// ============ Messages (Cross-Chain Communication) ============

#[derive(Debug, Deserialize, Serialize)]
pub enum Message {
    /// Join request from player on another chain
    JoinRequest {
        player: AccountOwner,
        nickname: String,
    },

    /// Play a card (sent from User Chain to Play Chain)
    PlayCard {
        player: AccountOwner,
        card_index: usize,
        chosen_suit: Option<CardSuit>,
    },

    /// Draw a card (sent from User Chain to Play Chain)
    DrawCard {
        player: AccountOwner,
    },

    /// Call Last Card (sent from User Chain to Play Chain)
    CallLastCard {
        player: AccountOwner,
    },

    /// Challenge Last Card (sent from User Chain to Play Chain)
    ChallengeLastCard {
        player: AccountOwner,
        target_index: usize,
    },

    /// Leave Match (sent from User Chain to Play Chain)
    LeaveMatch {
        player: AccountOwner,
    },

    /// Check Timeout (sent from User Chain to Play Chain)
    CheckTimeout,

    /// Sync initial state to newly joined player
    InitialStateSync {
        config: MatchConfig,
        players: Vec<String>, // player nicknames
        status: u8, // MatchStatus as u8
    },

    /// Broadcast game event to all players
    GameEvent {
        event: GameEvent, // TODO: Migrate to WhotEvent in Phase 2
    },
}

// ============ Events (For Stream Emission) ============
// New events are in whot-abi as WhotEvent
// Keep GameEvent for backward compatibility during transition

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum GameEvent {
    PlayerJoined { nickname: String, player_count: usize },
    MatchStarted { first_player: String, top_card: Card },
    CardPlayed { player: String, card: Card, next_player: String, special_effect: Option<String> },
    CardsDrawn { player: String, count: u8, next_player: String },
    MatchEnded { winner: String, winner_index: usize },
    PlayerLeft { nickname: String },
    TurnTimeoutWarning { player: String },
    TurnTimeout { player: String, auto_drawn: bool },
}

/// User status for 2-chain architecture
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum UserStatus {
    /// Idle - not in any game
    Idle,
    /// Finding a game to join
    FindingGame,
    /// Currently in a game
    InGame,
}
