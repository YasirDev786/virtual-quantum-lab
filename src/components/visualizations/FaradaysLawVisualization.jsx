import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import ParameterControl from '../ParameterControl'
import { useTheme } from '../../context/ThemeContext'

/**
 * Faraday's Law Visualization - Multi-mode
 * Three simulation modes:
 * 1. Coil & Moving Magnet - Classic induction demo
 * 2. DC/AC Motor - Current through coil in magnetic field produces torque
 * 3. Generator - Rotating coil in magnetic field generates EMF
 *
 * Supports 2D (SVG) and 3D (Three.js) views
 * NOTE: Physics calculations are placeholders. Insert real formulas where marked.
 */
export const FaradaysLawVisualization = ({
  initialMode = 'coil', // 'coil', 'motor', 'generator'
  mode: externalMode = null, // If provided, use external mode control
  initialMagnetSpeed = 1,
  initialCoilTurns = 10,
  initialFieldStrength = 1,
  initialRotationSpeed = 1,
  magnetX: externalMagnetX = null, // External magnet position control
  angle: externalAngle = null, // External angle control
  onParamsChange = null,
}) => {
  const { theme } = useTheme()
  const [mode, setMode] = useState(externalMode || initialMode)
  const [view3D, setView3D] = useState(true) // Default to 3D for better visualization
  const [magnetSpeed, setMagnetSpeed] = useState(initialMagnetSpeed)
  const [coilTurns, setCoilTurns] = useState(initialCoilTurns)
  const [fieldStrength, setFieldStrength] = useState(initialFieldStrength)
  const [rotationSpeed, setRotationSpeed] = useState(initialRotationSpeed)
  const [current, setCurrent] = useState(0)

  // Use external state if provided, otherwise use internal state
  const [internalMagnetX, setInternalMagnetX] = useState(-120)
  const [internalAngle, setInternalAngle] = useState(0)
  const magnetX = externalMagnetX !== null ? externalMagnetX : internalMagnetX
  const angle = externalAngle !== null ? externalAngle : internalAngle
  
  const directionRef = useRef(1)
  const lastFluxRef = useRef(null)
  const [flux, setFlux] = useState(0)
  const [emf, setEmf] = useState(0)
  const [inducedCurrent, setInducedCurrent] = useState(0)
  
  // Sync external mode
  useEffect(() => {
    if (externalMode !== null) {
      setMode(externalMode)
    }
  }, [externalMode])

  // animation loop - behavior changes per mode (only if not externally controlled)
  useEffect(() => {
    if (externalMagnetX !== null || externalAngle !== null) {
      // External control, don't animate internally
      return
    }
    
    let raf = null
    let lastTime = performance.now()

    const animate = (t) => {
      const dt = (t - lastTime) / 1000
      lastTime = t

      if (mode === 'coil') {
        // Move magnet - simple oscillator between -120 and 120
        setInternalMagnetX((x) => {
          let next = x + directionRef.current * magnetSpeed * 60 * dt
          if (next > 120) {
            next = 120
            directionRef.current = -1
          } else if (next < -120) {
            next = -120
            directionRef.current = 1
          }
          return next
        })
      } else if (mode === 'motor' || mode === 'generator') {
        // Rotate coil continuously
        setInternalAngle((a) => (a + rotationSpeed * dt * 2 * Math.PI) % (2 * Math.PI))
      }

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [magnetSpeed, rotationSpeed, mode, externalMagnetX, externalAngle])

  // compute flux/emf/current for each mode
  useEffect(() => {
    const coilArea = Math.PI * (80 ** 2) // px^2 for visualization
    let newFlux = 0
    let dPhiDt = 0

    if (mode === 'coil') {
      // Coil mode: flux varies as magnet moves through coil
      const distance = Math.abs(magnetX)
      const overlapFactor = Math.exp(-Math.pow(distance / 80, 2))
      newFlux = fieldStrength * coilArea * overlapFactor * 1e-6
    } else if (mode === 'generator') {
      // Generator mode: flux = B·A·cos(θ)
      newFlux = fieldStrength * coilArea * Math.cos(angle) * 1e-6
    } else if (mode === 'motor') {
      // Motor mode: apply current, flux from external field
      newFlux = fieldStrength * coilArea * 1e-6
    }

    const now = performance.now()
    if (lastFluxRef.current && lastFluxRef.current.time) {
      const dt = (now - lastFluxRef.current.time) / 1000
      if (dt > 0) {
        dPhiDt = (newFlux - lastFluxRef.current.value) / dt
      }
    }
    lastFluxRef.current = { value: newFlux, time: now }

    // EMF: ε = -N * dΦ/dt (generator & coil modes)
    const newEmf = mode === 'motor' ? 0 : -coilTurns * dPhiDt

    // Current: in motor mode, we set it manually via slider; in others, I = ε/R
    const R = 1
    const newCurrent = mode === 'motor' ? current : newEmf / R

    setFlux(newFlux)
    setEmf(newEmf)
    setInducedCurrent(newCurrent)

    if (onParamsChange) {
      onParamsChange({ mode, magnetSpeed, coilTurns, fieldStrength, rotationSpeed, current, flux: newFlux, emf: newEmf, inducedCurrent: newCurrent, angle })
    }
  }, [magnetX, angle, coilTurns, fieldStrength, rotationSpeed, mode, current, onParamsChange])

  const coilColor = theme === 'dark' ? '#9b59b6' : '#6b46c1'
  const magnetColor = '#ef4444'
  const fieldColor = '#06b6d4'
  const currentColor = '#10b981'

  return (
    <div className="glass rounded-xl p-4">
      {/* Mode selector - only show if not externally controlled */}
      {externalMode === null && (
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { id: 'coil', label: 'Coil & Magnet', icon: '🧲' },
            { id: 'motor', label: 'Motor', icon: '⚙️' },
            { id: 'generator', label: 'Generator', icon: '🔋' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                mode === m.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {m.icon} {m.label}
            </button>
          ))}
          <button
            onClick={() => setView3D(!view3D)}
            className="ml-auto px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 transition-all"
          >
            {view3D ? '📐 2D View' : '🎲 3D View'}
          </button>
        </div>
      )}

      {externalMode === null && (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Visualization area - Internal control mode - show full UI */}
          <div className="flex-1 flex flex-col items-center" style={{ minWidth: 320 }}>
            <div className="relative w-full flex-1 flex items-center justify-center bg-gray-50 dark:bg-dark-800 rounded-lg" style={{ minHeight: 360 }}>
              {view3D ? (
                <Canvas className="w-full h-[360px]">
                  <PerspectiveCamera makeDefault position={[0, 3, 5]} />
                  <OrbitControls enablePan={false} />
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  
                  {mode === 'coil' && <CoilMagnet3D magnetX={magnetX / 40} coilColor={coilColor} magnetColor={magnetColor} fieldColor={fieldColor} />}
                  {mode === 'motor' && <Motor3D angle={angle} current={inducedCurrent} coilColor={coilColor} fieldColor={fieldColor} />}
                  {mode === 'generator' && <Generator3D angle={angle} coilColor={coilColor} fieldColor={fieldColor} />}
                </Canvas>
              ) : (
                <svg viewBox="-220 -160 440 320" className="w-full h-[360px]">
                  {mode === 'coil' && <CoilMagnet2D magnetX={magnetX} coilColor={coilColor} magnetColor={magnetColor} fieldColor={fieldColor} />}
                  {mode === 'motor' && <Motor2D angle={angle} current={inducedCurrent} coilColor={coilColor} fieldColor={fieldColor} currentColor={currentColor} />}
                  {mode === 'generator' && <Generator2D angle={angle} coilColor={coilColor} fieldColor={fieldColor} currentColor={currentColor} />}
                </svg>
              )}
            </div>

            {/* Numeric readouts */}
            <div className="w-full mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 glass rounded-md">
                <div className="text-xs text-gray-500">Magnetic Flux</div>
                <div className="font-semibold">{flux.toExponential(3)} Wb</div>
              </div>
              <div className="p-2 glass rounded-md">
                <div className="text-xs text-gray-500">EMF (ε)</div>
                <div className="font-semibold">{emf.toExponential(3)} V</div>
              </div>
              <div className="p-2 glass rounded-md">
                <div className="text-xs text-gray-500">Current</div>
                <div className="font-semibold">{inducedCurrent.toExponential(3)} A</div>
              </div>
            </div>
          </div>

          {/* Controls - only show if not externally controlled */}
          <div className="w-full lg:w-[320px]">
            <div className="space-y-4">
              {mode === 'coil' && (
                <ParameterControl
                  label="Magnet Speed"
                  value={magnetSpeed}
                  onChange={(v) => setMagnetSpeed(v)}
                  min={0}
                  max={5}
                  step={0.1}
                />
              )}

              {(mode === 'motor' || mode === 'generator') && (
                <ParameterControl
                  label="Rotation Speed (Hz)"
                  value={rotationSpeed}
                  onChange={(v) => setRotationSpeed(v)}
                  min={0}
                  max={10}
                  step={0.1}
                />
              )}

              <ParameterControl
                label="Coil Turns (N)"
                value={coilTurns}
                onChange={(v) => setCoilTurns(Math.max(1, Math.round(v)))}
                min={1}
                max={200}
                step={1}
                type="input"
              />

              <ParameterControl
                label="Magnetic Field Strength (B)"
                value={fieldStrength}
                onChange={(v) => setFieldStrength(v)}
                min={0}
                max={5}
                step={0.1}
              />

              {mode === 'motor' && (
                <ParameterControl
                  label="Applied Current (A)"
                  value={current}
                  onChange={(v) => setCurrent(v)}
                  min={-5}
                  max={5}
                  step={0.1}
                />
              )}

              <div className="glass rounded-xl p-4 text-sm">
                <div className="font-semibold mb-2">Mode: {mode === 'coil' ? 'Coil & Magnet' : mode === 'motor' ? 'Motor' : 'Generator'}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  {mode === 'coil' && (
                    <>
                      <div>• Moving magnet induces EMF</div>
                      <div>• Flux: Φ ≈ B·A·overlap</div>
                      <div>• EMF: ε = -N·dΦ/dt</div>
                    </>
                  )}
                  {mode === 'motor' && (
                    <>
                      <div>• Current → Torque → Rotation</div>
                      <div>• Torque: τ = N·I·A·B·sin(θ)</div>
                      <div>• Force on conductors in field</div>
                    </>
                  )}
                  {mode === 'generator' && (
                    <>
                      <div>• Rotation → Changing Flux → EMF</div>
                      <div>• Flux: Φ = B·A·cos(θ)</div>
                      <div>• EMF: ε = -N·ω·B·A·sin(θ)</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============== 2D SVG Sub-components ==============
const CoilMagnet2D = ({ magnetX, coilColor, magnetColor, fieldColor }) => (
  <>
    {/* Coil - concentric circles */}
    <g>
      {[...Array(6)].map((_, i) => (
        <circle key={i} cx={0} cy={0} r={40 + i * 6} fill="none" stroke={coilColor} strokeWidth={1} opacity={0.9 - i * 0.1} />
      ))}
    </g>

    {/* Magnet (moving horizontally) */}
    <g transform={`translate(${magnetX}, 0)`}>
      <rect x={-20} y={-30} width={40} height={60} rx={6} fill={magnetColor} opacity={0.9} />
      <text x={0} y={-5} textAnchor="middle" fill="#fff" fontSize="10">N</text>
      <text x={0} y={15} textAnchor="middle" fill="#fff" fontSize="10">S</text>
    </g>

    {/* Magnetic field vectors */}
    <g>
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2
        const mx = magnetX
        const my = 0
        const len = 30 + Math.sin((Date.now() / 200) + i) * 6
        const x2 = mx + Math.cos(angle) * len
        const y2 = my + Math.sin(angle) * len
        return <line key={i} x1={mx} y1={my} x2={x2} y2={y2} stroke={fieldColor} strokeWidth={1.5} opacity={0.6} />
      })}
    </g>
  </>
)

const Motor2D = ({ angle, current, coilColor, fieldColor, currentColor }) => (
  <>
    {/* External magnetic field (horizontal arrows) */}
    <g>
      {[-100, -50, 0, 50, 100].map((y) => (
        <g key={y}>
          <line x1={-150} y1={y} x2={150} y2={y} stroke={fieldColor} strokeWidth={1} opacity={0.3} />
          <polygon points="145,{y} 150,{y} 145,{y+3}" fill={fieldColor} opacity={0.3} />
        </g>
      ))}
    </g>

    {/* Rotating coil */}
    <g transform={`rotate(${(angle * 180) / Math.PI})`}>
      <rect x={-60} y={-40} width={120} height={80} fill="none" stroke={coilColor} strokeWidth={3} rx={4} />
      {/* Current direction arrows */}
      {current !== 0 && (
        <>
          <line x1={-60} y1={0} x2={60} y2={0} stroke={currentColor} strokeWidth={2} />
          <polygon points={current > 0 ? '56,0 60,0 56,3' : '-56,0 -60,0 -56,3'} fill={currentColor} />
        </>
      )}
    </g>

    {/* Rotation axis */}
    <circle cx={0} cy={0} r={8} fill="#333" />
  </>
)

const Generator2D = ({ angle, coilColor, fieldColor, currentColor }) => (
  <>
    {/* External magnetic field (vertical) */}
    <g>
      {[-100, -50, 0, 50, 100].map((x) => (
        <g key={x}>
          <line x1={x} y1={-120} x2={x} y2={120} stroke={fieldColor} strokeWidth={1} opacity={0.3} />
          <polygon points={`${x},115 ${x},120 ${x+3},115`} fill={fieldColor} opacity={0.3} />
        </g>
      ))}
    </g>

    {/* Rotating coil */}
    <g transform={`rotate(${(angle * 180) / Math.PI})`}>
      <rect x={-60} y={-40} width={120} height={80} fill="none" stroke={coilColor} strokeWidth={3} rx={4} />
      {/* Induced current indication */}
      <line x1={-60} y1={0} x2={60} y2={0} stroke={currentColor} strokeWidth={2} opacity={0.7} />
      <polygon points="56,0 60,0 56,3" fill={currentColor} opacity={0.7} />
    </g>

    {/* Rotation axis */}
    <circle cx={0} cy={0} r={8} fill="#333" />
  </>
)

// ============== 3D Three.js Sub-components ==============
const CoilMagnet3D = ({ magnetX, coilColor, magnetColor, fieldColor }) => {
  // magnetX is already scaled when passed from page component
  const scaledX = magnetX
  return (
    <group>
      {/* Coil as torus */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1, 0.1, 16, 32]} />
        <meshStandardMaterial color={coilColor} />
      </mesh>

      {/* Magnet as box */}
      <mesh position={[scaledX, 0, 0]}>
        <boxGeometry args={[0.4, 0.8, 0.3]} />
        <meshStandardMaterial color={magnetColor} />
      </mesh>

      {/* Field lines (simple spheres) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const ang = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} position={[scaledX + Math.cos(ang) * 0.8, Math.sin(ang) * 0.8, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={fieldColor} opacity={0.5} transparent />
          </mesh>
        )
      })}
    </group>
  )
}

const Motor3D = ({ angle, current, coilColor, fieldColor }) => (
  <group>
    {/* External field (placeholder arrows) */}
    {[-1.5, -0.5, 0.5, 1.5].map((z) => (
      <mesh key={z} position={[0, 0, z]}>
        <coneGeometry args={[0.1, 0.4, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshBasicMaterial color={fieldColor} opacity={0.3} transparent />
      </mesh>
    ))}

    {/* Rotating coil */}
    <group rotation={[0, angle, 0]}>
      <mesh>
        <torusGeometry args={[1, 0.08, 16, 32]} />
        <meshStandardMaterial color={coilColor} />
      </mesh>
    </group>

    {/* Axis */}
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 3, 16]} rotation={[0, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  </group>
)

const Generator3D = ({ angle, coilColor, fieldColor }) => (
  <group>
    {/* Field */}
    {[-1.5, -0.5, 0.5, 1.5].map((x) => (
      <mesh key={x} position={[x, 0, 0]}>
        <coneGeometry args={[0.1, 0.4, 8]} rotation={[0, 0, -Math.PI / 2]} />
        <meshBasicMaterial color={fieldColor} opacity={0.3} transparent />
      </mesh>
    ))}

    {/* Rotating coil */}
    <group rotation={[0, angle, 0]}>
      <mesh>
        <torusGeometry args={[1, 0.08, 16, 32]} />
        <meshStandardMaterial color={coilColor} />
      </mesh>
    </group>

    {/* Axis */}
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 3, 16]} rotation={[0, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  </group>
)

// Export 3D-only component for use in Canvas
export const FaradaysLaw3DVisualization = ({ mode, angle, current, secondaryVoltage, panTemperature, theme = 'light' }) => {
  const coilColor = theme === 'dark' ? '#9b59b6' : '#6b46c1'
  const magnetColor = '#ef4444'
  const fieldColor = '#06b6d4'
  
  return (
    <group>
      {mode === 'generator' && <Generator3D angle={angle} coilColor={coilColor} fieldColor={fieldColor} />}
      {mode === 'transformer' && <Transformer3D current={current} secondaryVoltage={secondaryVoltage} coilColor={coilColor} fieldColor={fieldColor} />}
      {mode === 'induction-cooktop' && <InductionCooktop3D current={current} panTemperature={panTemperature} coilColor={coilColor} fieldColor={fieldColor} />}
    </group>
  )
}

// Transformer 3D Component
const Transformer3D = ({ current, secondaryVoltage, coilColor, fieldColor }) => (
  <group>
    {/* Primary coil (left) */}
    <mesh position={[-1.5, 0, 0]}>
      <torusGeometry args={[0.8, 0.08, 16, 32]} />
      <meshStandardMaterial color={coilColor} />
    </mesh>
    
    {/* Secondary coil (right) */}
    <mesh position={[1.5, 0, 0]}>
      <torusGeometry args={[0.8, 0.08, 16, 32]} />
      <meshStandardMaterial color={coilColor} />
    </mesh>
    
    {/* Magnetic flux lines linking the coils */}
    {Array.from({ length: 8 }).map((_, i) => {
      const t = i / 7
      const x = -1.5 + t * 3
      const y = Math.sin(t * Math.PI) * 0.5
      return (
        <mesh key={i} position={[x, y, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={fieldColor} opacity={0.6} transparent />
        </mesh>
      )
    })}
    
    {/* Core (iron core linking coils) */}
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[3.5, 0.3, 0.3]} />
      <meshStandardMaterial color="#888888" />
    </mesh>
  </group>
)

// Induction Cooktop 3D Component
const InductionCooktop3D = ({ current, panTemperature, coilColor, fieldColor }) => {
  // Temperature affects pan color (red when hot)
  const panColor = panTemperature > 100 
    ? `rgb(${255}, ${Math.max(0, 255 - (panTemperature - 100) * 2)}, 0)`
    : '#cccccc'
  
  return (
    <group>
      {/* Coil beneath pan */}
      <mesh position={[0, -0.3, 0]}>
        <torusGeometry args={[0.6, 0.05, 16, 32]} />
        <meshStandardMaterial color={coilColor} emissive={coilColor} emissiveIntensity={0.3} />
      </mesh>
      
      {/* Pan above coil */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
        <meshStandardMaterial color={panColor} emissive={panColor} emissiveIntensity={panTemperature > 100 ? 0.5 : 0} />
      </mesh>
      
      {/* Field lines passing into the pan */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const radius = 0.4 + Math.sin(current * 10) * 0.1
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = -0.1 + (i % 3) * 0.1
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={fieldColor} opacity={0.7} transparent />
          </mesh>
        )
      })}
      
      {/* Induced current visualization (glowing pattern) */}
      {panTemperature > 50 && (
        <mesh position={[0, 0.25, 0]}>
          <ringGeometry args={[0.3, 0.6, 32]} />
          <meshBasicMaterial color="#ffaa00" opacity={0.4} transparent />
        </mesh>
      )}
    </group>
  )
}

export default FaradaysLawVisualization

