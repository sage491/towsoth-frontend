import React, { useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ThemeContext } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { subjectsAPI, progressAPI } from '@/services/api'
import OwlLogo from '@/components/OwlLogo'
import { Loader2, BookMarked, Video as VideoIcon } from 'lucide-react'

const normalizeSubjectsResponse = (resp) => {
  // Handle both { data: [] } and [] forms
  const arr = Array.isArray(resp?.data) ? resp.data : (Array.isArray(resp) ? resp : [])
  return Array.isArray(arr) ? arr : []
}

const SubjectsListPage = () => {
  const { user } = useAuth()
  const { theme } = useContext(ThemeContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [isShowingSelected, setIsShowingSelected] = useState(false)

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true)
        setError(null)

        const selectedIds = Array.isArray(user?.selectedSubjects) ? user.selectedSubjects.filter(Boolean) : []

        if (selectedIds.length > 0) {
          setIsShowingSelected(true)
          // Fetch details for selected subjects
          const details = await Promise.all(
            selectedIds.map(async (id) => {
              try {
                const resp = await subjectsAPI.getById(id)
                return resp?.data || resp
              } catch {
                return null
              }
            })
          )
          const subjectDetails = details.filter(Boolean)

          // Fetch dashboard progress to merge per-subject stats
          let progressSubjects = []
          try {
            const progressResponse = await progressAPI.getDashboardData()
            progressSubjects = Array.isArray(progressResponse?.subjects)
              ? progressResponse.subjects
              : Array.isArray(progressResponse?.data?.subjects)
                ? progressResponse.data.subjects
                : []
          } catch {
            progressSubjects = []
          }

          const merged = subjectDetails.map((detail) => {
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
          setSubjects(merged)
        } else {
          setIsShowingSelected(false)
          const resp = await subjectsAPI.getAll()
          const list = normalizeSubjectsResponse(resp)
          setSubjects(list)
        }
      } catch (e) {
        console.error('Failed to fetch subjects:', e)
        setError(e?.message || 'Failed to load subjects')
        setSubjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-muted-foreground">Loading subjects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Unable to load subjects</h1>
          <p className="text-red-400 mb-4">{error}</p>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <OwlLogo className="h-5 w-5" color="white" />
            </div>
            <span className="text-xl font-bold">TOWSOTH</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/progress" className="text-muted-foreground hover:text-foreground transition-colors">Progress</Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{isShowingSelected ? 'My Subjects' : 'All Subjects'}</h2>
            <p className="text-muted-foreground">
              {isShowingSelected 
                ? 'Your selected subjects with progress and resources.' 
                : 'Browse every available subject and jump in.'}
            </p>
          </div>
        </div>

        {subjects.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <OwlLogo className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {isShowingSelected ? 'No subjects selected yet' : 'No subjects available'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {isShowingSelected 
                  ? 'Go to your Profile to select year and subjects.' 
                  : 'Please check back later or contact an administrator.'}
              </p>
              {isShowingSelected && (
                <Button variant="outline" onClick={() => navigate('/profile')}>Go to Profile</Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => {
              const id = subject?._id || subject?.id
              const title = subject?.name || 'Untitled Subject'
              const description = subject?.description || 'No description'
              const year = subject?.year || ''
              const stream = subject?.stream || ''
              const college = subject?.college || ''
              const progress = Math.max(0, Math.min(100, Number(subject?.progress || 0)))
              const totalNotes = Number(subject?.totalNotes || 0)
              const totalVideos = Number(subject?.totalVideos || 0)

              return (
                <Card key={id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{title}</span>
                    </CardTitle>
                    <CardDescription>
                      {[year, stream, college].filter(Boolean).join(' • ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{description}</p>
                    <div className="flex items-center gap-4 mb-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <BookMarked className="h-4 w-4" />
                        <span className="text-xs">{totalNotes} notes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <VideoIcon className="h-4 w-4" />
                        <span className="text-xs">{totalVideos} videos</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <Progress value={progress} />
                      <p className="text-xs text-muted-foreground mt-1">Progress: {progress}%</p>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={() => navigate(`/subject/${id}`)} className="bg-blue-600 hover:bg-blue-700">
                        View Subject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default SubjectsListPage