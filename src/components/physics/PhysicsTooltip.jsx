import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { springConfigs, waveMotion } from '../../utils/physicsAnimations'

/**
 * Physics-Inspired Tooltip Component
 * Features: Wave motion, spring physics, smooth appearance
 */
export const PhysicsTooltip = ({
  children,
  content,
  position = 'top', // 'top', 'bottom', 'left', 'right'
  delay = 0.3,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false)
  
  const positions = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: '8px',
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: '8px',
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginRight: '8px',
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: '8px',
    },
  }
  
  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              ...waveMotion(2, 3),
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={springConfigs.bouncy}
            style={positions[position]}
            className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
          >
            {content}
            {/* Arrow */}
            <motion.div
              className={`absolute w-0 h-0 ${
                position === 'top' ? 'top-full border-t-gray-900 dark:border-t-gray-800' :
                position === 'bottom' ? 'bottom-full border-b-gray-900 dark:border-b-gray-800' :
                position === 'left' ? 'left-full border-l-gray-900 dark:border-l-gray-800' :
                'right-full border-r-gray-900 dark:border-r-gray-800'
              }`}
              style={{
                left: position === 'left' || position === 'right' ? '50%' : 'auto',
                top: position === 'top' || position === 'bottom' ? '50%' : 'auto',
                transform: position === 'left' || position === 'right' 
                  ? 'translateY(-50%)' 
                  : 'translateX(-50%)',
                borderWidth: '6px',
                borderColor: 'transparent',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PhysicsTooltip

