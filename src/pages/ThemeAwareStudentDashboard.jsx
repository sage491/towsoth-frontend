import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge.jsx';
import { useAuth } from '@/contexts/AuthContext'
import { ThemeContext } from '@/contexts/ThemeContext'
import { subjectsAPI, progressAPI, authAPI, setUserProfile, notesAPI, videosAPI, announcementsAPI } from '@/services/api';
import { ThemeToggle } from '@/components/ThemeToggle'
import OwlLogo from '@/components/OwlLogo'
import { 
  Trophy, 
  TrendingUp, 
  LogOut, 
  Play,
  FileText,
  Clock,
  Award,
  BarChart3,
  Activity,
  Calendar,
  Star,
  Zap,
  User,
  Loader2,
  ChevronRight,
  Target,
  BookMarked,
  Video,
  CheckCircle
} from 'lucide-react'

const ThemeAwareStudentDashboard = () => {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth()
  const { theme } = useContext(ThemeContext)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  // Popups removed: subject selection now happens in Profile
  const [error, setError] = useState(null)
  const [filteredNotes, setFilteredNotes] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [announcements, setAnnouncements] = useState([])
  // No onboarding persistence needed

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Build subject list from user's selected subjects to avoid relying on /subjects/enrolled
        const selectedSubjects = Array.isArray(user?.selectedSubjects)
          ? user.selectedSubjects.filter(Boolean)
          : []

        let subjectsList = []
        if (selectedSubjects.length > 0) {
          try {
            const details = await Promise.all(
              selectedSubjects.map(async (id) => {
                try {
                  const resp = await subjectsAPI.getById(id)
                  return resp?.data || resp
                } catch (e) {
                  return null
                }
              })
            )
            subjectsList = details.filter(Boolean)
          } catch (subErr) {
            console.warn('Failed to fetch selected subject details:', subErr)
          }
        }

        const progressResponse = await progressAPI.getDashboardData()
        const progressSubjects = Array.isArray(progressResponse?.subjects)
          ? progressResponse.subjects
          : Array.isArray(progressResponse?.data?.subjects)
            ? progressResponse.data.subjects
            : []

        // Merge selected subject details with per-subject progress
        const mergedSubjects = (subjectsList || []).map((detail) => {
          const detailId = detail?._id || detail?.id
          const ps = progressSubjects.find((s) => {
            const sid = s?._id || s?.id
            return sid && detailId && String(sid) === String(detailId)
          })
          return {
            ...detail,
            id: detailId,
            progress: ps?.progress || 0,
            totalNotes: ps?.totalNotes || 0,
            completedNotes: ps?.completedNotes || 0,
            totalVideos: ps?.totalVideos || 0,
            watchedVideos: ps?.watchedVideos || 0,
          }
        })

        // Compute stats from merged subjects
        const overallProgress = mergedSubjects.length > 0
          ? Math.round(mergedSubjects.reduce((acc, s) => acc + (s.progress || 0), 0) / mergedSubjects.length)
          : 0
        const totalNotesRead = mergedSubjects.reduce((acc, s) => acc + (s.completedNotes || 0), 0)
        const totalVideosWatched = mergedSubjects.reduce((acc, s) => acc + (s.watchedVideos || 0), 0)

        const combinedData = {
          subjects: mergedSubjects,
          recentActivity: [],
          stats: { overallProgress, totalNotesRead, totalVideosWatched }
        }

        setDashboardData(combinedData)

        // Fetch content: notes and videos for selected subjects only
        try {
          const subjectIdsForNotes = selectedSubjects
          const subjectIdsForVideos = selectedSubjects
          const notesPromises = subjectIdsForNotes.map((id) => notesAPI.getBySubject(id))
          const videosPromises = subjectIdsForVideos.map((id) => videosAPI.getBySubject(id))
          const [notesResults, videosResults] = await Promise.all([
            Promise.all(notesPromises),
            Promise.all(videosPromises),
          ])
          const allNotes = notesResults.flatMap(r => r.data || r)
          const allVideos = videosResults.flatMap(r => r.data || r)
          setFilteredNotes(allNotes)
          setFilteredVideos(allVideos)
        } catch (contentErr) {
          console.error('Failed to fetch filtered content:', contentErr)
        }

        // Fetch announcements for dashboard box
        try {
          const annRes = await announcementsAPI.getAnnouncements()
          const annList = Array.isArray(annRes?.data) ? annRes.data : (Array.isArray(annRes) ? annRes : [])
          setAnnouncements(annList)
        } catch (annErr) {
          // Non-fatal: dashboard works without announcements
        }

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Refresh dashboard data when the tab regains focus or becomes visible
  useEffect(() => {
    const refreshDashboard = async () => {
      try {
        const selectedSubjects = (Array.isArray(user?.selectedSubjects) ? user.selectedSubjects.filter(Boolean) : [])

        let subjectsList = []
        if (selectedSubjects.length > 0) {
          try {
            const details = await Promise.all(
              selectedSubjects.map(async (id) => {
                try {
                  const resp = await subjectsAPI.getById(id)
                  return resp?.data || resp
                } catch (e) {
                  return null
                }
              })
            )
            subjectsList = details.filter(Boolean)
          } catch (subErr) {
            // Non-fatal
          }
        }

        const progressResponse = await progressAPI.getDashboardData()
        const progressSubjects = Array.isArray(progressResponse?.subjects)
          ? progressResponse.subjects
          : Array.isArray(progressResponse?.data?.subjects)
            ? progressResponse.data.subjects
            : []

        const mergedSubjects = (subjectsList || []).map((detail) => {
          const detailId = detail?._id || detail?.id
          const ps = progressSubjects.find((s) => {
            const sid = s?._id || s?.id
            return sid && detailId && String(sid) === String(detailId)
          })
          return {
            ...detail,
            id: detailId,
            progress: ps?.progress || 0,
            totalNotes: ps?.totalNotes || 0,
            completedNotes: ps?.completedNotes || 0,
            totalVideos: ps?.totalVideos || 0,
            watchedVideos: ps?.watchedVideos || 0,
          }
        })

        const overallProgress = mergedSubjects.length > 0
          ? Math.round(mergedSubjects.reduce((acc, s) => acc + (s.progress || 0), 0) / mergedSubjects.length)
          : 0
        const totalNotesRead = mergedSubjects.reduce((acc, s) => acc + (s.completedNotes || 0), 0)
        const totalVideosWatched = mergedSubjects.reduce((acc, s) => acc + (s.watchedVideos || 0), 0)

        const combinedData = {
          subjects: mergedSubjects,
          recentActivity: [],
          stats: { overallProgress, totalNotesRead, totalVideosWatched }
        }
        setDashboardData(combinedData)

        try {
          const subjectIdsForNotes = selectedSubjects
          const subjectIdsForVideos = selectedSubjects
          const notesPromises = subjectIdsForNotes.map((id) => notesAPI.getBySubject(id))
          const videosPromises = subjectIdsForVideos.map((id) => videosAPI.getBySubject(id))
          const [notesResults, videosResults] = await Promise.all([
            Promise.all(notesPromises),
            Promise.all(videosPromises),
          ])
          const allNotes = notesResults.flatMap(r => r.data || r)
          const allVideos = videosResults.flatMap(r => r.data || r)
          setFilteredNotes(allNotes)
          setFilteredVideos(allVideos)
        } catch (contentErr) {
          console.error('Failed to refresh filtered content:', contentErr)
        }
      } catch (err) {
        // Non-fatal: keep dashboard usable
      }
    }

    const onFocus = () => refreshDashboard()
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refreshDashboard()
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [user?.year, user?.selectedSubjects])

  const handleLogout = () => {
    logout()
    navigate('/')
  }
  // Pop-up year/subject save handlers removed; selection is managed via Profile

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

  const { subjects = [], recentActivity = [], stats = {} } = dashboardData || {}
  const overallProgress = stats.overallProgress || 0
  const selectedIds = Array.isArray(user?.selectedSubjects)
    ? user.selectedSubjects.filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto responsive-padding">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link to="/" className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <OwlLogo size="small" />
              </div>
              <span className="text-lg sm:text-xl font-bold truncate">TOWSOTH</span>
            </Link>
            
              <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
                <ThemeToggle />
                <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="truncate max-w-24 sm:max-w-none">{user?.name || 'Student'}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="touch-target">
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto responsive-padding">
        {/* Pop-ups removed. Students manage year and subjects in Profile. */}
        {/* Welcome Section */}
        <div className="responsive-margin mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="text-muted-foreground zoom-text">Continue your learning journey</p>
        </div>

        {/* Stats Overview */}
        <div className="responsive-grid mb-6 sm:mb-8">
          <Card className="min-w-0">
            <CardContent className="responsive-padding">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground truncate">Overall Progress</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{overallProgress}%</p>
                </div>
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 flex-shrink-0 ml-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="min-w-0">
            <CardContent className="responsive-padding">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground truncate">Subjects</p>
                  <p className="text-xl sm:text-2xl font-bold">{subjects.length}</p>
                </div>
                <BookMarked className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0 ml-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="min-w-0">
            <CardContent className="responsive-padding">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground truncate">Notes Read</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.totalNotesRead || 0}</p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0 ml-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="min-w-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Videos Watched</p>
                  <p className="text-2xl font-bold">{stats.totalVideosWatched || 0}</p>
                </div>
                <Video className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Subjects Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Your Subjects</h2>
              <Button 
                variant="outline" 
                onClick={() => navigate('/progress')}
                className="text-sm"
              >
                View All Progress
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            {subjects.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <OwlLogo className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No subjects yet</h3>
                  <p className="text-muted-foreground mb-4">Go to your Profile to select year and subjects.</p>
                  <div className="flex items-center justify-center gap-3">
                    <Button variant="outline" onClick={() => navigate('/profile')}>
                      Go to Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {subjects.slice(0, 4).map((subject) => (
                  <Card key={subject._id || subject.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground">{subject.description}</p>
                        </div>
                        <Badge variant={(subject.progress || 0) >= 80 ? "default" : "secondary"}>
                          {(subject.progress ?? 0)}% Complete
                        </Badge>
                      </div>
                      
                      <Progress value={subject.progress || 0} className="mb-4" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {subject.completedNotes || 0}/{subject.totalNotes || 0} Notes
                          </span>
                          <span className="flex items-center">
                            <Video className="h-4 w-4 mr-1" />
                            {subject.watchedVideos || 0}/{subject.totalVideos || 0} Videos
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/subject/${subject.id}`)}
                        >
                          Continue Learning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Quick Actions at top */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/progress')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Progress
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Announcements Box below Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Announcements</CardTitle>
                <CardDescription>Latest updates from admins</CardDescription>
              </CardHeader>
              <CardContent>
                {Array.isArray(announcements) && announcements.length > 0 ? (
                  <div className="space-y-3">
                    {announcements.slice(0, 3).map((a) => (
                      <div key={a.id ?? a._id} className="border rounded-md p-3">
                        <p className="text-sm font-medium">{a.title}</p>
                        {a.content && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{a.content}</p>
                        )}
                        {a.date && (
                          <p className="text-xs text-muted-foreground mt-1">{new Date(a.date).toLocaleDateString()}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No announcements</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filtered Content Section (Recommended) */}
        <div className="mt-4 space-y-6">
          <h2 className="text-2xl font-semibold">Recommended Content</h2>
          {/* Notes (PDFs) */}
          {filteredNotes.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center"><FileText className="h-4 w-4 mr-2" /> Notes</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredNotes.slice(0, 4).map((note) => (
                  <Card key={note._id || note.id}>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <Link to={`/note/${note._id || note.id}`} className="font-semibold text-primary hover:underline">
                          {note.title}
                        </Link>
                        {note.description && (
                          <p className="text-sm text-muted-foreground mt-1">{note.description}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {filteredVideos.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center"><Video className="h-4 w-4 mr-2" /> Videos</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredVideos.slice(0, 4).map((video) => (
                  <Card key={video._id || video.id}>
                    <CardContent className="p-0">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <iframe
                          src={(function normalize(rawUrl) {
                            if (!rawUrl || typeof rawUrl !== 'string') return ''
                            try {
                              const isYouTube = rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be')
                              if (!isYouTube) return rawUrl
                              const match = rawUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
                              const id = match ? match[1] : null
                              if (!id) return rawUrl
                              const orig = new URL(rawUrl)
                              const params = new URLSearchParams()
                              const list = orig.searchParams.get('list')
                              const start = orig.searchParams.get('start') || orig.searchParams.get('t')
                              if (list) params.set('list', list)
                              if (start) params.set('start', start)
                              const qs = params.toString()
                              return `https://www.youtube.com/embed/${id}${qs ? `?${qs}` : ''}`
                            } catch {
                              return rawUrl
                            }
                          })(video.video_url || video.videoURL)}
                          title={video.title}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="p-4">
                        <p className="font-semibold">{video.title}</p>
                        <p className="text-sm text-muted-foreground">{video.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ThemeAwareStudentDashboard