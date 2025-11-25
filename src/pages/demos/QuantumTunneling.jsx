import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'
import { calculateTunneling } from '../../physics/QuantumMechanics'
import QuantumTunnelingVisualization from '../../components/visualizations/QuantumTunnelingVisualization'
import ParameterControl from '../../components/ParameterControl'
import { ChartJSPhysicsChart as PhysicsChart } from '../../components/charts/ChartJSPhysicsChart'

export const QuantumTunneling = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [particleEnergy, setParticleEnergy] = useState(1)
  const [barrierHeight, setBarrierHeight] = useState(2)
  const [barrierWidth, setBarrierWidth] = useState(1)
  const [barrierPosition, setBarrierPosition] = useState(0)
  const [particlePosition, setParticlePosition] = useState(-3)
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showWaveFunction, setShowWaveFunction] = useState(true)
  const [showBarrier, setShowBarrier] = useState(true)
  const [showParticle, setShowParticle] = useState(true)
  const [chartData, setChartData] = useState({ transmission: [], reflection: [] })

  // Calculate tunneling probability
  const tunnelingResult = calculateTunneling({
    energy: particleEnergy,
    barrierHeight,
    barrierWidth,
    mass: 9.109e-31, // Electron mass
  })

  // Animation loop
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTime((prev) => {
        const newTime = prev + 0.016
        // Reset when particle passes barrier
        if (newTime > 10) return 0
        return newTime
      })
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [isRunning])

  // Generate chart data
  useEffect(() => {
    const transmissionData = []
    const reflectionData = []

    for (let energy = 0.1; energy <= barrierHeight * 2; energy += 0.1) {
      const result = calculateTunneling({
        energy,
        barrierHeight,
        barrierWidth,
        mass: 9.109e-31,
      })
      transmissionData.push({ x: energy, y: result.transmissionProbability })
      reflectionData.push({ x: energy, y: result.reflectionProbability })
    }

    setChartData({ transmission: transmissionData, reflection: reflectionData })
  }, [barrierHeight, barrierWidth])

  const handleReset = () => {
    setTime(0)
    setParticlePosition(-3)
    setIsRunning(false)
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
            <span className="gradient-text">Quantum Tunneling</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize how quantum particles can tunnel through potential barriers
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
              <h2 className="text-xl font-display font-bold">Parameters</h2>

              <ParameterControl
                label="Particle Energy"
                value={particleEnergy}
                onChange={setParticleEnergy}
                min={0.1}
                max={5}
                step={0.1}
                unit=" eV"
              />

              <ParameterControl
                label="Barrier Height"
                value={barrierHeight}
                onChange={setBarrierHeight}
                min={0.5}
                max={5}
                step={0.1}
                unit=" eV"
              />

              <ParameterControl
                label="Barrier Width"
                value={barrierWidth}
                onChange={setBarrierWidth}
                min={0.1}
                max={3}
                step={0.1}
                unit=" nm"
              />

              <ParameterControl
                label="Barrier Position"
                value={barrierPosition}
                onChange={setBarrierPosition}
                min={-2}
                max={2}
                step={0.1}
                unit=" nm"
              />

              <div className="pt-4 space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showWaveFunction}
                    onChange={(e) => setShowWaveFunction(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Wave Function</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBarrier}
                    onChange={(e) => setShowBarrier(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Barrier</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showParticle}
                    onChange={(e) => setShowParticle(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Particle</span>
                </label>
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

            {/* Tunneling Results */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">Tunneling Results</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Energy:</span>
                    <span className="font-semibold">
                      {particleEnergy.toFixed(2)} eV
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Barrier Height:</span>
                    <span className="font-semibold">
                      {barrierHeight.toFixed(2)} eV
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-dark-700">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Transmission:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {(tunnelingResult.transmissionProbability * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Reflection:</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {(tunnelingResult.reflectionProbability * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {tunnelingResult.tunneling 
                      ? '⚛️ Quantum tunneling occurs' 
                      : '⚡ Classical transmission'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">Quantum Tunneling</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Definition:</strong> Quantum particles can pass through potential barriers even when their energy is less than the barrier height.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Transmission Probability:</strong> T = e^(-2κa) where κ = √(2m(V₀-E))/ℏ
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Applications:</strong> Nuclear fusion, scanning tunneling microscopes, semiconductor devices.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Canvas and Charts */}
          <div className="lg:col-span-3 space-y-6">
            {/* 3D Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[400px] rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800"
            >
              <Canvas
                camera={{ position: [0, 2, 10], fov: 50 }}
                gl={{ antialias: true }}
              >
                <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                <gridHelper args={[20, 20]} />
                <axesHelper args={[5]} />
                <QuantumTunnelingVisualization
                  particleEnergy={particleEnergy}
                  barrierHeight={barrierHeight}
                  barrierWidth={barrierWidth}
                  barrierPosition={barrierPosition}
                  particlePosition={particlePosition}
                  time={time}
                  showWaveFunction={showWaveFunction}
                  showBarrier={showBarrier}
                  showParticle={showParticle}
                  transmissionProbability={tunnelingResult.transmissionProbability}
                />
              </Canvas>
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PhysicsChart
                data={chartData.transmission}
                label="Transmission Probability vs Energy"
                color="#2ecc71"
                xLabel="Energy (eV)"
                yLabel="Transmission Probability"
              />
              <PhysicsChart
                data={chartData.reflection}
                label="Reflection Probability vs Energy"
                color="#e74c3c"
                xLabel="Energy (eV)"
                yLabel="Reflection Probability"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuantumTunneling

