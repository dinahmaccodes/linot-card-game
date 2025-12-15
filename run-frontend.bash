#!/usr/bin/env bash
set -e

# Simple frontend server for local testing
# Run this in a separate terminal AFTER run.bash completes successfully

echo "Starting Linot Frontend (Local Development)"
echo "============================================"
echo ""
echo "Prerequisites:"
echo "  - Backend services running (run.bash completed)"
echo "  - GraphQL on http://localhost:8081 and http://localhost:8082"
echo ""

# Check if frontend is built
if [ ! -d "frontend/web" ]; then
  echo "❌ Frontend not built. Building now..."
  cd frontend
  npm install
  npm run build
  cd ..
fi

# Always copy latest build to web directory
echo "📦 Updating web directory with latest build..."
rm -rf frontend/web
cp -r frontend/out frontend/web

# Copy config.json from run.bash if it exists
if [ -f "frontend/web_template/config.json" ]; then
  echo "📝 Using config.json from run.bash..."
  cp frontend/web_template/config.json frontend/web/config.json
elif [ -d "frontend/out" ]; then
  echo "✅ Using config from build"
fi

# Start web server
echo "✅ Starting web server on http://localhost:5173"
echo ""
cd frontend/web
npx -y http-server . -p 5173 --cors -c0 --no-dotfiles

# Keep running
wait
