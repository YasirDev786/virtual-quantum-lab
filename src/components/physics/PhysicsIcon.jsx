import { motion } from 'framer-motion'
import { useState } from 'react'
import { springConfigs, pendulumMotion, orbitalMotion, quantumFluctuation } from '../../utils/physicsAnimations'

/**
 * Physics-Inspired Icon Component
 * Features: Various physics-based animations
 */
export const PhysicsIcon = ({
  children,
  animation = 'none', // 'none', 'pendulum', 'orbital', 'quantum', 'pulse', 'rotate'
  size = 'md',
  className = '',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  }
  
  const getAnimation = () => {
    switch (animation) {
      case 'pendulum':
        return pendulumMotion(15, 2)
      case 'orbital':
        return orbitalMotion(5, 3)
      case 'quantum':
        return quantumFluctuation(3)
      case 'pulse':
        return {
          scale: [1, 1.2, 1],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }
      case 'rotate':
        return {
          rotate: 360,
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          },
        }
      default:
        return {}
    }
  }
  
  const hoverAnimation = {
    scale: 1.2,
    rotate: [0, 10, -10, 0],
    transition: springConfigs.bouncy,
  }
  
  return (
    <motion.div
      animate={getAnimation()}
      whileHover={animation === 'none' ? hoverAnimation : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`inline-block ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default PhysicsIcon

