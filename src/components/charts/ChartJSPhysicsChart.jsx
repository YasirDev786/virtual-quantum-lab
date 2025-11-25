import React, { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { useTheme } from '../../context/ThemeContext'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

/**
 * Chart.js-based Physics Chart Component
 * Replaces custom canvas charts with Chart.js for better performance and features
 */
export const ChartJSPhysicsChart = ({
  data = [],
  label = 'Data',
  color = '#4ecdc4',
  xLabel = 'Time (s)',
  yLabel = 'Value',
  type = 'line', // 'line' or 'bar'
  maxPoints = 200,
  showGrid = true,
  showLegend = true,
  animation = true,
  height = 200,
}) => {
  const { theme } = useTheme()
  const chartRef = useRef(null)

  // Prepare chart data
  const chartData = {
    labels: data.map((point, index) => point.x?.toFixed(2) || index.toString()),
    datasets: [
      {
        label: label,
        data: data.map(point => point.y),
        borderColor: color,
        backgroundColor: type === 'bar'
          ? color + '40' // Semi-transparent for bars
          : color + '20', // Very transparent for line background
        borderWidth: type === 'line' ? 2 : 1,
        fill: type === 'line' ? true : false,
        tension: type === 'line' ? 0.1 : 0, // Slight curve for lines
        pointRadius: type === 'line' ? 3 : 0,
        pointHoverRadius: type === 'line' ? 6 : 0,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointBorderWidth: 1,
      },
    ],
  }

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: animation ? {
      duration: 300,
      easing: 'easeOutQuart',
    } : false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
          font: {
            size: 12,
            weight: '500',
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        titleColor: theme === 'dark' ? '#e5e7eb' : '#111827',
        bodyColor: theme === 'dark' ? '#e5e7eb' : '#374151',
        borderColor: color,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context) {
            return `${xLabel}: ${context[0].label}`
          },
          label: function(context) {
            return `${yLabel}: ${context.parsed.y.toFixed(3)}`
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: xLabel,
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          font: {
            size: 12,
            weight: '500',
          },
        },
        grid: {
          display: showGrid,
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
          lineWidth: 1,
        },
        ticks: {
          color: theme === 'dark' ? '#d1d5db' : '#374151',
          font: {
            size: 11,
          },
          maxTicksLimit: 10,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: yLabel,
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          font: {
            size: 12,
            weight: '500',
          },
        },
        grid: {
          display: showGrid,
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
          lineWidth: 1,
        },
        ticks: {
          color: theme === 'dark' ? '#d1d5db' : '#374151',
          font: {
            size: 11,
          },
          callback: function(value) {
            // Format large numbers with scientific notation
            if (Math.abs(value) >= 10000 || Math.abs(value) < 0.01) {
              return value.toExponential(2)
            }
            return value.toFixed(2)
          },
        },
      },
    },
    elements: {
      point: {
        hoverBorderWidth: 2,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  }

  // Update chart theme when theme changes
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current
      chart.update()
    }
  }, [theme])

  return (
    <div style={{ height: `${height}px` }} className="w-full">
      {type === 'line' ? (
        <Line ref={chartRef} data={chartData} options={options} />
      ) : (
        <Bar ref={chartRef} data={chartData} options={options} />
      )}
    </div>
  )
}

export default ChartJSPhysicsChart