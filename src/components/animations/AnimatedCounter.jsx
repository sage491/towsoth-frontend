import React, { useState, useEffect } from 'react'

const AnimatedCounter = ({ end, duration = 2000, start = 0 }) => {
  const [count, setCount] = useState(start)

  useEffect(() => {
    let startTime = null
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * (end - start) + start)
      
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [end, duration, start])

  return <span>{count}</span>
}

export default AnimatedCounter
