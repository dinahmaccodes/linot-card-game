#!/usr/bin/env bash
set -e

# Multiplayer inspo pattern: Use linera net helper for shared local network
export PATH="$PWD/target/debug:$PATH"
source /dev/stdin <<<"$(linera net helper 2>/dev/null)"

# Configuration
LINERA_FAUCET_URL="http://localhost:8080"
SERVICE_PORT_1=8081
SERVICE_PORT_2=8082

echo "Deploying Whot Card Game - 2 Player Multiplayer"

# Start Linera network with faucet 
echo "Starting Linera network..."
linera_spawn linera net up --initial-amount 1000000000000 --with-faucet --faucet-port 8080 --faucet-amount 1000000000

echo "Waiting for network to initialize..."
sleep 12

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

echo "Waiting for network to initialize..."
sleep 12

# Initialize Player 1 wallet (Host)
echo "Creating Player 1 wallet..."
linera --with-wallet 1 wallet init --faucet "$LINERA_FAUCET_URL"

# Get the default chain ID (PLAY_CHAIN) - this is the chain Wallet 1 owns
# The output format is: "Default chain: <chain_id>"
PLAY_CHAIN=$(linera --with-wallet 1 wallet show | grep "Default chain" | awk '{print $NF}')

if [ -z "$PLAY_CHAIN" ]; then
    echo "Failed to extract PLAY_CHAIN from wallet. Trying alternative method..."
    # Fallback: get first chain from wallet show
    PLAY_CHAIN=$(linera --with-wallet 1 wallet show | grep -oE "[a-f0-9]{64}" | head -n1)
fi

echo "Play Chain (Host): $PLAY_CHAIN"

# Create User Chain 1 (for Player 1 to play as a user)
USER_CHAIN_1=$(linera --with-wallet 1 wallet request-chain --faucet "$LINERA_FAUCET_URL" | grep -E "^[a-f0-9]{64}$" | head -n1)
echo "Player 1 Chain: $USER_CHAIN_1"

# Determine Owner 1 (using the new User Chain which has an owner)
# We grep for the line containing the chain ID, then extract the 0x... owner
OWNER_1=$(linera --with-wallet 1 wallet show | grep "$USER_CHAIN_1" | grep -oE "0x[0-9a-f]{64}" | head -n1)

if [ -z "$OWNER_1" ]; then
    echo "Owner not found for logic 1, dumping wallet for debug:"
    linera --with-wallet 1 wallet show
    # Fallback: Try to find ANY hex string that is NOT the chain ID on that line
    OWNER_1=$(linera --with-wallet 1 wallet show | grep "$USER_CHAIN_1" | grep -oE "[0-9a-f]{64}" | grep -v "$USER_CHAIN_1" | head -n1)
fi
echo "Owner 1: $OWNER_1"

# Get chain IDs and owners
echo "Setting up chains for multiplayer..."

# Player 1: Use USER_CHAIN_1 as the single profile chain
echo "Play Chain (Host): $PLAY_CHAIN"
echo "Player 1 Chain: $USER_CHAIN_1"
echo "  Owner: $OWNER_1"

# Initialize Player 2 wallet
echo "Creating Player 2 wallet..."
linera --with-wallet 2 wallet init --faucet "$LINERA_FAUCET_URL"
USER_CHAIN_2=$(linera --with-wallet 2 wallet request-chain --faucet "$LINERA_FAUCET_URL" | grep -E "^[a-f0-9]{64}$" | head -n1)
echo "Player 2 Chain: $USER_CHAIN_2"

# Determine Owner 2
OWNER_2=$(linera --with-wallet 2 wallet show | grep "$USER_CHAIN_2" | grep -oE "0x[0-9a-f]{64}" | head -n1)
if [ -z "$OWNER_2" ]; then
     OWNER_2=$(linera --with-wallet 2 wallet show | grep "$USER_CHAIN_2" | grep -oE "[0-9a-f]{64}" | grep -v "$USER_CHAIN_2" | head -n1)
fi
echo "  Owner: $OWNER_2"


echo "Performing initial chain synchronization..."
linera --with-wallet 1 sync $PLAY_CHAIN
linera --with-wallet 1 sync $USER_CHAIN_1
linera --with-wallet 2 sync $USER_CHAIN_2
sleep 2

# Build contracts
echo "Building contracts..."
cd backend
cargo build --release --target wasm32-unknown-unknown
cd ..

