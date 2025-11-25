import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'
import { simulateProjectile } from '../../physics/ClassicalMechanics'
import ProjectileVisualization from '../../components/visualizations/ProjectileVisualization'
import ParameterControl from '../../components/ParameterControl'
import { ChartJSPhysicsChart as PhysicsChart } from '../../components/charts/ChartJSPhysicsChart'

export const ProjectileMotion = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [velocity, setVelocity] = useState(20)
  const [angle, setAngle] = useState(45)
  const [gravity, setGravity] = useState(9.8)
  const [isRunning, setIsRunning] = useState(false)
  const [simulationData, setSimulationData] = useState(null)
  const [trajectory, setTrajectory] = useState([])
  const [chartData, setChartData] = useState({
    position: [],
    velocity: [],
    energy: [],
  })
  const timeRef = useRef(0)
  const animationFrameRef = useRef(null)

  // Calculate trajectory points
  const calculateTrajectory = () => {
    const points = []
    const angleRad = (angle * Math.PI) / 180
    const vx = velocity * Math.cos(angleRad)
    const vy = velocity * Math.sin(angleRad)
    const totalTime = (2 * vy) / gravity

    for (let t = 0; t <= totalTime; t += 0.1) {
      const x = vx * t
      const y = vy * t - 0.5 * gravity * t * t
      if (y >= 0) {
        points.push({ x, y, z: 0 })
      }
    }
    return points
  }

  // Update trajectory when parameters change
  useEffect(() => {
    setTrajectory(calculateTrajectory())
  }, [velocity, angle, gravity])

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      timeRef.current = 0
      setChartData({ position: [], velocity: [], energy: [] })
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const animate = () => {
      timeRef.current += 0.016 // ~60fps
      const angleRad = (angle * Math.PI) / 180
      const vx = velocity * Math.cos(angleRad)
      const vy = velocity * Math.sin(angleRad)
      const totalTime = (2 * vy) / gravity

      if (timeRef.current >= totalTime) {
        setIsRunning(false)
        timeRef.current = 0
        return
      }

      const result = simulateProjectile({
        velocity,
        angle,
        gravity,
        mass: 1,
        time: timeRef.current,
      })

      setSimulationData(result)

      // Update chart data
      setChartData((prev) => ({
        position: [
          ...prev.position.slice(-100), // Keep last 100 points
          { x: timeRef.current, y: result.position.y },
        ],
        velocity: [
          ...prev.velocity.slice(-100),
          { x: timeRef.current, y: result.speed },
        ],
        energy: [
          ...prev.energy.slice(-100),
          { x: timeRef.current, y: result.energy.total },
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
  }, [isRunning, velocity, angle, gravity])

  // Calculate max height and range
  const angleRad = (angle * Math.PI) / 180
  const vx = velocity * Math.cos(angleRad)
  const vy = velocity * Math.sin(angleRad)
  const maxHeight = (vy * vy) / (2 * gravity)
  const range = (velocity * velocity * Math.sin(2 * angleRad)) / gravity
  const flightTime = (2 * vy) / gravity

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
            <span className="gradient-text">Projectile Motion</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore the physics of projectile motion with adjustable parameters
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
                label="Initial Velocity"
                value={velocity}
                onChange={setVelocity}
                min={5}
                max={50}
                step={1}
                unit=" m/s"
              />

              <ParameterControl
                label="Launch Angle"
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
                  <span className="text-gray-600 dark:text-gray-400">Height:</span>
                  <span className="font-semibold">
                    {simulationData?.position.y.toFixed(2) || '0.00'} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Distance:</span>
                  <span className="font-semibold">
                    {simulationData?.position.x.toFixed(2) || '0.00'} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-semibold">
                    {simulationData?.time.toFixed(2) || '0.00'} s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Speed:</span>
                  <span className="font-semibold">
                    {simulationData?.speed.toFixed(2) || '0.00'} m/s
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
                <h3 className="font-semibold mb-2">Calculated Values</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Max Height:</span>
                    <span className="font-semibold">{maxHeight.toFixed(2)} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Range:</span>
                    <span className="font-semibold">{range.toFixed(2)} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Flight Time:</span>
                    <span className="font-semibold">{flightTime.toFixed(2)} s</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[600px] rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800"
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
                <ProjectileVisualization
                  position={simulationData?.position || { x: 0, y: 0, z: 0 }}
                  velocity={simulationData?.velocity || { x: 0, y: 0, z: 0 }}
                  trajectory={trajectory}
                  isRunning={isRunning}
                />
              </Canvas>
            </motion.div>

            {/* Real-time Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PhysicsChart
                data={chartData.position}
                label="Height vs Time"
                color="#e74c3c"
                xLabel="Time (s)"
                yLabel="Height (m)"
              />
              <PhysicsChart
                data={chartData.velocity}
                label="Speed vs Time"
                color="#3498db"
                xLabel="Time (s)"
                yLabel="Speed (m/s)"
              />
              <PhysicsChart
                data={chartData.energy}
                label="Energy vs Time"
                color="#2ecc71"
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

export default ProjectileMotion

