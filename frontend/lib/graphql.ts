// GraphQL Configuration
export interface GraphQLConfig {
  applicationId: string;
  playChain: string;
  endpoints: Array<{
    playerNumber: number;
    chainId: string;
    graphqlUrl: string;
    owner: string;
  }>;
}

// GraphQL Response Types (Best Practice: Type Safety)
export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

let cachedConfig: GraphQLConfig | null = null;

export async function loadConfig(): Promise<GraphQLConfig> {
  if (cachedConfig) return cachedConfig;
  
  try {
    const response = await fetch('/config.json');
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.statusText}`);
    }
    cachedConfig = await response.json();
    
    if (!cachedConfig) {
      throw new Error('Config file is empty');
    }
    
    return cachedConfig;
  } catch (error) {
    console.error('Config loading error:', error);
    throw new Error('Failed to load application configuration');
  }
}

// Get player number from URL
function getPlayerNumber(): number {
  if (typeof window === 'undefined') return 1;
  const params = new URLSearchParams(window.location.search);
  return params.get('player') === '2' ? 2 : 1;
}

// Main GraphQL query function with proper error handling
export async function graphqlQuery<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const config = await loadConfig();
  const playerNumber = getPlayerNumber();
  
  // Find endpoint for this player
  const endpoint = config.endpoints.find(e => e.playerNumber === playerNumber);
  if (!endpoint) {
    throw new Error(`No endpoint configured for player ${playerNumber}`);
  }
  
  // Construct GraphQL URL (Linera pattern: /chains/{chainId}/applications/{appId})
  const url = `${endpoint.graphqlUrl}/chains/${endpoint.chainId}/applications/${config.applicationId}`;
  
  console.log(`[GraphQL] Querying ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query, variables })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result: GraphQLResponse<T> = await response.json();
    
    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      const errorMessages = result.errors.map(e => e.message).join(', ');
      throw new Error(`GraphQL errors: ${errorMessages}`);
    }
    
    if (!result.data) {
      throw new Error('No data returned from GraphQL query');
    }
    
    return result.data;
  } catch (error) {
    console.error('[GraphQL] Query failed:', error);
    throw error;
  }
}

// Helper for mutations (clearer semantics)
export async function graphqlMutate<T = any>(
  mutation: string,
  variables?: Record<string, any>
): Promise<T> {
  return graphqlQuery<T>(mutation, variables);
}

// Query PLAY_CHAIN (for match state - authoritative source)
export async function queryPlayChain<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const config = await loadConfig();
  
  // Use PLAY_CHAIN endpoint for queries (where match state lives)
  const endpoint = config.endpoints[0]; // Can use either port since we're querying PLAY_CHAIN
  const url = `${endpoint.graphqlUrl}/chains/${config.playChain}/applications/${config.applicationId}`;
  
  console.log(`[GraphQL] Querying PLAY_CHAIN: ${url}`);
  console.log(`[GraphQL] PLAY_CHAIN ID: ${config.playChain}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query, variables })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result: GraphQLResponse<T> = await response.json();
    
    if (result.errors && result.errors.length > 0) {
      const errorMessages = result.errors.map(e => e.message).join(', ');
      throw new Error(`GraphQL errors: ${errorMessages}`);
    }
    
    if (!result.data) {
      throw new Error('No data returned from GraphQL query');
    }
    
    return result.data;
  } catch (error) {
    console.error('[GraphQL] PLAY_CHAIN query failed:', error);
    throw error;
  }
}

// Mutate USER_CHAIN (for player actions)
export async function mutateUserChain<T = any>(
  mutation: string,
  variables?: Record<string, any>,
  playerNumber?: number
): Promise<T> {
  const config = await loadConfig();
  const player = playerNumber || getPlayerNumber();
  
  // Find endpoint for this player's USER_CHAIN
  const endpoint = config.endpoints.find(e => e.playerNumber === player);
  if (!endpoint) {
    throw new Error(`No endpoint configured for player ${player}`);
  }
  
  // Use player's USER_CHAIN endpoint for mutations
  const url = `${endpoint.graphqlUrl}/chains/${endpoint.chainId}/applications/${config.applicationId}`;
  
  console.log(`[GraphQL] Mutating USER_CHAIN (Player ${player}): ${url}`);
  console.log(`[GraphQL] USER_CHAIN ID: ${endpoint.chainId}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query: mutation, variables })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result: GraphQLResponse<T> = await response.json();
    
    if (result.errors && result.errors.length > 0) {
      const errorMessages = result.errors.map(e => e.message).join(', ');
      throw new Error(`GraphQL errors: ${errorMessages}`);
    }
    
    if (!result.data) {
      throw new Error('No data returned from GraphQL mutation');
    }
    
    return result.data;
  } catch (error) {
    console.error('[GraphQL] USER_CHAIN mutation failed:', error);
    throw error;
  }
}
