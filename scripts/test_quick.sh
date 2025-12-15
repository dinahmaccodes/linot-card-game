#!/usr/bin/env bash
# Quick test following inspo's exact pattern
set -eu

echo "🎮 Quick Whot Test (Inspo Pattern)"

# Kill existing
pkill -f "linera" 2>/dev/null || true
sleep 2

# Config
FAUCET_PORT=8080
SERVICE_PORT_1=8081
SERVICE_PORT_2=8082
LINERA_MAX_PENDING_MESSAGES=10000

export PATH="$PWD/target/debug:$PATH"

# Start network with helper (inspo way)
echo "🚀 Starting network..."
source /dev/stdin <<<"$(linera net helper 2>/dev/null)"
linera_spawn linera net up --initial-amount 1000000000 --with-faucet --faucet-port $FAUCET_PORT
sleep 10

FAUCET_URL="http://localhost:$FAUCET_PORT"

# Wallets using LINERA_TMP_DIR (Inspo pattern)
export LINERA_WALLET_1="$LINERA_TMP_DIR/wallet_1.json"
export LINERA_KEYSTORE_1="$LINERA_TMP_DIR/keystore_1.json"
export LINERA_STORAGE_1="rocksdb:$LINERA_TMP_DIR/client_1.db"

export LINERA_WALLET_2="$LINERA_TMP_DIR/wallet_2.json"
export LINERA_KEYSTORE_2="$LINERA_TMP_DIR/keystore_2.json"
export LINERA_STORAGE_2="rocksdb:$LINERA_TMP_DIR/client_2.db"

echo "👛 Init wallets..."
linera --with-wallet 1 wallet init --faucet "$FAUCET_URL"
linera --with-wallet 2 wallet init --faucet "$FAUCET_URL"

echo "⛓️  Request chains..."
linera --with-wallet 1 wallet request-chain --faucet "$FAUCET_URL"
USER_CHAIN_1=$(linera --with-wallet 1 wallet show | grep "User Chain" | awk '{print $3}' | head -1)

linera --with-wallet 2 wallet request-chain --faucet "$FAUCET_URL"
USER_CHAIN_2=$(linera --with-wallet 2 wallet show | grep "User Chain" | awk '{print $3}' | head -1)

echo "User Chain 1: $USER_CHAIN_1"
echo "User Chain 2: $USER_CHAIN_2"

# Sync
linera --with-wallet 1 sync
linera --with-wallet 2 sync

# Build
echo "🔨 Building..."
(cd backend && cargo build --release --target wasm32-unknown-unknown)

# Deploy
echo "📦 Publishing..."
cd backend
DEPLOY_OUTPUT=$(linera --with-wallet 1 project publish-and-create --wait-for-outgoing-messages 2>&1)
APP_ID=$(echo "$DEPLOY_OUTPUT" | grep "Application ID" | awk '{print $NF}')
cd ..

echo "✅ App deployed: $APP_ID"

# Start services
echo "🌐 Starting services..."
linera --max-pending-message-bundles $LINERA_MAX_PENDING_MESSAGES --with-wallet 1 service --port $SERVICE_PORT_1 &
sleep 5
linera --max-pending-message-bundles $LINERA_MAX_PENDING_MESSAGES --with-wallet 2 service --port $SERVICE_PORT_2 &
sleep 5

echo ""
echo "✅ Ready!"
echo ""
echo "🔗 Endpoints:"
echo "   Player 1: http://localhost:$SERVICE_PORT_1"
echo "   Player 2: http://localhost:$SERVICE_PORT_2"
echo ""
echo "📝 Test:"
echo "export APP_ID=$APP_ID"
echo "export USER_CHAIN_1=$USER_CHAIN_1"
echo "export USER_CHAIN_2=$USER_CHAIN_2"
echo ""
echo "# Player 1 joins:"
echo "curl -X POST http://localhost:8081/chains/\$USER_CHAIN_1/applications/\$APP_ID \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"query\":\"mutation { joinMatch(nickname: \\\"Alice\\\") }\"}'"
echo ""
echo "Press Ctrl+C to stop"

# Keep alive
wait
