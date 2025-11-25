import { motion } from 'framer-motion'

const features = [
  {
    icon: '🌐',
    title: '100% Browser-Based',
    description: 'No installations required. Run everything directly in your browser.',
  },
  {
    icon: '⚡',
    title: 'Real-Time Simulations',
    description: 'Interactive physics simulations with instant visual feedback.',
  },
  {
    icon: '🎨',
    title: 'Beautiful Visualizations',
    description: 'Stunning 3D graphics and animations powered by WebGL.',
  },
  {
    icon: '🔬',
    title: 'Educational Focus',
    description: 'Designed for students, teachers, and researchers worldwide.',
  },
  {
    icon: '🚀',
    title: 'Open & Accessible',
    description: 'Free to use, accessible to everyone, anywhere.',
  },
  {
    icon: '🧠',
    title: 'AI-Powered Insights',
    description: 'Get explanations and predictions from AI physics assistant.',
  },
]

export const About = () => {
  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            <span className="gradient-text">About Virtual Quantum Lab</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A world-class, browser-based simulation lab designed to help visualize complex physics
            concepts intuitively and make science accessible to everyone.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 md:p-12 mb-12"
        >
          <h2 className="text-3xl font-display font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Virtual Quantum Lab aims to democratize physics education by providing a powerful,
            accessible platform for visualizing and understanding physical phenomena. We believe
            that everyone should have access to high-quality scientific tools, regardless of
            their location or resources. Our platform helps students, teachers, and researchers
            explore the wonders of physics through interactive, real-time simulations.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass rounded-xl p-6 card-hover"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-display font-bold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-display font-bold mb-6 text-center">
            Built With Modern Technology
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'React.js',
              'Three.js',
              'WebGL',
              'Tailwind CSS',
              'Framer Motion',
              'Vite',
              'JavaScript',
              'TensorFlow.js',
            ].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-center p-4 rounded-lg bg-gray-100 dark:bg-dark-800"
              >
                <span className="font-semibold">{tech}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact/Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="glass rounded-2xl p-8">
            <h2 className="text-3xl font-display font-bold mb-4">Team & Contact</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Virtual Quantum Lab is an open-source educational project
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              For inquiries, contributions, or feedback, please reach out through our repository
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

