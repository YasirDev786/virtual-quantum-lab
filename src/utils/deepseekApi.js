/**
 * Google Gemini API Utility
 * Handles requests to Google Gemini API for physics explanations and analysis
 * 
 * Note: API key is securely handled via Vite proxy (vite.config.js) which forwards
 * requests to Gemini API with the API key from .env file
 * 
 * API Documentation: https://ai.google.dev/docs
 */

const GEMINI_API_BASE = '/api/gemini'

/**
 * Send a message to Google Gemini API
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous conversation messages
 * @returns {Promise<Object>} Response with AI message and metadata
 */
export const sendMessage = async (message, conversationHistory = []) => {
  try {
    if (!message || message.trim() === '') {
      throw new Error('Message cannot be empty')
    }

    // Build conversation history for Gemini
    // Gemini uses parts array format with role: 'user' or 'model'
    const contents = []
    
    // Add system instruction as first user message with model response
    contents.push({
      role: 'user',
      parts: [{ text: `You are Qubit, a quantum physics assistant for the Virtual Quantum Lab platform. 
You help students, teachers, and researchers understand physics concepts, analyze experiments, 
and provide guidance on physics simulations.

Your role:
- Explain physics concepts clearly and accurately
- Analyze experiment parameters and predict outcomes
- Provide step-by-step guidance for physics problems
- Suggest improvements to experiments
- Answer questions about quantum mechanics, classical mechanics, electromagnetism, waves & optics, and relativity

Always be:
- Clear and educational
- Encouraging and supportive
- Accurate with physics formulas and principles
- Helpful with experiment analysis
- Concise but thorough

Format your responses with:
- Clear explanations
- Relevant formulas when applicable
- Step-by-step breakdowns for complex topics
- Practical examples when helpful` }]
    })
    contents.push({
      role: 'model',
      parts: [{ text: 'I understand. I\'m Qubit, your quantum physics assistant. How can I help you today?' }]
    })

    // Add conversation history
    conversationHistory.forEach(msg => {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })
    })

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    })

    // Log request for debugging (remove sensitive data)
    console.log('Sending request to Gemini API:', {
      url: GEMINI_API_BASE,
      contentsCount: contents.length,
      messageLength: message.length
    })

    const response = await fetch(GEMINI_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
          topP: 0.8,
          topK: 40,
        },
      }),
    })

    console.log('Gemini API Response status:', response.status, response.statusText)

    if (!response.ok) {
      let errorData
      try {
        const text = await response.text()
        console.error('Gemini API Error Response (raw):', text)
        errorData = JSON.parse(text)
      } catch (e) {
        errorData = { error: `Failed to parse error response: ${e.message}` }
      }
      
      // Handle specific Gemini API errors
      let errorMessage = 'Unknown error'
      
      if (errorData.error) {
        if (errorData.error.message) {
          errorMessage = errorData.error.message
        } else if (typeof errorData.error === 'string') {
          errorMessage = errorData.error
        } else if (errorData.error.status) {
          errorMessage = `${errorData.error.status}: ${errorData.error.message || 'API Error'}`
        }
      } else if (errorData.message) {
        errorMessage = errorData.message
      } else if (response.status === 400) {
        errorMessage = 'Invalid request. Please check your API key and request format. Make sure the server was restarted after adding the API key to .env file.'
      } else if (response.status === 401 || response.status === 403) {
        errorMessage = 'Invalid API key. Please check your VITE_GEMINI_API_KEY in .env file and restart the server.'
      } else {
        errorMessage = `HTTP error! status: ${response.status}`
      }
      
      console.error('Gemini API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: GEMINI_API_BASE
      })
      throw new Error(errorMessage)
    }

    const data = await response.json()
    
    // Handle Gemini API response format
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const content = data.candidates[0].content.parts[0].text
      return {
        message: content,
        usage: data.usageMetadata,
        model: 'gemini-1.5-flash',
      }
    }
    
    // Log unexpected response for debugging
    console.error('Unexpected Gemini API response:', data)
    throw new Error('Unexpected response format from Gemini API')
  } catch (error) {
    console.error('Error sending message to Gemini:', error)
    throw error
  }
}

/**
 * Analyze experiment parameters and provide insights
 * @param {Object} experimentData - Experiment configuration
 * @returns {Promise<Object>} Analysis and suggestions
 */
export const analyzeExperiment = async (experimentData) => {
  const analysisPrompt = `Analyze this physics experiment configuration and provide insights:

Experiment Type: ${experimentData.type || 'Unknown'}
Parameters: ${JSON.stringify(experimentData.parameters || {}, null, 2)}

Please provide:
1. What physical phenomena this experiment demonstrates
2. Expected outcomes and behaviors
3. Key formulas involved
4. Suggestions for optimization or improvement
5. Potential issues or considerations`

  return sendMessage(analysisPrompt, [])
}
