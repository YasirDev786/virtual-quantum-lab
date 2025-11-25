import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'
import { calculateWaveFunction } from '../../physics/QuantumMechanics'
import QuantumMechanicsVisualization from '../../components/visualizations/QuantumMechanicsVisualization'
import ParameterControl from '../../components/ParameterControl'
import { ChartJSPhysicsChart as PhysicsChart } from '../../components/charts/ChartJSPhysicsChart'

export const QuantumMechanics = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [particleX, setParticleX] = useState(0)
  const [particleY, setParticleY] = useState(0)
  const [waveAmplitude, setWaveAmplitude] = useState(1)
  const [wavelength, setWavelength] = useState(2)
  const [momentum, setMomentum] = useState(1)
  const [showParticleCloud, setShowParticleCloud] = useState(true)
  const [showWaveFunction, setShowWaveFunction] = useState(true)
  const [time, setTime] = useState(0)
  const [waveData, setWaveData] = useState([])
  const [chartData, setChartData] = useState({ probability: [], amplitude: [] })

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.016)
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [])

  // Calculate wave function data
  useEffect(() => {
    const gridSize = 20
    const step = 0.5
    const points = []
    const probData = []
    const ampData = []

    for (let x = -gridSize / 2; x <= gridSize / 2; x += step) {
      for (let y = -gridSize / 2; y <= gridSize / 2; y += step) {
        const result = calculateWaveFunction({
          position: x,
          time: time,
          momentum: momentum,
          mass: 1,
        })
        points.push({
          x,
          y,
          probability: result.probability,
          amplitude: result.amplitude,
        })
      }
      
      // For chart (1D slice along x-axis at y=0)
      if (Math.abs(x) < 0.1) {
        const result = calculateWaveFunction({
          position: x,
          time: time,
          momentum: momentum,
          mass: 1,
        })
        probData.push({ x, y: result.probability })
        ampData.push({ x, y: result.amplitude })
      }
    }

    setWaveData(points)
    setChartData({ probability: probData, amplitude: ampData })
  }, [momentum, time])

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
            <span className="gradient-text">Quantum Mechanics</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore probability waves and quantum phenomena
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
                label="Particle Position X"
                value={particleX}
                onChange={setParticleX}
                min={-5}
                max={5}
                step={0.1}
                unit=" m"
              />

              <ParameterControl
                label="Particle Position Y"
                value={particleY}
                onChange={setParticleY}
                min={-5}
                max={5}
                step={0.1}
                unit=" m"
              />

              <ParameterControl
                label="Wave Amplitude"
                value={waveAmplitude}
                onChange={setWaveAmplitude}
                min={0.1}
                max={3}
                step={0.1}
              />

              <ParameterControl
                label="Wavelength"
                value={wavelength}
                onChange={setWavelength}
                min={0.5}
                max={5}
                step={0.1}
                unit=" m"
              />

              <ParameterControl
                label="Momentum"
                value={momentum}
                onChange={setMomentum}
                min={0.1}
                max={5}
                step={0.1}
                unit=" kg⋅m/s"
              />

              <div className="pt-4 space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showParticleCloud}
                    onChange={(e) => setShowParticleCloud(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Particle Cloud</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showWaveFunction}
                    onChange={(e) => setShowWaveFunction(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Wave Function</span>
                </label>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">Quantum Information</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Wave Function:</strong> Describes the probability amplitude of finding a particle at a given position.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Probability Density:</strong> |ψ|² gives the probability of finding the particle.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Note:</strong> This is a simplified visualization. Full implementation will include Schrödinger equation solutions.
                </p>
              </div>
            </motion.div>

            {/* Real-time Data */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">Real-Time Data</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Particle Position:</span>
                  <span className="font-semibold">
                    ({particleX.toFixed(2)}, {particleY.toFixed(2)}) m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Wave Amplitude:</span>
                  <span className="font-semibold">
                    {waveAmplitude.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Wavelength (λ):</span>
                  <span className="font-semibold">
                    {wavelength.toFixed(2)} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Momentum (p):</span>
                  <span className="font-semibold">
                    {momentum.toFixed(2)} kg⋅m/s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Wave Number (k):</span>
                  <span className="font-semibold">
                    {((2 * Math.PI) / wavelength).toFixed(2)} m⁻¹
                  </span>
                </div>
                {waveData.length > 0 && (
                  <div className="pt-2 border-t border-gray-200 dark:border-dark-700">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Max Probability:</span>
                      <span className="font-semibold text-primary-600 dark:text-primary-400">
                        {Math.max(...waveData.map(d => d.probability)).toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-600 dark:text-gray-400">Time:</span>
                      <span className="font-semibold">
                        {time.toFixed(2)} s
                      </span>
                    </div>
                  </div>
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
              className="h-[400px] rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800"
            >
              <Canvas
                camera={{ position: [0, 10, 15], fov: 50 }}
                gl={{ antialias: true }}
              >
                <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                <gridHelper args={[20, 20]} />
                <axesHelper args={[5]} />
                <QuantumMechanicsVisualization
                  waveData={waveData}
                  particlePosition={{ x: particleX, y: particleY, z: 0 }}
                  waveAmplitude={waveAmplitude}
                  wavelength={wavelength}
                  time={time}
                  showParticleCloud={showParticleCloud}
                  showWaveFunction={showWaveFunction}
                />
              </Canvas>
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PhysicsChart
                data={chartData.probability}
                label="Probability Density"
                color="#9b59b6"
                xLabel="Position (m)"
                yLabel="Probability"
              />
              <PhysicsChart
                data={chartData.amplitude}
                label="Wave Amplitude"
                color="#8e44ad"
                xLabel="Position (m)"
                yLabel="Amplitude"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuantumMechanics

