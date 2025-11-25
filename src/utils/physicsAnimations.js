/**
 * Physics-Inspired Animation Utilities
 * Advanced motion effects based on real physics principles
 */

/**
 * Spring Physics Configuration
 * Based on Hooke's Law: F = -kx
 */
export const springConfigs = {
  // Gentle spring - smooth, natural motion
  gentle: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
    mass: 1,
  },
  // Bouncy spring - more elastic, playful
  bouncy: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
    mass: 0.8,
  },
  // Wobbly spring - oscillating, wavy motion
  wobbly: {
    type: 'spring',
    stiffness: 180,
    damping: 12,
    mass: 1.2,
  },
  // Stiff spring - quick, precise motion
  stiff: {
    type: 'spring',
    stiffness: 500,
    damping: 30,
    mass: 0.5,
  },
  // Gravity spring - simulates falling with bounce
  gravity: {
    type: 'spring',
    stiffness: 200,
    damping: 25,
    mass: 1.5,
  },
}

/**
 * Pendulum Motion
 * Creates pendulum-like swinging motion
 */
export const pendulumMotion = (amplitude = 15, period = 2) => ({
  rotate: [0, amplitude, -amplitude, 0],
  transition: {
    duration: period,
    repeat: Infinity,
    ease: 'easeInOut',
  },
})

/**
 * Wave Motion
 * Creates wave-like oscillation
 */
export const waveMotion = (amplitude = 10, frequency = 1) => ({
  y: [0, amplitude, -amplitude, 0],
  transition: {
    duration: 1 / frequency,
    repeat: Infinity,
    ease: 'easeInOut',
  },
})

/**
 * Orbital Motion
 * Creates circular/orbital motion
 */
export const orbitalMotion = (radius = 20, duration = 4) => {
  const steps = 60
  const keyframes = []
  
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2
    keyframes.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    })
  }
  
  return {
    x: keyframes.map(k => k.x),
    y: keyframes.map(k => k.y),
    transition: {
      duration,
      repeat: Infinity,
      ease: 'linear',
    },
  }
}

/**
 * Magnetic Attraction
 * Simulates magnetic pull effect
 */
export const magneticAttraction = (strength = 0.1) => ({
  scale: [1, 1 + strength, 1],
  transition: {
    duration: 0.3,
    ease: 'easeOut',
  },
})

/**
 * Elastic Bounce
 * Creates elastic collision-like bounce
 */
export const elasticBounce = (intensity = 0.3) => ({
  scale: [1, 1 + intensity, 1 - intensity * 0.5, 1],
  transition: {
    duration: 0.6,
    ease: 'easeOut',
  },
})

/**
 * Gravity Drop
 * Simulates falling with gravity
 */
export const gravityDrop = (distance = 100) => ({
  y: [0, distance],
  transition: {
    type: 'spring',
    stiffness: 200,
    damping: 15,
    mass: 1,
  },
})

/**
 * Momentum Slide
 * Creates momentum-based sliding motion
 */
export const momentumSlide = (direction = 'right', distance = 50) => {
  const directions = {
    right: { x: [0, distance, 0] },
    left: { x: [0, -distance, 0] },
    up: { y: [0, -distance, 0] },
    down: { y: [0, distance, 0] },
  }
  
  return {
    ...directions[direction],
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 20,
      mass: 1,
    },
  }
}

/**
 * Quantum Fluctuation
 * Creates quantum-like random fluctuations
 */
export const quantumFluctuation = (intensity = 5) => ({
  x: [0, intensity * (Math.random() - 0.5), 0],
  y: [0, intensity * (Math.random() - 0.5), 0],
  rotate: [0, intensity * (Math.random() - 0.5), 0],
  transition: {
    duration: 0.1,
    repeat: Infinity,
    repeatType: 'reverse',
  },
})

/**
 * Particle Trail Effect
 * Creates trailing motion effect
 */
export const particleTrail = (delay = 0.1) => ({
  opacity: [0, 1, 0],
  scale: [0.8, 1, 1.2],
  transition: {
    duration: 0.5,
    delay,
    ease: 'easeOut',
  },
})

/**
 * Field Line Animation
 * Creates flowing field line effect
 */
export const fieldLineFlow = (duration = 2) => ({
  pathLength: [0, 1],
  opacity: [0.3, 1, 0.3],
  transition: {
    duration,
    repeat: Infinity,
    ease: 'easeInOut',
  },
})

/**
 * Resonance Effect
 * Creates resonant oscillation
 */
export const resonance = (amplitude = 10, frequency = 2) => ({
  scale: [1, 1 + amplitude / 100, 1 - amplitude / 200, 1],
  transition: {
    duration: 1 / frequency,
    repeat: Infinity,
    ease: 'easeInOut',
  },
})

/**
 * Collision Bounce
 * Simulates elastic collision
 */
export const collisionBounce = (direction = 'horizontal') => {
  if (direction === 'horizontal') {
    return {
      x: [0, 20, -10, 5, 0],
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    }
  } else {
    return {
      y: [0, -20, 10, -5, 0],
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    }
  }
}

/**
 * Magnetic Field Pulse
 * Creates expanding magnetic field effect
 */
export const magneticPulse = (maxScale = 1.5) => ({
  scale: [1, maxScale, 1],
  opacity: [0.5, 0.8, 0.5],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
})

/**
 * Wave Interference Pattern
 * Creates interference-like motion
 */
export const waveInterference = (amplitude = 15) => {
  const steps = 40
  const keyframes = []
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    // Superposition of two waves
    const wave1 = Math.sin(t * Math.PI * 4) * amplitude
    const wave2 = Math.sin(t * Math.PI * 6 + Math.PI / 3) * amplitude * 0.7
    keyframes.push(wave1 + wave2)
  }
  
  return {
    y: keyframes,
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    },
  }
}

/**
 * Relativistic Time Dilation
 * Creates time-dilation-like slow motion effect
 */
export const timeDilation = (factor = 0.5) => ({
  transition: {
    duration: 1 * factor,
    ease: 'linear',
  },
})

/**
 * Quantum Superposition
 * Creates superposition-like flickering
 */
export const quantumSuperposition = (states = 3) => {
  const opacityStates = []
  for (let i = 0; i < states; i++) {
    opacityStates.push(Math.random() > 0.5 ? 1 : 0.3)
  }
  opacityStates.push(1) // Return to normal
  
  return {
    opacity: opacityStates,
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }
}

/**
 * Get physics animation by name
 */
export const getPhysicsAnimation = (name, options = {}) => {
  const animations = {
    pendulum: () => pendulumMotion(options.amplitude, options.period),
    wave: () => waveMotion(options.amplitude, options.frequency),
    orbital: () => orbitalMotion(options.radius, options.duration),
    magnetic: () => magneticAttraction(options.strength),
    elastic: () => elasticBounce(options.intensity),
    gravity: () => gravityDrop(options.distance),
    momentum: () => momentumSlide(options.direction, options.distance),
    quantum: () => quantumFluctuation(options.intensity),
    trail: () => particleTrail(options.delay),
    field: () => fieldLineFlow(options.duration),
    resonance: () => resonance(options.amplitude, options.frequency),
    collision: () => collisionBounce(options.direction),
    pulse: () => magneticPulse(options.maxScale),
    interference: () => waveInterference(options.amplitude),
    dilation: () => timeDilation(options.factor),
    superposition: () => quantumSuperposition(options.states),
  }
  
  return animations[name] ? animations[name]() : null
}

