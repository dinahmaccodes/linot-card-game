# Correct GraphQL Testing - Based on Actual Backend

## Current Deployment Info
Check your terminal output for these values:
- APP_ID: `2862a69384f2c157deaa725d05b7b4d35c8c6fdc28b3e47fdc5db52b819f0cc4`
- PLAY_CHAIN: `6caf06ac25875df88e26060182d6ed1ecabbbaf1476acab9925ab80a028284f4`
- USER_CHAIN_1: `2862a69384f2c157deaa725d05b7b4d35c8c6fdc28b3e47fdc5db52b819f0cc4`
- USER_CHAIN_2: `6f8f32e869304fa71f73c2052869fa5bdc2ba3490e13973d9f21f5c5c721e890`

## GraphiQL URLs

**Player 1:**
```
http://localhost:8081/chains/2862a69384f2c157deaa725d05b7b4d35c8c6fdc28b3e47fdc5db52b819f0cc4/applications/2862a69384f2c157deaa725d05b7b4d35c8c6fdc28b3e47fdc5db52b819f0cc4
```

**Player 2:**
```
http://localhost:8082/chains/6f8f32e869304fa71f73c2052869fa5bdc2ba3490e13973d9f21f5c5c721e890/applications/2862a69384f2c157deaa725d05b7b4d35c8c6fdc28b3e47fdc5db52b819f0cc4
```

---

## Test Sequence

### Player 1 - Create Match

```graphql
mutation {
  createMatch(maxPlayers: 2, nickname: "Player1")
}
```

**Expected:** `{"data": {"createMatch": "Ok"}}`

### Player 2 - Join Match

```graphql
mutation {
  joinMatch(
    playChainId: "6caf06ac25875df88e26060182d6ed1ecabbbaf1476acab9925ab80a028284f4"
    nickname: "Player2"
  )
}
```

**Expected:** `{"data": {"joinMatch": "Ok"}}`

### Player 1 - Start Match (after Player 2 joins)

```graphql
mutation {
  startMatch
}
```

**Expected:** `{"data": {"startMatch": "Ok"}}`

### Check Match State (either player)

```graphql
query {
  matchState {
    status
    maxPlayers
    players {
      nickname
      handSize
    }
  }
}
```

**Expected:** Status should show "WAITING" or "IN_PROGRESS"

---

## Notes

- ❌ No "subscribe" mutation - doesn't exist in GraphQL
- ✅ Player 1 creates match on their chain
- ✅ Player 2 joins via cross-chain message
- ✅ Player 1 can start match only when min players joined (2)
