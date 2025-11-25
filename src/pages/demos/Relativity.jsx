import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'
import { calculateTimeDilation, calculateLorentzContraction } from '../../physics/Relativity'
import RelativityVisualization from '../../components/visualizations/RelativityVisualization'
import ParameterControl from '../../components/ParameterControl'
import { ChartJSPhysicsChart as PhysicsChart } from '../../components/charts/ChartJSPhysicsChart'

export const Relativity = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [velocity, setVelocity] = useState(0.5) // Fraction of light speed
  const [properLength, setProperLength] = useState(2)
  const [properTime, setProperTime] = useState(1)
  const [showTimeDilation, setShowTimeDilation] = useState(true)
  const [showLengthContraction, setShowLengthContraction] = useState(true)
  const [chartData, setChartData] = useState({ gamma: [], timeDilation: [], lengthContraction: [] })

  // Calculate relativistic effects
  const c = 3e8 // Speed of light (m/s)
  const velocityMS = velocity * c // Velocity in m/s
  const timeDilationResult = calculateTimeDilation({
    properTime,
    velocity: velocityMS,
    c,
  })
  const contractionResult = calculateLorentzContraction({
    properLength,
    velocity: velocityMS,
    c,
  })

  // Generate chart data for different velocities
  useEffect(() => {
    const gammaData = []
    const timeData = []
    const lengthData = []

    for (let v = 0; v <= 0.99; v += 0.05) {
      const beta = v
      const gamma = 1 / Math.sqrt(1 - beta * beta)
      const dilatedTime = gamma * properTime
      const contractedLength = properLength / gamma

      gammaData.push({ x: v, y: gamma })
      timeData.push({ x: v, y: dilatedTime })
      lengthData.push({ x: v, y: contractedLength })
    }

    setChartData({
      gamma: gammaData,
      timeDilation: timeData,
      lengthContraction: lengthData,
    })
  }, [properTime, properLength])

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
            <span className="gradient-text">Special Relativity</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore time dilation and length contraction effects
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
                label="Velocity (β = v/c)"
                value={velocity}
                onChange={setVelocity}
                min={0}
                max={0.99}
                step={0.01}
                unit=" c"
              />

              <div className="pt-2 pb-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {velocityMS.toExponential(2)} m/s
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {(velocity * 100).toFixed(1)}% of light speed
                </div>
              </div>

              <ParameterControl
                label="Proper Length"
                value={properLength}
                onChange={setProperLength}
                min={0.5}
                max={5}
                step={0.1}
                unit=" m"
              />

              <ParameterControl
                label="Proper Time"
                value={properTime}
                onChange={setProperTime}
                min={0.1}
                max={5}
                step={0.1}
                unit=" s"
              />

              <div className="pt-4 space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTimeDilation}
                    onChange={(e) => setShowTimeDilation(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Time Dilation</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLengthContraction}
                    onChange={(e) => setShowLengthContraction(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Length Contraction</span>
                </label>
              </div>
            </motion.div>

            {/* Relativistic Effects */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">Relativistic Effects</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Beta (β = v/c):</span>
                    <span className="font-semibold">
                      {velocity.toFixed(3)} c
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {velocityMS.toExponential(2)} m/s
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Gamma (γ):</span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      {timeDilationResult.gamma.toFixed(3)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    γ = 1/√(1 - β²)
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-dark-700">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Proper Time:</span>
                    <span className="font-semibold">
                      {properTime.toFixed(2)} s
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Dilated Time:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {timeDilationResult.dilatedTime.toFixed(3)} s
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {((timeDilationResult.dilatedTime / properTime - 1) * 100).toFixed(1)}% slower
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-dark-700">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Proper Length:</span>
                    <span className="font-semibold">
                      {properLength.toFixed(2)} m
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Contracted Length:</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {contractionResult.contractedLength.toFixed(3)} m
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {((1 - contractionResult.contractedLength / properLength) * 100).toFixed(1)}% shorter
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
              <h2 className="text-xl font-display font-bold mb-4">Relativity Information</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Time Dilation:</strong> Moving clocks run slower relative to stationary observers.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Length Contraction:</strong> Objects contract in the direction of motion at relativistic speeds.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Note:</strong> Effects become significant as velocity approaches the speed of light (c).
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
                camera={{ position: [0, 5, 15], fov: 50 }}
                gl={{ antialias: true }}
              >
                <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                <gridHelper args={[20, 20]} />
                <axesHelper args={[5]} />
                <RelativityVisualization
                  velocity={velocity}
                  properLength={properLength}
                  properTime={properTime}
                  showTimeDilation={showTimeDilation}
                  showLengthContraction={showLengthContraction}
                />
              </Canvas>
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PhysicsChart
                data={chartData.gamma}
                label="Gamma Factor vs Velocity"
                color="#e74c3c"
                xLabel="Velocity (c)"
                yLabel="γ (gamma)"
              />
              <PhysicsChart
                data={chartData.timeDilation}
                label="Time Dilation vs Velocity"
                color="#3498db"
                xLabel="Velocity (c)"
                yLabel="Dilated Time (s)"
              />
              <PhysicsChart
                data={chartData.lengthContraction}
                label="Length Contraction vs Velocity"
                color="#2ecc71"
                xLabel="Velocity (c)"
                yLabel="Contracted Length (m)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Relativity

