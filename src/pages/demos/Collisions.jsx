import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'
import { calculateCollision } from '../../physics/ClassicalMechanics'
import ParameterControl from '../../components/ParameterControl'
import { ChartJSPhysicsChart as PhysicsChart } from '../../components/charts/ChartJSPhysicsChart'
import * as THREE from 'three'

/**
 * Collision Visualization Component
 */
const CollisionVisualization = ({
  object1,
  object2,
  collisionResult,
  showTrajectories = true,
}) => {
  const obj1Ref = useRef()
  const obj2Ref = useRef()
  const trajectory1Ref = useRef([])
  const trajectory2Ref = useRef([])

  useEffect(() => {
    if (obj1Ref.current) {
      obj1Ref.current.position.set(object1.position.x, object1.position.y, 0)
    }
    if (obj2Ref.current) {
      obj2Ref.current.position.set(object2.position.x, object2.position.y, 0)
    }
  }, [object1.position, object2.position])

  // Update trajectories
  useEffect(() => {
    if (showTrajectories) {
      trajectory1Ref.current.push({ ...object1.position })
      trajectory2Ref.current.push({ ...object2.position })
      
      // Keep last 50 points
      if (trajectory1Ref.current.length > 50) {
        trajectory1Ref.current.shift()
      }
      if (trajectory2Ref.current.length > 50) {
        trajectory2Ref.current.shift()
      }
    }
  }, [object1.position, object2.position, showTrajectories])

  return (
    <>
      {/* Object 1 */}
      <mesh ref={obj1Ref} position={[object1.position.x, object1.position.y, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#e74c3c"
          emissive="#e74c3c"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Object 2 */}
      <mesh ref={obj2Ref} position={[object2.position.x, object2.position.y, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#3498db"
          emissive="#3498db"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Trajectories */}
      {showTrajectories && (
        <>
          {trajectory1Ref.current.length > 1 && (
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={trajectory1Ref.current.length}
                  array={new Float32Array(
                    trajectory1Ref.current.flatMap((p) => [p.x, p.y, p.z])
                  )}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#e74c3c" linewidth={2} />
            </line>
          )}
          {trajectory2Ref.current.length > 1 && (
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={trajectory2Ref.current.length}
                  array={new Float32Array(
                    trajectory2Ref.current.flatMap((p) => [p.x, p.y, p.z])
                  )}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#3498db" linewidth={2} />
            </line>
          )}
        </>
      )}

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#95a5a6" />
      </mesh>
    </>
  )
}

export const Collisions = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [mass1, setMass1] = useState(1)
  const [velocity1, setVelocity1] = useState(2)
  const [mass2, setMass2] = useState(1)
  const [velocity2, setVelocity2] = useState(-1)
  const [restitution, setRestitution] = useState(1) // 1 = elastic, 0 = inelastic
  const [isRunning, setIsRunning] = useState(false)
  const [object1, setObject1] = useState({ position: { x: -3, y: 0, z: 0 }, velocity: { x: 2, y: 0 } })
  const [object2, setObject2] = useState({ position: { x: 3, y: 0, z: 0 }, velocity: { x: -1, y: 0 } })
  const [collisionResult, setCollisionResult] = useState(null)
  const [chartData, setChartData] = useState({ momentum: [], energy: [] })
  const timeRef = useRef(0)
  const animationFrameRef = useRef(null)
  const hasCollidedRef = useRef(false)

  // Reset positions when parameters change
  useEffect(() => {
    setObject1({ position: { x: -3, y: 0, z: 0 }, velocity: { x: velocity1, y: 0 } })
    setObject2({ position: { x: 3, y: 0, z: 0 }, velocity: { x: velocity2, y: 0 } })
    hasCollidedRef.current = false
    setCollisionResult(null)
    setChartData({ momentum: [], energy: [] })
  }, [mass1, mass2, velocity1, velocity2, restitution])

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      timeRef.current = 0
      hasCollidedRef.current = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const animate = () => {
      timeRef.current += 0.016 // ~60fps
      const dt = 0.016

      // Update positions
      setObject1((prev) => ({
        ...prev,
        position: {
          x: prev.position.x + prev.velocity.x * dt,
          y: prev.position.y + prev.velocity.y * dt,
          z: 0,
        },
      }))

      setObject2((prev) => ({
        ...prev,
        position: {
          x: prev.position.x + prev.velocity.x * dt,
          y: prev.position.y + prev.velocity.y * dt,
          z: 0,
        },
      }))

      // Check for collision
      const distance = Math.abs(object1.position.x - object2.position.x)
      if (distance < 0.6 && !hasCollidedRef.current) {
        hasCollidedRef.current = true
        
        const result = calculateCollision({
          object1: { mass: mass1, velocity: object1.velocity },
          object2: { mass: mass2, velocity: object2.velocity },
          restitution,
        })

        setCollisionResult(result)
        setObject1((prev) => ({ ...prev, velocity: result.object1.velocity }))
        setObject2((prev) => ({ ...prev, velocity: result.object2.velocity }))
      }

      // Update chart data
      const totalMomentum = mass1 * object1.velocity.x + mass2 * object2.velocity.x
      const totalEnergy =
        0.5 * mass1 * object1.velocity.x * object1.velocity.x +
        0.5 * mass2 * object2.velocity.x * object2.velocity.x

      setChartData((prev) => ({
        momentum: [
          ...prev.momentum.slice(-100),
          { x: timeRef.current, y: totalMomentum },
        ],
        energy: [
          ...prev.energy.slice(-100),
          { x: timeRef.current, y: totalEnergy },
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
  }, [isRunning, mass1, mass2, velocity1, velocity2, restitution, object1.velocity, object2.velocity])

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
            <span className="gradient-text">Elastic Collisions</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore conservation of momentum and energy in collisions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Object 1 Parameters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-xl p-6 space-y-6"
            >
              <h2 className="text-xl font-display font-bold">Object 1 (Red)</h2>

              <ParameterControl
                label="Mass"
                value={mass1}
                onChange={setMass1}
                min={0.1}
                max={5}
                step={0.1}
                unit=" kg"
              />

              <ParameterControl
                label="Initial Velocity"
                value={velocity1}
                onChange={setVelocity1}
                min={-5}
                max={5}
                step={0.1}
                unit=" m/s"
              />
            </motion.div>

            {/* Object 2 Parameters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6 space-y-6"
            >
              <h2 className="text-xl font-display font-bold">Object 2 (Blue)</h2>

              <ParameterControl
                label="Mass"
                value={mass2}
                onChange={setMass2}
                min={0.1}
                max={5}
                step={0.1}
                unit=" kg"
              />

              <ParameterControl
                label="Initial Velocity"
                value={velocity2}
                onChange={setVelocity2}
                min={-5}
                max={5}
                step={0.1}
                unit=" m/s"
              />
            </motion.div>

            {/* Collision Parameters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6 space-y-6"
            >
              <h2 className="text-xl font-display font-bold">Collision</h2>

              <ParameterControl
                label="Restitution (e)"
                value={restitution}
                onChange={setRestitution}
                min={0}
                max={1}
                step={0.1}
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

            {/* Collision Results */}
            {collisionResult && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-xl p-6"
              >
                <h2 className="text-xl font-display font-bold mb-4">Collision Results</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold mb-2">Object 1 Final:</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      v = {collisionResult.object1.velocity.x.toFixed(2)} m/s
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      KE = {collisionResult.object1.kineticEnergy.toFixed(2)} J
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Object 2 Final:</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      v = {collisionResult.object2.velocity.x.toFixed(2)} m/s
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      KE = {collisionResult.object2.kineticEnergy.toFixed(2)} J
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-dark-700">
                    <div className="text-gray-600 dark:text-gray-400">
                      Momentum conserved: {Math.abs(collisionResult.totalMomentum.initial - collisionResult.totalMomentum.final) < 0.01 ? '✓' : '✗'}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
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
                <CollisionVisualization
                  object1={{ ...object1, mass: mass1 }}
                  object2={{ ...object2, mass: mass2 }}
                  collisionResult={collisionResult}
                  showTrajectories={true}
                />
              </Canvas>
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PhysicsChart
                data={chartData.momentum}
                label="Total Momentum vs Time"
                color="#9b59b6"
                xLabel="Time (s)"
                yLabel="Momentum (kg⋅m/s)"
              />
              <PhysicsChart
                data={chartData.energy}
                label="Total Energy vs Time"
                color="#f39c12"
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

export default Collisions

