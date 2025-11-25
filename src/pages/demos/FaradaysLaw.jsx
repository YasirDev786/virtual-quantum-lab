import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'
import { FaradaysLaw3DVisualization } from '../../components/visualizations/FaradaysLawVisualization'
import ParameterControl from '../../components/ParameterControl'
import { ChartJSPhysicsChart as PhysicsChart } from '../../components/charts/ChartJSPhysicsChart'

export const FaradaysLaw = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  
  // Mode selection - matching CONTEXT.md requirements
  const [mode, setMode] = useState('generator') // 'generator', 'transformer', 'induction-cooktop'
  
  // Parameters for Generator
  const [rotationSpeed, setRotationSpeed] = useState(1) // Coil rotation speed (Hz)
  const [coilTurns, setCoilTurns] = useState(10) // Number of turns
  const [fieldStrength, setFieldStrength] = useState(1) // Magnetic field strength (T)
  
  // Parameters for Transformer
  const [acVoltage, setAcVoltage] = useState(120) // Input AC voltage (V)
  const [acFrequency, setAcFrequency] = useState(60) // AC frequency (Hz)
  const [primaryTurns, setPrimaryTurns] = useState(100) // Primary coil turns
  const [secondaryTurns, setSecondaryTurns] = useState(50) // Secondary coil turns
  
  // Parameters for Induction Cooktop
  const [cooktopFrequency, setCooktopFrequency] = useState(25000) // AC frequency (Hz)
  const [cooktopCurrent, setCooktopCurrent] = useState(5) // Coil current (A)
  
  // Animation state
  const [isRunning, setIsRunning] = useState(true)
  const [time, setTime] = useState(0)
  const [angle, setAngle] = useState(0) // For generator rotation
  
  // Calculated values
  const [flux, setFlux] = useState(0)
  const [emf, setEmf] = useState(0)
  const [inducedCurrent, setInducedCurrent] = useState(0)
  const [secondaryVoltage, setSecondaryVoltage] = useState(0) // For transformer
  const [panTemperature, setPanTemperature] = useState(20) // For induction cooktop (°C)
  
  // Chart data
  const [chartData, setChartData] = useState({
    flux: [],
    emf: [],
    current: [],
  })
  
  const lastFluxRef = useRef(null)
  const maxDataPoints = 200

  // Animation loop
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTime((prev) => prev + 0.016)
      
      if (mode === 'generator') {
        // Rotate coil continuously for generator
        setAngle((a) => (a + rotationSpeed * 0.016 * 2 * Math.PI) % (2 * Math.PI))
      }
      // Transformer and Induction Cooktop use AC, so they animate based on frequency
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [isRunning, rotationSpeed, mode])

  // Calculate flux, EMF, and current based on mode
  useEffect(() => {
    const coilArea = Math.PI * (0.1 ** 2) // Coil area in m² (10cm radius)
    let newFlux = 0
    let dPhiDt = 0
    let newEmf = 0
    let newCurrent = 0
    let newSecondaryVoltage = 0
    let newPanTemperature = panTemperature

    if (mode === 'generator') {
      // Electric Generator: Rotating coil in magnetic field
      // Flux: Φ = B·A·cos(θ)
      newFlux = fieldStrength * coilArea * Math.cos(angle) * 1e-3 // Convert to mWb
      
      const now = performance.now()
      if (lastFluxRef.current && lastFluxRef.current.time) {
        const dt = (now - lastFluxRef.current.time) / 1000
        if (dt > 0) {
          dPhiDt = (newFlux - lastFluxRef.current.value) / dt
        }
      }
      lastFluxRef.current = { value: newFlux, time: now }
      
      // EMF: ε = -N·dΦ/dt = -N·ω·B·A·sin(θ)
      newEmf = -coilTurns * dPhiDt
      const R = 10 // Load resistance (Ω)
      newCurrent = newEmf / R
      
    } else if (mode === 'transformer') {
      // Transformer: Changing current in primary induces voltage in secondary
      // Primary current: I = V/R (simplified)
      const primaryResistance = 1 // Ω
      const primaryCurrent = acVoltage / primaryResistance
      
      // Magnetic flux varies with AC: Φ = (μ₀·N₁·I₁·A) / l
      // Simplified: flux proportional to primary current
      const mu0 = 4 * Math.PI * 1e-7 // Permeability of free space
      const coreLength = 0.2 // m
      newFlux = (mu0 * primaryTurns * primaryCurrent * coilArea) / coreLength * 1e3 // mWb
      
      // Flux changes with AC frequency
      const omega = 2 * Math.PI * acFrequency
      dPhiDt = newFlux * omega * Math.cos(omega * time)
      
      // Secondary EMF: ε₂ = -N₂·dΦ/dt
      newSecondaryVoltage = -secondaryTurns * dPhiDt
      newEmf = acVoltage // Primary voltage
      newCurrent = primaryCurrent
      
    } else if (mode === 'induction-cooktop') {
      // Induction Cooktop: AC in coil induces current in pan
      // Magnetic field from coil: B = μ₀·N·I / (2·r)
      const coilRadius = 0.15 // m
      const mu0 = 4 * Math.PI * 1e-7
      const magneticField = (mu0 * 20 * cooktopCurrent) / (2 * coilRadius) // Simplified
      
      // Flux through pan: Φ = B·A
      const panArea = Math.PI * (0.2 ** 2) // Pan area in m²
      const omega = 2 * Math.PI * cooktopFrequency
      newFlux = magneticField * panArea * Math.cos(omega * time) * 1e3 // mWb
      
      // Induced EMF in pan: ε = -dΦ/dt
      dPhiDt = newFlux * omega * Math.sin(omega * time)
      newEmf = -dPhiDt
      
      // Induced current in pan (eddy currents)
      const panResistance = 0.1 // Ω (low resistance for metal pan)
      newCurrent = newEmf / panResistance
      
      // Heat generation: P = I²·R, temperature increases
      const power = newCurrent * newCurrent * panResistance
      const heatCapacity = 500 // J/K (simplified)
      const heatLoss = 0.1 // Heat loss factor
      newPanTemperature = Math.min(panTemperature + (power * 0.016 - heatLoss) / heatCapacity, 300)
    }

    setFlux(newFlux)
    setEmf(newEmf)
    setInducedCurrent(newCurrent)
    setSecondaryVoltage(newSecondaryVoltage)
    setPanTemperature(newPanTemperature)

    // Update chart data
    setChartData((prev) => {
      const newFluxData = [...prev.flux, { x: time, y: newFlux }].slice(-maxDataPoints)
      const newEmfData = [...prev.emf, { x: time, y: newEmf }].slice(-maxDataPoints)
      const newCurrentData = [...prev.current, { x: time, y: newCurrent }].slice(-maxDataPoints)
      return {
        flux: newFluxData,
        emf: newEmfData,
        current: newCurrentData,
      }
    })
  }, [angle, coilTurns, fieldStrength, rotationSpeed, mode, time, acVoltage, acFrequency, primaryTurns, secondaryTurns, cooktopFrequency, cooktopCurrent, panTemperature])

  const handleReset = () => {
    setTime(0)
    setAngle(0)
    setPanTemperature(20)
    setChartData({ flux: [], emf: [], current: [] })
    setIsRunning(false)
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setTime(0)
    setAngle(0)
    setPanTemperature(20)
    setChartData({ flux: [], emf: [], current: [] })
  }

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/simulations')}
            className="mb-4 text-primary-600 dark:text-primary-400 hover:underline"
          >
            ← Back to Simulations
          </button>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
            <span className="gradient-text">Faraday's Law & Applications</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore electromagnetic induction through Electric Generator, Transformer, and Induction Cooktop simulations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-xl p-6 space-y-6"
            >
              <h2 className="text-xl font-display font-bold">Mode Selection</h2>
              
              <div className="space-y-2">
                {[
                  { id: 'generator', label: 'Electric Generator', icon: '🔋', desc: 'Rotating coil in magnetic field' },
                  { id: 'transformer', label: 'Transformer', icon: '⚡', desc: 'Two coils with magnetic flux' },
                  { id: 'induction-cooktop', label: 'Induction Cooktop', icon: '🔥', desc: 'Coil beneath pan induces heat' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleModeChange(m.id)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-all ${
                      mode === m.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{m.icon}</span>
          <div>
                        <div className="font-semibold">{m.label}</div>
                        <div className="text-xs opacity-75">{m.desc}</div>
          </div>
        </div>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                <h2 className="text-xl font-display font-bold mb-4">Parameters</h2>

                {mode === 'generator' && (
                  <>
                    <ParameterControl
                      label="Coil Speed"
                      value={rotationSpeed}
                      onChange={setRotationSpeed}
                      min={0}
                      max={10}
                      step={0.1}
                      unit=" Hz"
                    />
                    <ParameterControl
                      label="Number of Turns"
                      value={coilTurns}
                      onChange={(v) => setCoilTurns(Math.max(1, Math.round(v)))}
                      min={1}
                      max={200}
                      step={1}
                      type="input"
                    />
                    <ParameterControl
                      label="Magnetic Field Strength"
                      value={fieldStrength}
                      onChange={setFieldStrength}
                      min={0}
                      max={5}
                      step={0.1}
                      unit=" T"
                    />
                  </>
                )}

                {mode === 'transformer' && (
                  <>
                    <ParameterControl
                      label="Input AC Voltage"
                      value={acVoltage}
                      onChange={setAcVoltage}
                      min={0}
                      max={240}
                      step={10}
                      unit=" V"
                    />
                    <ParameterControl
                      label="AC Frequency"
                      value={acFrequency}
                      onChange={setAcFrequency}
                      min={50}
                      max={60}
                      step={1}
                      unit=" Hz"
                    />
                    <ParameterControl
                      label="Primary Turns"
                      value={primaryTurns}
                      onChange={(v) => setPrimaryTurns(Math.max(1, Math.round(v)))}
                      min={1}
                      max={500}
                      step={10}
                      type="input"
                    />
                    <ParameterControl
                      label="Secondary Turns"
                      value={secondaryTurns}
                      onChange={(v) => setSecondaryTurns(Math.max(1, Math.round(v)))}
                      min={1}
                      max={500}
                      step={10}
                      type="input"
                    />
                  </>
                )}

                {mode === 'induction-cooktop' && (
                  <>
                    <ParameterControl
                      label="AC Frequency"
                      value={cooktopFrequency}
                      onChange={setCooktopFrequency}
                      min={20000}
                      max={30000}
                      step={1000}
                      unit=" Hz"
                    />
                    <ParameterControl
                      label="Coil Current"
                      value={cooktopCurrent}
                      onChange={setCooktopCurrent}
                      min={1}
                      max={10}
                      step={0.5}
                      unit=" A"
                    />
                  </>
                )}
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isRunning
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}
                >
                  {isRunning ? '⏸️ Pause' : '▶️ Play'}
                </button>
                <button
                  onClick={handleReset}
                  className="w-full px-4 py-2 rounded-lg font-semibold bg-gray-500 hover:bg-gray-600 text-white transition-colors"
                >
                  🔄 Reset
                </button>
              </div>
            </motion.div>

            {/* Real-time Data */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">Real-time Data</h2>
              <div className="space-y-3 text-sm">
              <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Magnetic Flux:</span>
                    <span className="font-semibold font-mono">
                      {flux.toExponential(3)} Wb
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">EMF (ε):</span>
                    <span className="font-semibold font-mono text-blue-600 dark:text-blue-400">
                      {emf.toFixed(3)} V
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Current (I):</span>
                    <span className="font-semibold font-mono text-green-600 dark:text-green-400">
                      {inducedCurrent.toFixed(3)} A
                    </span>
                  </div>
                </div>
                {mode === 'generator' && (
                  <div className="pt-2 border-t border-gray-200 dark:border-dark-700">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Angle:</span>
                      <span className="font-semibold font-mono">
                        {(angle * 180 / Math.PI).toFixed(1)}°
                      </span>
                    </div>
                  </div>
                )}
                {mode === 'transformer' && (
                  <div className="pt-2 border-t border-gray-200 dark:border-dark-700">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Secondary Voltage:</span>
                      <span className="font-semibold font-mono text-purple-600 dark:text-purple-400">
                        {Math.abs(secondaryVoltage).toFixed(2)} V
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Turns Ratio:</span>
                      <span className="font-semibold font-mono">
                        {primaryTurns}:{secondaryTurns}
                      </span>
                    </div>
                  </div>
                )}
                {mode === 'induction-cooktop' && (
                  <div className="pt-2 border-t border-gray-200 dark:border-dark-700">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Pan Temperature:</span>
                      <span className="font-semibold font-mono text-red-600 dark:text-red-400">
                        {panTemperature.toFixed(1)}°C
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Power:</span>
                      <span className="font-semibold font-mono">
                        {(inducedCurrent * inducedCurrent * 0.1).toFixed(1)} W
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Physics Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">
                {mode === 'generator' ? 'Electric Generator' : mode === 'transformer' ? 'Transformer' : 'Induction Cooktop'}
              </h2>
              <div className="space-y-2 text-sm">
                {mode === 'generator' && (
                  <>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Generator:</strong> ε = -N·ω·B·A·sin(θ)
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Rotating a coil in a magnetic field induces an electric current. Mechanical energy is converted to electrical energy.
                    </p>
                  </>
                )}
                {mode === 'transformer' && (
                  <>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Transformer:</strong> V₂/V₁ = N₂/N₁
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Changing current in a primary coil induces voltage in a secondary coil. Magnetic flux links the two coils.
                    </p>
                  </>
                )}
                {mode === 'induction-cooktop' && (
                  <>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Induction Heating:</strong> P = I²·R
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Alternating current in a coil produces a changing magnetic field, inducing eddy currents (and heat) in a metal pan.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Canvas and Charts */}
          <div className="lg:col-span-3 space-y-6">
            {/* 3D Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[500px] rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800"
            >
              <Canvas
                camera={{ position: [0, 3, 5], fov: 50 }}
                gl={{ antialias: true }}
              >
                <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                <gridHelper args={[20, 20]} />
                <axesHelper args={[5]} />
                <FaradaysLaw3DVisualization
                  mode={mode}
                  angle={angle}
                  current={inducedCurrent}
                  secondaryVoltage={secondaryVoltage}
                  panTemperature={panTemperature}
                  theme={theme}
                />
              </Canvas>
            </motion.div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass rounded-xl p-4">
                    <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Magnetic Flux vs Time
                    </h3>
                    <PhysicsChart
                      data={chartData.flux}
                      label="Magnetic Flux"
                      color="#8b5cf6"
                      xLabel="Time (s)"
                      yLabel="Flux (Wb)"
                      height={180}
                    />
                  </div>
                  <div className="glass rounded-xl p-4">
                    <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      EMF vs Time
                    </h3>
                    <PhysicsChart
                      data={chartData.emf}
                      label="EMF"
                      color="#3b82f6"
                      xLabel="Time (s)"
                      yLabel="EMF (V)"
                      height={180}
                    />
                  </div>
                  <div className="glass rounded-xl p-4">
                    <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Current vs Time
                    </h3>
                    <PhysicsChart
                      data={chartData.current}
                      label="Current"
                      color="#10b981"
                      xLabel="Time (s)"
                      yLabel="Current (A)"
                      height={180}
                    />
                  </div>
                </div>

            {/* Mode Descriptions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">About This Simulation</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center space-x-2">
                    <span>🔋</span>
                    <span>Electric Generator</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    3D coil spinning inside a magnetic field induces an electric current. 
                    Adjust coil speed, number of turns, and magnetic field strength to see the effect.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center space-x-2">
                    <span>⚡</span>
                    <span>Transformer</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Two coils side by side in 3D with animated magnetic flux lines linking them. 
                    Changing current in primary coil induces voltage in secondary coil.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center space-x-2">
                    <span>🔥</span>
                    <span>Induction Cooktop</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    3D coil beneath a pan with animated field lines. Alternating current produces 
                    a changing magnetic field, inducing current and heat in the metal pan.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FaradaysLaw
