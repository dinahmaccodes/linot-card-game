use linot::UserStatus;
use linera_sdk::linera_base_types::{ChainId, StreamUpdate};
use linot::{Card, GameEvent, MatchData, Message, GAME_STREAM_NAME};

use super::super::LinotContract;

impl LinotContract {
    /// Subscribe to PLAY_CHAIN events
    pub async fn handle_subscribe(&mut self, play_chain_id: ChainId) {
        let app_id = self.runtime.application_id().forget_abi();
        self.runtime.subscribe_to_events(
            play_chain_id,
            app_id,
            GAME_STREAM_NAME.into()
        );
        self.state.subscribed_play_chain.set(Some(play_chain_id));
        log::info!("USER_CHAIN: Subscribed to play chain: {:?}", play_chain_id);
    }

    /// Unsubscribe from PLAY_CHAIN
    pub async fn handle_unsubscribe(&mut self, play_chain_id: ChainId) {
        let app_id = self.runtime.application_id().forget_abi();
        self.runtime.unsubscribe_from_events(
            play_chain_id,
            app_id,
            GAME_STREAM_NAME.into()
        );
        self.state.subscribed_play_chain.set(None);
        log::info!("USER_CHAIN: Unsubscribed from play chain: {:?}", play_chain_id);
    }

    /// Send join request to PLAY_CHAIN
    pub async fn handle_join_match(&mut self, play_chain_id: ChainId, nickname: String) {
        let message = Message::RequestJoin {
            player_owner: self.runtime.authenticated_signer()
                .expect("Signer required"),
            player_chain: self.runtime.chain_id(),
            nickname: nickname.clone(),
        };

        self.runtime.prepare_message(message).send_to(play_chain_id);
        
        // Update local state
        self.state.subscribed_play_chain.set(Some(play_chain_id));
        self.state.player_nickname.set(Some(nickname.clone()));
        self.state.user_status.set(UserStatus::InMatch);

        log::info!("USER_CHAIN: Sent join request to play chain: {:?}", play_chain_id);
    }

    /// Process event streams from PLAY_CHAIN - THIS IS THE CRITICAL SYNC LOGIC
    pub async fn handle_process_streams(&mut self, updates: Vec<StreamUpdate>) {
        for update in updates {
            assert_eq!(update.stream_id.stream_name, GAME_STREAM_NAME.into());
            
            for index in update.new_indices() {
                let event: GameEvent = self.runtime.read_event(
                    update.chain_id,
                    GAME_STREAM_NAME.into(),
                    index
                );

                log::info!("USER_CHAIN: Received event: {:?}", event);

                // Update local_match based on event type
                match event {
                    GameEvent::MatchCreated { match_id, host, max_players } => {
                        self.handle_match_created_event(match_id, host, max_players);
                    }
                    
                    GameEvent::PlayerJoined { nickname, player_count } => {
                        self.handle_player_joined_event(nickname, player_count);
                    }
                    
                    GameEvent::MatchStarted { players, first_player, top_card } => {
                        self.handle_match_started_event(players, first_player, top_card);
                    }
                    
                    GameEvent::CardPlayed { player_nickname, card, next_player, special_effect } => {
                        self.handle_card_played_event(player_nickname, card, next_player, special_effect);
                    }
                    
                    GameEvent::CardsDrawn { player_nickname, count, next_player } => {
                        self.handle_cards_drawn_event(player_nickname, count, next_player);
                    }
                    
                    GameEvent::LastCardCalled { player_nickname } => {
                        self.handle_last_card_called_event(player_nickname);
                    }
                    
                    GameEvent::MatchWon { winner_nickname, winner_index } => {
                        self.handle_match_ended_event(winner_nickname, winner_index);
                    }
                    
                    // NOTE: Events are lightweight notifications only!
                    // Frontend should query PLAY_CHAIN for full match state
                    // when events arrive, not rely on event data
                    
                    GameEvent::TurnStarted { player_nickname, duration_micros } => {
                        log::info!("USER_CHAIN: Turn started for {}, duration: {}µs", player_nickname, duration_micros);
                    }
                    
                    GameEvent::TurnWarning { player_nickname, time_left_micros } => {
                        log::info!("USER_CHAIN: Turn warning for {}, {}µs remaining", player_nickname, time_left_micros);
                    }
                    
                    GameEvent::TurnTimeout { player_nickname, auto_drawn } => {
                        log::info!("USER_CHAIN: {} timed out, auto-draw: {}", player_nickname, auto_drawn);
                    }
                    
                    GameEvent::MatchEnded { winner, winner_index } => {
                        self.handle_match_ended_event(winner, winner_index);
                    }
                    
                    GameEvent::ChallengePenalty { challenged_player, penalty_cards } => {
                        self.handle_challenge_penalty_event(challenged_player, penalty_cards);
                    }
                }
            }
        }
    }

