#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use async_graphql::{EmptySubscription, Object, Request, Response, Schema, SimpleObject};
use linera_sdk::linera_base_types::{ChainId, WithServiceAbi};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    views::View,
    Service, ServiceRuntime,
};
use linot::{Card, LinotAbi, MatchData, MatchStatus, Operation};
use self::state::LinotState;
use linot::UserStatus;

/// The Linot service
pub struct LinotService {
    state: Arc<LinotState>,
    runtime: Arc<ServiceRuntime<Self>>,
}

linera_sdk::service!(LinotService);

use std::sync::Arc;

impl WithServiceAbi for LinotService {
    type Abi = LinotAbi;
}

impl Service for LinotService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = LinotState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        
        LinotService {
            state: Arc::new(state),
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, request: Request) -> Response {
        Schema::build(
            QueryRoot {
                state: self.state.clone(),
            },
            Operation::mutation_root(self.runtime.clone()),
            EmptySubscription,
        )
        .finish()
        .execute(request)
        .await
    }
}

/// GraphQL query root
#[derive(Clone)]
struct QueryRoot {
    state: Arc<LinotState>,
}

#[Object]
impl QueryRoot {
    /// Get current match state (queries PLAY_CHAIN authoritative state)
    async fn match_state(&self) -> Option<MatchData> {
        // Query PLAY_CHAIN authoritative state
        let match_data = self.state.match_data.get();
        if !match_data.players.is_empty() {
            return Some(match_data.clone());
        }
        
        None
    }

    /// Get player's own hand (filtered for privacy)
    async fn my_hand(&self) -> Vec<Card> {
        // Query PLAY_CHAIN match_data for player hands
        // TODO: Filter by authenticated owner in production
        let match_data = self.state.match_data.get();
        for player_opt in &match_data.players {
            if let Some(player) = player_opt {
                return player.hand.clone();
            }
        }
        
        Vec::new()
    }

    /// Get basic match info (player count, max players, status)
    async fn match_info(&self) -> Option<MatchInfo> {
        // Query PLAY_CHAIN authoritative state
        let match_data = self.state.match_data.get();
        if match_data.players.is_empty() {
            return None;
        }
        
        Some(MatchInfo {
            player_count: match_data.players.iter().filter(|p| p.is_some()).count() as u8,
            max_players: match_data.max_players,
            status: match_data.status,
            deck_size: match_data.deck_size,
            top_card: match_data.discard_pile.last().cloned(),
        })
    }

    /// Get current player's nickname
    async fn my_nickname(&self) -> Option<String> {
        self.state.player_nickname.get().clone()
    }

    /// Get subscribed play chain
    async fn play_chain(&self) -> Option<ChainId> {
        self.state.subscribed_play_chain.get().clone()
    }

    /// Get user status
    async fn user_status(&self) -> UserStatus {
        *self.state.user_status.get()
    }
}

/// Match info for queries
#[derive(SimpleObject)]
struct MatchInfo {
    player_count: u8,
    max_players: u8,
    status: MatchStatus,
    deck_size: usize,
    top_card: Option<Card>,
}
