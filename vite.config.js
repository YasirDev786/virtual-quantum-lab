import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api/qrng': {
          target: 'https://qrng.anu.edu.au',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/qrng/, '/API/jsonI.php'),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Add API key from environment variable
              const apiKey = env.VITE_ANU_QRNG_API_KEY
              if (apiKey) {
                // ANU QRNG API uses API key in headers
                proxyReq.setHeader('x-api-key', apiKey)
                // Alternative: if API key should be in query params, uncomment below:
                // const url = new URL(proxyReq.path, 'https://qrng.anu.edu.au')
                // url.searchParams.set('apiKey', apiKey)
                // proxyReq.path = url.pathname + url.search
              }
            })
          },
        },
        '/api/gemini': {
          target: 'https://generativelanguage.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => {
            const apiKey = env.VITE_GEMINI_API_KEY
            if (!apiKey || apiKey.trim() === '') {
              console.error('❌ VITE_GEMINI_API_KEY is not set in environment variables')
              console.error('Please check your .env file in the project root')
              console.error('Make sure the file contains: VITE_GEMINI_API_KEY=your_api_key_here')
              // Return a path that will result in a clear error
              return '/v1/models/gemini-1.5-flash:generateContent?key=MISSING_API_KEY'
            }
            // Gemini API uses API key as query parameter
            // Using v1 API with gemini-1.5-flash or gemini-1.5-pro model
            const apiPath = `/v1/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`
            console.log('✅ Rewriting Gemini API path with key:', '***' + apiKey.slice(-4))
            return apiPath
          },
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Set proper headers for Gemini API
              proxyReq.setHeader('Content-Type', 'application/json')
              const apiKey = env.VITE_GEMINI_API_KEY
              // Log for debugging (remove in production)
              if (apiKey) {
                console.log('Proxying Gemini API request with key:', '***' + apiKey.slice(-4))
              } else {
                console.error('VITE_GEMINI_API_KEY is NOT SET - requests will fail!')
              }
            })
            proxy.on('proxyRes', (proxyRes, req, res) => {
              // Log response for debugging
              if (proxyRes.statusCode !== 200) {
                console.error('Gemini API error status:', proxyRes.statusCode)
                // Try to read error body
                let body = ''
                proxyRes.on('data', (chunk) => {
                  body += chunk.toString()
                })
                proxyRes.on('end', () => {
                  if (body) {
                    try {
                      const errorData = JSON.parse(body)
                      console.error('Gemini API error details:', errorData)
                    } catch (e) {
                      console.error('Gemini API error body:', body)
                    }
                  }
                })
              }
            })
          },
        },
      },
    },
  }
})

