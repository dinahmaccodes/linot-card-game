Analyze the format for the links and then use that to give me the working links 

```

Starting Wallet 1 GraphQL service on port 8081...
Starting Wallet 2 GraphQL service on port 8082...
2025-12-15T02:46:59.774435Z  INFO linera::main:node_service{port=8082}: linera_service::node_service: GraphiQL IDE: http://localhost:8082
2025-12-15T02:46:59.785314Z  INFO background_sync_received_certificates{chain_id=0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9}: linera_client::chain_listener: Starting background certificate sync for chain 0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9
2025-12-15T02:46:59.785394Z  INFO background_sync_received_certificates{chain_id=188c3a8265ae4f62f0d97648b83daf857a8d2ba7135b709b85f61b3f7f280291}: linera_client::chain_listener: Starting background certificate sync for chain 188c3a8265ae4f62f0d97648b83daf857a8d2ba7135b709b85f61b3f7f280291
2025-12-15T02:46:59.789242Z  INFO background_sync_received_certificates{chain_id=0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9}: linera_core::client: find_received_certificates finished
2025-12-15T02:46:59.793174Z  INFO background_sync_received_certificates{chain_id=188c3a8265ae4f62f0d97648b83daf857a8d2ba7135b709b85f61b3f7f280291}: linera_core::client: find_received_certificates finished
2025-12-15T02:46:59.794300Z  INFO linera::main:node_service{port=8082}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain 188c3a8265ae4f62f0d97648b83daf857a8d2ba7135b709b85f61b3f7f280291.
2025-12-15T02:46:59.795298Z  INFO linera::main:node_service{port=8081}: linera_service::node_service: GraphiQL IDE: http://localhost:8081
2025-12-15T02:46:59.804283Z  INFO background_sync_received_certificates{chain_id=0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9}: linera_client::chain_listener: Starting background certificate sync for chain 0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9
2025-12-15T02:46:59.805279Z  INFO background_sync_received_certificates{chain_id=fc3af78e8b41ed93e75fee47c14a5cb38f88b4aaf078cfa380b5eb2a4e07f8e0}: linera_client::chain_listener: Starting background certificate sync for chain fc3af78e8b41ed93e75fee47c14a5cb38f88b4aaf078cfa380b5eb2a4e07f8e0
2025-12-15T02:46:59.809063Z  INFO background_sync_received_certificates{chain_id=0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9}: linera_core::client: find_received_certificates finished
2025-12-15T02:46:59.815308Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain fc3af78e8b41ed93e75fee47c14a5cb38f88b4aaf078cfa380b5eb2a4e07f8e0.
2025-12-15T02:46:59.816799Z  INFO background_sync_received_certificates{chain_id=fc3af78e8b41ed93e75fee47c14a5cb38f88b4aaf078cfa380b5eb2a4e07f8e0}: linera_core::client: find_received_certificates finished
Services initialized, waiting for readiness...

------------------------------------------------
Backend Deployment Complete
------------------------------------------------

   GraphQL Player 1: http://localhost:8081
   GraphQL Player 2: http://localhost:8082

To start frontend, run in separate terminal:
   ./run-frontend.bash

Services are running. Press Ctrl+C to stop.



-----

THE OUTPUT 

Your New Deployment URLs
APP_ID: 212203691ee2f91fe2ac310d983b89e2961ff5152238bd9185ed1d7c1ff98d75
PLAY_CHAIN (Wallet 1's default): 0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9
USER_CHAIN_1 (Port 8081): fc3af78e8b41ed93e75fee47c14a5cb38f88b4aaf078cfa380b5eb2a4e07f8e0
USER_CHAIN_2 (Port 8082): 188c3a8265ae4f62f0d97648b83daf857a8d2ba7135b709b85f61b3f7f280291



---- IMPORTANT DETAILS -----

Debugging StartMatch Issue
✅ Fixed StartMatch bug! Added StartMatchAction cross-chain message and routing logic. StartMatch now sends message to PLAY_CHAIN instead of executing locally on USER_CHAIN. PLAY_CHAIN handler will deal cards and set status to IN_PROGRESS. Build successful. Ready for redeployment.


Found and fixed the StartMatch bug!

Problem: StartMatch executed on USER_CHAIN but needed to run on PLAY_CHAIN.

Solution: Added cross-chain message routing (like CreateMatch/JoinMatch).

Changes:

Added StartMatchAction message
StartMatch now sends message to PLAY_CHAIN
PLAY_CHAIN executes match start logic
To test: Redeploy with ./run.bash, recreate match, then run startMatch - it will now deal 6 cards to each player! 🎮

Check walkthrough for full details.

----

script that was working and had mutations working 

Starting Wallet 1 GraphQL service on port 8081...
Starting Wallet 2 GraphQL service on port 8082...
2025-12-15T02:46:59.774435Z  INFO linera::main:node_service{port=8082}: linera_service::node_service: GraphiQL IDE: http://localhost:8082
2025-12-15T02:46:59.785314Z  INFO background_sync_received_certificates{chain_id=0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9}: linera_client::chain_listener: Starting background certificate sync for chain 0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9
2025-12-15T02:46:59.785394Z  INFO background_sync_received_certificates{chain_id=188c3a8265ae4f62f0d97648b83daf857a8d2ba7135b709b85f61b3f7f280291}: linera_client::chain_listener: Starting background certificate sync for chain 188c3a8265ae4f62f0d97648b83daf857a8d2ba7135b709b85f61b3f7f280291
2025-12-15T02:46:59.789242Z  INFO background_sync_received_certificates{chain_id=0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9}: linera_core::client: find_received_certificates finished
2025-12-15T02:46:59.793174Z  INFO background_sync_received_certificates{chain_id=188c3a8265ae4f62f0d97648b83daf857a8d2ba7135b709b85f61b3f7f280291}: linera_core::client: find_received_certificates finished
2025-12-15T02:46:59.794300Z  INFO linera::main:node_service{port=8082}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain 188c3a8265ae4f62f0d97648b83daf857a8d2ba7135b709b85f61b3f7f280291.
2025-12-15T02:46:59.795298Z  INFO linera::main:node_service{port=8081}: linera_service::node_service: GraphiQL IDE: http://localhost:8081
2025-12-15T02:46:59.804283Z  INFO background_sync_received_certificates{chain_id=0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9}: linera_client::chain_listener: Starting background certificate sync for chain 0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9
2025-12-15T02:46:59.805279Z  INFO background_sync_received_certificates{chain_id=fc3af78e8b41ed93e75fee47c14a5cb38f88b4aaf078cfa380b5eb2a4e07f8e0}: linera_client::chain_listener: Starting background certificate sync for chain fc3af78e8b41ed93e75fee47c14a5cb38f88b4aaf078cfa380b5eb2a4e07f8e0
2025-12-15T02:46:59.809063Z  INFO background_sync_received_certificates{chain_id=0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9}: linera_core::client: find_received_certificates finished
2025-12-15T02:46:59.815308Z  INFO linera::main:node_service{port=8081}: linera_client::chain_listener: Done processing inbox of chain. 0 blocks created on chain fc3af78e8b41ed93e75fee47c14a5cb38f88b4aaf078cfa380b5eb2a4e07f8e0.
2025-12-15T02:46:59.816799Z  INFO background_sync_received_certificates{chain_id=fc3af78e8b41ed93e75fee47c14a5cb38f88b4aaf078cfa380b5eb2a4e07f8e0}: linera_core::client: find_received_certificates finished
Services initialized, waiting for readiness...

------------------------------------------------
Backend Deployment Complete
------------------------------------------------

   GraphQL Player 1: http://localhost:8081
   GraphQL Player 2: http://localhost:8082

To start frontend, run in separate terminal:
   ./run-frontend.bash

Services are running. Press Ctrl+C to stop.



