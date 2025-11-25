# Google Gemini API Setup Instructions

## Prerequisites
- Google Gemini API Key (get it from https://makersuite.google.com/app/apikey or https://ai.google.dev/)

## Setup Steps

1. **Add API Key to `.env` file** in the project root directory:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

2. **Replace `your_actual_api_key_here`** with your actual Gemini API key

3. **Restart the development server** after adding/updating the API key:
   ```bash
   npm run dev
   ```

## How It Works

- The API key is stored securely in `.env` file (which is gitignored)
- Vite proxy (`vite.config.js`) intercepts requests to `/api/gemini`
- The proxy forwards requests to Gemini API with your API key as a query parameter
- The API key is **never exposed** to the frontend/browser

## API Configuration

The Gemini API proxy is configured to:
- Forward requests to `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`
- Add API key as query parameter automatically (`?key=your_api_key`)
- Keep the API key secure on the server side only

## Testing

1. Navigate to `/ai-assistant` page in the app
2. Try one of the preset questions or type your own
3. Qubit will respond with physics explanations and analysis
4. Check browser console for any errors

## Chatbot Features

- **Name**: Qubit — Your Quantum Assistant
- **Capabilities**:
  - Explain physics concepts clearly
  - Analyze experiment parameters
  - Provide step-by-step guidance
  - Suggest experiment improvements
  - Answer questions about all physics domains

## Preset Questions

The chat interface includes 4 preset questions for quick testing:
1. "Explain quantum superposition in simple terms"
2. "How does electromagnetic induction work?"
3. "What happens in a projectile motion experiment with velocity 20 m/s at 35°?"
4. "Explain the wave-particle duality"

## Production Note

For production builds, Vite's proxy doesn't work. You'll need to:
- Set up a backend server (Node.js/Express) to handle the proxy
- Or use a service like Vercel/Netlify serverless functions
- Keep the API key on the server side only

## API Endpoint Details

- **Base URL**: `https://generativelanguage.googleapis.com`
- **Model**: `gemini-1.5-flash` (faster) or `gemini-1.5-pro` (more capable)
- **Endpoint**: `/v1/models/gemini-1.5-flash:generateContent`
- **Method**: POST
- **Authentication**: API key as query parameter (`?key=...`)
- **API Key Source**: https://aistudio.google.com/api-keys

