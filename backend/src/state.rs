use async_graphql::SimpleObject;
use linera_sdk::{
    linera_base_types::ChainId,
    views::{linera_views, RegisterView, RootView, ViewStorageContext},
};

use linot::{MatchData, UserStatus};

/// The application state
#[derive(RootView, SimpleObject)]
#[view(context = ViewStorageContext)]
pub struct LinotState {
    // ==== PLAY CHAIN STATE ====
    /// The authoritative match state (on PLAY_CHAIN only)
    pub match_data: RegisterView<MatchData>,
    
    // ==== USER CHAIN STATE ====
    /// Copy of match state for local queries (on USER_CHAIN)
    pub local_match: RegisterView<Option<MatchData>>,
    
    /// Which play chain this user is subscribed to
    pub subscribed_play_chain: RegisterView<Option<ChainId>>,
    
    /// Player's own nickname
    pub player_nickname: RegisterView<Option<String>>,
    
    /// User status tracking (imported from lib.rs)
    pub user_status: RegisterView<UserStatus>,
}
