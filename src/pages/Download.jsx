import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Download = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              <span className="gradient-text">Virtual Quantum Lab</span>
              <br />
              <span className="text-gray-900 dark:text-white">Desktop App</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Experience quantum physics simulations with offline support, better performance, and exclusive desktop features.
            </p>
            
            <motion.a
              href="https://github.com/YasirDev786/virtual-quantum-lab/releases/download/v1.0.0/Virtual.Quantum.Lab.Setup.1.0.0.exe"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-lg shadow-lg shadow-primary-500/30 flex items-center justify-center mx-auto space-x-3 inline-flex"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download for Windows (v1.0.0)</span>
            </motion.a>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Windows 10/11 (64-bit) • 150MB
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: "🚀",
              title: "Offline Access",
              desc: "Run simulations anywhere, anytime without an internet connection."
            },
            {
              icon: "⚡",
              title: "Native Performance",
              desc: "Optimized for desktop hardware with smoother 3D rendering."
            },
            {
              icon: "💾",
              title: "Export Tools",
              desc: "Save your simulation results and graphs directly to your computer."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* System Requirements */}
        <div className="max-w-3xl mx-auto glass rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-primary-600 dark:text-primary-400 mb-2">Minimum</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Windows 10 (64-bit)</li>
                <li>• 4GB RAM</li>
                <li>• Intel Core i3 or equivalent</li>
                <li>• Integrated Graphics (DirectX 11)</li>
                <li>• 500MB Free Space</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-primary-600 dark:text-primary-400 mb-2">Recommended</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Windows 11 (64-bit)</li>
                <li>• 8GB RAM</li>
                <li>• Intel Core i5 or better</li>
                <li>• Dedicated GPU (NVIDIA/AMD)</li>
                <li>• SSD Storage</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Download;
