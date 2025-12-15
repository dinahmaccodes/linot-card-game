use async_graphql::{Enum, Request, Response, SimpleObject};
use linera_sdk::{
    abi::{ContractAbi, ServiceAbi},
    graphql::GraphQLMutationRoot,
    linera_base_types::{AccountOwner, ChainId},
};
use serde::{Deserialize, Serialize};

/// The Linot application ABI
pub struct LinotAbi;

impl ContractAbi for LinotAbi {
    type Operation = Operation;
    type Response = LinotResponse;
}

impl ServiceAbi for LinotAbi {
    type Query = Request;
    type QueryResponse = Response;
}

/// Response type for operations
#[derive(Debug, Deserialize, Serialize)]
pub enum LinotResponse {
    Ok,
    Error(String),
}

// ============================================================================
// OPERATIONS (GraphQL Mutations - User Actions)
// ============================================================================

#[derive(Debug, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    /// Subscribe to Play chain events
    Subscribe { play_chain_id: ChainId },
    
    /// Unsubscribe from Play chain
    Unsubscribe { play_chain_id: ChainId },
    
    /// Create a new match (becomes Play chain)
    CreateMatch { 
        max_players: u8,
        nickname: String,
    },
    
    /// Join existing match (sends message to Play chain)
    JoinMatch {
        play_chain_id: ChainId,
        nickname: String,
    },
    
    /// Start match (host only)
    StartMatch,
    
    /// Play a card
    PlayCard {
        card_index: usize,
        chosen_suit: Option<CardSuit>,  // For Whot cards
    },
    
    /// Draw a card
    DrawCard,
    
    /// Call "Last Card"
    CallLastCard,
    
    /// Challenge another player for not calling last card
    ChallengeLastCard {
        player_index: usize,
    },
    
    /// Check if current turn has timed out (called periodically)
    CheckTimeout,
    
    /// Leave match
    LeaveMatch,
}

// ============================================================================
// USER STATUS (Local State Tracking)
// ============================================================================

#[derive(Clone, Copy, Debug, Deserialize, Serialize, PartialEq, Eq, Enum)]
pub enum UserStatus {
    Idle,
    CreatingMatch,
    InMatch,
    WaitingForPlayers,
}

impl Default for UserStatus {
    fn default() -> Self {
        UserStatus::Idle
    }
}

// ============================================================================
// MESSAGES (Cross-Chain Communication)
// ============================================================================

#[derive(Clone, Debug, Deserialize, Serialize)]
pub enum Message {
    /// USER_CHAIN -> PLAY_CHAIN: Request to create a new match
    RequestCreateMatch {
        creator_owner: AccountOwner,
        max_players: u8,
        nickname: String,
    },
    
    /// PLAY_CHAIN -> USER_CHAIN: Result of create match request
    CreateMatchResult {
        success: bool,
        match_id: Option<usize>,
    },
    
    /// USER_CHAIN -> PLAY_CHAIN: Player requesting to join from their USER_CHAIN
    RequestJoin {
        player_owner: AccountOwner,
        player_chain: ChainId,
        nickname: String,
    },
    
    /// USER_CHAIN -> PLAY_CHAIN: Request to start the match
    StartMatchAction {
        player_owner: AccountOwner,
    },
    
    /// USER_CHAIN -> PLAY_CHAIN: Player action: play card
    PlayCardAction {
        player_owner: AccountOwner,
        card_index: usize,
        chosen_suit: Option<CardSuit>,
    },
    
    /// USER_CHAIN -> PLAY_CHAIN: Player action: draw card  
    DrawCardAction {
        player_owner: AccountOwner,
    },
    
    /// USER_CHAIN -> PLAY_CHAIN: Player calls last card
    CallLastCardAction {
        player_owner: AccountOwner,
    },
    
    /// USER_CHAIN -> PLAY_CHAIN: Player challenges another for not calling last card
    ChallengeLastCardAction {
        challenger_owner: AccountOwner,
        challenged_player_index: usize,
    },
}

// ============================================================================
// EVENTS (State Synchronization)
// ============================================================================

#[derive(Clone, Debug, Deserialize, Serialize)]
pub enum GameEvent {
    /// Match created
    MatchCreated {
        match_id: ChainId,
        host: String,
        max_players: u8,
    },
    
    /// Player joined
    PlayerJoined {
        nickname: String,
        player_count: usize,
    },
    
    /// Match started
    MatchStarted {
        players: Vec<String>,
        first_player: String,
        top_card: Card,
    },
    
