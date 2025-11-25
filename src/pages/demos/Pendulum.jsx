import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'
import { simulatePendulum } from '../../physics/ClassicalMechanics'
import ParameterControl from '../../components/ParameterControl'
import { ChartJSPhysicsChart as PhysicsChart } from '../../components/charts/ChartJSPhysicsChart'

/**
 * Pendulum Visualization Component
 */
const PendulumVisualization = ({ angle, length, position, time }) => {
  const pivotRef = useRef()
  const bobRef = useRef()

  useEffect(() => {
    if (bobRef.current && position) {
      bobRef.current.position.set(position.x, position.y, position.z)
    }
  }, [position])

  return (
    <>
      {/* Pivot point */}
      <mesh ref={pivotRef} position={[0, 5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>

      {/* String/rod */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([
              0, 5, 0,
              position.x, position.y, position.z,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#95a5a6" linewidth={2} />
      </line>

      {/* Bob */}
      <mesh ref={bobRef} position={[position.x, position.y, position.z]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={0.3} />
      </mesh>

      {/* Ground reference */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#95a5a6" />
      </mesh>
    </>
  )
}

export const Pendulum = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [length, setLength] = useState(2)
  const [angle, setAngle] = useState(30)
  const [gravity, setGravity] = useState(9.8)
  const [isRunning, setIsRunning] = useState(false)
  const [simulationData, setSimulationData] = useState(null)
  const [chartData, setChartData] = useState({ angle: [], energy: [] })
  const timeRef = useRef(0)
  const animationFrameRef = useRef(null)

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      timeRef.current = 0
      setChartData({ angle: [], energy: [] })
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const animate = () => {
      timeRef.current += 0.016 // ~60fps
      
      const result = simulatePendulum({
        length,
        angle: (angle * Math.PI) / 180, // Convert to radians
        gravity,
        time: timeRef.current,
      })

      setSimulationData(result)

      // Update chart data
      setChartData((prev) => ({
        angle: [
          ...prev.angle.slice(-100), // Keep last 100 points
          { x: timeRef.current, y: (result.angle * 180) / Math.PI },
        ],
        energy: [
          ...prev.energy.slice(-100),
          {
            x: timeRef.current,
            y: 0.5 * length * length * result.angularVelocity * result.angularVelocity,
          },
        ],
      }))

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isRunning, length, angle, gravity])

  // Calculate period
  const period = 2 * Math.PI * Math.sqrt(length / gravity)

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
            <span className="gradient-text">Pendulum Simulation</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore simple harmonic motion with an interactive pendulum
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
                label="Length"
                value={length}
                onChange={setLength}
                min={0.5}
                max={5}
                step={0.1}
                unit=" m"
              />

              <ParameterControl
                label="Initial Angle"
                value={angle}
                onChange={setAngle}
                min={0}
                max={90}
                step={1}
                unit="°"
              />

              <ParameterControl
                label="Gravity"
                value={gravity}
                onChange={setGravity}
                min={1}
                max={20}
                step={0.1}
                unit=" m/s²"
              />

              <div className="pt-4">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                    isRunning
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gradient-to-r from-primary-500 to-purple-500 hover:shadow-lg text-white'
                  }`}
                >
                  {isRunning ? 'Stop' : 'Start'} Simulation
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
              <h2 className="text-xl font-display font-bold mb-4">Real-Time Data</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Angle:</span>
                  <span className="font-semibold">
                    {simulationData
                      ? ((simulationData.angle * 180) / Math.PI).toFixed(2)
                      : angle}
                    °
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Angular Velocity:</span>
                  <span className="font-semibold">
                    {simulationData?.angularVelocity.toFixed(3) || '0.000'} rad/s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-semibold">
                    {simulationData?.time.toFixed(2) || '0.00'} s
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
                <h3 className="font-semibold mb-2">Calculated Values</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Period:</span>
                    <span className="font-semibold">{period.toFixed(2)} s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Frequency:</span>
                    <span className="font-semibold">{(1 / period).toFixed(2)} Hz</span>
                  </div>
                </div>
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
                camera={{ position: [0, 5, 10], fov: 50 }}
                gl={{ antialias: true }}
              >
                <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                <gridHelper args={[20, 20]} />
                <axesHelper args={[5]} />
                {simulationData && (
                  <PendulumVisualization
                    angle={simulationData.angle}
                    length={length}
                    position={simulationData.position}
                    time={simulationData.time}
                  />
                )}
              </Canvas>
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PhysicsChart
                data={chartData.angle}
                label="Angle vs Time"
                color="#e74c3c"
                xLabel="Time (s)"
                yLabel="Angle (°)"
              />
              <PhysicsChart
                data={chartData.energy}
                label="Energy vs Time"
                color="#3498db"
                xLabel="Time (s)"
                yLabel="Energy (J)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pendulum

