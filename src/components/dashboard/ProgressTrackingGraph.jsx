import React, { useMemo } from 'react'

const ProgressTrackingGraph = React.memo(({ data = [] }) => {
  // Memoize expensive calculations
  const chartData = useMemo(() => {
    // Use provided data or fallback to mock data
    const progressData = data.length > 0
      ? data.map((item, index) => ({
          week: index + 1,
          completed: item.completedItems,
          target: Math.round(item.points / 5) // Convert points to a target value
        }))
      : [
          { week: 1, completed: 20, target: 30 },
          { week: 2, completed: 45, target: 35 },
          { week: 3, completed: 30, target: 40 },
          { week: 4, completed: 25, target: 45 },
          { week: 5, completed: 35, target: 50 },
          { week: 6, completed: 50, target: 55 },
          { week: 7, completed: 60, target: 60 },
        ]

    // Calculate the maximum value for scaling
    const maxValue = Math.max(
      ...progressData.map(d => Math.max(d.completed, d.target))
    )
    
    // Calculate points for the SVG paths
    const completedPoints = progressData.map((d, i) => {
      const x = (i / (progressData.length - 1)) * 100
      const y = 100 - ((d.completed / maxValue) * 100)
      return `${x},${y}`
    }).join(' ')

    const targetPoints = progressData.map((d, i) => {
      const x = (i / (progressData.length - 1)) * 100
      const y = 100 - ((d.target / maxValue) * 100)
      return `${x},${y}`
    }).join(' ')

    return { progressData, maxValue, completedPoints, targetPoints }
  }, [data])

  const { progressData, maxValue, completedPoints, targetPoints } = chartData

  return (
    <div className="w-full h-48">
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        <line x1="0" y1="0" x2="100" y2="0" className="stroke-border" strokeWidth="0.5" />
        <line x1="0" y1="25" x2="100" y2="25" className="stroke-border" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" className="stroke-border" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" className="stroke-border" strokeWidth="0.5" />
        <line x1="0" y1="100" x2="100" y2="100" className="stroke-border" strokeWidth="0.5" />
        
        {/* Vertical grid lines */}
        {progressData.map((_, i) => {
          const x = (i / (progressData.length - 1)) * 100
          return (
            <line 
              key={`grid-${i}`} 
              x1={x} 
              y1="0" 
              x2={x} 
              y2="100" 
              className="stroke-border" 
              strokeWidth="0.5" 
            />
          )
        })}
        
        {/* Target line */}
        <polyline
          fill="none"
          className="stroke-muted-foreground"
          strokeWidth="1"
          strokeDasharray="2"
          points={targetPoints}
        />
        
        {/* Completed line */}
        <polyline
          fill="none"
          className="stroke-primary"
          strokeWidth="2"
          points={completedPoints}
        />
        
        {/* Data points for completed */}
        {progressData.map((d, i) => {
          const x = (i / (progressData.length - 1)) * 100
          const y = 100 - ((d.completed / maxValue) * 100)
          return (
            <circle 
              key={`point-${i}`} 
              cx={x} 
              cy={y} 
              r="1.5" 
              className="fill-primary" 
            />
          )
        })}
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center space-x-4 mt-2 text-xs text-muted-foreground">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-primary rounded-full mr-1"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-muted-foreground rounded-full mr-1"></div>
          <span>Target</span>
        </div>
      </div>
    </div>
  )
})

ProgressTrackingGraph.displayName = 'ProgressTrackingGraph'

export default ProgressTrackingGraph