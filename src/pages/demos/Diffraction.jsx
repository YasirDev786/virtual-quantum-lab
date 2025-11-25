import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'
import { calculateDiffraction } from '../../physics/WavesOptics'
import ParameterControl from '../../components/ParameterControl'
import { ChartJSPhysicsChart as PhysicsChart } from '../../components/charts/ChartJSPhysicsChart'
import * as THREE from 'three'

/**
 * Diffraction Pattern Visualization
 */
const DiffractionVisualization = ({ wavelength, slitWidth, distance, time }) => {
  const patternRef = useRef()
  const screenRef = useRef()

  useFrame(() => {
    if (!patternRef.current || !screenRef.current) return

    const screenGeometry = screenRef.current.geometry
    const positions = screenGeometry.attributes.position
    const colors = new Float32Array(positions.count * 3)

    // Calculate diffraction pattern on screen
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i)
      const angle = Math.atan(y / distance)
      
      const result = calculateDiffraction({
        wavelength,
        slitWidth,
        distance,
        angle,
      })

      const intensity = result.intensity
      colors[i * 3] = intensity
      colors[i * 3 + 1] = intensity
      colors[i * 3 + 2] = intensity
    }

    screenGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    screenRef.current.material.needsUpdate = true
  })

  return (
    <>
      {/* Slit */}
      <mesh position={[0, 0, -5]}>
        <boxGeometry args={[0.2, slitWidth * 2, 0.1]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>

      {/* Screen with diffraction pattern */}
      <mesh ref={screenRef} position={[0, 0, 5]}>
        <planeGeometry args={[0.5, 10, 1, 200]} />
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} />
      </mesh>

      {/* Light source */}
      <pointLight position={[0, 0, -8]} intensity={2} color="#ffff00" />
    </>
  )
}

export const Diffraction = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [wavelength, setWavelength] = useState(500e-9) // 500 nm
  const [slitWidth, setSlitWidth] = useState(1e-6) // 1 micrometer
  const [distance, setDistance] = useState(1) // 1 meter
  const [chartData, setChartData] = useState([])

  // Calculate diffraction pattern for chart
  useEffect(() => {
    const points = []
    for (let angle = -0.1; angle <= 0.1; angle += 0.001) {
      const result = calculateDiffraction({
        wavelength,
        slitWidth,
        distance,
        angle,
      })
      points.push({
        x: (angle * 180) / Math.PI, // Convert to degrees
        y: result.intensity,
      })
    }
    setChartData(points)
  }, [wavelength, slitWidth, distance])

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
            <span className="gradient-text">Single-Slit Diffraction</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore diffraction patterns through a single slit
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
                label="Wavelength"
                value={wavelength * 1e9} // Convert to nm for display
                onChange={(val) => setWavelength(val * 1e-9)}
                min={400}
                max={700}
                step={10}
                unit=" nm"
              />

              <ParameterControl
                label="Slit Width"
                value={slitWidth * 1e6} // Convert to micrometers
                onChange={(val) => setSlitWidth(val * 1e-6)}
                min={0.1}
                max={10}
                step={0.1}
                unit=" μm"
              />

              <ParameterControl
                label="Screen Distance"
                value={distance}
                onChange={setDistance}
                min={0.5}
                max={3}
                step={0.1}
                unit=" m"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">Diffraction Info</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  Single-slit diffraction creates a central bright fringe with alternating dark and bright fringes.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Pattern width increases with wavelength and decreases with slit width.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Canvas and Chart */}
          <div className="lg:col-span-3 space-y-6">
            {/* 3D Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[400px] rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800"
            >
              <Canvas
                camera={{ position: [0, 0, 10], fov: 50 }}
                gl={{ antialias: true }}
              >
                <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                <gridHelper args={[20, 20]} />
                <axesHelper args={[5]} />
                <DiffractionVisualization
                  wavelength={wavelength}
                  slitWidth={slitWidth}
                  distance={distance}
                  time={0}
                />
              </Canvas>
            </motion.div>

            {/* Intensity Pattern Chart */}
            <PhysicsChart
              data={chartData}
              label="Diffraction Intensity Pattern"
              color="#9b59b6"
              xLabel="Angle (degrees)"
              yLabel="Intensity"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Diffraction

