# Testnet Deployment Guide for Linot Card Game

This guide covers deploying Linot to the Conway testnet and verifying the deployment.

## Prerequisites

Before deploying to testnet, ensure you have:

1. **Linera CLI v0.15.8** installed and working
   ```bash
   linera --version
   # Should show: Linera protocol: v0.15.8
   ```

2. **Rust toolchain 1.86.0** with wasm32 target
   ```bash
   rustup target add wasm32-unknown-unknown
   ```

3. **Internet connectivity** to access testnet faucet
   - Faucet URL: `https://faucet.testnet-conway.linera.net`

## Deployment Steps

### 1. Run the Deployment Script

```bash
./deploy-testnet.sh
```

**What this script does:**
- Creates persistent wallet in `$HOME/.linera/linot/`
- Initializes wallet with Conway testnet faucet
- Requests a chain from the faucet
- Builds your WASM contracts
- Publishes and creates the application on testnet
- Saves deployment info to `deployment_info.json`
- Optionally starts the GraphQL service

### 2. Save Your Deployment Information

After successful deployment, you'll see:
```
✅ Linot Successfully Deployed to Conway Testnet!
================================================

📝 Deployment Information:
   Application ID: <64-character-hex-string>
   Chain ID:       <chain-id>
   Wallet:         $HOME/.linera/linot/wallet_1.json
```

**IMPORTANT:** Save the Application ID - you'll need it for frontend configuration!

### 3. Start GraphQL Service (if not started automatically)

```bash
# Set environment variables
export LINERA_WALLET_1="$HOME/.linera/linot/wallet_1.json"
export LINERA_STORAGE_1="rocksdb:$HOME/.linera/linot/client_1.db"

# Start service
linera -w1 service --port 8080
```

Access your application at:
```
http://localhost:8080/chains/<CHAIN_ID>/applications/<APP_ID>
```

## Verifying Deployment

### Test GraphQL Endpoint

```bash
# Replace with your actual CHAIN_ID and APP_ID
curl -X POST http://localhost:8080/chains/<CHAIN_ID>/applications/<APP_ID> \
  -H "Content-Type: application/json" \
  -d '{"query":"query { games { keys } }"}'
```

Expected response: JSON with empty games list initially

### Common Issues & Solutions

#### Issue: "Failed to initialize wallet"
**Solution:** Check internet connectivity and faucet availability:
```bash
curl https://faucet.testnet-conway.linera.net
# Should return HTTP 200
```

#### Issue: "WASM files not found"
**Solution:** Ensure contracts are built:
```bash
cd backend
cargo build --release --target wasm32-unknown-unknown
ls target/wasm32-unknown-unknown/release/linot_*.wasm
```

#### Issue: "Application deployment timeout"
**Solution:** Testnet might be slow, wait 30-60 seconds and try again

## Wallet Management

### Wallet Location
All testnet wallet data is stored in: `$HOME/.linera/linot/`

**Files:**
- `wallet_1.json` - Wallet configuration
- `keystore_1.json` - Private keys
- `client_1.db/` - RocksDB storage
- `deployment_info.json` - Deployment metadata

### Backup Your Wallet

**CRITICAL:** Back up your wallet before deleting:
```bash
cp -r $HOME/.linera/linot $HOME/.linera/linot.backup-$(date +%Y%m%d)
```

### Reset/Redeploy

To completely reset and redeploy:
```bash
# Backup first!
rm -rf $HOME/.linera/linot

# Then run deployment again
./deploy-testnet.sh
```

## Integration with Frontend

After deployment, update your frontend configuration:

### Option 1: Static Configuration
Edit `frontend/public/config.json`:
```json
{
  "applicationId": "YOUR_APP_ID_FROM_DEPLOYMENT",
  "chainId": "YOUR_CHAIN_ID",
  "graphqlEndpoint": "http://localhost:8080"
}
```

### Option 2: Environment Variable
Create `frontend/.env.local`:
```bash
VITE_APPLICATION_ID="YOUR_APP_ID"
VITE_CHAIN_ID="YOUR_CHAIN_ID"
VITE_GRAPHQL_URL="http://localhost:8080"
```

## Differences from Local Deployment

| Aspect | Local (`run.bash`) | Testnet (`deploy-testnet.sh`) |
|--------|-------------------|-------------------------------|
| Network | Local (`linera net up`) | Conway testnet validators |
| Faucet | `localhost:8080` | `faucet.testnet-conway.linera.net` |
| Storage | `/tmp/linera_whot` (ephemeral) | `$HOME/.linera/linot` (persistent) |
| Wallets | Multiple test wallets | Single deployment wallet |
| State | Resets on restart | Persistent on blockchain |
| Frontend | Multiple instances | Single app ID, users bring wallets |

## Network Status

While there's no official status dashboard yet, you can verify testnet health:

1. **Faucet accessibility:**
   ```bash
   curl -I https://faucet.testnet-conway.linera.net
   ```

2. **Wallet initialization:**
   ```bash
   # Creates temporary test wallet
   TEMP_DIR=$(mktemp -d)
   export LINERA_WALLET="$TEMP_DIR/test.json"
   export LINERA_STORAGE="rocksdb:$TEMP_DIR/db"
   linera wallet init --faucet https://faucet.testnet-conway.linera.net
   rm -rf "$TEMP_DIR"
   ```

## Next Steps

1. ✅ Deploy application to testnet
2. ✅ Save Application ID and Chain ID
3. ⏳ Configure frontend with deployment info
4. ⏳ Test game creation and joining
5. ⏳ Submit Wave 5 with testnet deployment info

## Resources

- **Testnet Documentation:** See `docs/wave_5/testnet_details.md`
- **Linera Operators Guide:** https://linera.dev/operators/testnets/
- **Deployment Info:** Check `$HOME/.linera/linot/deployment_info.json`

---

**Need help?** Check the implementation plan: `.gemini/antigravity/brain/*/implementation_plan.md`
