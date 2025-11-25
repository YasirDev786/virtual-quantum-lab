import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '../../context/ThemeContext'

/**
 * Spacetime Diagram Visualization Component
 * Visualizes Minkowski spacetime diagrams showing worldlines, light cones, and Lorentz transformations
 */
export const SpacetimeDiagramVisualization = ({
  velocity = 0.5, // β = v/c
  observerPosition = { x: 0, t: 0 },
  showWorldlines = true,
  showLightCones = true,
  showGrid = true,
  showLorentzTransform = true,
}) => {
  const { theme } = useTheme()
  const axesRef = useRef()

  const c = 1 // Normalized speed of light (c = 1 in natural units)
  const beta = velocity
  const gamma = 1 / Math.sqrt(1 - beta * beta)

  // Grid will be rendered as a group of lines
  const gridSize = 10
  const step = 1

  // Light cone points
  const coneSize = 5
  const lightConePoints = []
  
  if (showLightCones) {
    // Future light cone (ct = x)
    for (let x = 0; x <= coneSize; x += 0.1) {
      lightConePoints.push(new THREE.Vector3(x, x, 0))
      lightConePoints.push(new THREE.Vector3(-x, x, 0))
    }
    // Past light cone (ct = -x)
    for (let x = 0; x <= coneSize; x += 0.1) {
      lightConePoints.push(new THREE.Vector3(x, -x, 0))
      lightConePoints.push(new THREE.Vector3(-x, -x, 0))
    }
  }

  // Worldline points
  const worldlineLength = 8
  const worldlinePoints = []
  
  if (showWorldlines) {
    // Stationary observer worldline (vertical line at x=0)
    for (let t = -worldlineLength / 2; t <= worldlineLength / 2; t += 0.1) {
      worldlinePoints.push(new THREE.Vector3(0, t, 0))
    }
    // Moving observer worldline (slanted line)
    if (showLorentzTransform && beta !== 0) {
      for (let t = -worldlineLength / 2; t <= worldlineLength / 2; t += 0.1) {
        const x = beta * t // Worldline of moving observer
        worldlinePoints.push(new THREE.Vector3(x, t, 0))
      }
    }
  }

  // Update axes
  useFrame(() => {
    if (axesRef.current) {
      // Rotate axes based on Lorentz transformation
      if (showLorentzTransform && beta !== 0) {
        const angle = Math.atan(beta)
        axesRef.current.rotation.z = angle
      } else {
        axesRef.current.rotation.z = 0
      }
    }
  })

  const gridColor = theme === 'dark' ? 0x444444 : 0xcccccc
  const lightConeColor = theme === 'dark' ? 0xffaa00 : 0xff8800
  const worldlineColor = theme === 'dark' ? 0x3498db : 0x2980b9

  return (
    <group>
      {/* Grid */}
      {showGrid && (
        <group>
          {/* Vertical grid lines (space) */}
          {Array.from({ length: Math.floor(gridSize * 2 / step) + 1 }, (_, i) => {
            const x = -gridSize + i * step
            return (
              <line key={`v-${x}`}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([x, -gridSize, 0, x, gridSize, 0])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color={gridColor} opacity={0.3} transparent />
              </line>
            )
          })}
          {/* Horizontal grid lines (time) */}
          {Array.from({ length: Math.floor(gridSize * 2 / step) + 1 }, (_, i) => {
            const t = -gridSize + i * step
            return (
              <line key={`h-${t}`}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([-gridSize, t, 0, gridSize, t, 0])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color={gridColor} opacity={0.3} transparent />
              </line>
            )
          })}
        </group>
      )}

      {/* Light Cones */}
      {showLightCones && lightConePoints.length > 0 && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={lightConePoints.length}
              array={new Float32Array(lightConePoints.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={lightConeColor} linewidth={2} />
        </line>
      )}

      {/* Worldlines */}
      {showWorldlines && worldlinePoints.length > 0 && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={worldlinePoints.length}
              array={new Float32Array(worldlinePoints.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={worldlineColor} linewidth={3} />
        </line>
      )}

      {/* Coordinate Axes */}
      <group>
        {/* Space axis (x) - stationary frame */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([-10, 0, 0, 10, 0, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={theme === 'dark' ? 0xffffff : 0x000000} />
        </line>
        {/* Time axis (ct) - stationary frame */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, -10, 0, 0, 10, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={theme === 'dark' ? 0xffffff : 0x000000} />
        </line>
        {/* Transformed axes (if Lorentz transform is shown) */}
        {showLorentzTransform && beta !== 0 && (
          <group ref={axesRef}>
            {/* Space axis (x') - moving frame */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([-10, 0, 0, 10, 0, 0])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color={theme === 'dark' ? 0xff6b6b : 0xff0000} opacity={0.6} transparent />
            </line>
            {/* Time axis (ct') - moving frame */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([0, -10, 0, 0, 10, 0])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color={theme === 'dark' ? 0xff6b6b : 0xff0000} opacity={0.6} transparent />
            </line>
          </group>
        )}
      </group>

      {/* Observer position marker */}
      <mesh position={[observerPosition.x, observerPosition.t, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#e74c3c" emissive="#c0392b" emissiveIntensity={0.5} />
      </mesh>

      {/* Labels (using HTML overlay would be better, but for 3D we use sprites or ignore) */}
    </group>
  )
}

export default SpacetimeDiagramVisualization

