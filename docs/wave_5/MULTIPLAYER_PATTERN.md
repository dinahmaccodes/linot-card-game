# CORRECTED: How Linera Multiplayer Works

## ❌ What We Did Wrong

**Mistake:** Tried to make Player 2 run mutations on their own chain
```
http://localhost:8080/chains/PLAYER2_CHAIN/applications/APP_ID  ❌
```

**Error:** `"client is not configured to propose on chain PLAYER2_CHAIN"`

**Why it failed:** Player 2's chain doesn't have the application bytecode

---

## ✅ How It Actually Works (From Microcard)

### The Pattern:

1. **One Application Chain** - App is deployed ONCE on Player 1's chain
2. **All Players Use Same Endpoint** - Everyone queries/mutates Player 1's chain
3. **Authentication Differentiates Players** - Different wallets sign operations
4. **Cross-Chain Messages Handle Game Logic** - Backend sends messages between chains

### Correct Flow:

```
Player 1 Wallet → Signs operation → Sends to Player 1 Chain (where app lives)
Player 2 Wallet → Signs operation → Sends to Player 1 Chain (where app lives)
```

**Both players use the SAME GraphQL endpoint:**
```
http://localhost:8080/chains/PLAYER1_CHAIN/applications/APP_ID
```

---

## Fixed Testing Commands

### Both Players Use Player 1's Chain!

**Player 1 GraphQL:**
```
http://localhost:8080/chains/80d20f6b652bfef72cb74ff5adc6cbeb4e2228eb4b3084c8e18a918e20181026/applications/da917f83b07cdab46703029725820bf258c7d01e8b6a4c4e1c7951bc22657f14
```

**Player 2 GraphQL:** (SAME URL!)
```
http://localhost:8080/chains/80d20f6b652bfef72cb74ff5adc6cbeb4e2228eb4b3084c8e18a918e20181026/applications/da917f83b07cdab46703029725820bf258c7d01e8b6a4c4e1c7951bc22657f14
```

### But How to Sign as Player 2?

Since we're using the GraphQL service from deploy-testnet.sh which uses wallet 1, **we need to start a service for wallet 2** or use CLI commands.

**Option 1: Start Service for Wallet 2** (in separate terminal)
```bash
linera --with-wallet 2 service --port 8081
```

Then Player 2 uses port 8081:
```
http://localhost:8081/chains/80d20f6b652bfef72cb74ff5adc6cbeb4e2228eb4b3084c8e18a918e20181026/applications/da917f83b07cdab46703029725820bf258c7d01e8b6a4c4e1c7951bc22657f14
```

**Option 2: Use CLI** (simpler for testing)
```bash
# Player 2 subscribes using CLI
linera --with-wallet 2 query-application \
  --application-id da917f83b07cdab46703029725820bf258c7d01e8b6a4c4e1c7951bc22657f14 \
  --query-json '{"query": "mutation { subscribe(playChainId: \"80d20f6b652bfef72cb74ff5adc6cbeb4e2228eb4b3084c8e18a918e20181026\") }"}'
```

---

## Why This Design?

### Application Chain (Player 1's chain)
- Holds ALL game state
- Processes all operations
- Sends events/messages to player chains

### Player Chains (Player 1 & 2)
- Store player-specific data (nickname, status)
- Subscribe to game events
- Send signed operations to application chain

### Cross-Chain Flow:
```
1. Player 2 → Subscribe mutation → App Chain
2. App Chain → Executes subscribe → Stores subscription
3. Player 1 → CreateMatch → App Chain
4. App Chain → Creates match → Updates state
5. Player 2 → JoinMatch → App Chain
6. App Chain → Adds Player 2 → Sends message to Player 2's chain
7. Both players query App Chain → See updated game state
```

---

## Next Steps

1. **Start service for wallet 2:**
   ```bash
   linera --with-wallet 2 service --port 8081
   ```

2. **Player 2 uses port 8081 but same chain/app:**
   ```
   http://localhost:8081/chains/80d20f6b.../applications/da917f...
   ```

3. **Run the full flow:**
   - Player 1 (port 8080): subscribe → createMatch
   - Player 2 (port 8081): subscribe → joinMatch  
   - Player 1: startMatch
   - Both query same endpoint (with their respective ports)

---

## Key Takeaway

**One app chain, multiple wallets accessing it** - NOT one app per player chain!
