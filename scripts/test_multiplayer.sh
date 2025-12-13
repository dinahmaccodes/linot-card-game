#!/usr/bin/env bash
set -eu

echo "Testing Whot Multiplayer (2 Players)"

# Kill any existing Linera processes first
echo "Cleaning up any existing Linera processes..."
pkill -f "linera" 2>/dev/null || true
sleep 2

# Ports configuration
FAUCET_PORT=8080
SERVICE_PORT_1=8081
SERVICE_PORT_2=8082

# Setup paths
export PATH="$PWD/target/debug:$PATH"
rm -rf tmp
mkdir -p tmp

# Setup wallet environment variables (INSPO pattern)
export LINERA_WALLET_1="$PWD/tmp/wallet_1.json"
export LINERA_KEYSTORE_1="$PWD/tmp/keystore_1.json"
export LINERA_STORAGE_1="rocksdb:$PWD/tmp/client_1.db"

export LINERA_WALLET_2="$PWD/tmp/wallet_2.json"
export LINERA_KEYSTORE_2="$PWD/tmp/keystore_2.json"
export LINERA_STORAGE_2="rocksdb:$PWD/tmp/client_2.db"

# Start Linera network using helper (INSPO pattern)
echo "Starting Linera network..."
source /dev/stdin <<<"$(linera net helper 2>/dev/null)"
linera_spawn linera net up --initial-amount 1000000000 --with-faucet --faucet-port $FAUCET_PORT &
NETWORK_PID=$!
sleep 5

FAUCET_URL="http://localhost:$FAUCET_PORT"

# Initialize wallets using --with-wallet flag (requires env vars set)
echo "Initializing wallets..."
linera --with-wallet 1 wallet init --faucet "$FAUCET_URL"
linera --with-wallet 2 wallet init --faucet "$FAUCET_URL"

# Create chains
echo "Creating chains..."
PLAY_CHAIN=$(linera --with-wallet 1 wallet request-chain --faucet "$FAUCET_URL" 2>&1 | head -n1)
USER_CHAIN_1=$(linera --with-wallet 1 wallet request-chain --faucet "$FAUCET_URL" 2>&1 | head -n1)
USER_CHAIN_2=$(linera --with-wallet 2 wallet request-chain --faucet "$FAUCET_URL" 2>&1 | head -n1)

echo "Play Chain: $PLAY_CHAIN"
echo "User 1 Chain: $USER_CHAIN_1"
echo "User 2 Chain: $USER_CHAIN_2"

# Build contracts
echo "Building contracts..."
cd backend
cargo build --release --target wasm32-unknown-unknown
cd ..

# Deploy application on play chain
echo "Deploying Whot application..."
APP_ID=$(linera --with-wallet 1 project publish-and-create \
  --wait-for-outgoing-messages 2>&1 | grep "Application ID" | awk '{print $NF}')

echo "Application deployed: $APP_ID"

# Start services
echo "Starting GraphQL services..."
linera --with-wallet 1 service --port $SERVICE_PORT_1 &
SERVICE_PID_1=$!
linera --with-wallet 2 service --port $SERVICE_PORT_2 &
SERVICE_PID_2=$!

sleep 3

echo "Test environment ready!"
echo ""
echo "GraphQL Endpoints:"
echo "   Player 1: http://localhost:$SERVICE_PORT_1"
echo "   Player 2: http://localhost:$SERVICE_PORT_2"
echo ""
echo "Test with:"
echo "   curl -X POST http://localhost:$SERVICE_PORT_1/chains/$USER_CHAIN_1/applications/$APP_ID \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"query\":\"mutation { joinMatch(nickname: \\\"Alice\\\") }\"}'"
echo ""

# Cleanup function
cleanup() {
  echo ""
  echo "Cleaning up..."
  kill $NETWORK_PID $SERVICE_PID_1 $SERVICE_PID_2 2>/dev/null || true
  # Keep tmp/ for debugging
}

trap cleanup EXIT

# Wait for user interrupt
echo "Press Ctrl+C to stop..."
wait
