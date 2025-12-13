(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,18566,(e,a,t)=>{a.exports=e.r(76562)},2551,e=>{"use strict";var a=e.i(71645);let t=`
  query PlayerView($player: String!) {
    playerView(player: $player) {
      myCards { suit value }
      myCardCount
      calledLastCard
      opponents {
        owner
        nickname
        cardCount
        isActive
        calledLastCard
      }
      topCard { suit value }
      deckSize
      currentPlayerIndex
      status
      activeShapeDemand
      pendingPenalty
    }
  }
`;function r(){let[r,l]=(0,a.useState)(null),[s,n]=(0,a.useState)(!0),[i,o]=(0,a.useState)(null),[c,d]=(0,a.useState)(null),[u,m]=(0,a.useState)(1);(0,a.useEffect)(()=>{e.A(29530).then(({createLineraClient:e,getGlobalConfig:a})=>{try{let t=a();m(t.playerNumber||1);let r=e();d(r)}catch(e){console.error("Config not ready yet",e)}})},[]);let h=(0,a.useCallback)(async()=>{if(c)try{let a=await e.A(29530).then(e=>e.getGlobalConfig()),r=c.getOwner(),s=await c.query(t,{player:r},a.playChain);l(s.playerView),o(null)}catch(e){console.error("Failed to fetch game state:",e),o(e)}finally{n(!1)}},[c]);(0,a.useEffect)(()=>{if(!c)return;h();let e=setInterval(h,500);return()=>clearInterval(e)},[h,c]);let x=(0,a.useCallback)(async a=>{if(c)try{let t=await e.A(29530).then(e=>e.getGlobalConfig());await c.getChainId()===t.playChain?await c.mutate(`
            mutation JoinMatch($nickname: String!) {
              joinMatch(nickname: $nickname)
            }
          `,{nickname:a}):await c.mutate(`
            mutation JoinFromChain($hostChainId: String!, $nickname: String!) {
              joinFromChain(hostChainId: $hostChainId, nickname: $nickname)
            }
          `,{hostChainId:t.playChain,nickname:a}),await h()}catch(e){throw console.error("Failed to join game:",e),e}},[c,h]),g=(0,a.useCallback)(async()=>{if(c)try{await c.mutate("mutation { startMatch }"),await h()}catch(e){throw console.error("Failed to start game:",e),e}},[c,h]),y=(0,a.useCallback)(async(e,a)=>{if(c)try{await c.mutate(`
        mutation PlayCard($cardIndex: Int!, $chosenSuit: String) {
          playCard(cardIndex: $cardIndex, chosenSuit: $chosenSuit)
        }
      `,{cardIndex:e,chosenSuit:a}),await h()}catch(e){throw console.error("Failed to play card:",e),e}},[c,h]);return{gameState:r,loading:s,error:i,joinGame:x,startGame:g,playCard:y,drawCard:(0,a.useCallback)(async()=>{if(c)try{await c.mutate("mutation { drawCard }"),await h()}catch(e){throw console.error("Failed to draw card:",e),e}},[c,h]),callLastCard:(0,a.useCallback)(async()=>{if(c)try{await c.mutate("mutation { callLastCard }"),await h()}catch(e){throw console.error("Failed to call last card:",e),e}},[c,h]),refresh:h,playerNumber:u}}e.s(["useWhotGame",()=>r])},72637,e=>{"use strict";var a=e.i(43476),t=e.i(71645),r=e.i(18566),l=e.i(2551);function s(){let e=(0,r.useRouter)(),[s,n]=(0,t.useState)(""),[i,o]=(0,t.useState)(!1),[c,d]=(0,t.useState)(null),{joinGame:u,playerNumber:m}=(0,l.useWhotGame)(),h=async()=>{if(!s.trim())return void d("Please enter a nickname");o(!0),d(null);try{console.log(`Player ${m} joining as "${s}"...`),await u(s),console.log("✓ Successfully joined game"),await new Promise(e=>setTimeout(e,1e3)),e.push("/")}catch(e){console.error("Failed to join game:",e),d(e.message||"Failed to join game. Please try again."),o(!1)}};return(0,a.jsxs)("main",{className:"min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center",style:{background:"linear-gradient(180deg, #77F0FC 0%, #19D3F9 100%)"},children:[(0,a.jsx)("img",{src:"/water-bubbles.svg",className:"absolute z-3 top-0 left-[150px] animate-bubbles animation-delay-2000",alt:""}),(0,a.jsx)("img",{src:"/sea-walls.png",className:"absolute z-3 top-0 left-0",alt:""}),(0,a.jsx)("img",{src:"/reflection-lights.svg",className:"absolute z-3 top-0 left-0 animate-shimmer",alt:""}),(0,a.jsxs)("div",{className:"relative z-20 bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4",children:[(0,a.jsx)("h1",{className:"text-4xl font-bold text-center mb-2 text-[#01626F]",children:"Join Linot Game"}),(0,a.jsxs)("p",{className:"text-center text-gray-600 mb-6 text-lg",children:["Player ",m]}),(0,a.jsxs)("div",{className:"mb-6",children:[(0,a.jsx)("label",{className:"block text-gray-700 font-semibold mb-2 text-lg",children:"Enter your nickname:"}),(0,a.jsx)("input",{type:"text",value:s,onChange:e=>n(e.target.value),onKeyPress:e=>"Enter"===e.key&&!i&&h(),placeholder:"e.g., CardMaster",className:"w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#0FB6C6] text-lg",disabled:i,maxLength:20,autoFocus:!0}),(0,a.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:"Max 20 characters"})]}),c&&(0,a.jsx)("div",{className:"mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg",children:c}),(0,a.jsx)("button",{onClick:h,disabled:i||!s.trim(),className:"w-full bg-[#0FB6C6] hover:bg-[#0DA5B5] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors text-xl shadow-lg",children:i?(0,a.jsxs)("span",{className:"flex items-center justify-center",children:[(0,a.jsxs)("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[(0,a.jsx)("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),(0,a.jsx)("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Joining..."]}):"Join Game"}),(0,a.jsx)("p",{className:"text-xs text-gray-500 text-center mt-4",children:1===m?"You are the host. Wait for other players to join.":"Joining the host's game..."})]}),(0,a.jsx)("div",{className:"absolute bottom-0 w-full h-[150px] z-10 rounded-t-[50%]",style:{background:"linear-gradient(180deg, #D4FEBC -13.12%, #85F0D9 21.68%, #19E2D5 100%)",boxShadow:"0px 12px 18px 0px #E8FABC inset"}})]})}e.s(["default",()=>s])},29530,e=>{e.v(e=>Promise.resolve().then(()=>e(13209)))}]);