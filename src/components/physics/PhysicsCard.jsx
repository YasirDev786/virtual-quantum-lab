import { motion } from 'framer-motion'
import { useState } from 'react'
import { springConfigs, magneticAttraction, waveMotion } from '../../utils/physicsAnimations'

/**
 * Physics-Inspired Card Component
 * Features: Hover effects with physics, magnetic attraction, wave motion
 */
export const PhysicsCard = ({
  children,
  className = '',
  hoverEffect = 'lift', // 'lift', 'magnetic', 'wave', 'pulse'
  onClick,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const getHoverEffect = () => {
    switch (hoverEffect) {
      case 'magnetic':
        return {
          scale: 1.03,
          y: -8,
          rotateY: 2,
          transition: springConfigs.gentle,
        }
      case 'wave':
        return {
          y: -10,
          rotate: [0, 2, -2, 0],
          transition: {
            y: springConfigs.bouncy,
            rotate: {
              duration: 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
        }
      case 'pulse':
        return {
          scale: [1, 1.05, 1],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }
      default: // lift
        return {
          y: -12,
          scale: 1.02,
          transition: springConfigs.bouncy,
        }
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={getHoverEffect()}
      whileTap={{ scale: 0.98, transition: springConfigs.gentle }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`
        glass rounded-xl p-6
        cursor-pointer
        ${className}
      `}
      {...props}
    >
      <motion.div
        animate={isHovered ? { scale: 1.01 } : { scale: 1 }}
        transition={springConfigs.gentle}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default PhysicsCard

