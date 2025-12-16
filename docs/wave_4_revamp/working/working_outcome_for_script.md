 ./run.bash
Deploying Whot Card Game - 2 Player Multiplayer
Cleaning up old state...
Starting Linera network...
Waiting for network to initialize...
Creating Player 1 wallet...
2025-12-16T12:53:31.740404Z  INFO linera::main: linera: Wallet initialized in 266 ms
Requesting chain for Player 1...
2025-12-16T12:53:31.863491Z  INFO linera::main: linera: Requesting a new chain for owner 0xc3b5ef28522ef97acef3aa4f6c2b7a310fa59a7e5f9771797b3e7fadbc8921bf using the faucet at address http://localhost:8080
2025-12-16T12:53:31.904567Z  INFO linera::main: linera: New chain requested and added in 41 ms
2025-12-16T12:53:31.975475Z  INFO linera::main: linera: Wallet shown in 0 ms
Player 1 Chain: ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
Player 1 Owner: abafee7549c999bf09649bafa4c0484b9a51e1b9f811386285a90cf27a3dcad5
Creating Player 2 wallet...
2025-12-16T12:53:32.258726Z  INFO linera::main: linera: Wallet initialized in 276 ms
Requesting chain for Player 2...
2025-12-16T12:53:32.374732Z  INFO linera::main: linera: Requesting a new chain for owner 0x9e866e03f0c498fdc24e3aead19bdb710fb50a7aeff378340d65a2752464aab1 using the faucet at address http://localhost:8080
2025-12-16T12:53:32.415945Z  INFO linera::main: linera: New chain requested and added in 41 ms
2025-12-16T12:53:32.493973Z  INFO linera::main: linera: Wallet shown in 0 ms
Player 2 Chain: 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1
Player 2 Owner: 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1
2025-12-16T12:53:32.628135Z  INFO linera::main: linera: Synchronizing chain information
2025-12-16T12:53:32.646942Z  INFO linera::main: linera_core::client: find_received_certificates finished
2025-12-16T12:53:32.647296Z  INFO linera::main: linera: Synchronized chain information in 19 ms
2025-12-16T12:53:32.861568Z  INFO linera::main: linera: Synchronizing chain information
2025-12-16T12:53:32.874102Z  INFO linera::main: linera_core::client: find_received_certificates finished
2025-12-16T12:53:32.874600Z  INFO linera::main: linera: Synchronized chain information in 13 ms
Creating shared Play Chain...
2025-12-16T12:53:33.071461Z  INFO linera::main: linera: Requesting a new chain for owner 0x382dd059e30eb83be7d2c49d52f8d5a4ba7ec35001846aefbab6139267d51777 using the faucet at address http://localhost:8080
2025-12-16T12:53:33.108428Z  INFO linera::main: linera: New chain requested and added in 37 ms
Play Chain: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
Building contracts...
    Finished `release` profile [optimized + debuginfo] target(s) in 0.36s
Deploying application...
NOTE: This may take 10-30 seconds...
Running deployment command...
Deployment exit code: 0
Deployment output:
2025-12-16T12:53:33.765716Z  INFO linera::main: linera: Creating application on chain ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
    Finished `release` profile [optimized + debuginfo] target(s) in 0.24s
