/**
 * Game Results API Service
 * Handles sending game completion data to webhook endpoint
 */

const WEBHOOK_URL = 'https://hook.eu1.make.com/4jtevja63bir17db4oqw267cvuxe5y98';
const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * Formats the game results payload according to the required structure
 * @param {string} email - Player's email address
 * @param {number} score - Player's final score
 * @returns {Object} Formatted payload object
 */
const formatGameResultsPayload = (email, score) => {
  return {
    email: email,
    element_id: "05",
    game_name: "Bucket Sorting",
    location: "surat",
    score: score
  };
};

/**
 * Validates input parameters before sending to API
 * @param {string} email - Player's email address
 * @param {number} score - Player's final score
 * @throws {Error} If validation fails
 */
const validateGameData = (email, score) => {
  if (!email || typeof email !== 'string' || email.trim() === '') {
    throw new Error('Valid email is required');
  }
  
  if (typeof score !== 'number' || score < 0) {
    throw new Error('Valid score is required');
  }
};

/**
 * Sends the formatted payload to the webhook endpoint
 * @param {Object} payload - The formatted game results payload
 * @returns {Promise<Response>} The fetch response
 */
const sendToWebhook = async (payload) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Main function to submit game results to the webhook
 * @param {string} email - Player's email address
 * @param {number} score - Player's final score
 * @returns {Promise<void>}
 */
export const submitGameResults = async (email, score) => {
  try {
    // Validate input data
    validateGameData(email, score);
    
    // Format the payload
    const payload = formatGameResultsPayload(email, score);
    
    // Send to webhook
    const response = await sendToWebhook(payload);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log('Game results submitted successfully:', payload);
  } catch (error) {
    // Log error but don't throw to prevent disrupting user experience
    console.error('Failed to submit game results:', error.message);
    console.error('Payload that failed:', { email, score });
  }
};

// Export utility functions for testing
export { formatGameResultsPayload, validateGameData };