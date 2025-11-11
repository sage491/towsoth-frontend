import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeContext } from '@/contexts/ThemeContext'
import { subjectsAPI, notesAPI, videosAPI, progressAPI } from '@/services/api'
import { downloadFromSupabase } from '@/services/supabase'
import FloatingElements from '@/components/animations/FloatingElements'
import { ThemeToggle } from '@/components/ThemeToggle'
import OwlLogo from '@/components/OwlLogo'
import { 
  ArrowLeft, 
  FileText, 
  Play, 
  CheckCircle, 
  Clock,
  Download,
  ExternalLink,
  User,
  LogOut,
  Loader2,
  Zap,
  Target,
  Award
} from 'lucide-react'
import NoteViewer from '@/components/NoteViewer'

const SubjectPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { theme } = useContext(ThemeContext)
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState(null)
  const [subjectNotes, setSubjectNotes] = useState([])
  const [subjectVideos, setSubjectVideos] = useState([])
  const [completedItems, setCompletedItems] = useState(new Set())
  const [error, setError] = useState(null)
  const [videoAccessDenied, setVideoAccessDenied] = useState(false)
  const [progressAccessDenied, setProgressAccessDenied] = useState(false)
  const [previewNoteId, setPreviewNoteId] = useState(null)
  const progressFetchSeq = useRef(0)
  const [downloadingNoteId, setDownloadingNoteId] = useState(null)
  const pendingOpsRef = useRef(new Map())

  // Normalize video URLs for embedding (handle YouTube watch/short links)
  const normalizeVideoUrlForEmbed = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') return ''
    try {
      const isYouTube = rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be')
      if (!isYouTube) return rawUrl

      // Extract YouTube video ID from common formats
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
  }

  // Helper: refresh progress from server safely (guards against stale responses)
  const refreshProgress = async () => {
    if (!id || user?.role !== 'student') return
    try {
      const seq = ++progressFetchSeq.current
      const progressData = await progressAPI.getBySubject(id)
      // Ignore stale responses if a newer fetch started
      if (seq !== progressFetchSeq.current) return

      const serverCompleted = new Set()
      if (progressData.completedNotes) {
        progressData.completedNotes.forEach(noteId => serverCompleted.add(`note-${noteId}`))
      }
      if (progressData.watchedVideos) {
        progressData.watchedVideos.forEach(videoId => serverCompleted.add(`video-${videoId}`))
      }

      // Merge with local overrides from pending ops to avoid flip-backs
      const merged = new Set(serverCompleted)
      for (const [key, op] of pendingOpsRef.current.entries()) {
        if (op.status === 'completed') merged.add(key)
        else merged.delete(key)
      }
      setCompletedItems(merged)

      // Clear pending ops that are now confirmed by the server
      for (const [key, op] of Array.from(pendingOpsRef.current.entries())) {
        const serverHas = serverCompleted.has(key)
        if ((op.status === 'completed' && serverHas) || (op.status === 'pending' && !serverHas)) {
          pendingOpsRef.current.delete(key)
        }
      }
    } catch (progressError) {
      const msg = progressError?.message || ''
      if (msg.includes('students only')) {
        setProgressAccessDenied(true)
      }
      console.warn('Could not refresh progress:', progressError)
    }
  }

  // Fetch subject data on component mount
  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch subject details
        const subjectData = await subjectsAPI.getById(id)
        setSubject(subjectData)
        
        // Fetch notes (always available)
        const notesData = await notesAPI.getBySubject(id)
        setSubjectNotes(notesData && notesData.data ? notesData.data : [])

        // Fetch videos for students and admins; handle enrollment restrictions gracefully
        setVideoAccessDenied(false)
        const isStudent = user?.role === 'student'
        const isAdmin = user?.role === 'admin'
        if (isStudent || isAdmin) {
          try {
            const videosData = await videosAPI.getBySubject(id)
            setSubjectVideos(videosData && videosData.data ? videosData.data : [])
          } catch (vidErr) {
            const msg = vidErr?.message || ''
            if (msg.includes('Not authorized') || msg.includes('authorized')) {
              setVideoAccessDenied(true)
              setSubjectVideos([])
            } else {
              console.warn('Failed to fetch videos:', vidErr)
              setSubjectVideos([])
            }
          }
        } else {
          // Non-students do not have video access
          setSubjectVideos([])
          setVideoAccessDenied(true)
        }
        
        // Fetch progress data to determine completed items (students only)
        setProgressAccessDenied(false)
        if (user?.role === 'student') {
          await refreshProgress()
        } else {
          setProgressAccessDenied(true)
        }
        
      } catch (err) {
        console.error('Failed to fetch subject data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchSubjectData()
    }
  }, [id, user?.role])

  // Recalculate subject header progress when completed items or content lists change
  useEffect(() => {
    if (!subject) return

    const totalNotes = subjectNotes.length
    const totalVideos = subjectVideos.length

    let completedNotesCount = 0
    for (const n of subjectNotes) {
      if (completedItems.has(`note-${n.id}`)) completedNotesCount++
    }

    let watchedVideosCount = 0
    for (const v of subjectVideos) {
      if (completedItems.has(`video-${v.id}`)) watchedVideosCount++
    }

    const totalItems = totalNotes + totalVideos
    const completedCount = completedNotesCount + watchedVideosCount
    const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0

    setSubject(prev => {
      if (!prev) return prev
      const needsUpdate = (
        prev.totalNotes !== totalNotes ||
        prev.totalVideos !== totalVideos ||
        prev.completedNotes !== completedNotesCount ||
        prev.watchedVideos !== watchedVideosCount ||
        prev.progress !== progressPercent
      )
      if (!needsUpdate) return prev
      return {
        ...prev,
        totalNotes,
        totalVideos,
        completedNotes: completedNotesCount,
        watchedVideos: watchedVideosCount,
        progress: progressPercent,
      }
    })
  }, [completedItems, subjectNotes, subjectVideos])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-muted-foreground">Loading subject...</p>
        </div>
      </div>
    )
  }

  if (error || !subject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error ? 'Error loading subject' : 'Subject not found'}
          </h1>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const toggleItemCompletion = async (type, itemId) => {
    const key = `${type}-${itemId}`
    const isCurrentlyCompleted = completedItems.has(key)
    const desiredStatus = isCurrentlyCompleted ? 'pending' : 'completed'

    try {
      // Optimistically update local state first
      const optimistic = new Set(completedItems)
      if (isCurrentlyCompleted) {
        optimistic.delete(key)
      } else {
        optimistic.add(key)
      }
      setCompletedItems(optimistic)

      // Record pending op so server refresh won't flip it back
      pendingOpsRef.current.set(key, { status: desiredStatus, ts: Date.now() })

      if (type === 'note') {
        await progressAPI.updateProgress({
          noteId: itemId,
          status: desiredStatus,
        })
      } else if (type === 'video') {
        await progressAPI.updateProgress({
          videoId: itemId,
          status: desiredStatus,
        })
      }
      // After server confirms, refresh progress to sync with backend and avoid stale flips
      await refreshProgress()
      
    } catch (error) {
      console.error(`Failed to update ${type} completion:`, error)
      // Revert optimistic update on error
      const reverted = new Set(completedItems)
      if (isCurrentlyCompleted) {
        reverted.add(key)
      } else {
        reverted.delete(key)
      }
      setCompletedItems(reverted)
      pendingOpsRef.current.delete(key)
    }
  }

  const handleDownloadNote = async (note) => {
    const src = note?.file_url || note?.fileURL
    if (!src) return
    try {
      setDownloadingNoteId(note.id)
      let blob
      const isHttp = /^https?:\/\//i.test(src)
      if (isHttp) {
        const resp = await fetch(src)
        if (!resp.ok) throw new Error('Failed to fetch note file')
        blob = await resp.blob()
      } else {
        // Treat as Supabase storage path inside our CONTENT_BUCKET
        blob = await downloadFromSupabase(src)
      }

      const url = URL.createObjectURL(blob)
      const safeTitle = String(note?.title || 'note').replace(/[^a-z0-9_-]+/gi, '_')
      const extFromType = note?.type === 'pdf' ? 'pdf' : ''
      const mimeExt = blob.type && blob.type.includes('/') ? blob.type.split('/')[1] : ''
      const ext = extFromType || mimeExt || 'pdf'

      const a = document.createElement('a')
      a.href = url
      a.download = `${safeTitle}.${ext}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.warn('Download failed:', e)
      // Fallback: open in new tab if we have an HTTP URL
      const src = note?.file_url || note?.fileURL
      if (src && /^https?:\/\//i.test(src)) {
        window.open(src, '_blank')
      }
    } finally {
      setDownloadingNoteId(null)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Floating Background Elements */}
      <FloatingElements />
      
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <OwlLogo className="h-5 w-5" color="white" />
                </div>
                <span className="text-xl font-bold">TOWSOTH</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/progress" className="text-muted-foreground hover:text-foreground transition-colors">
                Progress Tracker
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-border text-muted-foreground hover:bg-muted">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Subject Header */}
        <div className="mb-8 bg-card rounded-xl p-6 border border-border shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">{subject.name}</h1>
              <p className="text-muted-foreground">{subject.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-500 mb-1">{subject.progress}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          
          <Progress value={subject.progress} className="h-3" />
          
          <div className="flex justify-between mt-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4 text-blue-400" />
                <span>{subject.completedNotes}/{subject.totalNotes} Notes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Play className="h-4 w-4 text-blue-400" />
                <span>{subject.watchedVideos}/{subject.totalVideos} Videos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="notes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notes" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Notes ({subjectNotes.length})</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Videos ({subjectVideos.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            {subjectNotes.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No notes available</h3>
                    <p className="text-muted-foreground">Notes for this subject will appear here when added.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {subjectNotes.map((note) => {
                  const isCompleted = note.completed || completedItems.has(`note-${note.id}`)
                  return (
                    <Card key={note.id} className={`transition-all ${isCompleted ? 'border-blue-500 shadow-blue-900/20' : 'hover:shadow-lg hover:shadow-blue-900/10'}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <CardTitle className="text-lg text-foreground">{note.title}</CardTitle>
                              {isCompleted && <CheckCircle className="h-5 w-5 text-blue-500" />}
                              {!isCompleted && <Clock className="h-5 w-5 text-muted-foreground" />}
                            </div>
                            <CardDescription className="text-muted-foreground">{note.description}</CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              note.type === 'pdf' ? 'bg-red-900/50 text-red-300' : 'bg-blue-900/50 text-blue-300'
                            }`}>
                              {note.type.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => navigate(`/note/${note.id}`)}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            {note.type === 'pdf' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadNote(note)}
                                disabled={!(note.file_url || note.fileURL) || downloadingNoteId === note.id}
                              >
                                {downloadingNoteId === note.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Downloading...
                                  </>
                                ) : (
                                  <>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </>
                                )}
                              </Button>
                            )}
                            {note.type === 'pdf' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setPreviewNoteId(prev => (prev === note.id ? null : note.id))}
                                disabled={!(note.file_url || note.fileURL)}
                              >
                                {previewNoteId === note.id ? 'Hide Preview' : 'Preview Inline'}
                              </Button>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className={isCompleted ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-muted hover:bg-muted/80"}
                            onClick={() => toggleItemCompletion('note', note.id)}
                          >
                            {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                          </Button>
                        </div>
                        {note.type === 'pdf' && previewNoteId === note.id && (
                          <div className="mt-4">
                            <NoteViewer url={(note.file_url || note.fileURL)} title={note.title || 'PDF Preview'} height={480} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-4">
            {subjectVideos.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Play className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      {videoAccessDenied ? 'Videos restricted' : 'No videos available'}
                    </h3>
                    <p className="text-muted-foreground">
                      {videoAccessDenied
                        ? (user?.role === 'student'
                            ? 'Enroll in this subject to access videos.'
                            : user?.role === 'admin'
                              ? 'If you are an admin, ensure your token grants admin access.'
                              : 'Videos are available to enrolled students or admins. Login accordingly.')
                        : 'Videos for this subject will appear here when added.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {subjectVideos.map((video) => {
                  const isWatched = video.watched || completedItems.has(`video-${video.id}`)
                  return (
                    <Card key={video.id} className={`transition-all ${isWatched ? 'border-blue-500 shadow-blue-900/20' : 'hover:shadow-lg hover:shadow-blue-900/10'}`}>
                      <CardContent className="p-0">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Video Embed */}
                          <div className="aspect-video bg-black rounded-l-lg overflow-hidden">
                            <iframe
                              src={normalizeVideoUrlForEmbed(video.video_url || video.videoURL || '')}
                              title={video.title}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                          
                          {/* Video Info */}
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="text-lg font-semibold text-foreground">{video.title}</h3>
                                  {isWatched && <CheckCircle className="h-5 w-5 text-blue-500" />}
                                  {!isWatched && <Clock className="h-5 w-5 text-muted-foreground" />}
                                </div>
                                <p className="text-muted-foreground mb-4">{video.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                                  <span>Duration: {video.duration}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    isWatched ? 'bg-blue-900/50 text-blue-300' : 'bg-muted text-muted-foreground'
                                  }`}>
                                    {isWatched ? 'Watched' : 'Not Watched'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className={isWatched ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-muted hover:bg-muted/80"}
                                onClick={() => toggleItemCompletion('video', video.id)}
                              >
                                {isWatched ? 'Mark Unwatched' : 'Mark Watched'}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => navigate(`/video/${video.id}`)}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <a 
                                  href={video.video_url || video.videoURL || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Open Video Link
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default SubjectPage
