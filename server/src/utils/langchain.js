const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');

// Initialize the LLM
const initLLM = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key not found');
  }
  
  console.log('Initializing ChatGoogleGenerativeAI with API key:', apiKey.substring(0, 5) + '...');
  
  return new ChatGoogleGenerativeAI({
    apiKey: apiKey,
    modelName: "gemini-2.0-flash",
    maxOutputTokens: 1024,
  });
};

/**
 * Extracts text from a LangChain response object
 */
const extractResponseText = (response) => {
  if (typeof response === 'string') {
    return response;
  } else if (response && response.content) {
    return response.content;
  } else if (response && response.text) {
    return response.text;
  } else if (response && Array.isArray(response) && response[0] && response[0].text) {
    return response[0].text;
  } else {
    throw new Error('Unable to extract text from response');
  }
};

/**
 * Converts session history to a simple text format for the prompt
 */
const formatChatHistory = (history, skipSystemMessages = true) => {
  if (!history || history.length === 0) return '';
  
  return history
    .filter(msg => skipSystemMessages ? msg.role !== 'system' : true)
    .map(msg => {
      const role = msg.role === 'user' ? 'User' : 'AI';
      return `${role}: ${msg.text}`;
    })
    .join('\n');
};

/**
 * Generates a response using LangChain with fallback to direct Gemini API
 */
const generateWithFallback = async (prompt, fallbackFn, fallbackArgs) => {
  try {
    // Attempt to use LangChain first
    const llm = initLLM();
    const response = await llm.invoke(prompt);
    return extractResponseText(response);
  } catch (langChainError) {
    console.warn('LangChain error, falling back to direct Gemini API:', langChainError);
    // Fallback to direct Gemini implementation
    return await fallbackFn(...fallbackArgs);
  }
};

/**
 * Generates a response using LangChain with Google's Gemini model
 * @param {string} prompt - The user's message
 * @param {Array} history - Session history array
 * @returns {Promise<string>} - The generated response text
 */
exports.generateResponse = async (prompt, history = []) => {
  try {
    // Format the conversation history as text
    const chatHistoryText = formatChatHistory(history);
    
    // Prepare the system prompt with optional chat history
    let systemPrompt = "You are a helpful AI assistant.\n\n";
    if (chatHistoryText) {
      systemPrompt += `Chat History:\n${chatHistoryText}\n\n`;
    }
    systemPrompt += `User: ${prompt}\n\nAI: `;
    
    // Generate response with fallback
    return await generateWithFallback(systemPrompt, require('./gemini').generateResponse, [systemPrompt]);
  } catch (error) {
    console.error('Response generation error:', error);
    return "I'm sorry, I encountered an error while generating a response. Please try again.";
  }
};

/**
 * Generates a story response using LangChain with Google's Gemini model
 * @param {string} userInput - The user's action or 'continue' command
 * @param {Array} messageHistory - Previous messages in the story
 * @param {Object} scenarioInfo - Information about the current scenario
 * @param {boolean} isContinue - Whether this is a 'continue' request
 * @returns {Promise<string>} - The generated story continuation
 */
exports.generateStoryResponse = async (userInput, messageHistory, scenarioInfo, isContinue = false) => {
  try {
    // Format the message history for the prompt
    const chatHistory = messageHistory
      .filter(msg => msg.role !== 'system')
      .map(msg => {
        const role = msg.role === 'user' ? 'User' : 'AI';
        return `${role}: ${msg.text}`;
      })
      .join('\n');
    
    // Build the system prompt with instructions and scenario context
    let systemPrompt = `You are an interactive storyteller for a ${scenarioInfo.name} scenario.\n`;
    systemPrompt += `${scenarioInfo.systemInstructions}\n\n`;
    
    // Add the story context
    systemPrompt += `Previous story context:\n${chatHistory}\n\n`;
    
    // Add the user input or continue instruction
    systemPrompt += `${isContinue ? '[Continue the story...]' : `[User Action]: ${userInput}`}\n\n`;
    
    // Add instructions for the response format
    systemPrompt += `Continue the narrative in an engaging way that responds to the user's input or advances the story. Keep the response to 2-4 paragraphs:`;
    
    // Generate response with fallback
    return await generateWithFallback(systemPrompt, require('./gemini').generateStoryResponse, [userInput, messageHistory, scenarioInfo, isContinue]);
    
  } catch (error) {
    console.error('Story generation error:', error);
    return "I'm sorry, I encountered an error while generating the story. Please try again.";
  }
};

console.log('LangChain initialized without Pinecone. Will add Pinecone integration in future updates.');

