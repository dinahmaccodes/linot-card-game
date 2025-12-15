#!/usr/bin/env bash
set -eu

echo "🎮 Simple Whot Multiplayer Test (2 Players)"

# Kill existing processes
echo "🧹 Cleanup..."
pkill -f "linera" 2>/dev/null || true
sleep 2

# Setup
FAUCET_PORT=8080
SERVICE_PORT_1=8081
SERVICE_PORT_2=8082
export PATH="$PWD/target/debug:$PATH"
rm -rf tmp
mkdir -p tmp

# Wallet environment variables (critical for --with-wallet flag)
export LINERA_WALLET_1="$PWD/tmp/wallet_1.json"
export LINERA_KEYSTORE_1="$PWD/tmp/keystore_1.json"
export LINERA_STORAGE_1="rocksdb:$PWD/tmp/client_1.db"

export LINERA_WALLET_2="$PWD/tmp/wallet_2.json"
export LINERA_KEYSTORE_2="$PWD/tmp/keystore_2.json"
export LINERA_STORAGE_2="rocksdb:$PWD/tmp/client_2.db"

# Start network
echo "🚀 Starting Linera network..."
linera net up --initial-amount 1000000000 --with-faucet --faucet-port $FAUCET_PORT &
sleep 8

FAUCET_URL="http://localhost:$FAUCET_PORT"

# Initialize wallets
echo "👛 Creating wallets..."
linera --with-wallet 1 wallet init --faucet "$FAUCET_URL" || { echo "Failed to init wallet 1"; exit 1; }
linera --with-wallet 2 wallet init --faucet "$FAUCET_URL" || { echo "Failed to init wallet 2"; exit 1; }

echo "⛓️  Creating chains..."
PLAY_CHAIN=$(linera --with-wallet 1 wallet request-chain --faucet "$FAUCET_URL" 2>&1 | grep -E "^[a-f0-9]{64}$" | head -n1)
USER_CHAIN_1=$(linera --with-wallet 1 wallet request-chain --faucet "$FAUCET_URL" 2>&1 | grep -E "^[a-f0-9]{64}$" | head -n1)
echo "  User 1 Default Chain: $USER_CHAIN_1"

linera --with-wallet 1 sync


# Wallet 2


USER_CHAIN_2=$(linera --with-wallet 2 wallet request-chain --faucet "$FAUCET_URL" 2>&1 | grep -E "^[a-f0-9]{64}$" | head -n1)
echo "  User 2 Default Chain: $USER_CHAIN_2"

linera --with-wallet 2 sync


linera --with-wallet 1 sync
linera --with-wallet 2 sync

# Assign Roles
PLAY_CHAIN=$USER_CHAIN_1 # Host Logic on User 1's chain
echo "  Play Chain: $PLAY_CHAIN"

# Build
echo "🔨 Building contracts..."
(cd backend && cargo build --release --target wasm32-unknown-unknown)

# Deploy
echo "📦 Deploying application..."
# Use 'publish-and-create' (without 'project') for explicit Wasm paths
if ! DEPLOY_OUTPUT=$(linera --with-wallet 1 publish-and-create \
  backend/target/wasm32-unknown-unknown/release/backend_contract.wasm \
  backend/target/wasm32-unknown-unknown/release/backend_service.wasm \
  --json-argument "{\"max_players\": 2, \"is_ranked\": false, \"strict_mode\": false}" \
  2>&1); then
  echo "❌ Deployment failed:"
  echo "$DEPLOY_OUTPUT"
  exit 1
fi
echo "DEBUG - Full Deployment Output:"
echo "$DEPLOY_OUTPUT"
echo "--------------------------------"

APP_ID=$(echo "$DEPLOY_OUTPUT" | grep "Application ID" | awk '{print $NF}')

echo "✅ Application deployed: $APP_ID"

# Start services
echo "🌐 Starting GraphQL services..."
linera --with-wallet 1 service --port $SERVICE_PORT_1 &
SERVICE_PID_1=$!
linera --with-wallet 2 service --port $SERVICE_PORT_2 &
SERVICE_PID_2=$!

sleep 5

# --- AUTOMATED TEST FLOW ---

# 1. Join Match (Player 1 - Host)
echo "👤 Player 1 joining..."
echo "URL: http://localhost:$SERVICE_PORT_1/chains/$USER_CHAIN_1/applications/$APP_ID"
RESPONSE=$(curl -s -X POST "http://localhost:$SERVICE_PORT_1/chains/$USER_CHAIN_1/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { joinMatch(nickname: \"HostAlice\") }"}')
echo "Response: $RESPONSE"

# 2. Join From Chain (Player 2 - Cross Chain)
echo "👤 Player 2 joining (cross-chain)..."
echo "URL: http://localhost:$SERVICE_PORT_2/chains/$USER_CHAIN_2/applications/$APP_ID"
RESPONSE=$(curl -s -X POST "http://localhost:$SERVICE_PORT_2/chains/$USER_CHAIN_2/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"mutation { joinFromChain(hostChainId: \\\"$PLAY_CHAIN\\\", nickname: \\\"GuestBob\\\") }\"}")
echo "Response: $RESPONSE"

echo "⏳ Waiting for join message delivery..."
sleep 5 

# 3. Verify Player 2 Joined (Host View)
echo "📊 Verifying players on Host Chain..."
FOUND=0
for i in {1..5}; do
  if curl -s -X POST "http://localhost:$SERVICE_PORT_1/chains/$USER_CHAIN_1/applications/$APP_ID" \
    -H "Content-Type: application/json" \
    -d '{"query": "query { matchState { players { nickname } } }"}' \
    2>/dev/null | grep "GuestBob"; then
    echo "✅ Player 2 found!"
    FOUND=1
    break
  fi
  echo "zzz Waiting for player 2... ($i/5)"
  sleep 2
done

if [ $FOUND -eq 0 ]; then
  echo "❌ Player 2 failed to join in time. Skipping match start."
  exit 1
fi

# 4. Start Match (Player 1)
echo "🎮 Starting match..."
curl -s -X POST "http://localhost:$SERVICE_PORT_1/chains/$USER_CHAIN_1/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { startMatch }"}'

sleep 2

# 5. Check State (Host View)
echo "📊 Checking final state..."
curl -s -X POST "http://localhost:$SERVICE_PORT_1/chains/$USER_CHAIN_1/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { matchState { status players { nickname cardCount } } }"}'
echo ""
echo "🔗 GraphQL Endpoints:"
echo "   Player 1: http://localhost:$SERVICE_PORT_1"
echo "   Player 2: http://localhost:$SERVICE_PORT_2"
echo ""
echo "📝 Application Info:"
echo "   App ID:       $APP_ID"
echo "   Play Chain:   $PLAY_CHAIN"
echo "   User Chain 1: $USER_CHAIN_1"
echo "   User Chain 2: $USER_CHAIN_2"
echo ""
echo "Press Ctrl+C to stop..."

# Cleanup on exit
cleanup() {
  echo ""
  echo "🧹 Cleaning up..."
  kill $SERVICE_PID_1 $SERVICE_PID_2 2>/dev/null || true
  pkill -f "linera" 2>/dev/null || true
}
trap cleanup EXIT

wait