2025-12-16T12:53:34.083615Z  INFO linera::main: linera_client::client_context: Loading bytecode files
2025-12-16T12:53:34.084556Z  INFO linera::main: linera_client::client_context: Publishing module
2025-12-16T12:53:34.736122Z  WARN linera::main:handle_block_proposal{address="http://localhost:13001"}: grpc_client: error=Blobs not found: [BlobId { blob_type: ContractBytecode, hash: 51b6d73e0c9f6efea6d2397f36da5a6086008fb88ae3618ad823d60ea353c6d4 }, BlobId { blob_type: ServiceBytecode, hash: 1cae1755176e1f1e6d6db22636502601e4faaa7ae2800b558c2ad21ec11e2150 }]
2025-12-16T12:53:34.784100Z  INFO linera::main: linera_client::client_context: Module published successfully!
2025-12-16T12:53:34.784111Z  INFO linera::main: linera_client::client_context: Synchronizing client and processing inbox
2025-12-16T12:53:34.788043Z  INFO linera::main: linera_core::client: find_received_certificates finished
2025-12-16T12:53:34.880551Z  INFO linera::main: linera: Application published successfully!
2025-12-16T12:53:34.880572Z  INFO linera::main: linera: Project published and created in 1114 ms
b69d8edc9f2872691bf5c6a1689f54405776e7f861188c85de5a0080fd5f85e3
2025-12-16T12:53:34.880614Z  INFO linera::main: linera: Project published and created in 1231 ms
---
Application deployed successfully!
APP_ID: b69d8edc9f2872691bf5c6a1689f54405776e7f861188c85de5a0080fd5f85e3
Frontend already built
Creating player frontend directories...
Generating config.json for Player 1...
Player 1 config created
  GraphQL Endpoint: http://localhost:8081/chains/ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9/applications/b69d8edc9f2872691bf5c6a1689f54405776e7f861188c85de5a0080fd5f85e3
Generating config.json for Player 2...
Player 2 config created
  GraphQL Endpoint: http://localhost:8082/chains/5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1/applications/b69d8edc9f2872691bf5c6a1689f54405776e7f861188c85de5a0080fd5f85e3
Starting GraphQL services...
2025-12-16T12:53:35.119061Z  INFO linera::main:node_service{port=8081}: linera_service::node_service: GraphiQL IDE: http://localhost:8081
2025-12-16T12:53:35.123156Z  INFO background_sync_received_certificates{chain_id=41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798}: linera_client::chain_listener: Starting background certificate sync for chain 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:53:35.123525Z  INFO background_sync_received_certificates{chain_id=abafee7549c999bf09649bafa4c0484b9a51e1b9f811386285a90cf27a3dcad5}: linera_client::chain_listener: Starting background certificate sync for chain abafee7549c999bf09649bafa4c0484b9a51e1b9f811386285a90cf27a3dcad5
2025-12-16T12:53:35.123879Z  INFO background_sync_received_certificates{chain_id=ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9}: linera_client::chain_listener: Starting background certificate sync for chain ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
2025-12-16T12:53:35.126345Z  INFO background_sync_received_certificates{chain_id=abafee7549c999bf09649bafa4c0484b9a51e1b9f811386285a90cf27a3dcad5}: linera_core::client: find_received_certificates finished
2025-12-16T12:53:35.130242Z  INFO background_sync_received_certificates{chain_id=ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9}: linera_core::client: find_received_certificates finished
2025-12-16T12:53:35.135495Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798.
2025-12-16T12:53:35.137870Z  INFO linera::main:node_service{port=8082}: linera_service::node_service: GraphiQL IDE: http://localhost:8082
2025-12-16T12:53:35.140783Z  INFO background_sync_received_certificates{chain_id=41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798}: linera_core::client: find_received_certificates finished
2025-12-16T12:53:35.145494Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9.
2025-12-16T12:53:35.149855Z  INFO background_sync_received_certificates{chain_id=5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1}: linera_client::chain_listener: Starting background certificate sync for chain 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1
2025-12-16T12:53:35.150769Z  INFO background_sync_received_certificates{chain_id=abafee7549c999bf09649bafa4c0484b9a51e1b9f811386285a90cf27a3dcad5}: linera_client::chain_listener: Starting background certificate sync for chain abafee7549c999bf09649bafa4c0484b9a51e1b9f811386285a90cf27a3dcad5
2025-12-16T12:53:35.152679Z  INFO background_sync_received_certificates{chain_id=abafee7549c999bf09649bafa4c0484b9a51e1b9f811386285a90cf27a3dcad5}: linera_core::client: find_received_certificates finished
2025-12-16T12:53:35.156562Z  INFO background_sync_received_certificates{chain_id=5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1}: linera_core::client: find_received_certificates finished
2025-12-16T12:53:35.159865Z  INFO linera::main:node_service{port=8082}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1.
Starting web servers...

