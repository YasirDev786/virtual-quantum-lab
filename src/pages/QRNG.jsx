import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { fetchQuantumRandom, getSingleRandom, getMultipleRandom, getRandomHex } from '../utils/qrngApi'

/**
 * ANU QRNG Page
 * Australian National University Quantum Random Number Generator
 * Provides true quantum randomness for physics simulations and experiments
 */
export const QRNG = () => {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)
  const [history, setHistory] = useState([])
  const [config, setConfig] = useState({
    length: 10,
    type: 'uint16',
  })

  // Fetch random numbers
  const handleFetch = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await fetchQuantumRandom({
        length: config.length,
        type: config.type,
      })
      
      setResults(data)
      
      // Add to history
      setHistory((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          length: config.length,
          type: config.type,
          data: data.data || data,
        },
        ...prev.slice(0, 9), // Keep last 10
      ])
    } catch (err) {
      setError(err.message || 'Failed to fetch quantum random numbers')
      console.error('QRNG Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Quick fetch single number
  const handleQuickFetch = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const number = await getSingleRandom(config.type)
      setResults({ data: [number], success: true })
      
      setHistory((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          length: 1,
          type: config.type,
          data: [number],
        },
        ...prev.slice(0, 9),
      ])
    } catch (err) {
      setError(err.message || 'Failed to fetch quantum random number')
    } finally {
      setLoading(false)
    }
  }

  // Get hex values
  const handleFetchHex = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const hexValues = await getRandomHex(config.length)
      setResults({ data: hexValues, success: true })
      
      setHistory((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          length: config.length,
          type: 'hex16',
          data: hexValues,
        },
        ...prev.slice(0, 9),
      ])
    } catch (err) {
      setError(err.message || 'Failed to fetch quantum random hex values')
    } finally {
      setLoading(false)
    }
  }

  // Copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  // Format data for display
  const formatData = (data) => {
    if (Array.isArray(data)) {
      return data.join(', ')
    }
    return String(data)
  }

  // Calculate statistics
  const calculateStats = (data) => {
    if (!Array.isArray(data) || data.length === 0) return null
    
    const numbers = data.filter((n) => typeof n === 'number')
    if (numbers.length === 0) return null
    
    const sum = numbers.reduce((a, b) => a + b, 0)
    const avg = sum / numbers.length
    const min = Math.min(...numbers)
    const max = Math.max(...numbers)
    const variance = numbers.reduce((acc, n) => acc + Math.pow(n - avg, 2), 0) / numbers.length
    const stdDev = Math.sqrt(variance)
    
    return { avg, min, max, stdDev, count: numbers.length }
  }

  const stats = results?.data ? calculateStats(results.data) : null

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-4 inline-block"
          >
            🌀
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            <span className="gradient-text">ANU Quantum Random Number Generator</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Generate true quantum randomness using the Australian National University's quantum random number generator.
            Perfect for physics simulations, cryptography, and scientific research.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-2xl font-display font-bold mb-4">Configuration</h2>
              
              {/* Length Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Number of Values (1-1024)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1024"
                  value={config.length}
                  onChange={(e) => setConfig({ ...config, length: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Type Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Number Type
                </label>
                <select
                  value={config.type}
                  onChange={(e) => setConfig({ ...config, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="uint8">uint8 (0-255)</option>
                  <option value="uint16">uint16 (0-65535)</option>
                  <option value="hex16">hex16 (Hexadecimal)</option>
                  <option value="uint16bin">uint16bin (Binary)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFetch}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '🌀 Generating...' : `🌀 Generate ${config.length} Numbers`}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleQuickFetch}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ⚡ Quick Single Number
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFetchHex}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔢 Generate Hex Values
                </motion.button>
              </div>
            </motion.div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="text-lg font-display font-bold mb-3">About ANU QRNG</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                The Australian National University Quantum Random Number Generator uses quantum fluctuations
                in a vacuum to generate truly random numbers. Unlike pseudo-random number generators,
                quantum randomness is fundamentally unpredictable and perfect for scientific applications.
              </p>
            </motion.div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-4 bg-red-500/10 border border-red-500/20"
              >
                <p className="text-red-600 dark:text-red-400 font-semibold">⚠️ Error: {error}</p>
              </motion.div>
            )}

            {/* Results Display */}
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-display font-bold">Results</h2>
                  {results.data && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCopy(formatData(results.data))}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
                    >
                      📋 Copy
                    </motion.button>
                  )}
                </div>

                {/* Statistics */}
                {stats && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="glass rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Count</div>
                      <div className="text-lg font-bold">{stats.count}</div>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Average</div>
                      <div className="text-lg font-bold">{stats.avg.toFixed(2)}</div>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Min</div>
                      <div className="text-lg font-bold">{stats.min}</div>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Max</div>
                      <div className="text-lg font-bold">{stats.max}</div>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Std Dev</div>
                      <div className="text-lg font-bold">{stats.stdDev.toFixed(2)}</div>
                    </div>
                  </div>
                )}

                {/* Data Display */}
                <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                    {formatData(results.data || results)}
                  </pre>
                </div>
              </motion.div>
            )}

            {/* History */}
            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-xl p-6"
              >
                <h2 className="text-2xl font-display font-bold mb-4">Recent History</h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-800 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {item.timestamp} • {item.length} × {item.type}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {formatData(item.data.slice(0, 5))}
                          {item.data.length > 5 && '...'}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCopy(formatData(item.data))}
                        className="ml-2 p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900 rounded"
                        title="Copy"
                      >
                        📋
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!results && !error && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-xl p-12 text-center"
              >
                <div className="text-6xl mb-4">🌀</div>
                <h3 className="text-xl font-display font-bold mb-2">Ready to Generate</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure your settings and click "Generate" to get quantum random numbers
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRNG

