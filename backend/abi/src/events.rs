use serde::{Deserialize, Serialize};
use crate::card::Card;
use crate::game::WhotGame;

/// Events emitted to the game stream (only major state changes)
#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum WhotEvent {
    /// Full game state update (major events only)
    GameState { 
        game: WhotGame 
    },
    
    /// Player action occurred
    PlayerAction { 
        player: String, 
        action: ActionType,
    },
    
    /// Game finished
    GameFinished { 
        winner: String,
        winner_index: usize,
    },
    
    /// Turn timeout warning
    TurnTimeoutWarning {
        player: String,
    },
}

/// Type of player action
#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum ActionType {
    PlayedCard(Card),
    DrewCard,
    CalledLastCard,
    JoinedGame,
}

/// Batched events for efficiency (minor updates)
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct BatchedEvents {
    pub events: Vec<WhotEvent>,
    pub timestamp: u64,
}
