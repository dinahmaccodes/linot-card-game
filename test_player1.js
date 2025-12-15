// PLAYER 1 - Full Test Script
// Open: http://localhost:5173/?player=1

const APP_ID = "212203691ee2f91fe2ac310d983b89e2961ff5152238bd9185ed1d7c1ff98d75";
const PLAY_CHAIN = "0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9";
const USER_CHAIN_1 = "fc3af78e8b41ed93e75fee47c14a5cb38f88b4aaf078cfa380b5eb2a4e07f8e0";

const P1_URL = `http://localhost:8081/chains/${USER_CHAIN_1}/applications/${APP_ID}`;

async function testPlayer1() {
  console.log("🎮 Testing Player 1...\n");
  
  // Step 1: Subscribe
  console.log("1️⃣ Subscribing to PLAY_CHAIN...");
  const sub = await fetch(P1_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation { subscribe(playChainId: "${PLAY_CHAIN}") }`
    })
  }).then(r => r.json());
  console.log("Subscribe:", sub);
  
  // Step 2: Create Match
  console.log("\n2️⃣ Creating match...");
  const create = await fetch(P1_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation { createMatch(maxPlayers: 2, nickname: "Alice") }`
    })
  }).then(r => r.json());
  console.log("Create Match:", create);
  
  // Wait for Player 2 to join...
  console.log("\n⏸️  Waiting for Player 2 to join...");
  console.log("Run testPlayer2() in Player 2 tab, then run startAndQuery() here");
}

async function startAndQuery() {
  console.log("\n3️⃣ Starting match...");
  const start = await fetch(P1_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation { startMatch }`
    })
  }).then(r => r.json());
  console.log("Start Match:", start);
  
  // Query Match State
  console.log("\n4️⃣ Querying match state...");
  const matchState = await fetch(P1_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query {
        matchState {
          players { nickname handSize }
          currentPlayerIndex
          status
          deckSize
          discardPile { suit value }
        }
      }`
    })
  }).then(r => r.json());
  console.log("Match State:", matchState);
  
  // Query My Hand
  console.log("\n5️⃣ Querying my hand...");
  const myHand = await fetch(P1_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query { myHand { suit value } }`
    })
  }).then(r => r.json());
  console.log("My Hand:", myHand);
  
  console.log("\n✅ Player 1 testing complete!");
}

// Run this first
testPlayer1();