================================================
Linot Running!
================================================

Frontend:
  Player 1: http://localhost:5173?player=1
  Player 2: http://localhost:5174?player=2

GraphQL:
  Player 1: http://localhost:8081
  Player 2: http://localhost:8082

Application Details:
  APP_ID:        b69d8edc9f2872691bf5c6a1689f54405776e7f861188c85de5a0080fd5f85e3
  PLAY_CHAIN:    41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
  USER_CHAIN_1:  ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
  USER_CHAIN_2:  5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1
  OWNER_1:       abafee7549c999bf09649bafa4c0484b9a51e1b9f811386285a90cf27a3dcad5
  OWNER_2:       5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1

GraphQL Test URLs:
  Player 1: http://localhost:8081/chains/ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9/applications/b69d8edc9f2872691bf5c6a1689f54405776e7f861188c85de5a0080fd5f85e3
  Player 2: http://localhost:8082/chains/5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1/applications/b69d8edc9f2872691bf5c6a1689f54405776e7f861188c85de5a0080fd5f85e3

Services running. Press Ctrl+C to stop.

Starting up http-server, serving .

http-server version: 14.1.1

http-server settings: 
CORS: true
Cache: 3600 seconds
Connection Timeout: 120 seconds
Directory Listings: visible
AutoIndex: visible
Serve GZIP Files: false
Serve Brotli Files: false
Default File Extension: none

Available on:
  http://127.0.0.1:5174
  http://10.27.195.40:5174
Hit CTRL-C to stop the server

Starting up http-server, serving .

http-server version: 14.1.1

http-server settings: 
CORS: true
Cache: 3600 seconds
Connection Timeout: 120 seconds
Directory Listings: visible
AutoIndex: visible
Serve GZIP Files: false
Serve Brotli Files: false
Default File Extension: none

Available on:
  http://127.0.0.1:5173
  http://10.27.195.40:5173
Hit CTRL-C to stop the server

