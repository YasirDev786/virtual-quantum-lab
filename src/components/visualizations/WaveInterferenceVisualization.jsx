import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Wave Interference Visualization Component
 * Displays animated wavefronts and interference patterns
 */
export const WaveInterferenceVisualization = ({ 
  sources = [],
  waveData = [],
  time = 0,
  showInterference = true 
}) => {
  const waveMeshRef = useRef()
  const sourcesRef = useRef([])

  // Enhanced interference pattern calculation
  const calculateInterference = (x, y, sources, time) => {
    let totalAmplitude = 0
    let totalIntensity = 0
    const phases = []

    sources.forEach((source) => {
      const dx = x - source.position.x
      const dy = y - source.position.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Wave phase: 2π(distance/λ - frequency*time + phase)
      const phase = 2 * Math.PI * (distance / source.wavelength - source.frequency * time) + (source.phase || 0)
      phases.push(phase)
      
      // Amplitude decreases with distance (1/r for spherical waves)
      const amplitudeAtPoint = source.amplitude / (1 + distance * 0.1)
      totalAmplitude += amplitudeAtPoint * Math.sin(phase)
    })

    // Calculate interference intensity (amplitude squared)
    if (sources.length > 1) {
      // Constructive and destructive interference
      let realPart = 0
      let imagPart = 0
      
      sources.forEach((source, idx) => {
        const dx = x - source.position.x
        const dy = y - source.position.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const amplitudeAtPoint = source.amplitude / (1 + distance * 0.1)
        const phase = phases[idx]
        
        realPart += amplitudeAtPoint * Math.cos(phase)
        imagPart += amplitudeAtPoint * Math.sin(phase)
      })
      
      totalIntensity = realPart * realPart + imagPart * imagPart
    } else {
      totalIntensity = totalAmplitude * totalAmplitude
    }

    return {
      amplitude: totalAmplitude,
      intensity: totalIntensity,
    }
  }

  // Create enhanced wave mesh with better interference patterns
  useEffect(() => {
    if (!waveMeshRef.current) return

    const size = 20
    const segments = 150 // Higher resolution for better patterns
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
    
    // Update vertices based on enhanced wave interference
    const positions = geometry.attributes.position
    const colors = new Float32Array(positions.count * 3)
    let maxIntensity = 0
    const intensities = []

    // First pass: calculate all intensities
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const result = calculateInterference(x, y, sources, time)
      intensities.push(result.intensity)
      maxIntensity = Math.max(maxIntensity, result.intensity)
    }

    // Second pass: set colors based on intensity (interference pattern)
    for (let i = 0; i < positions.count; i++) {
      const normalizedIntensity = maxIntensity > 0 ? intensities[i] / maxIntensity : 0
      
      // Create interference pattern colors (bright for constructive, dark for destructive)
      // Use a colormap that shows interference fringes
      const hue = (normalizedIntensity * 240) % 360 // Blue to cyan gradient
      const saturation = 0.8
      const brightness = 0.3 + normalizedIntensity * 0.7
      
      const color = new THREE.Color()
      color.setHSL(hue / 360, saturation, brightness)
      
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    if (waveMeshRef.current.geometry) {
      waveMeshRef.current.geometry.dispose()
    }
    waveMeshRef.current.geometry = geometry
  }, [sources, time, showInterference])

  // Animate wave with enhanced interference
  useFrame((state) => {
    if (waveMeshRef.current && sources.length > 0) {
      const positions = waveMeshRef.current.geometry.attributes.position
      const currentTime = state.clock.elapsedTime
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = positions.getY(i)
        
        let z = 0
        sources.forEach((source) => {
          const dx = x - source.position.x
          const dy = y - source.position.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // Enhanced wave calculation with distance attenuation
          const amplitudeAtPoint = source.amplitude / (1 + distance * 0.1)
          const phase = 2 * Math.PI * (distance / source.wavelength - source.frequency * currentTime) + (source.phase || 0)
          z += amplitudeAtPoint * Math.sin(phase)
        })
        
        positions.setZ(i, z * 0.15) // Scale for better visualization
      }
      
      positions.needsUpdate = true
    }
  })

  return (
    <>
      {/* Wave surface */}
      <mesh ref={waveMeshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <bufferGeometry />
        <meshStandardMaterial 
          vertexColors
          wireframe={false}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Wave sources */}
      {sources.map((source, index) => (
        <mesh 
          key={`source-${index}`}
          position={[source.position.x, source.position.y, 0.5]}
        >
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial 
            color="#4ecdc4"
            emissive="#4ecdc4"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </>
  )
}

export default WaveInterferenceVisualization

