# Testnet Multiplayer Testing Guide

This guide walks you through testing the Linot game with 2 players on Conway testnet.

## Prerequisites

✅ You've already run `./deploy-testnet.sh` successfully  
✅ GraphQL service is running on port 8080  
✅ You have the Application ID from deployment

**Your Deployment Info:**
```json
{
  "applicationId": "da917f83b07cdab46703029725820bf258c7d01e8b6a4c4e1c7951bc22657f14",
  "chainId": "80d20f6b652bfef72cb74ff5adc6cbeb4e2228eb4b3084c8e18a918e20181026"
}
```

---

## Step 1: Setup Player 2

**Run the setup script:**
```bash
./setup-player2-testnet.sh
```

This will:
- Create a second wallet for Player 2
- Request a chain from testnet faucet
- Save Player 2 information

**After running, you'll have:**
- Player 1 Chain: `80d20f6b652bfef72cb74ff5adc6cbeb4e2228eb4b3084c8e18a918e20181026`
- Player 2 Chain: `<will be generated>`
- Application ID: `da917f83b07cdab46703029725820bf258c7d01e8b6a4c4e1c7951bc22657f14`

---

## Step 2: Subscribe Players to PLAY_CHAIN

Since this is a testnet deployment with a single application, **you need to designate a PLAY_CHAIN**. Let's use Player 1's chain as the PLAY_CHAIN.

### Player 1: Subscribe to Own Chain (will act as PLAY_CHAIN)

```bash
PLAYER1_CHAIN="80d20f6b652bfef72cb74ff5adc6cbeb4b3084c8e18a918e20181026"
APP_ID="da917f83b07cdab46703029725820bf258c7d01e8b6a4c4e1c7951bc22657f14"

curl -X POST "http://localhost:8080/chains/$PLAYER1_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { subscribe(playChainId: \"'$PLAYER1_CHAIN'\") }"
  }'
```

### Player 2: Subscribe to Player 1's Chain

```bash
# Get Player 2 chain from saved file
PLAYER2_CHAIN=$(cat $HOME/.linera/linot/player2_info.txt | grep "Player 2 Chain:" | cut -d' ' -f4)

curl -X POST "http://localhost:8080/chains/$PLAYER2_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { subscribe(playChainId: \"'$PLAYER1_CHAIN'\") }"
  }'
```

---

## Step 3: Complete Game Flow

### 3.1 Player 1 Creates a Match

```bash
curl -X POST "http://localhost:8080/chains/$PLAYER1_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createMatch(maxPlayers: 2, nickname: \"Alice\") }"
  }'
```

**Expected:** Success response

---

### 3.2 Player 2 Joins the Match

```bash
curl -X POST "http://localhost:8080/chains/$PLAYER2_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { joinMatch(playChainId: \"'$PLAYER1_CHAIN'\", nickname: \"Bob\") }"
  }'
```

**Expected:** Success response

---

### 3.3 Player 1 Starts the Match

```bash
curl -X POST "http://localhost:8080/chains/$PLAYER1_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { startMatch }"
  }'
```

**Expected:** Game starts, cards dealt

---

### 3.4 Query Game State

**From Player 1's perspective:**
```bash
curl -X POST "http://localhost:8080/chains/$PLAYER1_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { status currentPlayerIndex players { nickname handSize } topCard { suit value } deckSize }"
  }'
```

**From Player 2's perspective:**
```bash
curl -X POST "http://localhost:8080/chains/$PLAYER2_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { status currentPlayerIndex players { nickname handSize } topCard { suit value } deckSize }"
  }'
```

**Expected Response:**
```json
{
  "data": {
    "status": "IN_PROGRESS",
    "currentPlayerIndex": 0,
    "players": [
      {"nickname": "Alice", "handSize": 6},
      {"nickname": "Bob", "handSize": 6}
    ],
    "topCard": {"suit": "CIRCLE", "value": 5},
    "deckSize": 49
  }
}
```

---

### 3.5 Play a Card (Current Player)

**Check who's turn it is first**, then the current player plays:

```bash
# Example: Player 1 plays their first card (index 0)
curl -X POST "http://localhost:8080/chains/$PLAYER1_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { playCard(cardIndex: 0, chosenSuit: null) }"
  }'
```

