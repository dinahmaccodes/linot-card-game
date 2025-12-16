#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;
mod chains;
use self::state::LinotState;
use linot::UserStatus;
use linera_sdk::linera_base_types::{StreamUpdate, WithContractAbi};
use linera_sdk::{
    views::{RootView, View},
    Contract, ContractRuntime,
};
use linot::{
    Card, CardSuit, GameEvent, LinotAbi, LinotResponse, MatchData, MatchStatus,
    Message, Operation, Player,
};

/// The Linot contract
pub struct LinotContract {
    state: LinotState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(LinotContract);

impl WithContractAbi for LinotContract {
    type Abi = LinotAbi;
}

impl Contract for LinotContract {
    type Message = Message;
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = GameEvent;

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = LinotState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        LinotContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        // Initialize with default state
        self.state.user_status.set(UserStatus::Idle);
    }

    async fn execute_operation(&mut self, operation: Operation) -> LinotResponse {
        match operation {
            // USER_CHAIN operations
            Operation::Subscribe { play_chain_id } => {
                self.handle_subscribe(play_chain_id).await;
                LinotResponse::Ok
            }

            Operation::Unsubscribe { play_chain_id } => {
                self.handle_unsubscribe(play_chain_id).await;
                LinotResponse::Ok
            }

            Operation::JoinMatch { play_chain_id, nickname } => {
                self.handle_join_match(play_chain_id, nickname).await;
                LinotResponse::Ok
            }

            // USER_CHAIN operation - Create match request
            Operation::CreateMatch { max_players, nickname } => {
                log::info!("CreateMatch operation on USER_CHAIN");
                
                // Verify we're subscribed to a PLAY_CHAIN
                let play_chain_id = match self.state.subscribed_play_chain.get().as_ref() {
                    Some(chain_id) => *chain_id,
                    None => {
                        return LinotResponse::Error(
                            "Must subscribe to PLAY_CHAIN first".to_string()
                        );
                    }
                };
                
                // Get authenticated user
                let creator_owner = self.runtime.authenticated_signer()
                    .expect("Creator must be authenticated");
                
                // SEND MESSAGE TO PLAY_CHAIN 
                self.runtime.prepare_message(Message::RequestCreateMatch {
                    creator_owner,
                    max_players,
                    nickname: nickname.clone(),
                }).send_to(play_chain_id);
                
                // Update local USER_CHAIN state
                self.state.user_status.set(UserStatus::CreatingMatch);
                self.state.player_nickname.set(Some(nickname));
                
                log::info!("Sent RequestCreateMatch message to PLAY_CHAIN {:?}", play_chain_id);
                LinotResponse::Ok
            }

            Operation::StartMatch => {
                // Check if on USER_CHAIN (has subscribed_play_chain)
                if let Some(play_chain_id) = self.state.subscribed_play_chain.get().as_ref() {
                    // USER_CHAIN: Send message to PLAY_CHAIN
                    let message = Message::StartMatchAction {
                        player_owner: self.runtime.authenticated_signer()
                            .expect("Signer required"),
                    };
                    self.runtime.prepare_message(message).send_to(*play_chain_id);
                    log::info!("USER_CHAIN: Sent StartMatchAction to PLAY_CHAIN");
                    LinotResponse::Ok
                } else {
                    // PLAY_CHAIN: Execute directly
                    self.handle_start_match().await
                }
            }

            // Game actions (can be on either chain)
            Operation::PlayCard { card_index, chosen_suit } => {
                if let Some(play_chain_id) = self.state.subscribed_play_chain.get().as_ref() {
                    // USER_CHAIN: Send message to PLAY_CHAIN
                    let message = Message::PlayCardAction {
                        player_owner: self.runtime.authenticated_signer()
                            .expect("Signer required"),
                        card_index,
                        chosen_suit,
                    };
                    self.runtime.prepare_message(message).send_to(*play_chain_id);
                    LinotResponse::Ok
                } else {
                    // PLAY_CHAIN: Process via execute_message
                    LinotResponse::Error("PlayCard should be sent via message".to_string())
                }
            }

            Operation::DrawCard => {
                if let Some(play_chain_id) = self.state.subscribed_play_chain.get().as_ref() {
                    // USER_CHAIN: Send message to PLAY_CHAIN
                    let message = Message::DrawCardAction {
                        player_owner: self.runtime.authenticated_signer()
                            .expect("Signer required"),
                    };
                    self.runtime.prepare_message(message).send_to(*play_chain_id);
                    LinotResponse::Ok
                } else {
                    LinotResponse::Error("DrawCard should be sent via message".to_string())
                }
            }

            Operation::CallLastCard => {
                let player_owner = self.runtime.authenticated_signer()
                    .expect("Signer required");
                
                // Determine if we're on PLAY_CHAIN or USER_CHAIN
                if self.state.match_data.get().players.len() > 0 {
                    // On PLAY_CHAIN - handle directly
                    self.handle_call_last_card_message(player_owner).await;
                } else {
                    // On USER_CHAIN - send message to PLAY_CHAIN
                    let play_chain_id = self.state.subscribed_play_chain.get()
                        .expect("Not subscribed to any play chain");
                    
                    let message = Message::CallLastCardAction { player_owner };
                    self.runtime.prepare_message(message).send_to(play_chain_id);
                }
                LinotResponse::Ok
            }
            
            Operation::ChallengeLastCard { player_index } => {
                let challenger_owner = self.runtime.authenticated_signer()
                    .expect("Signer required");
                
                // Determine chain type
                if self.state.match_data.get().players.len() > 0 {
                    // On PLAY_CHAIN - handle directly
                    self.handle_challenge_last_card_message(challenger_owner, player_index).await;
                } else {
                    // On USER_CHAIN - send message to PLAY_CHAIN
                    let play_chain_id = self.state.subscribed_play_chain.get()
                        .expect("Not subscribed to any play chain");
                    
                    let message = Message::ChallengeLastCardAction {
                        challenger_owner,
                        challenged_player_index: player_index,
                    };
                    self.runtime.prepare_message(message).send_to(play_chain_id);
                }
                LinotResponse::Ok
            }
            
            Operation::CheckTimeout => {
                // Only valid on PLAY_CHAIN
                if self.state.match_data.get().players.len() > 0 {
                    self.handle_check_timeout().await;
                }
                LinotResponse::Ok
            }

            Operation::LeaveMatch => {
                self.state.user_status.set(UserStatus::Idle);
                self.state.subscribed_play_chain.set(None);
                self.state.local_match.set(None);
                log::info!("Player left match");
                LinotResponse::Ok
            }
        }
    }

