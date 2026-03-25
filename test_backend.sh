#!/bin/bash

# Load OPENAI_API_KEY if not already set
if [ -z "$OPENAI_API_KEY" ]; then
  echo "OPENAI_API_KEY not set. Please export it or run with OPENAI_API_KEY=your_key ./test_backend.sh"
  exit 1
fi

# Backup original .env
cp backend/.env backend/.env.backup

# Temporarily update .env with the provided key
echo "OPENAI_API_KEY=$OPENAI_API_KEY" > backend/.env

# Kill any running server
lsof -ti:8002 | xargs kill -9 2>/dev/null || true

# Start server
cd backend && uvicorn server:app --reload --host 0.0.0.0 --port 8002 &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo "Testing /api/chat..."
curl -X POST http://127.0.0.1:8002/api/chat \
-H "Content-Type: application/json" \
-d '{"message":"Hola, quiero información sobre clases","history":[]}' | jq .

echo -e "\n\nTesting /api/generate-campaign..."
curl -X POST http://127.0.0.1:8002/api/generate-campaign \
-H "Content-Type: application/json" \
-d '{"budget":100,"dateRange":{"start":"2024-01-01","end":"2024-01-07"},"campaignType":"promotional","platforms":["instagram","facebook"]}' | jq .

# Kill server
kill $SERVER_PID 2>/dev/null || true

# Restore original .env
mv backend/.env.backup backend/.env

echo "Test complete. .env restored."