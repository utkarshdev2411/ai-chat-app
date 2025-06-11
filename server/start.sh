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
cd ../client && npm run dev &
CLIENT_PID=$!

echo "Server running on http://localhost:5000"
echo "Client running on http://localhost:5173"
echo "Server PID: $SERVER_PID"
echo "Client PID: $CLIENT_PID"

# Wait for user input to stop
echo "Press any key to stop both services..."
read -n 1 -s

# Kill both processes
echo "Stopping services..."
kill $SERVER_PID $CLIENT_PID
echo "Services stopped."