# Deploy application from Player 1 on PLAY_CHAIN (Wallet 1's default chain)
echo "Deploying application on PLAY_CHAIN ($PLAY_CHAIN)..."
# PLAY_CHAIN is already Wallet 1's default chain (from wallet init), so no need to set it
DEPLOY_OUTPUT=$(linera --with-wallet 1 project publish-and-create backend \
  --json-argument '{"max_players": 2, "is_ranked": false, "strict_mode": false}')
APP_ID=$(echo "$DEPLOY_OUTPUT" | grep -oE "[0-9a-f]{64}" | tail -n1)

if [ -z "$APP_ID" ]; then
    echo  "Failed to extract Application ID. Output was:"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

echo "Application deployed: $APP_ID"
echo "Deployed on chain: $PLAY_CHAIN (Wallet 1's default chain)"

# Application bytecode is automatically available to all chains via network storage
# When Player 2 interacts with the game, the bytecode will be automatically propagated via cross-chain messaging
echo "Application bytecode available to all chains via automatic propagation"

# Create frontend config with both player endpoints
# -----------------------------------------------------------------------------------------------------------------
# Build Frontend Once
# -----------------------------------------------------------------------------------------------------------------
echo "Building frontend..."
cd frontend
npm install
# Ensure we can build (might need to disable lint on build if there are errors, but let's try standard build)
npm run build
cd ..

# -----------------------------------------------------------------------------------------------------------------
# Create web server directories
# -----------------------------------------------------------------------------------------------------------------
echo "Creating web server directories..."
mkdir -p frontend/web_p1 frontend/web_p2

# Copy build artifacts (Next.js static export goes to 'out')
cp -r frontend/out/. frontend/web_p1/
cp -r frontend/out/. frontend/web_p2/

echo "Web directories created and populated"

# -----------------------------------------------------------------------------------------------------------------
# Generate config.json for Player 1 (Host)
# -----------------------------------------------------------------------------------------------------------------
echo "Generating config.json for Player 1..."
cat > frontend/web_p1/config.json << ENVEOF
{
  "applicationId": "$APP_ID",
  "playChain": "$PLAY_CHAIN",
  "playerNumber": 1,
  "endpoints": [
    {
      "chainId": "$USER_CHAIN_1",
      "owner": "$OWNER_1",
      "url": "http://localhost:$SERVICE_PORT_1"
    }
  ]
}
ENVEOF

# -----------------------------------------------------------------------------------------------------------------
# Generate config.json for Player 2 (Guest)
# -----------------------------------------------------------------------------------------------------------------
echo "Generating config.json for Player 2..."
cat > frontend/web_p2/config.json << ENVEOF
{
  "applicationId": "$APP_ID",
  "playChain": "$PLAY_CHAIN",
  "playerNumber": 2,
  "endpoints": [
    {
      "chainId": "$USER_CHAIN_2",
      "owner": "$OWNER_2",
      "url": "http://localhost:$SERVICE_PORT_2"
    }
  ]
}
ENVEOF

echo "Frontend configs created"

# -----------------------------------------------------------------------------------------------------------------
# Start Services
# -----------------------------------------------------------------------------------------------------------------

# Start GraphQL services
echo "Starting Player 1 GraphQL service on port $SERVICE_PORT_1..."
linera --with-wallet 1 service --port $SERVICE_PORT_1 &
SERVICE_PID_1=$!

echo "Starting Player 2 GraphQL service on port $SERVICE_PORT_2..."
linera --with-wallet 2 service --port $SERVICE_PORT_2 &
SERVICE_PID_2=$!

sleep 15
echo "Services initialized, waiting for readiness..."


# Start Web Servers 
echo "Starting Player 1 Web Server (http://localhost:3001)..."
cd /build/frontend/web_p1
npx -y http-server . -p 3001 --cors -c0 --no-dotfiles &
WEB_PID_1=$!
cd /build

echo "Starting Player 2 Web Server (http://localhost:3002)..."
cd /build/frontend/web_p2
npx -y http-server . -p 3002 --cors -c0 --no-dotfiles &
WEB_PID_2=$!
cd /build


echo ""
echo "------------------------------------------------"
echo "Multiplayer Deployment Complete" 
echo "------------------------------------------------"
echo ""
echo "   Player 1: http://localhost:3001"
echo "   Player 2: http://localhost:3002"
echo ""
echo "Services are running. Press Ctrl+C to stop."
echo ""

# Keep container running by waiting for background processes
wait
