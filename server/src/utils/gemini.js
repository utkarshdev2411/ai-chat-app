const axios = require('axios');

/**
 * Generates a response from the Gemini API
 * @param {string} prompt - The user's prompt/message
 * @returns {Promise<string>} - The generated response text
 */
exports.generateResponse = async (prompt) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }
    
    // API endpoint for Gemini Pro with API key as a query parameter
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const response = await axios.post(url, {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
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
    
    return generatedText;
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    throw error;
  }
};

