# Bash Script Fixes - December 16, 2025

## Overview
Fixed the `run.bash` script to successfully deploy and run the Linot card game backend. The script now properly deploys the application, extracts the Application ID, and starts all required services.

## Issues Fixed

### 1. Missing LINERA_KEYSTORE Environment Variable
**Problem:**
```
ERROR: Signer doesn't have key to sign for chain
```

**Cause:**
The deployment command was only setting `LINERA_WALLET` and `LINERA_STORAGE` but missing `LINERA_KEYSTORE`.

**Fix:**
```bash
# Before
DEPLOY_OUTPUT=$(LINERA_WALLET="$LINERA_WALLET_1" LINERA_STORAGE="$LINERA_STORAGE_1" \
  linera --wait-for-outgoing-messages project publish-and-create . linot \
  --json-parameters '{"max_players": 2, "is_ranked": false, "strict_mode": false}' 2>&1)

# After
DEPLOY_OUTPUT=$(LINERA_WALLET="$LINERA_WALLET_1" LINERA_STORAGE="$LINERA_STORAGE_1" LINERA_KEYSTORE="$LINERA_KEYSTORE_1" \
  linera --wait-for-outgoing-messages project publish-and-create . linot 2>&1)
```

### 2. Invalid JSON Parameters
**Problem:**
Contract was being deployed with unnecessary JSON parameters even though the contract defines:
```rust
type Parameters = ();
type InstantiationArgument = ();
```

**Fix:**
Removed the `--json-parameters` flag entirely:
```bash
# Before
linera --wait-for-outgoing-messages project publish-and-create . linot \
  --json-parameters '{"max_players": 2, "is_ranked": false, "strict_mode": false}' 2>&1

# After  
linera --wait-for-outgoing-messages project publish-and-create . linot 2>&1
```

### 3. Incorrect APP_ID Extraction
**Problem:**
The script was extracting the first 64-character hex string from the deployment output, which was the chain ID, not the application ID.

**Example Output:**
```
Creating application on chain 246b90e0fd9e5f8fd2ee84a35fa3ad1d4af62956b3e31602c1f842f258569019
...
20860868b319f2edae858d4daec468046ef0adab0dcc75a05e4e8bc2c633b43e  ← Actual APP_ID
```

**Fix:**
Changed to extract the **last** hex string instead of the first:
```bash
# Before
APP_ID=$(echo "$DEPLOY_OUTPUT" | grep -Eo '[0-9a-f]{64}' | head -1)

# After
APP_ID=$(echo "$DEPLOY_OUTPUT" | grep -Eo '[0-9a-f]{64}' | tail -1)
```

### 4. Unused Imports (Bonus)
**Problem:**
Build warnings about unused imports in `contract.rs`:
```
warning: unused imports: `INITIAL_HAND_SIZE` and `SpecialEffect`
```

**Fix:**
Removed unused imports:
```rust
// Before
use linot::{
    Card, CardSuit, GameEvent, LinotAbi, LinotResponse, MatchData, MatchStatus,
    Message, Operation, Player, SpecialEffect, INITIAL_HAND_SIZE,
};

// After
use linot::{
    Card, CardSuit, GameEvent, LinotAbi, LinotResponse, MatchData, MatchStatus,
    Message, Operation, Player,
};
```

## Result

✅ **Script now successfully:**
1. Starts the Linera network
2. Creates two player wallets with chains
3. Creates a shared Play Chain
4. Deploys the application with correct environment variables
5. Extracts the correct Application ID
6. Generates proper config.json files for both players
7. Starts GraphQL services on ports 8081 and 8082
8. Starts frontend web servers on ports 5173 and 5174

## Expected Output

```
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
  APP_ID:        20860868b319f2edae858d4daec468046ef0adab0dcc75a05e4e8bc2c633b43e
  PLAY_CHAIN:    82df43256ac043f154c6c14b0f8a487f04df5e3b240a55c9e71f76ff964ce3e2
  USER_CHAIN_1:  246b90e0fd9e5f8fd2ee84a35fa3ad1d4af62956b3e31602c1f842f258569019
  USER_CHAIN_2:  7cfb7ea69df0183f021a61b6ab65e2fcf9fab0b16f5b2a18c40a29edfa4f5695

GraphQL Test URLs:
  Player 1: http://localhost:8081/chains/USER_CHAIN_1/applications/APP_ID
  Player 2: http://localhost:8082/chains/USER_CHAIN_2/applications/APP_ID

Services running. Press Ctrl+C to stop.
```

## Testing

The backend should now be ready for GraphQL mutations testing! You can test with:
```bash
./run.bash
```

Then in another terminal, use the GraphQL endpoints to test mutations for creating and joining matches.
