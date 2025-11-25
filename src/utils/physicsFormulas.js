/**
 * Physics Formulas Module
 * Real-time physics calculations for Experiment Builder
 */

/**
 * Classical Mechanics Formulas
 */
export const ClassicalFormulas = {
  // Projectile Motion
  projectileRange: (velocity, angle, gravity = 9.8) => {
    const angleRad = (angle * Math.PI) / 180
    return (velocity * velocity * Math.sin(2 * angleRad)) / gravity
  },

  projectileMaxHeight: (velocity, angle, gravity = 9.8) => {
    const angleRad = (angle * Math.PI) / 180
    return (velocity * velocity * Math.sin(angleRad) * Math.sin(angleRad)) / (2 * gravity)
  },

  projectileTimeOfFlight: (velocity, angle, gravity = 9.8) => {
    const angleRad = (angle * Math.PI) / 180
    return (2 * velocity * Math.sin(angleRad)) / gravity
  },

  // Energy
  kineticEnergy: (mass, velocity) => {
    const speed = typeof velocity === 'number' 
      ? velocity 
      : Math.sqrt((velocity.x || 0) ** 2 + (velocity.y || 0) ** 2 + (velocity.z || 0) ** 2)
    return 0.5 * mass * speed * speed
  },

  potentialEnergy: (mass, height, gravity = 9.8) => {
    return mass * gravity * height
  },

  // Force
  force: (mass, acceleration) => {
    return mass * acceleration
  },

  // Momentum
  momentum: (mass, velocity) => {
    return {
      x: mass * (velocity.x || 0),
      y: mass * (velocity.y || 0),
      z: mass * (velocity.z || 0),
    }
  },
}

/**
 * Electromagnetism Formulas
 */
export const ElectromagnetismFormulas = {
  // Electric Field
  electricField: (charge, distance) => {
    const k = 8.99e9 // Coulomb's constant
    return (k * charge) / (distance * distance)
  },

  // Electric Force (Coulomb's Law)
  coulombForce: (q1, q2, distance) => {
    const k = 8.99e9
    return (k * q1 * q2) / (distance * distance)
  },

  // Electric Potential
  electricPotential: (charge, distance) => {
    const k = 8.99e9
    return (k * charge) / distance
  },

  // Magnetic Field (from current)
  magneticFieldFromCurrent: (current, distance) => {
    const mu0 = 4 * Math.PI * 1e-7
    return (mu0 * current) / (2 * Math.PI * distance)
  },

  // Lorentz Force
  lorentzForce: (charge, velocity, electricField, magneticField) => {
    const electricForce = {
      x: charge * (electricField.x || 0),
      y: charge * (electricField.y || 0),
      z: charge * (electricField.z || 0),
    }

    const v = velocity || { x: 0, y: 0, z: 0 }
    const B = magneticField || { x: 0, y: 0, z: 0 }
    
    const magneticForce = {
      x: charge * (v.y * B.z - v.z * B.y),
      y: charge * (v.z * B.x - v.x * B.z),
      z: charge * (v.x * B.y - v.y * B.x),
    }

    return {
      x: electricForce.x + magneticForce.x,
      y: electricForce.y + magneticForce.y,
      z: electricForce.z + magneticForce.z,
    }
  },
}

/**
 * Waves & Optics Formulas
 */
