import React, { useState, useEffect } from 'react'

export const AnimatedCounter = ({ value, className = '', duration = 1000 }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let start = 0
    const end = parseInt(value)
    
    // Make sure we don't exceed the value
    if (start === end) return
    
    // Calculate the increment per frame to achieve smooth animation
    const totalFrames = Math.round(duration / 16)
    const incrementPerFrame = (end - start) / totalFrames
    
    let currentCount = start
    
    // Use requestAnimationFrame for smoother animation
    const counter = setInterval(() => {
      currentCount += incrementPerFrame
      
      // Make sure we don't exceed the target value
      if (currentCount >= end) {
        clearInterval(counter)
        setCount(end)
      } else {
        setCount(Math.floor(currentCount))
      }
    }, 16)
    
    return () => {
      clearInterval(counter)
    }
  }, [value, duration])
  
  return <span className={className}>{count}</span>
}