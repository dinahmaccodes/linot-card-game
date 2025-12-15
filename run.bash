#!/usr/bin/env bash

set -e

echo "🎮 Deploying Whot Card Game - 2 Player Multiplayer"

# Start Linera network directly (avoid linera_spawn cleanup issues in Docker)
echo "🌐 Starting Linera network..."
linera net up --initial-amount 1000000000 --with-faucet --faucet-port 8080 > /tmp/linera_network.log 2>&1 &
NETWORK_PID=$!

export LINERA_FAUCET_URL=http://localhost:8080
export FAUCET_PORT=8080
export SERVICE_PORT_1=8081
export SERVICE_PORT_2=8082
LINERA_TMP_DIR=/tmp/linera_whot

# Remove old data to avoid conflicts
rm -rf $LINERA_TMP_DIR
mkdir -p $LINERA_TMP_DIR

# Setup wallet environment variables 
export LINERA_WALLET_1="$LINERA_TMP_DIR/wallet_1.json"
export LINERA_KEYSTORE_1="$LINERA_TMP_DIR/keystore_1.json"
export LINERA_STORAGE_1="rocksdb:$LINERA_TMP_DIR/client_1.db"

export LINERA_WALLET_2="$LINERA_TMP_DIR/wallet_2.json"
export LINERA_KEYSTORE_2="$LINERA_TMP_DIR/keystore_2.json"
export LINERA_STORAGE_2="rocksdb:$LINERA_TMP_DIR/client_2.db"

echo "⏳ Waiting for network to initialize..."
sleep 12

# Initialize Player 1 wallet
echo "👛 Creating Player 1 wallet..."
linera --with-wallet 1 wallet init --faucet "$LINERA_FAUCET_URL"
USER_CHAIN_1=$(linera --with-wallet 1 wallet show | grep -E "^[a-f0-9]{64}$" | head -n1)
OWNER_1=$(linera --with-wallet 1 wallet show | grep "Public Key" | awk '{print $NF}')

echo "✅ Player 1 Chain: $USER_CHAIN_1"

# Initialize Player 2 wallet
echo "👛 Creating Player 2 wallet..."
linera --with-wallet 2 wallet init --faucet "$LINERA_FAUCET_URL"
USER_CHAIN_2=$(linera --with-wallet 2 wallet show | grep -E "^[a-f0-9]{64}$" | head -n1)
OWNER_2=$(linera --with-wallet 2 wallet show | grep "Public Key" | awk '{print $NF}')

echo "✅ Player 2 Chain: $USER_CHAIN_2"

linera --with-wallet 1 sync
linera --with-wallet 2 sync

# Create shared Play Chain (from Player 1)
echo "⛓️  Creating shared Play Chain..."
PLAY_CHAIN=$(linera --with-wallet 1 wallet request-chain --faucet "$LINERA_FAUCET_URL" | grep -E "^[a-f0-9]{64}$")
echo "✅ Play Chain: $PLAY_CHAIN"

# Build contracts
echo "🔨 Building contracts..."
cd backend
cargo build --release --target wasm32-unknown-unknown
cd ..

# Deploy application from Player 1
echo "📦 Deploying application..."
DEPLOY_OUTPUT=$(linera --with-wallet 1 project publish-and-create backend \
  --json-argument '{"max_players": 2, "is_ranked": false, "strict_mode": false}' \
  --wait-for-outgoing-messages 2>&1)
APP_ID=$(echo "$DEPLOY_OUTPUT" | grep "Application ID" | awk '{print $NF}')

echo "✅ Application deployed: $APP_ID"

# Create frontend config with both player endpoints
echo "📝 Creating frontend config..."
cat > frontend/public/config.json << ENVEOF
{
  "applicationId": "$APP_ID",
  "playChain": "$PLAY_CHAIN",
  "endpoints": [
    {
      "chainId": "$USER_CHAIN_1",
      "owner": "$OWNER_1",
      "url": "http://whot:$SERVICE_PORT_1"
    },
    {
      "chainId": "$USER_CHAIN_2",
      "owner": "$OWNER_2",
      "url": "http://whot:$SERVICE_PORT_2"
    }
  ]
}
ENVEOF

echo "✅ Frontend config created"

# Start GraphQL services for both players
echo "🌐 Starting Player 1 GraphQL service on port $SERVICE_PORT_1..."
linera --with-wallet 1 service --port $SERVICE_PORT_1 &
SERVICE_PID_1=$!

echo "🌐 Starting Player 2 GraphQL service on port $SERVICE_PORT_2..."
linera --with-wallet 2 service --port $SERVICE_PORT_2 &
SERVICE_PID_2=$!

sleep 5

# Build and run frontend
echo "🎨 Starting frontend..."
cd frontend
npm install
npm run dev -- --hostname 0.0.0.0 --port 3000 &
cd ..

echo ""
echo "✅ Multiplayer Deployment Complete!"
echo ""
echo "🔗 Access Points:"
echo "   Frontend:        http://localhost:3000"
echo "   Player 1 (8081): http://localhost:$SERVICE_PORT_1"
echo "   Player 2 (8082): http://localhost:$SERVICE_PORT_2"
echo "   Faucet:          http://localhost:$FAUCET_PORT"
echo ""
echo "📝 Application Info:"
echo "   App ID:          $APP_ID"
echo "   Play Chain:      $PLAY_CHAIN"
echo "   Player 1 Chain:  $USER_CHAIN_1"
echo "   Player 2 Chain:  $USER_CHAIN_2"
echo ""
echo "🎮 Test Commands:"
echo "   # Player 1 joins game:"
echo "   curl -X POST http://localhost:$SERVICE_PORT_1/chains/$USER_CHAIN_1/applications/$APP_ID \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"query\":\"mutation { joinMatch(nickname: \\\"Alice\\\") }\"}'"
echo ""
echo "   # Player 2 joins game:"
echo "   curl -X POST http://localhost:$SERVICE_PORT_2/chains/$USER_CHAIN_2/applications/$APP_ID \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"query\":\"mutation { joinMatch(nickname: \\\"Bob\\\") }\"}'"
echo ""
echo "🎮 Services are running. Press Ctrl+C to stop."
echo ""

# Keep container running by waiting for background processes
wait
