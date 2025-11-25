# Physics Engine Documentation

This directory contains the modular physics simulation engine for Virtual Quantum Lab.

## Structure

```
physics/
├── ClassicalMechanics.js    # Motion, collisions, pendulum, projectile
├── Electromagnetism.js       # Electric & magnetic fields
├── WavesOptics.js            # Diffraction, interference, reflection, refraction
├── QuantumMechanics.js      # Probability waves, tunneling
├── Relativity.js            # Time dilation, Lorentz contraction
└── index.js                 # Main engine interface
```

## Usage

### Basic Example

```javascript
import { PhysicsEngine } from './physics'
import SimulationCanvas from './components/SimulationCanvas'

// In your component
const [simParams, setSimParams] = useState({
  velocity: 20,
  angle: 45,
  gravity: 9.8,
})

<SimulationCanvas
  simulationType="classical"
  simulationFunction="simulateProjectile"
  simulationParams={simParams}
  onSimulationUpdate={(result) => {
    console.log('Position:', result.position)
    console.log('Velocity:', result.velocity)
  }}
/>
```

## Available Modules

### Classical Mechanics
- `simulateProjectile(params)` - Projectile motion
- `simulatePendulum(params)` - Pendulum motion
- `calculateCollision(params)` - Collision physics
- `calculateForce(params)` - Force calculations

### Electromagnetism
- `calculateElectricField(params)` - Electric field at a point
- `calculateMagneticField(params)` - Magnetic field at a point
- `calculateLorentzForce(params)` - Lorentz force calculation

### Waves & Optics
- `calculateInterference(params)` - Wave interference
- `calculateDiffraction(params)` - Diffraction patterns
- `calculateReflection(params)` - Reflection calculations
- `calculateRefraction(params)` - Refraction (Snell's law)

### Quantum Mechanics
- `calculateWaveFunction(params)` - Probability wave function
- `calculateTunneling(params)` - Quantum tunneling probability
- `calculateUncertainty(params)` - Uncertainty principle
- `calculateSuperposition(params)` - Superposition states

### Relativity
- `calculateTimeDilation(params)` - Time dilation
- `calculateLorentzContraction(params)` - Length contraction
- `calculateRelativisticMomentum(params)` - Relativistic momentum
- `calculateLorentzTransformation(params)` - Lorentz transformation

## Three.js Integration

Each module includes a `create*Scene()` function that sets up 3D visualizations:

- `createClassicalMechanicsScene(scene, params)`
- `createElectromagnetismScene(scene, params)`
- `createWavesOpticsScene(scene, params)`
- `createQuantumMechanicsScene(scene, params)`
- `createRelativityScene(scene, params)`

These functions return scene objects with an `update()` method that can be called to update visualizations based on simulation results.

## Physics Engine API

### `PhysicsEngine` Class

```javascript
const engine = new PhysicsEngine()

// Initialize a module
engine.initializeModule('classical', threeScene, { theme: 'dark' })

// Run a simulation
const result = engine.simulate('simulateProjectile', {
  velocity: 20,
  angle: 45,
  gravity: 9.8,
  time: 0.5,
})

// Get available functions
const functions = engine.getAvailableFunctions()
```

## Parameters

Most functions accept a `params` object with relevant physics parameters:

- **Projectile Motion**: `velocity`, `angle`, `gravity`, `mass`, `time`
- **Pendulum**: `length`, `angle`, `gravity`, `time`
- **Electric Field**: `charges[]`, `point`
- **Wave Interference**: `waves[]`, `point`, `time`
- **Quantum Wave Function**: `position`, `time`, `momentum`, `mass`
- **Time Dilation**: `properTime`, `velocity`, `c`

## Notes

- All functions are placeholders with basic implementations
- Full physics formulas will be implemented in future versions
- Three.js scenes include basic visualizations that can be extended
- The engine is designed to be modular and easily extensible

