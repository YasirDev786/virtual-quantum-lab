import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'
import { springConfigs } from '../utils/physicsAnimations'

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/simulations', label: 'Simulations', icon: '🔬' },
  { path: '/learn', label: 'Learn', icon: '📚' },
  { path: '/about', label: 'About', icon: '🧭' },
  { path: '/qrng', label: 'ANU QRNG', icon: '🌀' },
]

export const Navbar = () => {
  const location = useLocation()

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50 dark:border-dark-700/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ 
                rotate: 360,
                scale: 1.2,
              }}
              whileTap={{ scale: 0.9 }}
              transition={springConfigs.bouncy}
              className="text-2xl"
            >
              ⚛️
            </motion.div>
            <motion.span 
              className="text-xl font-display font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
              transition={springConfigs.gentle}
            >
              Virtual Quantum Lab
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary-500/10 dark:bg-primary-500/20 rounded-lg"
                      transition={springConfigs.bouncy}
                    />
                  )}
                  <motion.span 
                    className="relative flex items-center space-x-2 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={springConfigs.gentle}
                  >
                    <motion.span
                      animate={isActive ? { 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1],
                      } : {}}
                      transition={{
                        duration: 0.6,
                        repeat: isActive ? Infinity : 0,
                        repeatDelay: 2,
                      }}
                    >
                      {item.icon}
                    </motion.span>
                    <span className={isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}>
                      {item.label}
                    </span>
                  </motion.span>
                </Link>
              )
            })}
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200/50 dark:border-dark-700/50">
        <div className="px-4 py-2 flex space-x-2 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}

