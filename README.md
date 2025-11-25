# Virtual Quantum Lab - Physics Simulation Platform

A modern, browser-based physics simulation and visualization platform built with React, Three.js, and Tailwind CSS.

## 🚀 Features

- **Real-Time Physics Simulations** - Interactive 2D and 3D physics visualizations
- **Modern UI/UX** - Beautiful, responsive design with smooth animations
- **Dark Mode** - Seamless light/dark theme switching
- **Multiple Physics Categories** - Classical Mechanics, Electromagnetism, Waves & Optics, Quantum Mechanics, and Relativity
- **Experiment Builder** - Drag-and-drop interface for creating custom experiments
- **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Three.js** - 3D graphics (ready for implementation)
- **React Router** - Navigation

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## 🏗️ Build

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
quantum-vision/
├── src/
│   ├── components/      # Reusable React components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── ThemeToggle.jsx
│   ├── context/         # React context providers
│   │   └── ThemeContext.jsx
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── Simulations.jsx
│   │   ├── ExperimentBuilder.jsx
│   │   ├── Learn.jsx
│   │   └── About.jsx
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css      # Global styles
├── public/             # Static assets
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🎨 Pages

- **Home** - Hero section with call-to-action buttons and feature overview
- **Simulations** - Browse available physics simulations (placeholders for now)
- **Experiment Builder** - Drag-and-drop interface for creating custom experiments
- **Learn** - Educational content and physics concepts
- **About** - Project information and team details

## 🌙 Dark Mode

The app includes a fully functional dark mode that:
- Persists user preference in localStorage
- Respects system preferences on first visit
- Smoothly transitions between themes

## 🚧 Coming Soon

- AI Physics Assistant integration
- Full physics simulation implementations
- Interactive 3D visualizations with Three.js
- Experiment saving and sharing
- Advanced simulation parameters

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

