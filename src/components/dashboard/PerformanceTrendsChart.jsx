import React, { useMemo } from 'react'
import { Card } from '@/components/ui/card'

const PerformanceTrendsChart = React.memo(({ data = [] }) => {
  // Memoize expensive calculations
  const chartData = useMemo(() => {
    const weeklyData = data.length > 0 
      ? data.map(item => item.points) 
      : [65, 59, 80, 81, 56, 55, 72]
    const maxValue = Math.max(...weeklyData)
    
    return { weeklyData, maxValue }
  }, [data])
  
  const { weeklyData, maxValue } = chartData
  
  return (
    <div className="w-full">
      {/* Bar Chart */}
      <div className="flex items-end h-32 space-x-2 mb-4">
        {weeklyData.map((value, index) => {
          const height = (value / maxValue) * 100
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-primary rounded-t-sm" 
                style={{ height: `${height}%` }}
              ></div>
              <div className="text-xs text-muted-foreground mt-1">
                {data.length > 0 
                  ? new Date(data[index].date).getDate()
                  : `D${index + 1}`
                }
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Circular Progress */}
      <div className="flex justify-center mt-4">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              className="text-muted stroke-current" 
              strokeWidth="10" 
              cx="50" 
              cy="50" 
              r="40" 
              fill="transparent"
            ></circle>
            <circle 
              className="text-primary stroke-current" 
              strokeWidth="10" 
              strokeLinecap="round" 
              cx="50" 
              cy="50" 
              r="40" 
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset="50.24"
              transform="rotate(-90 50 50)"
            ></circle>
            <text 
              x="50" 
              y="50" 
              dominantBaseline="middle" 
              textAnchor="middle" 
              className="text-2xl font-bold fill-foreground"
            >
              80%
            </text>
          </svg>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <Card className="bg-card p-2 text-center">
          <div className="text-xs text-muted-foreground">Hours</div>
          <div className="text-lg font-bold text-foreground">56 hrs</div>
        </Card>
        <Card className="bg-card p-2 text-center">
          <div className="text-xs text-muted-foreground">Score</div>
          <div className="text-lg font-bold text-foreground">92%</div>
        </Card>
      </div>
    </div>
  )
})

PerformanceTrendsChart.displayName = 'PerformanceTrendsChart'

export default PerformanceTrendsChart