    async fn execute_message(&mut self, message: Message) {
        let origin_chain_id = self.runtime.message_origin_chain_id()
            .expect("Chain ID missing from message");
        
        match message {
            // PLAY_CHAIN: Handle create match request from USER_CHAIN
            Message::RequestCreateMatch {
                creator_owner,
                max_players,
                nickname,
            } => {
                log::info!("PLAY_CHAIN received RequestCreateMatch from {:?}", origin_chain_id);
                
                // Execute match creation logic ON PLAY_CHAIN
                let result = self.create_match_on_play_chain(
                    creator_owner,
                    origin_chain_id,  // creator's USER_CHAIN
                   max_players,
                    nickname,
                ).await;
                
                // Send result back to USER_CHAIN
                let success = result.is_ok();
                let match_id = result.ok();
                self.runtime.prepare_message(Message::CreateMatchResult {
                    success,
                    match_id,
                }).send_to(origin_chain_id);
                
                log::info!("Sent CreateMatchResult (success={}) to {:?}", success, origin_chain_id);
            }
            
            // USER_CHAIN: Handle create match result from PLAY_CHAIN
            Message::CreateMatchResult { success, match_id } => {
                log::info!("USER_CHAIN received CreateMatchResult: success={}, match_id={:?}", success, match_id);
                
                if success {
                    self.state.user_status.set(UserStatus::InMatch);
                    // TODO: Emit event for frontend
                } else {
                    self.state.user_status.set(UserStatus::Idle);
                }
            }
            
            // PLAY_CHAIN: Player requesting to join
            Message::RequestJoin {
                player_owner,
                player_chain,
                nickname,
            } => {
                self.handle_request_join_message(player_owner, player_chain, nickname).await;
            }
            
            Message::StartMatchAction { player_owner: _ } => {
                // Player requesting to start match on PLAY_CHAIN
                log::info!("PLAY_CHAIN: Received StartMatchAction");
                self.handle_start_match().await;
            }

            Message::PlayCardAction { player_owner, card_index, chosen_suit } => {
                self.handle_play_card_message(player_owner, card_index, chosen_suit).await;
            }

            Message::DrawCardAction { player_owner } => {
                self.handle_draw_card_message(player_owner).await;
            }

            Message::CallLastCardAction { player_owner } => {
                self.handle_call_last_card_message(player_owner).await;
            }
            
            Message::ChallengeLastCardAction { challenger_owner, challenged_player_index } => {
                self.handle_challenge_last_card_message(challenger_owner, challenged_player_index).await;
            }
        }
    }

    async fn process_streams(&mut self, updates: Vec<StreamUpdate>) {
        self.handle_process_streams(updates).await;
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}

// ============================================================================
// HELPER METHODS
// ============================================================================

impl LinotContract {
    /// Create initial match state
    fn create_match(&mut self, max_players: u8, host_nickname: String) -> MatchData {
        let mut players = vec![None; max_players as usize];

        // Host is first player
        players[0] = Some(Player::new(
            self.runtime.chain_id(),
            self.runtime.authenticated_signer().expect("Signer required"),
            host_nickname,
        ));

        // Create and shuffle deck
        let mut deck = Vec::with_capacity(61);
        
        // Regular suits (Circle, Triangle, Cross, Square) - values 1 to 14
        for suit in [CardSuit::Circle, CardSuit::Triangle, CardSuit::Cross, CardSuit::Square] {
            for value in 1..=14 {
                deck.push(Card { suit, value });
            }
        }
        
        // Star suit - values 1 to 7
        for value in 1..=7 {
            deck.push(Card { suit: CardSuit::Star, value });
        }
        
        // Whot cards (wild) - 5 total
        for _ in 0..5 {
            deck.push(Card { suit: CardSuit::Whot, value: 20 });
        }
        
        // Deterministic shuffle
        let len = deck.len();
        for i in (1..len).rev() {
            let j = (i * 7 + 11) % (i + 1);
            deck.swap(i, j);
        }
        
        let deck_size = deck.len();

        MatchData {
            players,
            deck,
            discard_pile: Vec::new(),
            current_player_index: 0,
            status: MatchStatus::Waiting,
            winner_index: None,
            max_players,
            deck_size,
            pending_draw_stack: 0,
            pending_draw_type: None,
            turn_start_time: None,
            turn_duration: linot::TURN_TIMEOUT_MICROS,
        }
    }
}