2025-12-16T12:54:06.315065Z  INFO linera_execution::wasm::runtime_api: CreateMatch operation on USER_CHAIN
2025-12-16T12:54:06.319132Z  INFO linera_execution::wasm::runtime_api: CreateMatch operation on USER_CHAIN
2025-12-16T12:54:06.322897Z  INFO linera_execution::wasm::runtime_api: CreateMatch operation on USER_CHAIN
2025-12-16T12:54:06.365593Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9.
2025-12-16T12:54:14.292866Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Sent join request to play chain: 0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9
2025-12-16T12:54:14.297171Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Sent join request to play chain: 0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9
2025-12-16T12:54:14.300814Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Sent join request to play chain: 0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9
2025-12-16T12:54:14.338833Z  INFO linera::main:node_service{port=8082}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1.
2025-12-16T12:55:42.924251Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Sent join request to play chain: 0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9
2025-12-16T12:55:42.929002Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Sent join request to play chain: 0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9
2025-12-16T12:55:42.933564Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Sent join request to play chain: 0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9
2025-12-16T12:55:42.981095Z  INFO linera::main:node_service{port=8082}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1.
2025-12-16T12:57:29.257722Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Subscribed to play chain: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:57:29.260047Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Subscribed to play chain: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:57:29.262744Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Subscribed to play chain: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:57:29.293799Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9.
2025-12-16T12:57:31.944154Z  INFO linera_execution::wasm::runtime_api: CreateMatch operation on USER_CHAIN
2025-12-16T12:57:31.945721Z  INFO linera_execution::wasm::runtime_api: Sent RequestCreateMatch message to PLAY_CHAIN 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:57:31.950204Z  INFO linera_execution::wasm::runtime_api: CreateMatch operation on USER_CHAIN
2025-12-16T12:57:31.950750Z  INFO linera_execution::wasm::runtime_api: Sent RequestCreateMatch message to PLAY_CHAIN 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:57:31.954602Z  INFO linera_execution::wasm::runtime_api: CreateMatch operation on USER_CHAIN
2025-12-16T12:57:31.955080Z  INFO linera_execution::wasm::runtime_api: Sent RequestCreateMatch message to PLAY_CHAIN 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:57:31.979951Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9.
2025-12-16T12:57:31.991674Z  INFO linera_execution::wasm::runtime_api: PLAY_CHAIN received RequestCreateMatch from ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
2025-12-16T12:57:31.993077Z  INFO linera_execution::wasm::runtime_api: PLAY_CHAIN: Match created via cross-chain message from ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
2025-12-16T12:57:31.995474Z  INFO linera_execution::wasm::runtime_api: Sent CreateMatchResult (success=true) to ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
2025-12-16T12:57:32.014107Z  INFO linera_execution::wasm::runtime_api: PLAY_CHAIN received RequestCreateMatch from ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
2025-12-16T12:57:32.015297Z  INFO linera_execution::wasm::runtime_api: PLAY_CHAIN: Match created via cross-chain message from ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
2025-12-16T12:57:32.015614Z  INFO linera_execution::wasm::runtime_api: Sent CreateMatchResult (success=true) to ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
2025-12-16T12:57:32.025539Z  INFO linera_execution::wasm::runtime_api: PLAY_CHAIN received RequestCreateMatch from ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
2025-12-16T12:57:32.026104Z  INFO linera_execution::wasm::runtime_api: PLAY_CHAIN: Match created via cross-chain message from ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
2025-12-16T12:57:32.026316Z  INFO linera_execution::wasm::runtime_api: Sent CreateMatchResult (success=true) to ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
2025-12-16T12:57:32.090409Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 1 blocks created on chain 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798.
2025-12-16T12:57:32.092360Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798.
2025-12-16T12:57:32.095346Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN received CreateMatchResult: success=true, match_id=Some(0)
2025-12-16T12:57:32.100219Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Received event: MatchCreated { match_id: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798, host: "Alice", max_players: 2 }
2025-12-16T12:57:32.100323Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Match created by Alice, max players: 2
2025-12-16T12:57:32.103688Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN received CreateMatchResult: success=true, match_id=Some(0)
2025-12-16T12:57:32.107105Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Received event: MatchCreated { match_id: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798, host: "Alice", max_players: 2 }
2025-12-16T12:57:32.107211Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Match created by Alice, max players: 2
2025-12-16T12:57:32.114320Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN received CreateMatchResult: success=true, match_id=Some(0)
2025-12-16T12:57:32.116807Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Received event: MatchCreated { match_id: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798, host: "Alice", max_players: 2 }
2025-12-16T12:57:32.116877Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Match created by Alice, max players: 2
2025-12-16T12:57:32.143088Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 1 blocks created on chain ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9.
2025-12-16T12:57:32.146896Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9.
2025-12-16T12:57:32.148936Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9.
2025-12-16T12:58:33.290046Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Subscribed to play chain: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:58:33.293426Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Subscribed to play chain: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:58:33.297730Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Subscribed to play chain: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:58:33.364742Z  INFO linera_execution::wasm::runtime_api: PLAY_CHAIN received RequestCreateMatch from ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
2025-12-16T12:58:33.365464Z  INFO linera_execution::wasm::runtime_api: PLAY_CHAIN: Match created via cross-chain message from ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
2025-12-16T12:58:33.365701Z  INFO linera_execution::wasm::runtime_api: Sent CreateMatchResult (success=true) to ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9
2025-12-16T12:58:33.373740Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Received event: MatchCreated { match_id: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798, host: "Alice", max_players: 2 }
2025-12-16T12:58:33.373819Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Match created by Alice, max players: 2
2025-12-16T12:58:33.377851Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Received event: MatchCreated { match_id: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798, host: "Alice", max_players: 2 }
2025-12-16T12:58:33.377937Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Match created by Alice, max players: 2
2025-12-16T12:58:33.380818Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Received event: MatchCreated { match_id: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798, host: "Alice", max_players: 2 }
2025-12-16T12:58:33.380893Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Match created by Alice, max players: 2
2025-12-16T12:58:33.407743Z  INFO linera::main:node_service{port=8082}: linera_client::chain_listener: Done processing inbox of chain. 1 blocks created on chain 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1.
2025-12-16T12:58:33.410034Z  INFO linera::main:node_service{port=8082}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1.
2025-12-16T12:58:33.411345Z  INFO linera::main:node_service{port=8082}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1.
2025-12-16T12:58:38.574341Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Sent join request to play chain: 0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9
2025-12-16T12:58:38.577322Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Sent join request to play chain: 0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9
2025-12-16T12:58:38.580506Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Sent join request to play chain: 0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9
2025-12-16T12:58:38.608893Z  INFO linera::main:node_service{port=8082}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1.
2025-12-16T12:59:37.009888Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Subscribed to play chain: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:59:37.012295Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Subscribed to play chain: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:59:37.016959Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Subscribed to play chain: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:59:37.042895Z  INFO linera::main:node_service{port=8082}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1.
2025-12-16T12:59:50.381691Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Sent join request to play chain: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:59:50.384906Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Sent join request to play chain: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:59:50.387914Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Sent join request to play chain: 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:59:50.428981Z  INFO linera::main:node_service{port=8082}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1.
2025-12-16T12:59:50.456012Z  INFO linera::main:node_service{port=8082}: linera_core::client: NewIncomingBundle: Fail to synchronize new message after notification chain_id=41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798
2025-12-16T12:59:50.485095Z  INFO linera_execution::wasm::runtime_api: PLAY_CHAIN: Player joined from chain: 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1
2025-12-16T12:59:50.493585Z  INFO linera_execution::wasm::runtime_api: PLAY_CHAIN: Player joined from chain: 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1
2025-12-16T12:59:50.501848Z  INFO linera_execution::wasm::runtime_api: PLAY_CHAIN: Player joined from chain: 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1
2025-12-16T12:59:50.537000Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 1 blocks created on chain 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798.
2025-12-16T12:59:50.545819Z  INFO linera_execution::wasm::runtime_api: PLAY_CHAIN: Player joined from chain: 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1
2025-12-16T12:59:50.546248Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain 41b44708a79b87c2efaea6251eaa74ec61f6081db370d73bf83e522241d8e798.
2025-12-16T12:59:50.552063Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Received event: PlayerJoined { nickname: "Barnold", player_count: 2 }
2025-12-16T12:59:50.552147Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Player Barnold joined (total: 2)
2025-12-16T12:59:50.554011Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Received event: PlayerJoined { nickname: "Barnold", player_count: 2 }
2025-12-16T12:59:50.554132Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Player Barnold joined (total: 2)
2025-12-16T12:59:50.555363Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Received event: PlayerJoined { nickname: "Barnold", player_count: 2 }
2025-12-16T12:59:50.555441Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Player Barnold joined (total: 2)
2025-12-16T12:59:50.559992Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Received event: PlayerJoined { nickname: "Barnold", player_count: 2 }
2025-12-16T12:59:50.560087Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Player Barnold joined (total: 2)
2025-12-16T12:59:50.560670Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Received event: PlayerJoined { nickname: "Barnold", player_count: 2 }
2025-12-16T12:59:50.560751Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Player Barnold joined (total: 2)
2025-12-16T12:59:50.563895Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Received event: PlayerJoined { nickname: "Barnold", player_count: 2 }
2025-12-16T12:59:50.564161Z  INFO linera_execution::wasm::runtime_api: USER_CHAIN: Player Barnold joined (total: 2)
2025-12-16T12:59:50.587169Z  INFO linera::main:node_service{port=8082}: linera_client::chain_listener: Done processing inbox of chain. 1 blocks created on chain 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1.
2025-12-16T12:59:50.588930Z  INFO linera::main:node_service{port=8082}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain 5c1fea30d0626f2a5473410117f8759f9f9a8f3103b33a3cea1634a855220ce1.
2025-12-16T12:59:50.599579Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 1 blocks created on chain ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9.
2025-12-16T12:59:50.600891Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain ca76016923cf969ab030bd51e0d7bef7885fecd3e2dbcdeb1c38a946f72d58c9.
