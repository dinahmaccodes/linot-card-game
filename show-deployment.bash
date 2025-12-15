#!/usr/bin/env bash
# Helper script to extract current deployment details from run.bash output

echo "📋 Current Deployment Details"
echo "=============================="
echo ""

# Extract from terminal history or provide manual entry
if [ -f "deployment_info.json" ]; then
    echo "Reading from deployment_info.json..."
    cat deployment_info.json
else
    echo "⚠️  deployment_info.json not found"
    echo ""
    echo "Extracting from run.bash terminal output..."
    echo ""
    
    # Try to get from ps/grep of running run.bash
    APP_ID=$(ps aux | grep "linera.*service" | head -1 | grep -oE '[0-9a-f]{64}' | head -1)
    
    if [ -n "$APP_ID" ]; then
        echo "Found APP_ID: $APP_ID"
    else
        echo "Could not auto-detect. Check terminal output of run.bash"
        echo ""
        echo "Look for lines like:"
        echo '  "Application deployed: <APP_ID>"'
        echo '  "Deployed on chain: <PLAY_CHAIN>"'
    fi
fi

echo ""
echo "💡 Tip: Restart run.bash to generate fresh deployment_info.json"
