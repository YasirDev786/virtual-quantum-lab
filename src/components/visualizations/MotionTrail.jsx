import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Motion Trail Component
 * Creates a fading trail effect for moving particles/objects
 * 
 * @param {Array} positions - Array of position objects {x, y, z} or Vector3
 * @param {string} color - Trail color (hex string or number)
 * @param {number} maxLength - Maximum number of trail points
 * @param {number} fadeSpeed - How quickly the trail fades (0-1)
 * @param {number} lineWidth - Width of the trail line
 */
export const MotionTrail = ({
  positions = [],
  color = '#4ecdc4',
  maxLength = 100,
  fadeSpeed = 0.95,
  lineWidth = 2,
}) => {
  const lineRef = useRef()
  const trailPointsRef = useRef([])
  const trailColorsRef = useRef([])

  // Update trail with new positions
  useEffect(() => {
    if (positions.length === 0) return

    const latestPosition = positions[positions.length - 1]
    const point = latestPosition instanceof THREE.Vector3
      ? latestPosition
      : new THREE.Vector3(latestPosition.x || 0, latestPosition.y || 0, latestPosition.z || 0)

    // Add new point
    trailPointsRef.current.push(point.clone())

    // Limit trail length
    if (trailPointsRef.current.length > maxLength) {
      trailPointsRef.current.shift()
    }

    // Update geometry
    if (lineRef.current && trailPointsRef.current.length > 1) {
      const geometry = new THREE.BufferGeometry().setFromPoints(trailPointsRef.current)
      
      // Create color array with fading opacity
      const colors = new Float32Array(trailPointsRef.current.length * 3)
      const colorObj = new THREE.Color(color)
      
      for (let i = 0; i < trailPointsRef.current.length; i++) {
        const age = i / trailPointsRef.current.length
        const opacity = Math.pow(age, 2) // Fade from 1 to 0
        const index = i * 3
        colors[index] = colorObj.r * opacity
        colors[index + 1] = colorObj.g * opacity
        colors[index + 2] = colorObj.b * opacity
      }

      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      
      if (lineRef.current.geometry) {
        lineRef.current.geometry.dispose()
      }
      lineRef.current.geometry = geometry
    }
  }, [positions, maxLength, color])

  // Fade trail over time
  useFrame(() => {
    if (lineRef.current && lineRef.current.geometry) {
      const colors = lineRef.current.geometry.attributes.color
      if (colors) {
        for (let i = 0; i < colors.count; i++) {
          colors.setX(i, colors.getX(i) * fadeSpeed)
          colors.setY(i, colors.getY(i) * fadeSpeed)
          colors.setZ(i, colors.getZ(i) * fadeSpeed)
        }
        colors.needsUpdate = true
      }
    }
  })

  if (trailPointsRef.current.length < 2) return null

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial
        vertexColors
        linewidth={lineWidth}
        transparent
        opacity={0.8}
      />
    </line>
  )
}

export default MotionTrail

