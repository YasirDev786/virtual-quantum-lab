import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FooterLink = ({ to, children }) => (
  <motion.li
    whileHover={{ x: 5 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <Link
      to={to}
      className="text-base text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
    >
      {children}
    </Link>
  </motion.li>
);

const Particle = ({ delay }) => (
  <motion.div
    className="absolute rounded-full bg-primary-500/10 dark:bg-primary-400/5 blur-3xl pointer-events-none"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{
      y: [0, -50, 0],
      x: [0, 30, 0],
      opacity: [0.1, 0.3, 0.1],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 15 + Math.random() * 10,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
    style={{
      width: Math.random() * 200 + 100,
      height: Math.random() * 200 + 100,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
  />
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-800 overflow-hidden transition-colors duration-300">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <Particle key={i} delay={i * 2} />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-3xl"
              >
                ⚛️
              </motion.div>
              <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">
                Virtual Quantum Lab
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Bridging the gap between theoretical physics and visual understanding through real-time simulations, 3D environments, and AI-assisted learning.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/simulations">Simulations</FooterLink>
              <FooterLink to="/learn">Learning Center</FooterLink>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Tools & AI
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/qrng">Quantum RNG</FooterLink>
              <FooterLink to="/qubit-ai">Qubit AI Assistant</FooterLink>
              <FooterLink to="/simulations/quantum-mechanics">Quantum Lab</FooterLink>
              <FooterLink to="/simulations/relativity">Relativity Engine</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-dark-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} Virtual Quantum Lab. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <motion.div 
                className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Systems Operational</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
