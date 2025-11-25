import { motion } from 'framer-motion'
import { useState } from 'react'
import { springConfigs, elasticBounce, magneticAttraction } from '../../utils/physicsAnimations'

/**
 * Physics-Inspired Button Component
 * Features: Spring physics, magnetic attraction, elastic bounce
 */
export const PhysicsButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  physicsType = 'bouncy', // 'bouncy', 'gentle', 'magnetic', 'elastic'
  disabled = false,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false)
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-purple-500 text-white',
    secondary: 'bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300',
    outline: 'border-2 border-primary-500 text-primary-600 dark:text-primary-400',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  const getPhysicsConfig = () => {
    switch (physicsType) {
      case 'magnetic':
        return {
          whileHover: {
            scale: 1.05,
            transition: springConfigs.gentle,
          },
          whileTap: magneticAttraction(0.15),
        }
      case 'elastic':
        return {
          whileHover: {
            scale: 1.05,
            transition: springConfigs.bouncy,
          },
          whileTap: elasticBounce(0.2),
        }
      case 'gentle':
        return {
          whileHover: {
            scale: 1.03,
            transition: springConfigs.gentle,
          },
          whileTap: {
            scale: 0.97,
            transition: springConfigs.gentle,
          },
        }
      default: // bouncy
        return {
          whileHover: {
            scale: 1.08,
            y: -2,
            transition: springConfigs.bouncy,
          },
          whileTap: {
            scale: 0.92,
            y: 2,
            transition: springConfigs.bouncy,
          },
        }
    }
  }
  
  return (
    <motion.button
      {...getPhysicsConfig()}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
        rounded-lg font-semibold
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        shadow-lg hover:shadow-xl
        transition-shadow duration-300
      `}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      <motion.span
        animate={isPressed ? { y: 1 } : { y: 0 }}
        transition={springConfigs.bouncy}
      >
        {children}
      </motion.span>
    </motion.button>
  )
}

export default PhysicsButton

