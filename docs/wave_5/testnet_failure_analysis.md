# Testnet Deployment Failure Analysis

## Error Summary

**Deployment failed at:** Application creation step  
**Error type:** WASM runtime panic during `execute-operation`  
**Exit code:** 1

## Error Message Breakdown

```
ERROR linera: Error is Failed to create application

Caused by:
    chain client error: Local node operation failed: Worker operation failed: 
    Execution error: Failed to execute Wasm module: RuntimeError: unreachable
        at rust_panic (linot_contract-3edc0af81424ae8a.wasm[398]:0x2b2d4)
        at linera:app/contract-entrypoints#execute-operation (linot_contract-3edc0af81424ae8a.wasm[181]:0xda9e)
        during Operation(0)
```

## Root Cause

The contract **panicked during initialization** (`Operation(0)` = instantiate operation).

### What's Happening:

1. ✅ **Wallet created successfully**
2. ✅ **Chain requested successfully**  
3. ✅ **Contracts built successfully**
4. ✅ **Module published successfully** (`INFO: Module published successfully!`)
5. ❌ **Application creation FAILED** when executing the instantiation operation

### The Problem:

Looking at [contract.rs:42-45](file:///home/dinahmaccodes/Documents/codes-rust-linera/linot-card-game/backend/src/contract.rs#L42-L45):

```rust
async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
    // Initialize with default state
    self.state.user_status.set(UserStatus::Idle);
}
```

**Issue:** The deployment script passes `--json-argument "{}"` but:
- The contract expects `type InstantiationArgument = ();` (unit type)
- Passing an empty JSON object `{}` might be confusing the deserializer
- The contract panics during instantiation when trying to set initial state

### Why This Worked Locally But Fails on Testnet:

**Local deployment (`run.bash`):**
- Uses a **different initialization path** (possibly through `linera net up`)
- Might have implicit defaults that mask the issue
- Local network might handle empty initialization differently

**Testnet deployment:**
- Stricter validation
- Public validators enforce correct WASM execution
- Empty `{}` argument doesn't match `()` type expectation

## Warnings (Not the cause, but notable):

```
WARN: Blobs not found: [BlobId { blob_type: ContractBytecode, ...}]
```

**These are normal!** They indicate:
- Network propagation lag (some validators don't have blobs yet)
- Not an error - the deployment continues
- Common in distributed testnet environments

## Solution

### Option 1: Remove the JSON argument (Recommended)

Change deployment script from:
```bash
linera --with-wallet 1 publish-and-create \
  backend/target/wasm32-unknown-unknown/release/linot_{contract,service}.wasm \
  --json-argument "{}"
```

To:
```bash
linera --with-wallet 1 publish-and-create \
  backend/target/wasm32-unknown-unknown/release/linot_{contract,service}.wasm
```

**Rationale:** Since `InstantiationArgument = ()`, we should pass NO argument, not `{}`.

### Option 2: Fix the InstantiationArgument Type

Change contract to accept an actual argument:

```rust
// In lib.rs
#[derive(Debug, Deserialize, Serialize, Default)]
pub struct InstantiationConfig {}

// In contract.rs
type InstantiationArgument = InstantiationConfig;

async fn instantiate(&mut self, _config: Self::InstantiationArgument) {
    self.state.user_status.set(UserStatus::Idle);
}
```

Then keep `--json-argument "{}"`.

### Option 3: Simplify Instantiation

Remove the `user_status.set()` call from `instantiate`:

```rust
async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
    // Do nothing - RegisterView fields initialize to default
    // UserStatus::default() is already Idle
}
```

**Rationale:** `RegisterView` fields auto-initialize to their `Default` impl.

## Recommended Fix

**Use Option 1** - simplest and cleanest:

1. Remove `--json-argument "{}"` from `deploy-testnet.sh`
2. Test locally first with `run.bash` to ensure no regression
3. Re-run testnet deployment

## Files to Modify

1. **[deploy-testnet.sh](file:///home/dinahmaccodes/Documents/codes-rust-linera/linot-card-game/deploy-testnet.sh)** (line ~110)
   - Remove `--json-argument "{}"`

2. **[run.bash](file:///home/dinahmaccodes/Documents/codes-rust-linera/linot-card-game/run.bash)** (line ~106)
   - Remove `--json-argument "{}"`  (ensure consistency)

## Verification Steps

After fixing:

1. **Test locally first:**
   ```bash
   ./run.bash
   # Verify local deployment still works
   ```

2. **Test on testnet:**
   ```bash
   ./deploy-testnet.sh
   # Should succeed now
   ```

3. **Check for success:**
   - Look for: `Module published successfully!`
   - Look for: Application ID printed (64-char hex)
   - No panic errors

## Additional Notes

- The panic stack trace shows `rust_panic` which confirms this is a Rust panic, not a WASM issue
- The error happens during `Operation(0)` which is the first operation (instantiation)
- `UserStatus::default()` already returns `Idle`, so the `.set()` call is redundant anyway

---

**Next Action:** Remove `--json-argument "{}"` from both deployment scripts and retry.
