import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { springConfigs, orbitalMotion } from '../utils/physicsAnimations'
import { PhysicsIcon } from './physics'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      whileHover={{ 
        scale: 1.15,
        rotate: [0, 5, -5, 0],
      }}
      whileTap={{ scale: 0.85 }}
      onClick={toggleTheme}
      transition={springConfigs.bouncy}
      className="relative p-2 rounded-lg bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 transition-colors hover:shadow-lg"
      aria-label="Toggle theme"
    >
      <motion.div
        key={theme}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: 1, 
          rotate: 0,
        }}
        exit={{ scale: 0, rotate: 180 }}
        transition={springConfigs.bouncy}
        className="text-xl"
      >
        <PhysicsIcon animation="pulse" size="md">
          {theme === 'dark' ? '🌙' : '☀️'}
        </PhysicsIcon>
      </motion.div>
      
      {/* Orbital particles */}
      <motion.div
        animate={orbitalMotion(8, 3)}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div
          className="absolute top-0 left-1/2 w-1 h-1 bg-primary-500 rounded-full"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </motion.button>
  )
}

