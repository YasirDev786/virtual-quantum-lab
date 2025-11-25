import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '../../context/ThemeContext'

/**
 * Quantum Tunneling Visualization Component
 * Visualizes particle wave function approaching, interacting with, and tunneling through a potential barrier
 */
export const QuantumTunnelingVisualization = ({
  particleEnergy = 1,
  barrierHeight = 2,
  barrierWidth = 1,
  barrierPosition = 0,
  particlePosition = -3,
  time = 0,
  showWaveFunction = true,
  showBarrier = true,
  showParticle = true,
  transmissionProbability = 0,
}) => {
  const { theme } = useTheme()
  const barrierRef = useRef()
  const particleRef = useRef()
  const tunneledParticleRef = useRef()
  
  const hbar = 1.0545718e-34
  const mass = 9.109e-31 // Electron mass (kg)
  const c = 3e8

  // Calculate wave function points
  const wavePoints = []
  const waveColors = []
  const pointCount = 200

  for (let i = 0; i < pointCount; i++) {
    const x = (i / pointCount) * 10 - 5 // Range from -5 to 5
    let amplitude = 0
    let probability = 0

    if (x < barrierPosition) {
      // Before barrier: incident wave
      const k = Math.sqrt(2 * mass * particleEnergy) / hbar
      amplitude = Math.cos(k * x - (particleEnergy * time) / hbar)
      probability = amplitude * amplitude
      waveColors.push(0.2, 0.6, 1) // Blue for incident
    } else if (x >= barrierPosition && x <= barrierPosition + barrierWidth) {
      // Inside barrier: exponential decay
      if (particleEnergy < barrierHeight) {
        const kappa = Math.sqrt(2 * mass * (barrierHeight - particleEnergy)) / hbar
        amplitude = Math.exp(-kappa * (x - barrierPosition))
        probability = amplitude * amplitude
      } else {
        const k = Math.sqrt(2 * mass * (particleEnergy - barrierHeight)) / hbar
        amplitude = Math.cos(k * (x - barrierPosition) - (particleEnergy * time) / hbar)
        probability = amplitude * amplitude
      }
      waveColors.push(1, 0.2, 0.2) // Red for barrier
    } else {
      // After barrier: transmitted wave
      const k = Math.sqrt(2 * mass * particleEnergy) / hbar
      amplitude = Math.sqrt(transmissionProbability) * Math.cos(k * x - (particleEnergy * time) / hbar)
      probability = amplitude * amplitude
      waveColors.push(0.2, 1, 0.2) // Green for transmitted
    }

    // Store point with probability as y-coordinate
    wavePoints.push(x, probability * 2, 0) // Scale probability for visibility
  }

  // Update particle position
  useFrame(() => {
    if (particleRef.current) {
      const speed = Math.sqrt(2 * particleEnergy / mass) * 0.1 // Scaled for visualization
      particleRef.current.position.x = particlePosition + speed * time
      
      // Pulse effect
      const scale = 1 + 0.2 * Math.sin(time * 5)
      particleRef.current.scale.set(scale, scale, scale)
    }

    if (tunneledParticleRef.current && transmissionProbability > 0.01) {
      // Show tunneled particle after barrier
      const speed = Math.sqrt(2 * particleEnergy / mass) * 0.1
      tunneledParticleRef.current.position.x = barrierPosition + barrierWidth + speed * (time - 2)
      tunneledParticleRef.current.visible = time > 2
      
      // Scale by transmission probability
      const scale = Math.sqrt(transmissionProbability)
      tunneledParticleRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group>
      {/* Wave Function Visualization */}
      {showWaveFunction && wavePoints.length > 0 && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={pointCount}
              array={new Float32Array(wavePoints)}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={pointCount}
              array={new Float32Array(waveColors)}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            vertexColors
            linewidth={3}
            transparent
            opacity={0.8}
          />
        </line>
      )}

      {/* Potential Barrier */}
      {showBarrier && (
        <mesh ref={barrierRef} position={[barrierPosition + barrierWidth / 2, 0, 0]}>
          <boxGeometry args={[barrierWidth, 3, 0.2]} />
          <meshStandardMaterial
            color={theme === 'dark' ? '#e74c3c' : '#c0392b'}
            transparent
            opacity={0.6}
            emissive={theme === 'dark' ? '#8b0000' : '#ff0000'}
            emissiveIntensity={0.3}
          />
        </mesh>
      )}

      {/* Incident Particle */}
      {showParticle && particlePosition < barrierPosition && (
        <mesh ref={particleRef} position={[particlePosition, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#3498db"
            emissive="#2980b9"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Tunneled Particle */}
      {showParticle && transmissionProbability > 0.01 && (
        <mesh ref={tunneledParticleRef} position={[barrierPosition + barrierWidth + 1, 0, 0]} visible={false}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#2ecc71"
            emissive="#27ae60"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Energy level indicator */}
      <mesh position={[-4.5, particleEnergy * 0.5, 0]}>
        <boxGeometry args={[0.1, particleEnergy, 0.1]} />
        <meshStandardMaterial color="#3498db" />
      </mesh>

      {/* Barrier height indicator */}
      <mesh position={[barrierPosition + barrierWidth / 2, barrierHeight * 0.5, 0]}>
        <boxGeometry args={[0.1, barrierHeight, 0.1]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
    </group>
  )
}

export default QuantumTunnelingVisualization

