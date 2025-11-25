import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'
import { calculateLorentzTransformation } from '../../physics/Relativity'
import SpacetimeDiagramVisualization from '../../components/visualizations/SpacetimeDiagramVisualization'
import ParameterControl from '../../components/ParameterControl'
import { ChartJSPhysicsChart as PhysicsChart } from '../../components/charts/ChartJSPhysicsChart'

export const SpacetimeDiagrams = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [velocity, setVelocity] = useState(0.5) // β = v/c
  const [observerX, setObserverX] = useState(0)
  const [observerT, setObserverT] = useState(0)
  const [showWorldlines, setShowWorldlines] = useState(true)
  const [showLightCones, setShowLightCones] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [showLorentzTransform, setShowLorentzTransform] = useState(true)
  const [chartData, setChartData] = useState({ worldline: [] })

  const c = 3e8 // Speed of light
  const velocityMS = velocity * c

  // Calculate Lorentz transformation
  const lorentzResult = calculateLorentzTransformation({
    position: { x: observerX, y: 0, z: 0, t: observerT },
    velocity: velocityMS,
    c,
  })

  // Generate chart data for worldlines
  useEffect(() => {
    const worldlineData = []
    const timeRange = 5

    // Stationary observer worldline
    for (let t = -timeRange; t <= timeRange; t += 0.1) {
      worldlineData.push({ x: 0, y: t })
    }

    // Moving observer worldline
    if (showLorentzTransform && velocity !== 0) {
      for (let t = -timeRange; t <= timeRange; t += 0.1) {
        const x = velocity * t
        worldlineData.push({ x, y: t })
      }
    }

    setChartData({ worldline: worldlineData })
  }, [velocity, showLorentzTransform])

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
            <span className="gradient-text">Spacetime Diagrams</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize Minkowski spacetime, worldlines, and Lorentz transformations
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
                label="Observer X Position"
                value={observerX}
                onChange={setObserverX}
                min={-5}
                max={5}
                step={0.1}
                unit=" m"
              />

              <ParameterControl
                label="Observer Time (ct)"
                value={observerT}
                onChange={setObserverT}
                min={-5}
                max={5}
                step={0.1}
                unit=" m"
              />

              <div className="pt-4 space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showWorldlines}
                    onChange={(e) => setShowWorldlines(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Worldlines</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLightCones}
                    onChange={(e) => setShowLightCones(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Light Cones</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Grid</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLorentzTransform}
                    onChange={(e) => setShowLorentzTransform(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Lorentz Transform</span>
                </label>
              </div>
            </motion.div>

            {/* Transformation Results */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">Lorentz Transformation</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Beta (β):</span>
                    <span className="font-semibold">
                      {velocity.toFixed(3)} c
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Gamma (γ):</span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      {lorentzResult.gamma.toFixed(3)}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-dark-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Original Position:</div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">x:</span>
                    <span className="font-semibold">
                      {observerX.toFixed(2)} m
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">ct:</span>
                    <span className="font-semibold">
                      {observerT.toFixed(2)} m
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-dark-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Transformed Position:</div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">x':</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {lorentzResult.position.x.toFixed(3)} m
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">ct':</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {lorentzResult.position.t.toFixed(3)} m
                    </span>
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
              <h2 className="text-xl font-display font-bold mb-4">Spacetime Diagrams</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Worldline:</strong> Path of an object through spacetime (x vs ct).
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Light Cone:</strong> Boundary of causally connected events (ct = ±x).
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Lorentz Transform:</strong> x' = γ(x - βct), ct' = γ(ct - βx)
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
              className="h-[500px] rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800"
            >
              <Canvas
                camera={{ position: [0, 0, 15], fov: 50 }}
                gl={{ antialias: true }}
              >
                <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                <SpacetimeDiagramVisualization
                  velocity={velocity}
                  observerPosition={{ x: observerX, t: observerT }}
                  showWorldlines={showWorldlines}
                  showLightCones={showLightCones}
                  showGrid={showGrid}
                  showLorentzTransform={showLorentzTransform}
                />
              </Canvas>
            </motion.div>

            {/* 2D Spacetime Diagram (SVG overlay) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="text-lg font-display font-bold mb-4">2D Spacetime Diagram</h3>
              <div className="h-[300px] relative">
                <svg
                  viewBox="-10 -10 20 20"
                  className="w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Grid */}
                  {showGrid && (
                    <g opacity="0.3">
                      {Array.from({ length: 21 }, (_, i) => i - 10).map((x) => (
                        <line
                          key={`v-${x}`}
                          x1={x}
                          y1={-10}
                          x2={x}
                          y2={10}
                          stroke={theme === 'dark' ? '#666' : '#ccc'}
                          strokeWidth="0.5"
                        />
                      ))}
                      {Array.from({ length: 21 }, (_, i) => i - 10).map((t) => (
                        <line
                          key={`h-${t}`}
                          x1={-10}
                          y1={t}
                          x2={10}
                          y2={t}
                          stroke={theme === 'dark' ? '#666' : '#ccc'}
                          strokeWidth="0.5"
                        />
                      ))}
                    </g>
                  )}

                  {/* Light Cones */}
                  {showLightCones && (
                    <g>
                      <line
                        x1={-10}
                        y1={-10}
                        x2={10}
                        y2={10}
                        stroke="#ff8800"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                      />
                      <line
                        x1={-10}
                        y1={10}
                        x2={10}
                        y2={-10}
                        stroke="#ff8800"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                      />
                    </g>
                  )}

                  {/* Worldlines */}
                  {showWorldlines && (
                    <g>
                      {/* Stationary observer */}
                      <line
                        x1={0}
                        y1={-10}
                        x2={0}
                        y2={10}
                        stroke="#3498db"
                        strokeWidth="3"
                      />
                      {/* Moving observer */}
                      {showLorentzTransform && velocity !== 0 && (
                        <line
                          x1={-10 * velocity}
                          y1={-10}
                          x2={10 * velocity}
                          y2={10}
                          stroke="#e74c3c"
                          strokeWidth="3"
                        />
                      )}
                    </g>
                  )}

                  {/* Axes */}
                  <g>
                    <line
                      x1={-10}
                      y1={0}
                      x2={10}
                      y2={0}
                      stroke={theme === 'dark' ? '#fff' : '#000'}
                      strokeWidth="2"
                    />
                    <line
                      x1={0}
                      y1={-10}
                      x2={0}
                      y2={10}
                      stroke={theme === 'dark' ? '#fff' : '#000'}
                      strokeWidth="2"
                    />
                  </g>

                  {/* Observer position */}
                  <circle
                    cx={observerX}
                    cy={observerT}
                    r="0.3"
                    fill="#e74c3c"
                  />

                  {/* Labels */}
                  <text
                    x={9}
                    y={0.5}
                    fill={theme === 'dark' ? '#fff' : '#000'}
                    fontSize="1"
                    textAnchor="end"
                  >
                    x
                  </text>
                  <text
                    x={0.5}
                    y={-9}
                    fill={theme === 'dark' ? '#fff' : '#000'}
                    fontSize="1"
                  >
                    ct
                  </text>
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpacetimeDiagrams

