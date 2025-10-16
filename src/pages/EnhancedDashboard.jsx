import React, { useState, useEffect, useContext, Suspense, lazy } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeContext } from '@/contexts/ThemeContext'
import { progressAPI } from '@/services/api'
import { ThemeToggle } from '@/components/ThemeToggle'
import { 
  Trophy, 
  TrendingUp, 
  LogOut, 
  Play, 
  FileText, 
  User,
  Bell,
  Settings,
  Loader2,
  Target,
  Clock,
  Award,
  BarChart3,
  Activity,
  Calendar,
  ChevronRight,
  Star,
  Zap,
  ArrowLeft,
  ArrowRight,
  Megaphone
} from 'lucide-react'
import OwlLogo from '@/components/OwlLogo'

// Lazy load chart components for better performance
const PerformanceTrendsChart = lazy(() => import('@/components/dashboard/PerformanceTrendsChart'))
const ProgressTrackingGraph = lazy(() => import('@/components/dashboard/ProgressTrackingGraph'))
const DashboardCalendar = lazy(() => import('@/components/dashboard/DashboardCalendar'))

const EnhancedDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme } = useContext(ThemeContext)
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState([])
  const [userProgress, setUserProgress] = useState(null)
  const [error, setError] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [performanceTrends, setPerformanceTrends] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Notice for Exam Schedule',
      content: 'Exams will start on November 15th',
      date: '2023-11-01'
    },
    {
      id: 2,
      title: 'Holiday Announcement',
      content: 'Campus will be closed for holidays',
      date: '2023-12-20'
    }
  ])

  // Slides for the carousel
  const slides = [
    {
      id: 1,
      title: 'Check Your Full Progress',
      image: '/images/progress-slide.jpg',
      link: '/progress'
    },
    {
      id: 2,
      title: 'Complete Your Profile',
      image: '/images/profile-slide.jpg',
      link: '/profile'
    },
    {
      id: 3,
      title: 'Join Study Groups',
      image: '/images/groups-slide.jpg',
      link: '/groups'
    }
  ]

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch enhanced dashboard data
        const response = await progressAPI.getEnhancedDashboardData()
        
        console.log('Enhanced dashboard data:', response)
        
        if (response.success) {
          setSubjects(response.subjects || [])
          setUserProgress(response.user)
          setPerformanceTrends(response.performanceTrends || [])
          setUpcomingEvents(response.upcomingEvents || [])
        } else {
          throw new Error(response.message || 'Failed to fetch dashboard data')
        }
        
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()

    // Auto-advance carousel
    const carouselInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(carouselInterval)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Error loading dashboard</h1>
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <OwlLogo className="h-5 w-5" color="white" />
                </div>
                <span className="text-xl font-bold">TOWSOTH</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
              </Button>
              <ThemeToggle />
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium">{user?.name || 'Student'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="container mx-auto px-6 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Please check your progress below to continue your learning journey.
          </p>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {subjects.slice(0, 3).map((subject, index) => (
            <Card key={subject.id || index} className="bg-card border-border hover:border-primary transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{subject.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {subject.progress}% Complete
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={subject.progress} className="h-2 mb-4" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div>Completed: {subject.completedNotes + subject.watchedVideos}</div>
                  <div>Total: {subject.totalNotes + subject.totalVideos}</div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <div className="text-xs px-2 py-1 bg-primary/20 rounded-full">
                      {subject.totalNotes} Notes
                    </div>
                    <div className="text-xs px-2 py-1 bg-secondary/50 rounded-full">
                      {subject.totalVideos} Videos
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80" onClick={() => navigate(`/subject/${subject.id}`)}>
                    Continue
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance and Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Carousel */}
          <div className="lg:col-span-3 relative overflow-hidden rounded-xl h-48 bg-gradient-to-r from-primary to-secondary">
            <div className="absolute inset-0 flex transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {slides.map((slide, index) => (
                <div key={slide.id} className="min-w-full flex items-center justify-between p-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
                    <Button size="sm" variant="secondary" onClick={() => navigate(slide.link)}>
                      View Details
                    </Button>
                  </div>
                  <div className="text-4xl font-bold">
                    {index + 1}/{slides.length}
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
              onClick={prevSlide}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
              onClick={nextSlide}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/50'}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>

          {/* Performance Trends */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Performance Trends
              </h3>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </div>
            <Suspense fallback={<div className="h-32 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
              <PerformanceTrendsChart data={performanceTrends} />
            </Suspense>
          </div>

          {/* Progress Graph */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                Progress
              </h3>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </div>
            <Suspense fallback={<div className="h-32 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
              <ProgressTrackingGraph data={performanceTrends} />
            </Suspense>
          </div>

          {/* Calendar */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-secondary" />
                Calendar
              </h3>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </div>
            <Suspense fallback={<div className="h-32 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
              <DashboardCalendar events={upcomingEvents} />
            </Suspense>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-card rounded-xl p-4 border border-border mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <Megaphone className="h-5 w-5 mr-2 text-yellow-500" />
              Announcements
            </h3>
            <Button variant="ghost" size="sm" className="text-xs">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {announcements.map(announcement => (
              <div key={announcement.id} className="border-b border-border pb-3 last:border-0">
                <div className="flex justify-between mb-1">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <span className="text-xs text-muted-foreground">{announcement.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{announcement.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedDashboard