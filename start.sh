#!/bin/bash

# Start the AI Storytelling App
echo "Starting AI Storytelling App..."

# Start server in background
echo "Starting server..."
cd server && npm run dev &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Start client in background
echo "Starting client..."
ls
cd client && npm run dev &
CLIENT_PID=$!

echo "Server running on http://localhost:5000"
echo "Client running on http://localhost:5173"
echo "Server PID: $SERVER_PID"
echo "Client PID: $CLIENT_PID"
echo ""
echo "🚀 AI Storytelling App is ready!"
echo "📖 Open http://localhost:5173 in your browser to start your adventure"
echo ""
echo "Press Ctrl+C to stop both services..."

# Function to cleanup on exit
cleanup() {
    echo "\nStopping services..."
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    echo "Services stopped."
    exit 0
}

# Set trap to call cleanup function on CTRL+C
trap cleanup SIGINT

# Keep script running
while true; do
    sleep 1
done

