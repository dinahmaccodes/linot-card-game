use serde::{Deserialize, Serialize};
use linera_sdk::linera_base_types::AccountOwner;
use crate::card::{Card, CardSuit};

/// Whot game state representation (used across chains)
#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct WhotGame {
    /// All players in this match
    pub players: Vec<WhotPlayer>,
    /// Index of current player whose turn it is
    pub current_player_index: usize,
    /// Draw pile (cards to be drawn)
    pub deck_size: usize,
    /// Top card in discard pile
    pub top_card: Option<Card>,
    /// Current game status
    pub status: GameStatus,
    /// Index of winning player (if finished)
    pub winner_index: Option<usize>,
    /// Active shape demand (set by Whot card)
    pub active_shape_demand: Option<CardSuit>,
    /// Pending penalty cards to draw (Pick Two/Three)
    pub pending_penalty: u8,
    /// Turn start timestamp (for timeout detection)
    pub turn_started_at: u64,
    /// Hold On state - player must play second card
    pub hold_on_active: bool,
}

impl Default for WhotGame {
    fn default() -> Self {
        Self {
            players: Vec::new(),
            current_player_index: 0,
            deck_size: 0,
            top_card: None,
            status: GameStatus::Waiting,
            winner_index: None,
            active_shape_demand: None,
            pending_penalty: 0,
            turn_started_at: 0,
            hold_on_active: false,
        }
    }
}

/// Player information (public view)
#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct WhotPlayer {
    /// Player owner account
    pub owner: AccountOwner,
    /// Display nickname
    pub nickname: String,
    /// Number of cards (visible to all)
    pub card_count: usize,
    /// Whether player is still active
    pub is_active: bool,
    /// Whether player called "Last Card!"
    pub called_last_card: bool,
}

/// Game status
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, async_graphql::Enum)]
pub enum GameStatus {
    /// Waiting for players to join
    Waiting,
    /// Match is in progress
    InProgress,
    /// Match has finished
    Finished,
}

/// Player view with private hand data
#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct PlayerView {
    /// My cards (only visible to me)
    pub my_cards: Vec<Card>,
    /// My card count
    pub my_card_count: usize,
    /// Whether I called last card
    pub called_last_card: bool,
    /// Other players (without their cards)
    pub opponents: Vec<OpponentView>,
    /// Top card in discard pile
    pub top_card: Option<Card>,
    /// Remaining deck size
    pub deck_size: usize,
    /// Current player index
    pub current_player_index: usize,
    /// Game status
    pub status: GameStatus,
    /// Active shape demand
    pub active_shape_demand: Option<CardSuit>,
    /// Pending penalty
    pub pending_penalty: u8,
}

/// Opponent information (cards hidden)
#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct OpponentView {
    pub owner: AccountOwner,
    pub nickname: String,
    pub card_count: usize,
    pub is_active: bool,
    pub called_last_card: bool,
}

/// User profile
#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct Profile {
    pub nickname: String,
    pub games_played: u32,
    pub games_won: u32,
}

impl Default for Profile {
    fn default() -> Self {
        Self {
            nickname: String::new(),
            games_played: 0,
            games_won: 0,
        }
    }
}
