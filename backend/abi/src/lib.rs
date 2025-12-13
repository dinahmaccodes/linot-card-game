// ABI crate - main lib entry point

/// Stream name for Whot game events (multiplayer synchronization)
pub const WHOT_STREAM_NAME: &[u8] = b"whot_game_events";

// Re-export all modules
pub mod card;
pub mod game;
pub mod events;
pub mod deck;

pub use card::*;
pub use game::*;
pub use events::*;
pub use deck::*;
