import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Electric Field Visualization Component
 * Displays charges, field lines, and vector field
 */
export const ElectricFieldVisualization = ({ 
  charges = [],
  fieldData = [],
  showFieldLines = true,
  showVectors = true 
}) => {
  const fieldLinesRef = useRef([])
  const groupRef = useRef(new THREE.Group())

  // Enhanced field line calculation using electric field equations
  const calculateFieldLine = (startPoint, charges, maxSteps = 200, stepSize = 0.1) => {
    const points = [new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z)]
    const k = 8.99e9 // Coulomb's constant
    
    for (let step = 0; step < maxSteps; step++) {
      const currentPoint = points[points.length - 1]
      let fieldX = 0, fieldY = 0, fieldZ = 0
      
      // Calculate total electric field at current point
      charges.forEach((charge) => {
        const dx = currentPoint.x - charge.position.x
        const dy = currentPoint.y - charge.position.y
        const dz = (currentPoint.z || 0) - (charge.position.z || 0)
        const distanceSq = dx * dx + dy * dy + dz * dz
        const distance = Math.sqrt(distanceSq)
        
        if (distance < 0.3) return // Too close to charge
        
        const fieldMagnitude = (k * charge.q) / distanceSq
        fieldX += fieldMagnitude * (dx / distance)
        fieldY += fieldMagnitude * (dy / distance)
        fieldZ += fieldMagnitude * (dz / distance)
      })
      
      // Normalize and step along field direction
      const fieldMagnitude = Math.sqrt(fieldX * fieldX + fieldY * fieldY + fieldZ * fieldZ)
      if (fieldMagnitude < 0.01) break // Field too weak
      
      const direction = new THREE.Vector3(fieldX / fieldMagnitude, fieldY / fieldMagnitude, fieldZ / fieldMagnitude)
      const nextPoint = currentPoint.clone().add(direction.multiplyScalar(stepSize))
      
      // Check if too far or too close to any charge
      let tooClose = false
      charges.forEach((charge) => {
        const dist = nextPoint.distanceTo(new THREE.Vector3(charge.position.x, charge.position.y, charge.position.z))
        if (dist < 0.3) tooClose = true
      })
      
      if (tooClose || Math.abs(nextPoint.x) > 15 || Math.abs(nextPoint.y) > 15) break
      
      points.push(nextPoint)
    }
    
    return points
  }

  // Create enhanced field lines
  useEffect(() => {
    // Clear existing lines
    groupRef.current.clear()
    fieldLinesRef.current = []

    if (!showFieldLines || charges.length === 0) return

    // Generate field lines from each charge
    charges.forEach((charge, chargeIndex) => {
      const numLines = charge.q > 0 ? 16 : 16 // More lines for better visualization
      const chargeSign = charge.q > 0 ? 1 : -1
      
      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2
        const startRadius = 0.5
        const startPoint = {
          x: charge.position.x + startRadius * Math.cos(angle),
          y: charge.position.y + startRadius * Math.sin(angle),
          z: charge.position.z || 0,
        }
        
        // Calculate field line using physics equations
        const points = calculateFieldLine(startPoint, charges)
        
        if (points.length < 2) continue
        
        // Create line with gradient color (stronger near charge)
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const colors = new Float32Array(points.length * 3)
        const baseColor = new THREE.Color(charge.q > 0 ? 0xff4444 : 0x4444ff)
        
        points.forEach((point, idx) => {
          const distance = point.distanceTo(new THREE.Vector3(charge.position.x, charge.position.y, charge.position.z))
          const intensity = Math.max(0.3, 1 - distance / 10) // Fade with distance
          const index = idx * 3
          colors[index] = baseColor.r * intensity
          colors[index + 1] = baseColor.g * intensity
          colors[index + 2] = baseColor.b * intensity
        })
        
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        
        const material = new THREE.LineBasicMaterial({ 
          vertexColors: true,
          opacity: 0.7,
          transparent: true,
          linewidth: 2,
        })
        const line = new THREE.Line(geometry, material)
        groupRef.current.add(line)
        fieldLinesRef.current.push(line)
      }
    })
  }, [charges, showFieldLines])

  return (
    <>
      {/* Render charges */}
      {charges.map((charge, index) => (
        <mesh 
          key={`charge-${index}`}
          position={[charge.position.x, charge.position.y, charge.position.z]}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color={charge.q > 0 ? '#ff4444' : '#4444ff'}
            emissive={charge.q > 0 ? '#ff4444' : '#4444ff'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Render field lines */}
      {showFieldLines && <primitive object={groupRef.current} />}

      {/* Render vector field */}
      {showVectors && fieldData.map((field, index) => {
        if (field.magnitude < 0.1) return null
        const direction = new THREE.Vector3(field.x, field.y, field.z).normalize()
        const origin = new THREE.Vector3(field.point.x, field.point.y, field.point.z)
        const length = Math.min(field.magnitude * 0.3, 1)
        const arrow = new THREE.ArrowHelper(direction, origin, length, 0xffff00, 0.05, 0.03)
        return (
          <primitive key={`vector-${index}`} object={arrow} />
        )
      })}
    </>
  )
}

export default ElectricFieldVisualization