export const WavesOpticsFormulas = {
  // Wave properties
  waveSpeed: (frequency, wavelength) => {
    return frequency * wavelength
  },

  waveFrequency: (speed, wavelength) => {
    return speed / wavelength
  },

  waveWavelength: (speed, frequency) => {
    return speed / frequency
  },

  // Interference
  pathDifference: (distance1, distance2) => {
    return Math.abs(distance1 - distance2)
  },

  interferencePhase: (pathDifference, wavelength) => {
    return (2 * Math.PI * pathDifference) / wavelength
  },

  interferenceAmplitude: (amplitude1, amplitude2, phase) => {
    return Math.sqrt(
      amplitude1 * amplitude1 +
      amplitude2 * amplitude2 +
      2 * amplitude1 * amplitude2 * Math.cos(phase)
    )
  },

  // Diffraction
  diffractionAngle: (wavelength, slitWidth, order = 1) => {
    return Math.asin((order * wavelength) / slitWidth)
  },

  // Refraction (Snell's Law)
  snellsLaw: (n1, n2, angle1) => {
    const angle1Rad = (angle1 * Math.PI) / 180
    const sinAngle2 = (n1 / n2) * Math.sin(angle1Rad)
    return Math.asin(sinAngle2) * (180 / Math.PI)
  },
}

/**
 * Quantum Mechanics Formulas
 */
export const QuantumFormulas = {
  // De Broglie wavelength
  deBroglieWavelength: (momentum) => {
    const h = 6.626e-34 // Planck's constant
    return h / momentum
  },

  // Energy of photon
  photonEnergy: (frequency) => {
    const h = 6.626e-34
    return h * frequency
  },

  // Uncertainty principle (minimum uncertainty)
  uncertaintyPrinciple: (uncertaintyX, uncertaintyP) => {
    const hbar = 1.0545718e-34
    return uncertaintyX * uncertaintyP >= hbar / 2
  },

  // Quantum tunneling probability (simplified)
  tunnelingProbability: (energy, barrierHeight, barrierWidth, mass) => {
    if (energy >= barrierHeight) return 1
    
    const hbar = 1.0545718e-34
    const kappa = Math.sqrt(2 * mass * (barrierHeight - energy)) / hbar
    return Math.exp(-2 * kappa * barrierWidth)
  },
}

/**
 * Relativity Formulas
 */
export const RelativityFormulas = {
  // Lorentz factor
  gamma: (velocity, c = 3e8) => {
    const beta = velocity / c
    return 1 / Math.sqrt(1 - beta * beta)
  },

  // Time dilation
  timeDilation: (properTime, velocity, c = 3e8) => {
    const gamma = RelativityFormulas.gamma(velocity, c)
    return gamma * properTime
  },

  // Length contraction
  lengthContraction: (properLength, velocity, c = 3e8) => {
    const gamma = RelativityFormulas.gamma(velocity, c)
    return properLength / gamma
  },

  // Relativistic momentum
  relativisticMomentum: (mass, velocity, c = 3e8) => {
    const gamma = RelativityFormulas.gamma(velocity, c)
    return gamma * mass * velocity
  },

  // Relativistic energy
  relativisticEnergy: (mass, velocity, c = 3e8) => {
    const gamma = RelativityFormulas.gamma(velocity, c)
    return gamma * mass * c * c
  },
}

/**
 * Get formula result based on formula name and parameters
 * @param {string} category - Formula category (classical, electromagnetism, etc.)
 * @param {string} formulaName - Name of the formula
 * @param {Object} params - Parameters for the formula
 * @returns {any} Formula result
 */
export const calculateFormula = (category, formulaName, params) => {
  const categories = {
    classical: ClassicalFormulas,
    electromagnetism: ElectromagnetismFormulas,
    waves: WavesOpticsFormulas,
    quantum: QuantumFormulas,
    relativity: RelativityFormulas,
  }

  const formulaSet = categories[category]
  if (!formulaSet || !formulaSet[formulaName]) {
    console.warn(`Formula not found: ${category}.${formulaName}`)
    return null
  }

  try {
    return formulaSet[formulaName](...Object.values(params))
  } catch (error) {
    console.error(`Error calculating formula ${category}.${formulaName}:`, error)
    return null
  }
}

export default {
  ClassicalFormulas,
  ElectromagnetismFormulas,
  WavesOpticsFormulas,
  QuantumFormulas,
  RelativityFormulas,
  calculateFormula,
}

