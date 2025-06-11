# AI Chat Application

A full-stack chat application that leverages LangChain with Google's Gemini AI model and Pinecone vector database for enhanced context and information retrieval.

## Features

- Chat with an AI assistant powered by Google's Gemini Pro model
- Vector search capabilities with Pinecone for improved context retrieval
- Conversation history management
- User authentication system
- Clean, responsive UI

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB for user and session storage
- LangChain for AI orchestration
- Google Gemini Pro API for language model
- Pinecone vector database for embeddings storage and retrieval

### Frontend
- React.js
- Tailwind CSS for styling

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or cloud)
- Gemini API key from Google AI Studio
- Pinecone API key and index setup

### Environment Variables
Create `.env` files in both the server directory with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index_name
NODE_ENV=development
```

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd server
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd client
   npm install
   ```
4. Start the development servers:
   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm run dev`

## How It Works

This application uses LangChain to orchestrate interactions between the user, the Gemini language model, and the Pinecone vector database. When a user sends a message:

1. The text is processed through LangChain's workflow
2. Relevant context is retrieved from Pinecone's vector database
3. The context, conversation history, and user's query are sent to Gemini
4. Gemini generates a response enhanced by the additional context
5. The response is returned to the user and stored in the conversation history

This approach provides more contextually relevant and accurate responses compared to a direct API call to the language model.

## License

MIT

