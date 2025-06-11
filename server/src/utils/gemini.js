const axios = require('axios');

/**
 * Generates a story continuation from the Gemini API
 * @param {string} userInput - The user's action or 'continue' command
 * @param {Array} messageHistory - Previous messages in the story
 * @param {Object} scenarioInfo - Information about the current scenario
 * @param {boolean} isContinue - Whether this is a 'continue' request (true) or custom action (false)
 * @returns {Promise<string>} - The generated story continuation
 */
exports.generateStoryResponse = async (userInput, messageHistory, scenarioInfo, isContinue = false) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }
    
    // API endpoint for Gemini Pro with API key as a query parameter
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    // Build the system prompt with instructions and scenario context
    const systemPrompt = scenarioInfo.systemInstructions;
    
    // Build the story context from message history
    let storyContext = '';
    // Include up to last 10 messages for context (to avoid token limits)
    const relevantHistory = messageHistory.slice(-10);
    
    for (const message of relevantHistory) {
      if (message.role === 'system') {
        continue; // Skip system messages in the narrative
      } else if (message.role === 'user') {
        storyContext += `[User ${message.inputType === 'action' ? 'Action' : 'Input'}]: ${message.text}\n`;
      } else { // AI responses
        storyContext += `[Story]: ${message.text}\n\n`;
      }
    }
    
    // Create the full prompt
    const fullPrompt = `${systemPrompt}\n\nPrevious story context:\n${storyContext}\n\n${isContinue ? '[Continue the story...]' : `[User Action]: ${userInput}`}\n\nContinue the narrative in an engaging way that responds to the user's input or advances the story. Keep the response to 2-4 paragraphs:`;
    
    // Send request to Gemini API
    const response = await axios.post(url, {
      contents: [
        {
          parts: [
            {
              text: fullPrompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.8, // Slightly higher temperature for creative storytelling
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
    
    // Extract the generated text from the response
    const generatedText = response.data.candidates[0]?.content?.parts[0]?.text;
    
    if (!generatedText) {
      throw new Error('No text generated from the API');
    }
    
    // Clean up the response - remove any artifacts from the prompt format
    const cleanedResponse = generatedText
      .replace(/\[Story\]:/g, '')
      .replace(/\[Continue the story...\]/g, '')
      .replace(/\[User Action\]:.*/g, '')
      .trim();
    
    return cleanedResponse;
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    throw error;
  }
};

