#!/usr/bin/env bash
set -e

echo "🧹 Cleaning up test environment..."

# Kill all linera processes
pkill -f "linera" || true

# Remove temporary files
rm -rf tmp/

echo "✅ Cleanup complete"
