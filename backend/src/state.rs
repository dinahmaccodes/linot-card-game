use linera_sdk::{
    linera_base_types::AccountOwner,
    views::{RegisterView, RootView, ViewStorageContext},
};
use serde::{Deserialize, Serialize};

use linot::{Card, CardSuit, MatchConfig};

/// Root application state stored on-chain using Linera Views
/// Note: Different fields are used on different chain types (User vs Play)
#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct LinotState {
    // === COMMON/PLAY CHAIN FIELDS ===
    /// Match configuration
    pub config: RegisterView<MatchConfig>,
    /// Current match data (players, deck, game state)
    pub match_data: RegisterView<MatchData>,
    /// Optional betting pool for staking (Wave 4-5)
    pub betting_pool: RegisterView<Option<BettingPool>>,
    /// ID of the Play Chain this chain is connected to (for User Chains)
    pub active_game_chain_id: RegisterView<Option<linera_sdk::linera_base_types::ChainId>>,
}

// ============ Match Data ============

#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct MatchData {
    /// All players in this match (max 2 for V1)
    pub players: Vec<Player>,
    /// Index of current player whose turn it is
    pub current_player_index: usize,
    /// Draw pile (cards to be drawn)
    pub deck: Vec<Card>,
    /// Discard pile (played cards, top card is last)
    pub discard_pile: Vec<Card>,
    /// Current game status
    pub status: MatchStatus,
    /// Index of winning player (if finished)
    pub winner_index: Option<usize>,
    /// Round number (for reshuffle entropy)
    pub round_number: u32,
    /// Timestamp when match was created
    pub created_at: u64,
    /// Active shape demand (set by Whot card)
    pub active_shape_demand: Option<CardSuit>,
    /// Pending penalty cards to draw (Pick Two/Three)
    pub pending_penalty: u8,
    /// Turn start timestamp (for 3-minute timeout)
    pub turn_started_at: u64,
    /// Hold On state - player must play second card
    pub hold_on_active: bool,
    /// Hold On shape requirement (must match first card's shape)
    pub hold_on_required_shape: Option<CardSuit>,
    /// Penalty stack count (for stacking Pick 2/Pick 3)
    pub penalty_stack: u8,
}

impl Default for MatchData {
    fn default() -> Self {
        Self {
            players: Vec::new(),
            current_player_index: 0,
            deck: Vec::new(),
            discard_pile: Vec::new(),
            status: MatchStatus::Waiting,
            winner_index: None,
            round_number: 0,
            created_at: 0,
            active_shape_demand: None,
            pending_penalty: 0,
            turn_started_at: 0,
            hold_on_active: false,
            hold_on_required_shape: None,
            penalty_stack: 0,
        }
    }
}

// ============ Player ============

#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct Player {
    /// Owner account
    pub owner: AccountOwner,
    /// Display nickname
    pub nickname: String,
    /// Cards in hand (hidden from other players)
    pub cards: Vec<Card>,
    /// Whether player is still active (not forfeited)
    pub is_active: bool,
    /// Number of cards (visible to all)
    pub card_count: usize,
    /// Whether player called "Last Card!"
    pub called_last_card: bool,
    /// Chain ID of the player's USER_CHAIN (for routing events)
    pub chain_id: Option<linera_sdk::linera_base_types::ChainId>,
}

impl Player {
    #[allow(dead_code)] // Used in contract.rs
    pub fn new(owner: AccountOwner, nickname: String) -> Self {
        Self {
            owner,
            nickname,
            cards: Vec::new(),
            is_active: true,
            card_count: 0,
            called_last_card: false,
            chain_id: None, // Will be set when player joins from a chain
        }
    }

    /// Update card count to match actual cards
    #[allow(dead_code)] // Used in contract.rs
    pub fn update_card_count(&mut self) {
        self.card_count = self.cards.len();
    }
}

// ============ Match Status ============

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, async_graphql::Enum)]
pub enum MatchStatus {
    /// Waiting for players to join
    Waiting,
    /// Match is in progress
    InProgress,
    /// Match has finished
    Finished,
}

// ============ Betting Pool (Wave 4-5) ============

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct BettingPool {
    /// Total amount staked
    pub total_pool: u64,
    /// Individual bets per player
    pub bets: Vec<Bet>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Bet {
    /// Player who placed the bet
    pub player: AccountOwner,
    /// Amount staked
    pub amount: u64,
    /// Timestamp of bet
    pub placed_at: u64,
}

// ============ Helper Methods ============

impl MatchData {
    /// Get player-specific view (Inspo pattern - hides opponent cards)
    #[allow(dead_code)]
    pub fn get_player_view(&self, player_owner: &AccountOwner) -> Option<PlayerView> {
        // Find the requesting player
        let player = self.players.iter()
            .find(|p| &p.owner == player_owner)?;
        
        // Build opponent views (without their cards)
        let opponents: Vec<OpponentView> = self.players.iter()
            .filter(|p| &p.owner != player_owner)
            .map(|p| OpponentView {
                owner: p.owner,
                nickname: p.nickname.clone(),
                card_count: p.card_count,
                is_active: p.is_active,
                called_last_card: p.called_last_card,
            })
            .collect();
        
        Some(PlayerView {
            my_cards: player.cards.clone(),
            my_card_count: player.card_count,
            called_last_card: player.called_last_card,
            opponents,
            top_card: self.discard_pile.last().cloned(),
            deck_size: self.deck.len(),
            current_player_index: self.current_player_index,
            status: self.status,
            active_shape_demand: self.active_shape_demand,
            pending_penalty: self.pending_penalty,
        })
    }
}

/// Player-specific view with private hand data
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
    pub status: MatchStatus,
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

// Placeholder to keep the file present in the repo.
/// Placeholder exported type to document that state lives here.
pub struct _StatePlaceholder;
