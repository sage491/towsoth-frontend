import React, { useState, useEffect } from 'react'
import { Sparkles, Zap, Star, Target, Award, BookOpen } from 'lucide-react'

const InteractiveGraphics = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const graphics = [
    { icon: Sparkles, color: 'text-yellow-400', size: 'h-6 w-6' },
    { icon: Zap, color: 'text-blue-400', size: 'h-5 w-5' },
    { icon: Star, color: 'text-purple-400', size: 'h-4 w-4' },
    { icon: Target, color: 'text-green-400', size: 'h-6 w-6' },
    { icon: Award, color: 'text-orange-400', size: 'h-5 w-5' },
    { icon: BookOpen, color: 'text-indigo-400', size: 'h-4 w-4' }
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 animate-pulse" />
      
      {/* Interactive floating elements */}
      {graphics.map((graphic, index) => {
        const Icon = graphic.icon
        const delay = index * 0.5
        const offsetX = Math.sin((Date.now() / 1000 + delay) * 0.5) * 50
        const offsetY = Math.cos((Date.now() / 1000 + delay) * 0.3) * 30
        
        return (
          <div
            key={index}
            className={`absolute opacity-30 ${graphic.color} transition-all duration-1000`}
            style={{
              left: `${10 + index * 15}%`,
              top: `${20 + (index % 3) * 25}%`,
              transform: `translate(${offsetX}px, ${offsetY}px) scale(${isHovered ? 1.2 : 1})`,
              animation: `float-${index} ${4 + index}s ease-in-out infinite`
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Icon className={graphic.size} />
          </div>
        )
      })}

      {/* Particle system */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle-${i % 3} ${5 + Math.random() * 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Mouse follower effect */}
      <div
        className="absolute w-32 h-32 bg-blue-500/5 rounded-full blur-xl transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
          transform: 'translate3d(0, 0, 0)'
        }}
      />

    </div>
  )
}

export default InteractiveGraphics
