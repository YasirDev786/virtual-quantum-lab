# ANU QRNG Setup Instructions

## Prerequisites
- ANU QRNG API Key (get it from https://qrng.anu.edu.au/)

## Setup Steps

1. **Create `.env` file** in the project root directory:
   ```
   VITE_ANU_QRNG_API_KEY=your_actual_api_key_here
   ```

2. **Replace `your_actual_api_key_here`** with your actual ANU QRNG API key

3. **Restart the development server** after creating/updating the `.env` file:
   ```bash
   npm run dev
   ```

## How It Works

- The API key is stored securely in `.env` file (which is gitignored)
- Vite proxy (`vite.config.js`) intercepts requests to `/api/qrng`
- The proxy forwards requests to ANU QRNG API with your API key
- The API key is **never exposed** to the frontend/browser

## API Key Location

The API key is added to requests in one of two ways (check ANU QRNG documentation):
- **Header**: `x-api-key` header (currently configured)
- **Query Parameter**: `apiKey` query parameter (alternative, commented in code)

If the header method doesn't work, uncomment the query parameter method in `vite.config.js` and comment out the header method.

## Testing

1. Navigate to `/qrng` page in the app
2. Configure your settings (length, type)
3. Click "Generate" to fetch quantum random numbers
4. Check browser console for any errors

## Production Note

For production builds, Vite's proxy doesn't work. You'll need to:
- Set up a backend server (Node.js/Express) to handle the proxy
- Or use a service like Vercel/Netlify serverless functions
- Keep the API key on the server side only

