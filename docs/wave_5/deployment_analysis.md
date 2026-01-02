# Validator vs Application Deployment - Analysis

## The Critical Distinction

The testnet documentation describes **TWO DIFFERENT** deployment scenarios:

### 1. Validator Deployment (Infrastructure - NOT for us)

**Script:** `scripts/deploy-validator.sh <hostname> <email>`

**Purpose:** Deploy a validator node to JOIN the Linera network infrastructure

**Requirements:**
- Domain name pointing to server
- SSL certificates (Let's Encrypt)
- ScyllaDB database
- Prometheus + Grafana monitoring
- Docker infrastructure
- Onboarding by Linera team

**Who needs this:** Network operators, infrastructure providers

**Example:**
```bash
scripts/deploy-validator.sh linera.mydomain.com admin@mydomain.com
```

---

### 2. Application Deployment (What We Need!)

**Script:** Custom deployment script (like microchess `deploy.sh`)

**Purpose:** Deploy YOUR APPLICATION to the existing Conway testnet

**Requirements:**
- Linera CLI installed
- Internet access to testnet faucet
- WASM contracts built
- That's it!

**Who needs this:** Application developers (us!)

**Example (microchess):**
```bash
FAUCET_URL=https://faucet.testnet-conway.linera.net/
linera --with-wallet 1 wallet init --faucet $FAUCET_URL
linera --with-wallet 1 wallet request-chain --faucet $FAUCET_URL
linera --with-wallet 1 publish-and-create chess/chess_{contract,service}.wasm
linera -w1 service --port 8080
```

---

## What Microchess Actually Does

Looking at `microchess-main/deploy.sh`:

**Lines 22-52:**
```bash
FAUCET_URL=https://faucet.testnet-conway.linera.net/

# 1. Create wallet connected to testnet
linera --with-wallet 1 wallet init --faucet $FAUCET_URL

# 2. Request chain from testnet faucet
linera --with-wallet 1 wallet request-chain --faucet $FAUCET_URL

# 3. Deploy application to testnet
LINERA_APPLICATION_ID=$(linera --with-wallet 1 publish-and-create \
  chess/chess_{contract,service}.wasm \
  --json-argument "{ ... }")

# 4. Start GraphQL service
linera -w1 service --port 8080
```

**Key observations:**
- ❌ Does NOT use `deploy-validator.sh`
- ❌ Does NOT require domain name
- ❌ Does NOT deploy validator infrastructure
- ✅ Uses public testnet faucet
- ✅ Deploys application contracts only
- ✅ Starts local GraphQL service

---

## Our Implementation Comparison

### Microchess `deploy.sh` vs Our `deploy-testnet.sh`

| Step | Microchess | Our Script | Status |
|------|-----------|------------|--------|
| Storage location | `/data/linera` | `$HOME/.linera/linot` | ✅ Both persistent |
| Faucet URL | `https://faucet.testnet-conway.linera.net/` | Same | ✅ Identical |
| Wallet init | `linera -w1 wallet init --faucet` | Same | ✅ Identical |
| Chain request | `linera -w1 wallet request-chain --faucet` | Same | ✅ Identical |
| Contract deploy | `publish-and-create chess/...wasm` | `publish-and-create linot/...wasm` | ✅ Same pattern |
| GraphQL service | `linera -w1 service --port 8080` | Same (interactive) | ✅ Same pattern |

**Conclusion:** Our `deploy-testnet.sh` follows the exact same pattern as microchess!

---

## Verification

### What Microchess Does NOT Have

Checking microchess repository for validator deployment:

```bash
# Searched for "deploy-validator" in microchess
grep -r "deploy-validator" inspo-multi-new/microchess-main/
# Result: No matches found
```

**Microchess does NOT deploy validators!** It only deploys the application.

### What Microchess README Says

From `microchess-main/README.md` (lines 23-35):
```
git clone https://github.com/linera-io/linera-protocol.git
cd linera-protocol
cargo install --path linera-service
cargo install --path linera-storage-service

# make sure linera and its corresponding binaries are installed
git clone https://github.com/Nirajsah/microchess.git
cd microchess
./run.sh # this scripts deploys the app and starts the linera service
```

**No mention of validator deployment!** Just installs Linera CLI and runs the app.

---

## Conclusion

### The Documentation Confusion

The testnet_details.md document contains **both** types of deployment:

1. **Section 1 (lines 1-115):** Validator deployment (`deploy-validator.sh`)
   - For infrastructure operators
   - NOT relevant for Wave 5

2. **Section 2 (lines 117-167):** How to verify testnet works
   - Using wallet init + request-chain
   - This IS what we use

### What We Implemented

Our `deploy-testnet.sh` is:
- ✅ **Application deployment** (correct for Wave 5)
- ✅ **Follows microchess pattern** (proven to work)
- ✅ **Does NOT deploy validators** (correct)
- ✅ **Uses testnet faucet** (correct)
- ✅ **Ready to use** (no changes needed)

### Next Step

**We're ready to deploy!**

```bash
./deploy-testnet.sh
```

This will:
1. Connect to Conway testnet (existing validators)
2. Create a wallet on the testnet
3. Request a chain from the faucet
4. Deploy Linot application contracts
5. Optionally start GraphQL service

**No validator infrastructure needed!** We're just deploying our app to the existing network, exactly like microchess did.