    // ================================================================================
    // EVENT HANDLERS - Update local_match for each event type
    // ================================================================================

    fn handle_match_created_event(&mut self, _match_id: ChainId, host: String, max_players: u8) {
        let mut match_data = MatchData::default();
        match_data.max_players = max_players;
        match_data.players = vec![None; max_players as usize];
        
        self.state.local_match.set(Some(match_data));
        log::info!("USER_CHAIN: Match created by {}, max players: {}", host, max_players);
    }

    fn handle_player_joined_event(&mut self, nickname: String, player_count: usize) {
        if let Some(mut match_data) = self.state.local_match.get().clone() {
            log::info!("USER_CHAIN: Player {} joined (total: {})", nickname, player_count);
            
            // Note: We don't have full player data in the event, so we just update player count
            // The actual player data will be synced when MatchStarted event arrives
            match_data.deck_size = player_count; // Temporary use of deck_size to track players
            
            self.state.local_match.set(Some(match_data));
        }
    }

    fn handle_match_started_event(&mut self, players: Vec<String>, first_player: String, top_card: Card) {
        if let Some(mut match_data) = self.state.local_match.get().clone() {
            match_data.status = linot::MatchStatus::InProgress;
            match_data.discard_pile = vec![top_card];
            
            // Find first player index
            if let Some(index) = players.iter().position(|name| name == &first_player) {
                match_data.current_player_index = index;
            }
            
            self.state.local_match.set(Some(match_data));
            log::info!("USER_CHAIN: Match started, first player: {}", first_player);
        }
    }

    fn handle_card_played_event(&mut self, player_nickname: String, card: Card, next_player: String, special_effect: Option<linot::SpecialEffect>) {
        if let Some(mut match_data) = self.state.local_match.get().clone() {
            // Add card to discard pile
            match_data.discard_pile.push(card.clone());
            
            // Update current player index by finding next_player
            for (index, player_opt) in match_data.players.iter().enumerate() {
                if let Some(player) = player_opt {
                    if player.nickname == next_player {
                        match_data.current_player_index = index;
                        break;
                    }
                }
            }
            
            self.state.local_match.set(Some(match_data));
            log::info!("USER_CHAIN: {} played {:?}, next: {}", player_nickname, card, next_player);
            
            if let Some(effect) = special_effect {
                log::info!("USER_CHAIN: Special effect: {:?}", effect);
            }
        }
    }

    fn handle_cards_drawn_event(&mut self, player_nickname: String, count: u8, next_player: String) {
        if let Some(mut match_data) = self.state.local_match.get().clone() {
            // Update current player index
            for (index, player_opt) in match_data.players.iter().enumerate() {
                if let Some(player) = player_opt {
                    if player.nickname == next_player {
                        match_data.current_player_index = index;
                        break;
                    }
                }
            }
            
            self.state.local_match.set(Some(match_data));
            log::info!("USER_CHAIN: {} drew {} cards, next: {}", player_nickname, count, next_player);
        }
    }

    fn handle_last_card_called_event(&mut self, player_nickname: String) {
        if let Some(mut match_data) = self.state.local_match.get().clone() {
            // Find player and set called_last_card flag
            for player_opt in match_data.players.iter_mut() {
                if let Some(player) = player_opt {
                    if player.nickname == player_nickname {
                        player.called_last_card = true;
                        break;
                    }
                }
            }
            
            self.state.local_match.set(Some(match_data));
            log::info!("USER_CHAIN: {} called last card", player_nickname);
        }
    }

    fn handle_match_ended_event(&mut self, winner: String, winner_index: usize) {
        if let Some(mut match_data) = self.state.local_match.get().clone() {
            match_data.status = linot::MatchStatus::Finished;
            match_data.winner_index = Some(winner_index);
            
            self.state.local_match.set(Some(match_data));
            self.state.user_status.set(UserStatus::Idle);
            
            log::info!("USER_CHAIN: Match ended, winner: {}", winner);
        }
    }

    fn handle_challenge_penalty_event(&mut self, challenged_player: String, penalty_cards: u8) {
        if let Some(mut match_data) = self.state.local_match.get().clone() {
            // Find player and update their hand size
            for player_opt in match_data.players.iter_mut() {
                if let Some(player) = player_opt {
                    if player.nickname == challenged_player {
                        player.hand_size += penalty_cards as usize;
                        log::info!("USER_CHAIN: {} penalized {} cards", challenged_player, penalty_cards);
                        break;
                    }
                }
            }
            self.state.local_match.set(Some(match_data));
        }
    }
}