**For Whot cards (wild), specify chosenSuit:**
```bash
curl -X POST "http://localhost:8080/chains/$PLAYER1_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { playCard(cardIndex: 2, chosenSuit: CIRCLE) }"
  }'
```

---

### 3.6 Draw a Card

If a player can't play, they must draw:

```bash
curl -X POST "http://localhost:8080/chains/$PLAYER2_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { drawCard }"
  }'
```

---

## Quick Testing Script

Save this as `test-game.sh`:

```bash
#!/bin/bash

# Load deployment info
PLAYER1_CHAIN="80d20f6b652bfef72cb74ff5adc6cbeb4b3084c8e18a918e20181026"
APP_ID="da917f83b07cdab46703029725820bf258c7d01e8b6a4c4e1c7951bc22657f14"

# Get Player 2 chain (after running setup-player2-testnet.sh)
PLAYER2_CHAIN=$(cat $HOME/.linera/linot/player2_info.txt | grep "Player 2 Chain:" | cut -d' ' -f4)

echo "Testing Linot on Conway Testnet"
echo "================================"
echo ""
echo "Player 1 Chain: $PLAYER1_CHAIN"
echo "Player 2 Chain: $PLAYER2_CHAIN"
echo "App ID: $APP_ID"
echo ""

# Subscribe both players
echo "1. Subscribing players..."
curl -s -X POST "http://localhost:8080/chains/$PLAYER1_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { subscribe(playChainId: \"'$PLAYER1_CHAIN'\") }"}' | jq .

curl -s -X POST "http://localhost:8080/chains/$PLAYER2_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { subscribe(playChainId: \"'$PLAYER1_CHAIN'\") }"}' | jq .

echo ""
echo "2. Creating match..."
curl -s -X POST "http://localhost:8080/chains/$PLAYER1_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { createMatch(maxPlayers: 2, nickname: \"Alice\") }"}' | jq .

sleep 2

echo ""
echo "3. Joining match..."
curl -s -X POST "http://localhost:8080/chains/$PLAYER2_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { joinMatch(playChainId: \"'$PLAYER1_CHAIN'\", nickname: \"Bob\") }"}' | jq .

sleep 2

echo ""
echo "4. Starting match..."
curl -s -X POST "http://localhost:8080/chains/$PLAYER1_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { startMatch }"}' | jq .

sleep 2

echo ""
echo "5. Querying game state..."
curl -s -X POST "http://localhost:8080/chains/$PLAYER1_CHAIN/applications/$APP_ID" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { status currentPlayerIndex players { nickname handSize } topCard { suit value } }"}' | jq .

echo ""
echo "✅ Test complete!"
```

---

## Troubleshooting

### "Must subscribe to PLAY_CHAIN first"
- Make sure both players run the `subscribe` mutation first
- Use Player 1's chain as the `playChainId`

### "Player not found" or "Not your turn"
- Query the game state to see whose turn it is (`currentPlayerIndex`)
- Player 0 = first player (Alice), Player 1 = second player (Bob)

### GraphQL errors
- Check the GraphQL service is still running (from deploy-testnet.sh)
- Verify you're using the correct chain IDs and App ID
- Use `| jq .` to pretty-print responses

---

## Environment Variables Helper

Add to your `~/.bashrc` for easy testing:

```bash
# Linot Testnet Testing
export LINOT_APP_ID="da917f83b07cdab46703029725820bf258c7d01e8b6a4c4e1c7951bc22657f14"
export LINOT_P1_CHAIN="80d20f6b652bfef72cb74ff5adc6cbeb4b3084c8e18a918e20181026"
export LINOT_P2_CHAIN="<your-player-2-chain>"  # Fill after setup
export LINOT_GRAPHQL="http://localhost:8080"

# Aliases
alias linot-p1="curl -X POST \"$LINOT_GRAPHQL/chains/$LINOT_P1_CHAIN/applications/$LINOT_APP_ID\" -H \"Content-Type: application/json\""
alias linot-p2="curl -X POST \"$LINOT_GRAPHQL/chains/$LINOT_P2_CHAIN/applications/$LINOT_APP_ID\" -H \"Content-Type: application/json\""
```

Then you can test with:
```bash
linot-p1 -d '{"query": "query { status }"}'
```

---

**Next:** After testing works, update your Wave 5 submission with the deployed Application ID!
