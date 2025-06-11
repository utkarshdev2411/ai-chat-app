const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { HumanMessage, AIMessage } = require('@langchain/core/messages');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { RunnableSequence } = require('@langchain/core/runnables');

// Initialize the LLM
const initLLM = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key not found');
  }
  
  console.log('Initializing ChatGoogleGenerativeAI with API key:', apiKey.substring(0, 5) + '...');
  
  // Try a more minimal configuration to avoid errors
  return new ChatGoogleGenerativeAI({
    apiKey: apiKey,
    modelName: "gemini-2.0-flash",
    maxOutputTokens: 1024,
  });
};

/**
 * Converts session history to a simple text format for the prompt
 * @param {Array} history - Session history array
 * @returns {string} - Formatted chat history text
 */
const formatChatHistory = (history) => {
  if (!history || history.length === 0) return '';
  
  return history.map(msg => {
    const role = msg.role === 'user' ? 'User' : 'AI';
    return `${role}: ${msg.text}`;
  }).join('\n');
};

/**
 * Generates a response using LangChain with Google's Gemini model
 * @param {string} prompt - The user's message
 * @param {Array} history - Session history array
 * @returns {Promise<string>} - The generated response text
 */
exports.generateResponse = async (prompt, history = []) => {
  try {
    try {
      // Attempt to use LangChain first
      const llm = initLLM();
      // Format the conversation history as text
      const chatHistoryText = formatChatHistory(history);
      
      // Prepare the system prompt with optional chat history
      let systemPrompt = "You are a helpful AI assistant.\n\n";
      if (chatHistoryText) {
        systemPrompt += `Chat History:\n${chatHistoryText}\n\n`;
      }
      systemPrompt += `User: ${prompt}\n\nAI: `;
      
      // Try to invoke the model
      const response = await llm.invoke(systemPrompt);
      
      // Extract text from response
      let textResponse;
      if (typeof response === 'string') {
        textResponse = response;
      } else if (response && response.content) {
        textResponse = response.content;
      } else if (response && response.text) {
        textResponse = response.text;
      } else if (response && Array.isArray(response) && response[0] && response[0].text) {
        textResponse = response[0].text;
      } else {
        throw new Error('Unable to extract text from response');
      }
      
      return textResponse;
    } catch (langChainError) {
      console.warn('LangChain error, falling back to direct Gemini API:', langChainError);
      
      // Fallback to the direct Gemini API implementation
      const { generateResponse } = require('./gemini');
      
      // Format a prompt with history for the direct API call
      const chatHistoryText = formatChatHistory(history);
      let fullPrompt = "You are a helpful AI assistant.\n\n";
      if (chatHistoryText) {
        fullPrompt += `Chat History:\n${chatHistoryText}\n\n`;
      }
      fullPrompt += `User: ${prompt}\n\nAI: `;
      
      return await generateResponse(fullPrompt);
    }
  } catch (error) {
    console.error('Response generation error:', error);
    return "I'm sorry, I encountered an error while generating a response. Please try again.";
  }
};

console.log('LangChain initialized without Pinecone. Will add Pinecone integration in future updates.');

