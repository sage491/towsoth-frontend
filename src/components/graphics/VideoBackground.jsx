import React from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const VideoBackground = ({ src, poster, className = "" }) => {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const videoRef = React.useRef(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Placeholder video area with gradient background */}
      <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center relative">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
        </div>
        
        {/* Video controls overlay */}
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-sm border border-white/30">
            <Play className="h-8 w-8 text-white ml-1" />
          </div>
          <h3 className="text-white font-semibold mb-2">Learning in Action</h3>
          <p className="text-blue-100 text-sm">Watch how students transform their study habits</p>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animation: `float ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Video controls */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlay}
          className="bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

    </div>
  )
}

export default VideoBackground
