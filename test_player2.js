// PLAYER 2 - Full Test Script
// Open: http://localhost:5173/?player=2

const APP_ID = "212203691ee2f91fe2ac310d983b89e2961ff5152238bd9185ed1d7c1ff98d75";
const PLAY_CHAIN = "0c391c84fc9b3dd405e0f40b0780c3f57f0500f7f3744aa128df9762bcec81e9";
const USER_CHAIN_2 = "188c3a8265ae4f62f0d97648b83daf857a8d2ba7135b709b85f61b3f7f280291";

const P2_URL = `http://localhost:8082/chains/${USER_CHAIN_2}/applications/${APP_ID}`;

async function testPlayer2() {
  console.log("🎮 Testing Player 2...\n");
  
  // Step 1: Subscribe
  console.log("1️⃣ Subscribing to PLAY_CHAIN...");
  const sub = await fetch(P2_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation { subscribe(playChainId: "${PLAY_CHAIN}") }`
    })
  }).then(r => r.json());
  console.log("Subscribe:", sub);
  
  // Step 2: Join Match
  console.log("\n2️⃣ Joining match...");
  const join = await fetch(P2_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation { 
        joinMatch(
          playChainId: "${PLAY_CHAIN}",
          nickname: "Bob"
        )
      }`
    })
  }).then(r => r.json());
  console.log("Join Match:", join);
  
  console.log("\n⏸️  Go back to Player 1 tab and run startAndQuery()");
  console.log("Then run queryMyHand() here to see your cards");
}

async function queryMyHand() {
  // Query Match State
  console.log("\n3️⃣ Querying match state...");
  const matchState = await fetch(P2_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query {
        matchState {
          players { nickname handSize }
          currentPlayerIndex
          status
          deckSize
        }
      }`
    })
  }).then(r => r.json());
  console.log("Match State:", matchState);
  
  // Query My Hand
  console.log("\n4️⃣ Querying my hand...");
  const myHand = await fetch(P2_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query { myHand { suit value } }`
    })
  }).then(r => r.json());
  console.log("My Hand (Bob):", myHand);
  
  console.log("\n✅ Player 2 testing complete!");
  console.log("Note: Bob's hand should be DIFFERENT from Alice's!");
}

// Run this first
testPlayer2();
