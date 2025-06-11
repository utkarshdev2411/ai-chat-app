const axios = require('axios');

// Max retries for rate limits
const MAX_RETRIES = 3;
// Base delay for exponential backoff (in ms)
const BASE_DELAY = 1000;

/**
 * Generate a response from Gemini API
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<string>} - The AI response text
 */
async function generateResponse(prompt, retryCount = 0) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
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
          maxOutputTokens: 1000
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        timeout: 15000 // 15 seconds timeout
      }
    );

    // Extract the text from the response
    const generatedText = response.data.candidates[0].content.parts[0].text;
    return generatedText;
  } catch (error) {
    // Handle rate limiting with exponential backoff
    if (error.response && error.response.status === 429 && retryCount < MAX_RETRIES) {
      const delay = BASE_DELAY * Math.pow(2, retryCount);
      console.log(`Rate limited. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateResponse(prompt, retryCount + 1);
    }

    // Handle other errors
    console.error('Gemini API error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || 'Failed to generate AI response');
  }
}

module.exports = { generateResponse };

