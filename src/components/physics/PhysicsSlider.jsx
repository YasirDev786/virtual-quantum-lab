import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useState } from 'react'
import { springConfigs } from '../../utils/physicsAnimations'

/**
 * Physics-Inspired Slider Component
 * Features: Spring physics, momentum, smooth motion
 */
export const PhysicsSlider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  unit = '',
  className = '',
  physicsEnabled = true,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)
  const springX = useSpring(x, springConfigs.gentle)
  
  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value)
    onChange(newValue)
    
    if (physicsEnabled) {
      // Add slight bounce effect
      x.set(5)
      setTimeout(() => x.set(0), 100)
    }
  }
  
  return (
    <motion.div
      className={`space-y-2 ${className}`}
      animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
      transition={springConfigs.gentle}
    >
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          <motion.span
            key={value}
            initial={{ scale: 1.2, color: '#3b82f6' }}
            animate={{ scale: 1, color: 'inherit' }}
            transition={springConfigs.bouncy}
            className="text-sm font-semibold text-primary-600 dark:text-primary-400"
          >
            {value.toFixed(2)}{unit}
          </motion.span>
        </div>
      )}
      
      <motion.div
        style={{ x: physicsEnabled ? springX : 0 }}
        className="relative"
      >
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500 focus:outline-none"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
          }}
        />
      </motion.div>
      
      {/* Physics indicator */}
      {physicsEnabled && isDragging && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-primary-500"
        >
          ⚡
        </motion.div>
      )}
    </motion.div>
  )
}

export default PhysicsSlider

