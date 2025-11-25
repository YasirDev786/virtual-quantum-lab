import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { PhysicsButton, PhysicsCard } from '../components/physics'
import { springConfigs } from '../utils/physicsAnimations'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

const categories = [
  {
    icon: '🌊',
    title: 'Classical Mechanics',
    description: 'Motion, collisions, pendulums, and projectile physics',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '⚡',
    title: 'Electromagnetism',
    description: 'Electric and magnetic field visualizations',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: '🌐',
    title: 'Waves & Optics',
    description: 'Diffraction, interference, reflection, and refraction',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: '⚛️',
    title: 'Quantum Mechanics',
    description: 'Probability waves, tunneling, and quantum phenomena',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: '🚀',
    title: 'Relativity',
    description: 'Time dilation and Lorentz contraction visualizations',
    color: 'from-red-500 to-rose-500',
  },
]

export const Home = () => {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="inline-block text-6xl md:text-8xl mb-4"
              >
                ⚛️
              </motion.span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6"
            >
              <span className="gradient-text">Virtual Quantum Lab</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto"
            >
              Real-Time Physics Simulation and Visualization Platform
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Visualize, analyze, and understand physics phenomena in your browser.
              From quantum mechanics to relativity — all in real-time.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/simulations">
                <PhysicsButton
                  variant="primary"
                  size="lg"
                  physicsType="bouncy"
                  className="shadow-lg shadow-primary-500/50 hover:shadow-xl hover:shadow-primary-500/50"
                >
                  Start Simulation
                </PhysicsButton>
              </Link>
              <Link to="/learn">
                <PhysicsButton
                  variant="outline"
                  size="lg"
                  physicsType="magnetic"
                  className="border-2 border-gray-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-500"
                >
                  Explore Physics
                </PhysicsButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50/50 dark:bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Explore Physics Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Dive into different realms of physics with interactive simulations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link key={category.title} to="/simulations">
                <PhysicsCard
                  hoverEffect={index % 2 === 0 ? 'lift' : 'magnetic'}
                  className="h-full"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...springConfigs.bouncy, delay: index * 0.1 }}
                  >
                    <motion.div 
                      className="text-4xl mb-4"
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.2,
                      }}
                    >
                      {category.icon}
                    </motion.div>
                    <h3 className="text-xl font-display font-bold mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>
                    <motion.div 
                      className={`mt-4 h-1 bg-gradient-to-r ${category.color} rounded-full`}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ ...springConfigs.gentle, delay: index * 0.1 + 0.3 }}
                    />
                  </motion.div>
                </PhysicsCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Physics Categories', value: '5+' },
              { label: 'Simulations', value: '20+' },
              { label: 'Interactive Tools', value: '10+' },
              { label: 'Real-Time', value: '100%' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-purple-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
          >
            Ready to Explore Physics?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mb-8"
          >
            Explore interactive physics simulations and learn with AI assistance
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/simulations">
              <PhysicsButton
                variant="outline"
                size="lg"
                physicsType="bouncy"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
              >
                View Simulations
              </PhysicsButton>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

