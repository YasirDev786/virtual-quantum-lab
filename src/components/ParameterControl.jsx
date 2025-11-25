import { motion } from 'framer-motion'
import { PhysicsSlider } from './physics/PhysicsSlider'
import { springConfigs } from '../utils/physicsAnimations'

/**
 * Parameter Control Component
 * Reusable slider and input control for simulation parameters
 * Enhanced with physics-inspired animations
 */
export const ParameterControl = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  type = 'slider', // 'slider' or 'input'
  className = '',
  physicsEnabled = true,
}) => {
  if (type === 'slider' && physicsEnabled) {
    return (
      <PhysicsSlider
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        label={label}
        unit={unit}
        className={className}
        physicsEnabled={physicsEnabled}
      />
    )
  }
  
  return (
    <motion.div 
      className={`space-y-2 ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={springConfigs.gentle}
    >
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
      {type === 'slider' ? (
        <motion.input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          whileFocus={{ scale: 1.02 }}
          transition={springConfigs.gentle}
          className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500 focus:outline-none"
        />
      ) : (
        <motion.input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          whileFocus={{ scale: 1.02 }}
          transition={springConfigs.gentle}
          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        />
      )}
    </motion.div>
  )
}

export default ParameterControl