    /// Card played
    CardPlayed {
        player_nickname: String,
        card: Card,
        next_player: String,
        special_effect: Option<SpecialEffect>,
    },
    
    /// Cards drawn
    CardsDrawn {
        player_nickname: String,
        count: u8,
        next_player: String,
    },
    
    /// Last card called
    LastCardCalled {
        player_nickname: String,
    },
    
    /// Match ended
    MatchEnded {
        winner: String,
        winner_index: usize,
    },
    
    /// Match won
    MatchWon {
        winner_nickname: String,
        winner_index: usize,
    },
    
    /// Challenge penalty applied
    ChallengePenalty {
        challenged_player: String,
        penalty_cards: u8,
    },
    
    /// Turn started with timer
    TurnStarted {
        player_nickname: String,
        duration_micros: u64,
    },
    
    /// Turn warning - time running out
    TurnWarning {
        player_nickname: String,
        time_left_micros: u64,
    },
    
    /// Turn timed out
    TurnTimeout {
        player_nickname: String,
        auto_drawn: bool,
    },
}

// ============================================================================
// DATA STRUCTURES
// ============================================================================

/// Card definition
#[derive(Clone, Debug, Serialize, Deserialize, SimpleObject, PartialEq)]
pub struct Card {
    pub suit: CardSuit,
    pub value: u8,
}

/// Card suits
#[derive(Clone, Debug, Serialize, Deserialize, Enum, Copy, PartialEq, Eq)]
pub enum CardSuit {
    Circle,
    Triangle,
    Cross,
    Square,
    Star,
    Whot,  // Wild card
}

/// Special card effects
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum SpecialEffect {
    PickTwo,
    PickThree,
    HoldOn,
    GeneralMarket,
    WhotPlayed { chosen_suit: CardSuit },
}

/// Player in match
#[derive(Clone, Debug, Serialize, Deserialize, SimpleObject)]
pub struct Player {
    pub chain_id: ChainId,
    pub owner: AccountOwner,
    pub nickname: String,
    #[graphql(skip)]
    pub hand: Vec<Card>,
    pub hand_size: usize,  // Public info
    pub called_last_card: bool,
}

impl Player {
    pub fn new(chain_id: ChainId, owner: AccountOwner, nickname: String) -> Self {
        Self {
            chain_id,
            owner,
            nickname,
            hand: Vec::new(),
            hand_size: 0,
            called_last_card: false,
        }
    }
    
    pub fn update_hand_size(&mut self) {
        self.hand_size = self.hand.len();
    }
}

/// Match state
#[derive(Clone, Debug, Serialize, Deserialize, SimpleObject)]
pub struct MatchData {
    pub players: Vec<Option<Player>>,
    #[graphql(skip)]
    pub deck: Vec<Card>,
    pub discard_pile: Vec<Card>,
    pub current_player_index: usize,
    pub status: MatchStatus,
    pub winner_index: Option<usize>,
    pub max_players: u8,
    pub deck_size: usize,  // Public info
    pub pending_draw_stack: u8,        // Total cards to draw (for stacking)
    #[graphql(skip)]
    pub pending_draw_type: Option<u8>, // Value of stacking card (2 or 5)
    pub turn_start_time: Option<u64>,   // When current turn started (micros)
    pub turn_duration: u64,             // Turn duration in micros
}

impl Default for MatchData {
    fn default() -> Self {
        Self {
            players: Vec::new(),
            deck: Vec::new(),
            discard_pile: Vec::new(),
            current_player_index: 0,
            status: MatchStatus::Waiting,
            winner_index: None,
            max_players: 2,
            deck_size: 0,
            pending_draw_stack: 0,
            pending_draw_type: None,
            turn_start_time: None,
            turn_duration: crate::TURN_TIMEOUT_MICROS,
        }
    }
}

/// Match status
#[derive(Clone, Debug, Serialize, Deserialize, Enum, Copy, PartialEq, Eq)]
pub enum MatchStatus {
    Waiting,     // Waiting for players
    InProgress,  // Game ongoing
    Finished,    // Game complete
}

// ============================================================================
// CONSTANTS
// ============================================================================

pub const GAME_STREAM_NAME: &[u8] = b"linot_game_events";
pub const INITIAL_HAND_SIZE: u8 = 6;
pub const MAX_PLAYERS: u8 = 6;
pub const MIN_PLAYERS: u8 = 2;
pub const TURN_TIMEOUT_MICROS: u64 = 180_000_000;  // 3 minutes
pub const TURN_WARNING_MICROS: u64 = 120_000_000;  // 2 minutes
