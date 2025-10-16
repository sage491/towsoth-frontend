import React from 'react'
import { BookOpen, Trophy, Target, Star, Zap, Award } from 'lucide-react'

const FloatingElements = () => {
  const elements = [
    { icon: BookOpen, delay: 0, duration: 6 },
    { icon: Trophy, delay: 1, duration: 8 },
    { icon: Target, delay: 2, duration: 7 },
    { icon: Star, delay: 3, duration: 9 },
    { icon: Zap, delay: 4, duration: 6 },
    { icon: Award, delay: 5, duration: 8 }
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element, index) => {
        const Icon = element.icon
        return (
          <div
            key={index}
            className={`absolute opacity-10 text-blue-400`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${element.duration}s ease-in-out infinite`,
              animationDelay: `${element.delay}s`
            }}
          >
            <Icon className="h-8 w-8" />
          </div>
        )
      })}
      
    </div>
  )
}

export default FloatingElements
