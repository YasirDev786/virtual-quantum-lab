import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import { Home } from './pages/Home'
import { Simulations } from './pages/Simulations'
import { Learn } from './pages/Learn'
import ProjectileMotion from './pages/demos/ProjectileMotion'
import Pendulum from './pages/demos/Pendulum'
import Collisions from './pages/demos/Collisions'
import ElectricField from './pages/demos/ElectricField'
import ElectricFieldEnhanced from './pages/demos/ElectricFieldEnhanced'
import MagneticField from './pages/demos/MagneticField'
import WaveInterference from './pages/demos/WaveInterference'
import ReflectionRefraction from './pages/demos/ReflectionRefraction'
import Diffraction from './pages/demos/Diffraction'
import QuantumMechanics from './pages/demos/QuantumMechanics'
import Relativity from './pages/demos/Relativity'
import QuantumTunneling from './pages/demos/QuantumTunneling'
import SpacetimeDiagrams from './pages/demos/SpacetimeDiagrams'
import FaradaysLaw from './pages/demos/FaradaysLaw'
import QRNG from './pages/QRNG'
import QubitAI from './pages/QubitAI'
import { QuantumEnvironment } from './components/QuantumEnvironment'
import { FaradayLearning } from './pages/learning/FaradayLearning'
import { ClassicalMechanicsLearning } from './pages/learning/ClassicalMechanicsLearning'
import { ElectromagnetismLearning } from './pages/learning/ElectromagnetismLearning'
import { WavesOpticsLearning } from './pages/learning/WavesOpticsLearning'
import { QuantumMechanicsLearning } from './pages/learning/QuantumMechanicsLearning'
import { RelativityLearning } from './pages/learning/RelativityLearning'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <div className="relative min-h-screen bg-white dark:bg-dark-900 transition-colors duration-300 overflow-hidden">
          <QuantumEnvironment />
          <div className="relative z-10">
            <Navbar />
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulations" element={<Simulations />} />
            <Route path="/simulations/projectile-motion" element={<ProjectileMotion />} />
            <Route path="/simulations/pendulum" element={<Pendulum />} />
            <Route path="/simulations/collisions" element={<Collisions />} />
            <Route path="/simulations/electric-field" element={<ElectricFieldEnhanced />} />
            <Route path="/simulations/magnetic-field" element={<MagneticField />} />
            <Route path="/simulations/wave-interference" element={<WaveInterference />} />
            <Route path="/simulations/reflection-refraction" element={<ReflectionRefraction />} />
            <Route path="/simulations/diffraction" element={<Diffraction />} />
            <Route path="/simulations/quantum-mechanics" element={<QuantumMechanics />} />
            <Route path="/simulations/quantum-tunneling" element={<QuantumTunneling />} />
            <Route path="/simulations/relativity" element={<Relativity />} />
            <Route path="/simulations/spacetime-diagrams" element={<SpacetimeDiagrams />} />
            <Route path="/simulations/faradays-law" element={<FaradaysLaw />} />
            <Route path="/faradays-law" element={<FaradaysLaw />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/faraday" element={<FaradayLearning />} />
            <Route path="/learn/classical" element={<ClassicalMechanicsLearning />} />
            <Route path="/learn/electromagnetism" element={<ElectromagnetismLearning />} />
            <Route path="/learn/waves" element={<WavesOpticsLearning />} />
            <Route path="/learn/quantum" element={<QuantumMechanicsLearning />} />
            <Route path="/learn/relativity" element={<RelativityLearning />} />
            <Route path="/qubit-ai" element={<QubitAI />} />
            <Route path="/qrng" element={<QRNG />} />
          </Routes>
          <Footer />
          </div>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App

