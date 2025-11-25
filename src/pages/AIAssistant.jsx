import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { sendMessage } from '../utils/deepseekApi' // Note: File name kept for compatibility, but uses Gemini API
import { PhysicsButton } from '../components/physics'
import { springConfigs } from '../utils/physicsAnimations'

/**
 * AI Physics Assistant Page
 * Chat interface with Qubit - Your Quantum Assistant
 */
export const AIAssistant = () => {
  const { theme } = useTheme()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Preset questions for quick testing
  const presetQuestions = [
    {
      text: "Explain quantum superposition in simple terms",
      icon: "⚛️"
    },
    {
      text: "How does electromagnetic induction work?",
      icon: "⚡"
    },
    {
      text: "What happens in a projectile motion experiment with velocity 20 m/s at 35°?",
      icon: "🎯"
    },
    {
      text: "Explain the wave-particle duality",
      icon: "🌊"
    }
  ]

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle sending message
  const handleSend = async (messageText = null) => {
    const textToSend = messageText || input.trim()
    if (!textToSend || loading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      // Get conversation history (last 10 messages for context)
      const conversationHistory = messages
        .slice(-10)
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }))

      const response = await sendMessage(textToSend, conversationHistory)

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        usage: response.usage,
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      setError(err.message || 'Failed to get response from Qubit')
      console.error('AI Assistant Error:', err)
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  // Handle preset question click
  const handlePresetClick = (question) => {
    handleSend(question)
  }

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Clear conversation
  const handleClear = () => {
    if (confirm('Clear all messages?')) {
      setMessages([])
      setError(null)
    }
  }

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springConfigs.bouncy}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className="text-6xl mb-4 inline-block"
          >
            ⚛️
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
            <span className="gradient-text">Qubit</span>
            <span className="text-gray-600 dark:text-gray-400"> — Your Quantum Assistant</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Ask me anything about physics! I can explain concepts, analyze experiments, and help you understand the quantum world.
          </p>
        </motion.div>

        {/* Preset Questions */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ...springConfigs.bouncy }}
            className="mb-6"
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 text-center">
              Try asking me:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {presetQuestions.map((preset, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, ...springConfigs.bouncy }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePresetClick(preset.text)}
                  className="glass rounded-xl p-4 text-left hover:bg-primary-500/10 dark:hover:bg-primary-500/20 transition-colors border border-gray-200 dark:border-dark-700"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{preset.icon}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                      {preset.text}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springConfigs.bouncy}
          className="glass rounded-2xl overflow-hidden shadow-xl"
        >
          {/* Messages Area */}
          <div className="h-[500px] md:h-[600px] overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-dark-800/50">
            {messages.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="text-6xl mb-4"
                >
                  ⚛️
                </motion.div>
                <h3 className="text-xl font-display font-bold mb-2 text-gray-700 dark:text-gray-300">
                  Welcome! I'm Qubit
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  Ask me anything about physics. I can explain concepts, analyze your experiments, 
                  and help you understand the fascinating world of quantum mechanics and classical physics.
                </p>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                  transition={springConfigs.gentle}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white'
                        : 'bg-white dark:bg-dark-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">⚛️</span>
                        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                          Qubit
                        </span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                      {message.content}
                    </div>
                    {message.usage && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-xs opacity-70">
                        Tokens: {message.usage.totalTokenCount || message.usage.total_tokens || 'N/A'}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white dark:bg-dark-700 rounded-2xl p-4 max-w-[70%]">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">⚛️</span>
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                      Qubit is thinking...
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-primary-500 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-dark-700 p-4 bg-white dark:bg-dark-800">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Qubit about physics..."
                  disabled={loading}
                  rows={1}
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <PhysicsButton
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                physicsType="bouncy"
                size="md"
                variant="primary"
                className="flex-shrink-0"
              >
                {loading ? '⏳' : '🚀'}
              </PhysicsButton>
              {messages.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClear}
                  className="p-3 rounded-xl bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors"
                  title="Clear conversation"
                >
                  🗑️
                </motion.button>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AIAssistant

