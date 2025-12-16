#!/usr/bin/env bash
set -e

echo "Deploying Whot Card Game - 2 Player Multiplayer"

# -----------------------------------------------------------------------------------------------------------------
# Cleanup and Setup
# -----------------------------------------------------------------------------------------------------------------


cleanup() {
  echo "Cleaning up..."
  rm -rf frontend/web_p1 frontend/web_p2
  kill $SERVICE_PID_1 $SERVICE_PID_2 2>/dev/null || true
}
# REMOVED trap cleanup EXIT - was hiding deployment errors!

# -----------------------------------------------------------------------------------------------------------------
# Environment Setup
# -----------------------------------------------------------------------------------------------------------------
export LINERA_FAUCET_URL=http://localhost:8080
export FAUCET_PORT=8080
export SERVICE_PORT_1=8081
export SERVICE_PORT_2=8082
LINERA_TMP_DIR=/tmp/linera_whot

# Remove old data (inspo pattern)
echo "Cleaning up old state..."
rm -rf $LINERA_TMP_DIR
mkdir -p $LINERA_TMP_DIR

# Setup wallet environment variables  
export LINERA_WALLET_1="$LINERA_TMP_DIR/wallet_1.json"
export LINERA_KEYSTORE_1="$LINERA_TMP_DIR/keystore_1.json"
export LINERA_STORAGE_1="rocksdb:$LINERA_TMP_DIR/client_1.db"

export LINERA_WALLET_2="$LINERA_TMP_DIR/wallet_2.json"
export LINERA_KEYSTORE_2="$LINERA_TMP_DIR/keystore_2.json"
export LINERA_STORAGE_2="rocksdb:$LINERA_TMP_DIR/client_2.db"

# -----------------------------------------------------------------------------------------------------------------
# Start Linera Network
# -----------------------------------------------------------------------------------------------------------------
echo "Starting Linera network..."
linera net up --initial-amount 1000000000 --with-faucet --faucet-port $FAUCET_PORT > /tmp/linera_network.log 2>&1 &
echo "Waiting for network to initialize..."
sleep 12

# -----------------------------------------------------------------------------------------------------------------
# Create Wallets and Extract Chain IDs (working pattern from working-bash.md)
# -----------------------------------------------------------------------------------------------------------------
echo "Creating Player 1 wallet..."
linera --with-wallet 1 wallet init --faucet "$LINERA_FAUCET_URL"

echo "Requesting chain for Player 1..."
USER_CHAIN_1_OUTPUT=$(linera --with-wallet 1 wallet request-chain --faucet "$LINERA_FAUCET_URL")
mapfile -t StringArray <<<"$USER_CHAIN_1_OUTPUT"
USER_CHAIN_1=${StringArray[0]}

OWNER_1=$(linera --with-wallet 1 wallet show | grep "AccountOwner:" | head -1 | awk '{print $2}')
echo "Player 1 Chain: $USER_CHAIN_1"
echo "Player 1 Owner: $OWNER_1"

echo "Creating Player 2 wallet..."
linera --with-wallet 2 wallet init --faucet "$LINERA_FAUCET_URL"

echo "Requesting chain for Player 2..."
USER_CHAIN_2_OUTPUT=$(linera --with-wallet 2 wallet request-chain --faucet "$LINERA_FAUCET_URL")
mapfile -t StringArray <<<"$USER_CHAIN_2_OUTPUT"
USER_CHAIN_2=${StringArray[0]}

OWNER_2=$(linera --with-wallet 2 wallet show | grep "AccountOwner:" | head -1 | awk '{print $2}')
echo "Player 2 Chain: $USER_CHAIN_2"
echo "Player 2 Owner: $OWNER_2"

# Sync wallets
linera --with-wallet 1 sync
linera --with-wallet 2 sync

# Create shared Play Chain
echo "Creating shared Play Chain..."
PLAY_CHAIN_OUTPUT=$(linera --with-wallet 1 wallet request-chain --faucet "$LINERA_FAUCET_URL")
mapfile -t StringArray <<< "$PLAY_CHAIN_OUTPUT"
PLAY_CHAIN=${StringArray[0]}
echo "Play Chain: $PLAY_CHAIN"

# -----------------------------------------------------------------------------------------------------------------
# Build Contracts
# -----------------------------------------------------------------------------------------------------------------
echo "Building contracts..."
cd backend
cargo build --release --target wasm32-unknown-unknown
cd ..

# -----------------------------------------------------------------------------------------------------------------
# Deploy Application (inspo pattern: project publish-and-create)
# -----------------------------------------------------------------------------------------------------------------
echo "Deploying application..."
echo "NOTE: This may take 10-30 seconds..."

cd backend

# Use explicit wallet environment variables (not --with-wallet flag)
echo "Running deployment command..."
DEPLOY_OUTPUT=$(LINERA_WALLET="$LINERA_WALLET_1" LINERA_STORAGE="$LINERA_STORAGE_1" LINERA_KEYSTORE="$LINERA_KEYSTORE_1" \
  linera --wait-for-outgoing-messages project publish-and-create . linot 2>&1)

# Check if deployment succeeded
DEPLOY_EXIT_CODE=$?
cd ..

echo "Deployment exit code: $DEPLOY_EXIT_CODE"
echo "Deployment output:"
echo "$DEPLOY_OUTPUT"
echo "---"

if [ $DEPLOY_EXIT_CODE -ne 0 ]; then
  echo "Deployment failed!"
  exit 1
fi

# Extract APP_ID from output (64-character hex string) - use last one (actual app ID)
APP_ID=$(echo "$DEPLOY_OUTPUT" | grep -Eo '[0-9a-f]{64}' | tail -1)

if [ -z "$APP_ID" ]; then
  echo "Failed to extract Application ID!"
  echo "Full output was shown above"
  exit 1
fi

echo "Application deployed successfully!"
echo "APP_ID: $APP_ID"

# -----------------------------------------------------------------------------------------------------------------
# Build Frontend (if needed)
# -----------------------------------------------------------------------------------------------------------------
if [ ! -d "frontend/out" ]; then
  echo "Building frontend..."
  cd frontend
  npm install
  npm run build
  cd ..
else
  echo "Frontend already built"
fi

# -----------------------------------------------------------------------------------------------------------------
# Setup Player Directories 
# -----------------------------------------------------------------------------------------------------------------
echo "Creating player frontend directories..."
mkdir -p frontend/web_p1 frontend/web_p2

# Copy built frontend
cp -r frontend/out/. frontend/web_p1/
cp -r frontend/out/. frontend/web_p2/

# -----------------------------------------------------------------------------------------------------------------
# Generate config.json 
# -----------------------------------------------------------------------------------------------------------------
echo "Generating config.json for Player 1..."
jq -n \
  --arg applicationId "$APP_ID" \
  --arg playChain "$PLAY_CHAIN" \
  --arg chainId "$USER_CHAIN_1" \
  --arg graphqlUrl "http://localhost:$SERVICE_PORT_1" \
  --arg owner "$OWNER_1" \
  '{
    applicationId: $applicationId,
    playChain: $playChain,
    endpoints: [
      {
        playerNumber: 1,
        chainId: $chainId,
        graphqlUrl: $graphqlUrl,
        owner: $owner
      }
    ]
  }' > "frontend/web_p1/config.json"

echo "Player 1 config created"
echo "  GraphQL Endpoint: http://localhost:$SERVICE_PORT_1/chains/$USER_CHAIN_1/applications/$APP_ID"

echo "Generating config.json for Player 2..."
jq -n \
  --arg applicationId "$APP_ID" \
  --arg playChain "$PLAY_CHAIN" \
  --arg chainId "$USER_CHAIN_2" \
  --arg graphqlUrl "http://localhost:$SERVICE_PORT_2" \
  --arg owner "$OWNER_2" \
  '{
    applicationId: $applicationId,
    playChain: $playChain,
    endpoints: [
      {
        playerNumber: 2,
        chainId: $chainId,
        graphqlUrl: $graphqlUrl,
        owner: $owner
      }
    ]
  }' > "frontend/web_p2/config.json"

echo "Player 2 config created"
echo "  GraphQL Endpoint: http://localhost:$SERVICE_PORT_2/chains/$USER_CHAIN_2/applications/$APP_ID"

# -----------------------------------------------------------------------------------------------------------------
# Start Services
# -----------------------------------------------------------------------------------------------------------------
echo "Starting GraphQL services..."
linera --with-wallet 1 service --port $SERVICE_PORT_1 &
SERVICE_PID_1=$!

linera --with-wallet 2 service --port $SERVICE_PORT_2 &
SERVICE_PID_2=$!

sleep 5

echo "Starting web servers..."
cd frontend/web_p1
npx -y http-server . -p 5173 --cors -c0 --no-dotfiles &
WEB_PID_1=$!

cd ../web_p2
npx -y http-server . -p 5174 --cors -c0 --no-dotfiles &
WEB_PID_2=$!
cd ../..

echo ""
echo "================================================"
echo "Linot Running!"
echo "================================================"
echo ""
echo "Frontend:"
echo "  Player 1: http://localhost:5173?player=1"
echo "  Player 2: http://localhost:5174?player=2"
echo ""
echo "GraphQL:"
echo "  Player 1: http://localhost:$SERVICE_PORT_1"
echo "  Player 2: http://localhost:$SERVICE_PORT_2"
echo ""
echo "Application Details:"
echo "  APP_ID:        $APP_ID"
echo "  PLAY_CHAIN:    $PLAY_CHAIN"
echo "  USER_CHAIN_1:  $USER_CHAIN_1"
echo "  USER_CHAIN_2:  $USER_CHAIN_2"
echo "  OWNER_1:       $OWNER_1"
echo "  OWNER_2:       $OWNER_2"
echo ""
echo "GraphQL Test URLs:"
echo "  Player 1: http://localhost:$SERVICE_PORT_1/chains/$USER_CHAIN_1/applications/$APP_ID"
echo "  Player 2: http://localhost:$SERVICE_PORT_2/chains/$USER_CHAIN_2/applications/$APP_ID"
echo ""
echo "Services running. Press Ctrl+C to stop."
echo ""

# Keep running
wait
