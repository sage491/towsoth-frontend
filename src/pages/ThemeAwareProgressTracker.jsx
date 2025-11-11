import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeContext } from '@/contexts/ThemeContext'
import { progressAPI } from '@/services/api';
import { ThemeToggle } from '@/components/ThemeToggle'
import OwlLogo from '@/components/OwlLogo'
import { 
  Trophy, 
  TrendingUp, 
  LogOut, 
  ArrowLeft,
  Target,
  Clock,
  Award,
  BarChart3,
  Activity,
  Calendar,
  Star,
  Zap,
  User,
  Loader2
} from 'lucide-react'

const ThemeAwareProgressTracker = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme } = useContext(ThemeContext)
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState([])
  const [userProgress, setUserProgress] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Guard: Only students should call progress endpoints
        if (!user || user.role !== 'student') {
          setError('Progress tracking is available to students only.')
          setSubjects([])
          setUserProgress(null)
          return
        }
        
        const response = await progressAPI.getDashboardData()
        
        if (response.success) {
          setSubjects(response.subjects || [])
          setUserProgress(response.user)
        } else {
          throw new Error(response.message || 'Failed to fetch progress data')
        }
        
      } catch (err) {
        console.error('Failed to fetch progress data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProgressData()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-muted-foreground">Loading progress...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Error loading progress</h1>
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const overallProgress = subjects.length > 0 
    ? Math.round(subjects.reduce((acc, subject) => acc + subject.progress, 0) / subjects.length)
    : 0

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <OwlLogo className="h-5 w-5" color="white" />
                </div>
                <span className="text-xl font-bold">TOWSOTH</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.name || 'Student'}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Progress Tracker</h1>
          <p className="text-muted-foreground">Track your learning progress across all subjects</p>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-primary">{overallProgress}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{subjects.length}</div>
                <div className="text-sm text-muted-foreground">Subjects</div>
              </div>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </CardContent>
        </Card>

        {/* Subject Progress */}
        <div className="grid gap-6">
          <h2 className="text-2xl font-semibold flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-primary" />
            Subject Progress
          </h2>
          
          {subjects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <OwlLogo className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No subjects found</h3>
                <p className="text-muted-foreground mb-4">Start learning by exploring available subjects</p>
                <Button onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <CardDescription>
                      {subject.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span className="font-semibold">{subject.progress}%</span>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="font-semibold text-primary">{subject.completedNotes || 0}</div>
                          <div className="text-muted-foreground">Notes Read</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="font-semibold text-secondary">{subject.watchedVideos || 0}</div>
                          <div className="text-muted-foreground">Videos Watched</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex space-x-2">
                          <div className="text-xs px-2 py-1 bg-primary/20 rounded-full">
                            {subject.totalNotes || 0} Notes
                          </div>
                          <div className="text-xs px-2 py-1 bg-secondary/20 rounded-full">
                            {subject.totalVideos || 0} Videos
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/subject/${subject.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ThemeAwareProgressTracker