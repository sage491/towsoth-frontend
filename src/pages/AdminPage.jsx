import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { subjectsAPI, adminAPI, announcementsAPI, notesAPI, videosAPI } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Play, 
  Upload,
  Save,
  Trash2,
  Edit,
  User,
  LogOut,
  Link as LinkIcon,
  Bell,
  Calendar,
  Settings,
  Megaphone
} from 'lucide-react'
import OwlLogo from '@/components/OwlLogo'

const AdminPage = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [subjects, setSubjects] = useState([])
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalNotes: 0,
    totalVideos: 0,
    activeStudents: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  
  const [uploadContent, setUploadContent] = useState({
    title: '',
    description: '',
    year: '',
    subject: '',
    type: 'pdf',
    file: null,
    videoURL: ''
  })
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    subject: ''
  })
  const [newSubject, setNewSubject] = useState({
    name: '',
    description: '',
    year: '',
    subjectType: ''
  })

  const [announcements, setAnnouncements] = useState([])
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0]
  })
  
  const [subjectFieldRequired, setSubjectFieldRequired] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Edit subject state
  const [editingSubjectId, setEditingSubjectId] = useState(null)
  const [editSubject, setEditSubject] = useState({
    name: '',
    description: '',
    year: '',
    subjectType: ''
  })

  // Per-subject notes for Manage Content
  const [subjectNotes, setSubjectNotes] = useState({})
  // Per-subject videos for Manage Content
  const [subjectVideos, setSubjectVideos] = useState({})

  const handleDeleteNote = async (subjectId, noteId) => {
    try {
      setErrorMessage('')
      // Pass subjectId so caches for that subject's notes are invalidated
      await adminAPI.deleteNote(noteId, subjectId)
      setSubjectNotes(prev => ({
        ...prev,
        [subjectId]: (prev[subjectId] || []).filter(n => (n._id || n.id) !== noteId)
      }))
      setSuccessMessage('Note deleted successfully!')
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete note')
    }
  }

  const fetchNotesForSubjects = async (subjectList) => {
    try {
      const entries = await Promise.all(
        subjectList.map(async (s) => {
          const id = s._id || s.id
          try {
            const res = await notesAPI.getBySubject(id)
            const data = res && res.data ? res.data : []
            return [id, Array.isArray(data) ? data : []]
          } catch (err) {
            // Surface an error to the admin if any subject's notes fail to load
            setErrorMessage(prev => prev || 'Failed to load notes for some subjects')
            return [id, []]
          }
        })
      )
      const map = Object.fromEntries(entries)
      setSubjectNotes(map)
    } catch (e) {
      // Non-fatal: keep UI working even if notes fail to load
    }
  }

  const handleDeleteVideo = async (subjectId, videoId) => {
    try {
      setErrorMessage('')
      await adminAPI.deleteVideo(videoId, subjectId)
      setSubjectVideos(prev => ({
        ...prev,
        [subjectId]: (prev[subjectId] || []).filter(v => (v._id || v.id) !== videoId)
      }))
      setSuccessMessage('Video deleted successfully!')
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete video')
    }
  }

  const fetchVideosForSubjects = async (subjectList) => {
    try {
      const entries = await Promise.all(
        subjectList.map(async (s) => {
          const id = s._id || s.id
          try {
            const res = await videosAPI.getBySubject(id)
            const data = res && res.data ? res.data : []
            return [id, Array.isArray(data) ? data : []]
          } catch (err) {
            setErrorMessage(prev => prev || 'Failed to load videos for some subjects')
            return [id, []]
          }
        })
      )
      const map = Object.fromEntries(entries)
      setSubjectVideos(map)
    } catch (e) {
      // Non-fatal: keep UI working even if videos fail to load
    }
  }

  // Fetch subjects, announcements, and stats on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Use Promise.all to fetch data concurrently instead of sequentially
        const [subjectsData, announcementsData] = await Promise.all([
          subjectsAPI.getAll(),
          announcementsAPI.getAnnouncements()
        ])
        
        // Ensure subjects is always an array
        const subjectsArray = (subjectsData && subjectsData.data)
          ? subjectsData.data
          : (Array.isArray(subjectsData) ? subjectsData : [])

        setSubjects(subjectsArray)

        // Fetch notes and videos for each subject to show in Manage Content
        if (Array.isArray(subjectsArray) && subjectsArray.length > 0) {
          await Promise.all([
            fetchNotesForSubjects(subjectsArray),
            fetchVideosForSubjects(subjectsArray)
          ])
        } else {
          setSubjectNotes({})
          setSubjectVideos({})
        }
        
        if (announcementsData.success) {
          setAnnouncements(announcementsData.data)
        }
        
        // Calculate stats from subjects
        setStats({
          totalSubjects: subjectsArray.length,
          totalNotes: subjectsArray.reduce((acc, subject) => acc + (subject.totalNotes || 0), 0),
          totalVideos: subjectsArray.reduce((acc, subject) => acc + (subject.totalVideos || 0), 0),
          activeStudents: 0 // This would come from actual stats API
        })
        
        setLoading(false)
      } catch (err) {
        setError(err.message || 'Failed to fetch data')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault()
    try {
      setErrorMessage('')
      setSuccessMessage('')
      
      const response = await announcementsAPI.createAnnouncement(newAnnouncement)
      
      if (response.success) {
        setSuccessMessage('Announcement added successfully!')
        
        // Add the new announcement to the list
        setAnnouncements([response.data, ...announcements])
        
        // Reset form
        setNewAnnouncement({
          title: '',
          content: '',
          date: new Date().toISOString().split('T')[0]
        })
      } else {
        setErrorMessage(response.message || 'Failed to add announcement')
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to add announcement')
    }
  }

  const handleDeleteAnnouncement = async (id) => {
    try {
      setErrorMessage('')
      
      const response = await announcementsAPI.deleteAnnouncement(id)
      
      if (response.success) {
        // Remove the deleted announcement from the list
        setAnnouncements(announcements.filter(announcement => (announcement.id ?? announcement._id) !== id))
        setSuccessMessage('Announcement deleted successfully!')
      } else {
        setErrorMessage(response.message || 'Failed to delete announcement')
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete announcement')
    }
  }

  const handleNoteSubmit = async (e) => {
    e.preventDefault()
    try {
      setErrorMessage('')
      setSuccessMessage('')
      
      if (!newNote.subject) {
        setSubjectFieldRequired(true)
        setErrorMessage('Please select a subject')
        return
      }
      // Find selected subject details to provide required year and subjectType
      const selectedSubject = subjects.find((s) => (s._id || s.id) === newNote.subject)
      if (!selectedSubject) {
        setErrorMessage('Selected subject not found')
        return
      }
      if (!selectedSubject.year || !selectedSubject.subjectType) {
        setErrorMessage('Selected subject is missing year or subject type. Please edit the subject to include these.')
        return
      }
      // Map UI "url" field to backend-required "fileURL" and include year/subjectType
      const payload = {
        subject: newNote.subject,
        title: newNote.title,
        description: newNote.description,
        type: newNote.type,
        fileURL: newNote.url,
        year: selectedSubject.year,
        subjectType: selectedSubject.subjectType,
      }
      
      const subjectId = newNote.subject
      await adminAPI.createNote(payload)
      setSuccessMessage('Note added successfully!')
      
      // Reset form
      setNewNote({
        title: '',
        description: '',
        type: 'pdf',
        url: '',
        subject: ''
      })
      
      // Refresh subjects data
      const subjectsData = await subjectsAPI.getAll()
      const subjectsArray = (subjectsData && subjectsData.data)
        ? subjectsData.data
        : (Array.isArray(subjectsData) ? subjectsData : [])
      setSubjects(subjectsArray)

      // Refresh notes for the affected subject to update UI in real-time
      try {
        const res = await notesAPI.getBySubject(subjectId)
        const data = res && res.data ? res.data : []
        setSubjectNotes(prev => ({
          ...prev,
          [subjectId]: Array.isArray(data) ? data : []
        }))
      } catch (refreshErr) {
        // If refresh fails, do nothing; UI remains with previous state
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to add note')
    }
  }

  const handleVideoSubmit = async (e) => {
    e.preventDefault()
    try {
      setErrorMessage('')
      setSuccessMessage('')
      
      if (!newVideo.subject) {
        setSubjectFieldRequired(true)
        setErrorMessage('Please select a subject')
        return
      }
      
      // In a real app, you would call an API to add a video
      // For now, just show success message
      setSuccessMessage('Video added successfully!')
      
      // Reset form
      setNewVideo({
        title: '',
        description: '',
        youtubeId: '',
        duration: '',
        subject: ''
      })
    } catch (err) {
      setErrorMessage(err.message || 'Failed to add video')
    }
  }

  const handleContentUploadSubmit = async (e) => {
    e.preventDefault()
    try {
      setErrorMessage('')
      setSuccessMessage('')

      if (!uploadContent.subject) {
        setSubjectFieldRequired(true)
        setErrorMessage('Please select a subject')
        return
      }

      // Validate file types early
      if (uploadContent.type === 'pdf' && uploadContent.file) {
        const isPdf = uploadContent.file.type === 'application/pdf'
        if (!isPdf) {
          setErrorMessage('Invalid file format. Please upload a PDF.')
          return
        }
      }
      if (uploadContent.type === 'video' && uploadContent.file) {
        const isVideo = uploadContent.file.type.startsWith('video/')
        if (!isVideo) {
          setErrorMessage('Invalid file format. Please upload a video file.')
          return
        }
      }

      // Upload file via backend to Supabase Storage when provided
      let fileURLFromSupabase = ''
      let videoURLFromSupabase = ''

      if ((uploadContent.type === 'pdf' || uploadContent.type === 'video') && uploadContent.file) {
        const formData = new FormData()
        formData.append('file', uploadContent.file)
        formData.append('type', uploadContent.type)
        formData.append('subject', uploadContent.subject)
        formData.append('title', uploadContent.title)
        const resp = await adminAPI.uploadFile(formData)
        if (resp && resp.success && resp.url) {
          if (uploadContent.type === 'pdf') fileURLFromSupabase = resp.url
          if (uploadContent.type === 'video') videoURLFromSupabase = resp.url
        } else {
          throw new Error(resp?.message || 'File upload failed')
        }
      }

      const payload = {
        title: uploadContent.title,
        description: uploadContent.description,
        year: uploadContent.year,
        subject: uploadContent.subject,
        type: uploadContent.type,
        fileURL: fileURLFromSupabase || '',
        videoURL: videoURLFromSupabase || uploadContent.videoURL || '',
      }

      const resp = await adminAPI.uploadContent(payload)
      if (resp && resp.success) {
        setSuccessMessage('Content uploaded successfully!')
        setUploadContent({ title: '', description: '', year: '', subject: '', type: 'pdf', file: null, videoURL: '' })

        // Immediately reflect the new content in Manage Content without waiting for full refetch
        try {
          const created = resp.data
          const subjectId = created?.subject_id || uploadContent.subject
          if (created && subjectId) {
            if (uploadContent.type === 'pdf') {
              setSubjectNotes(prev => {
                const prevList = Array.isArray(prev[subjectId]) ? prev[subjectId] : []
                return { ...prev, [subjectId]: [created, ...prevList] }
              })
            }
            if (uploadContent.type === 'video') {
              setSubjectVideos(prev => {
                const prevList = Array.isArray(prev[subjectId]) ? prev[subjectId] : []
                return { ...prev, [subjectId]: [created, ...prevList] }
              })
            }
          }
        } catch {}

        // Refresh lists for the subject on successful upload
        const subjectsData = await subjectsAPI.getAll()
        const subjectsArray = (subjectsData && subjectsData.data)
          ? subjectsData.data
          : (Array.isArray(subjectsData) ? subjectsData : [])
        setSubjects(subjectsArray)
        // Update stats totals to reflect newly uploaded content
        setStats({
          totalSubjects: subjectsArray.length,
          totalNotes: subjectsArray.reduce((acc, subject) => acc + (subject.totalNotes || 0), 0),
          totalVideos: subjectsArray.reduce((acc, subject) => acc + (subject.totalVideos || 0), 0),
          activeStudents: 0
        })
        await Promise.all([
          fetchNotesForSubjects(subjectsArray),
          fetchVideosForSubjects(subjectsArray)
        ])
      } else {
        setErrorMessage(resp?.message || 'Upload failed')
      }
    } catch (err) {
      console.error('Admin upload error:', err)
      setErrorMessage(err.message || 'Failed to upload content')
    }
  }
  
  const handleSubjectSubmit = async (e) => {
    e.preventDefault()
    try {
      setErrorMessage('')
      setSuccessMessage('')
      
      if (!newSubject.name) {
        setErrorMessage('Subject name is required')
        return
      }
      
      await adminAPI.createSubject(newSubject)
      setSuccessMessage('Subject added successfully!')
      
      // Reset form
      setNewSubject({
        name: '',
        description: '',
        year: '',
        subjectType: ''
      })
      
      // Refresh subjects data
      const subjectsData = await subjectsAPI.getAll()
      const subjectsArray = (subjectsData && subjectsData.data)
        ? subjectsData.data
        : (Array.isArray(subjectsData) ? subjectsData : [])
      setSubjects(subjectsArray)
      setStats(prev => ({
        ...prev,
        totalSubjects: subjectsArray.length
      }))
    } catch (err) {
      setErrorMessage(err.message || 'Failed to add subject')
    }
  }
  
  

  const extractYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    const match = url.match(regex)
    return match ? match[1] : url
  }

  const startEditSubject = (subject) => {
    const id = subject._id || subject.id
    setEditingSubjectId(id)
    setEditSubject({
      name: subject.name || '',
      description: subject.description || '',
      year: subject.year || '',
      subjectType: subject.subjectType || ''
    })
  }

  const cancelEditSubject = () => {
    setEditingSubjectId(null)
    setEditSubject({ name: '', description: '', year: '', subjectType: '' })
  }

  const handleEditSubjectSubmit = async (e) => {
    e.preventDefault()
    try {
      setErrorMessage('')
      setSuccessMessage('')

      if (!editingSubjectId) {
        setErrorMessage('No subject selected for editing')
        return
      }

      if (!editSubject.name) {
        setErrorMessage('Subject name is required')
        return
      }

      await adminAPI.updateSubject(editingSubjectId, editSubject)
      setSuccessMessage('Subject updated successfully!')

      // Refresh subjects data
      const subjectsData = await subjectsAPI.getAll()
      const subjectsArray = (subjectsData && subjectsData.data)
        ? subjectsData.data
        : (Array.isArray(subjectsData) ? subjectsData : [])
      setSubjects(subjectsArray)
      setStats(prev => ({
        ...prev,
        totalSubjects: subjectsArray.length
      }))
      cancelEditSubject()
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update subject')
    }
  }

  const handleDeleteSubject = async (id) => {
    try {
      setErrorMessage('')
      const confirmed = window.confirm('Delete this subject and all its content? This cannot be undone.')
      if (!confirmed) return

      await adminAPI.deleteSubject(id)

      // Remove subject locally
      setSubjects(prev => (prev || []).filter(s => (s._id || s.id) !== id))

      // Remove any cached per-subject content in UI state
      setSubjectNotes(prev => {
        const copy = { ...(prev || {}) }
        delete copy[id]
        return copy
      })
      setSubjectVideos(prev => {
        const copy = { ...(prev || {}) }
        delete copy[id]
        return copy
      })

      // Update stats locally
      setStats(prev => ({
        ...prev,
        totalSubjects: Math.max(0, (prev.totalSubjects || 0) - 1)
      }))

      setSuccessMessage('Subject deleted successfully!')
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete subject')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Link to="/" className="flex items-center space-x-2">
                <OwlLogo className="h-8 w-8" color="#3b82f6" />
                <span className="text-2xl font-bold text-primary">Towsoth Edu</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-muted-foreground hover:text-primary">
                Dashboard
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Admin Panel</span>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage content, upload new materials, and assign them to subjects.
          </p>
        </div>

        {/* Status Messages */}
        {(successMessage || errorMessage) && (
          <div className={`p-4 mb-6 rounded-md border ${successMessage ? 'bg-primary/10 text-primary border-primary/30' : 'bg-destructive/15 text-destructive border-destructive/30'}`}>
            {successMessage || errorMessage}
          </div>
        )}
        
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : error ? (
          <div className="p-4 mb-6 rounded-md bg-destructive/15 text-destructive border border-destructive/30">
            {error}
          </div>
        ) : (
          /* Stats Cards */
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                <OwlLogo className="h-4 w-4" color="#6b7280" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSubjects}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalNotes}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                <Play className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVideos}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeStudents}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content Management Tabs */}
          <Tabs defaultValue="add-subject" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="add-subject">Add Subject</TabsTrigger>
              <TabsTrigger value="upload-content">Upload Content</TabsTrigger>
              <TabsTrigger value="add-assignment">Assignments</TabsTrigger>
              <TabsTrigger value="manage-content">Manage Content</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Megaphone className="h-5 w-5" />
                  <span>Manage Announcements</span>
                </CardTitle>
                <CardDescription>
                  Create and manage announcements for students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Add new announcement form */}
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">Add New Announcement</h3>
                    <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="announcement-title">Title</Label>
                        <Input
                          id="announcement-title"
                          placeholder="e.g., Important Update"
                          value={newAnnouncement.title}
                          onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="announcement-content">Content</Label>
                        <Textarea
                          id="announcement-content"
                          placeholder="Enter announcement content"
                          value={newAnnouncement.content}
                          onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="announcement-date">Date</Label>
                        <Input
                          id="announcement-date"
                          type="date"
                          value={newAnnouncement.date}
                          onChange={(e) => setNewAnnouncement({...newAnnouncement, date: e.target.value})}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full">
                        <Bell className="h-4 w-4 mr-2" />
                        Post Announcement
                      </Button>
                    </form>
                  </div>
                  
                  {/* List of existing announcements */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Existing Announcements</h3>
                    {announcements.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No announcements found. Add your first one above.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {announcements.map((announcement) => (
                          <div key={announcement.id ?? announcement._id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{announcement.title}</h4>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteAnnouncement(announcement.id ?? announcement._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                            <div className="text-xs text-muted-foreground flex items-center opacity-75">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(announcement.date).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Add Subject Tab */}
          <TabsContent value="add-subject">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <OwlLogo className="h-5 w-5" color="#3b82f6" />
                  <span>Add New Subject</span>
                </CardTitle>
                <CardDescription>
                  Create a new subject for the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubjectSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject-name">Subject Name</Label>
                    <Input
                      id="subject-name"
                      placeholder="e.g. Introduction to Computer Science"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject-description">Description</Label>
                    <Textarea
                      id="subject-description"
                      placeholder="Enter a description for this subject"
                      value={newSubject.description}
                      onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject-year">Year</Label>
                    <select
                      id="subject-year"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={newSubject.year}
                      onChange={(e) => setNewSubject({ ...newSubject, year: e.target.value })}
                      required
                    >
                      <option value="">Select year</option>
                      <option value="1st">1st</option>
                      <option value="2nd">2nd</option>
                      <option value="3rd">3rd</option>
                      <option value="4th">4th</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject-type">Subject Type</Label>
                    <Input
                      id="subject-type"
                      placeholder="e.g. Core, Elective"
                      value={newSubject.subjectType}
                      onChange={(e) => setNewSubject({ ...newSubject, subjectType: e.target.value })}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subject
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          

          {/* Add Note Tab removed */}


          {/* Upload Content Tab */}
          <TabsContent value="upload-content">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload PDF or Video</span>
                </CardTitle>
                <CardDescription>
                  Upload PDF files to storage or provide video URL/embed link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContentUploadSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="upload-title">Title</Label>
                      <Input
                        id="upload-title"
                        placeholder="e.g., Linear Algebra Lecture Notes"
                        value={uploadContent.title}
                        onChange={(e) => setUploadContent({ ...uploadContent, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upload-subject">Subject</Label>
                      <select
                        id="upload-subject"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={uploadContent.subject}
                        onChange={(e) => setUploadContent({ ...uploadContent, subject: e.target.value })}
                        required
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((subject) => (
                          <option key={subject._id || subject.id} value={subject._id || subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upload-description">Description</Label>
                    <Input
                      id="upload-description"
                      placeholder="Brief description of the content"
                      value={uploadContent.description}
                      onChange={(e) => setUploadContent({ ...uploadContent, description: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="upload-year">Year</Label>
                      <select
                        id="upload-year"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={uploadContent.year}
                        onChange={(e) => setUploadContent({ ...uploadContent, year: e.target.value })}
                      >
                        <option value="">Auto from subject</option>
                        <option value="1st">1st</option>
                        <option value="2nd">2nd</option>
                        <option value="3rd">3rd</option>
                        <option value="4th">4th</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="upload-type">Type</Label>
                      <select
                        id="upload-type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={uploadContent.type}
                        onChange={(e) => setUploadContent({ ...uploadContent, type: e.target.value })}
                      >
                        <option value="pdf">PDF</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                  </div>

                  {uploadContent.type === 'pdf' ? (
                    <div className="space-y-2">
                      <Label htmlFor="upload-file">PDF File</Label>
                      <input
                        id="upload-file"
                        type="file"
                        accept="application/pdf"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        onChange={(e) => setUploadContent({ ...uploadContent, file: e.target.files?.[0] || null })}
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="upload-video-url">Video URL or Embed Link</Label>
                      <Input
                        id="upload-video-url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={uploadContent.videoURL}
                        onChange={(e) => setUploadContent({ ...uploadContent, videoURL: e.target.value })}
                        required
                      />
                    </div>
                  )}

                  <Button type="submit" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Content Tab */}
          <TabsContent value="manage-content">
            <div className="space-y-6">
              {subjects.map((subject) => (
                <Card key={subject._id || subject.id} className="bg-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{subject.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">{subject.description}</CardDescription>
                      </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => startEditSubject(subject)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Subject
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteSubject(subject._id || subject.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Subject
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/subject/${subject.id}`}>
                          <LinkIcon className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingSubjectId === (subject._id || subject.id) && (
                      <div className="mb-6 border rounded-md p-4 bg-muted">
                        <h4 className="font-medium mb-4">Edit Subject</h4>
                        <form onSubmit={handleEditSubjectSubmit} className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`edit-name-${subject._id || subject.id}`}>Name</Label>
                              <Input
                                id={`edit-name-${subject._id || subject.id}`}
                                value={editSubject.name}
                                onChange={(e) => setEditSubject({ ...editSubject, name: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-year-${subject._id || subject.id}`}>Year</Label>
                              <Select value={editSubject.year} onValueChange={(value) => setEditSubject({ ...editSubject, year: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1st">1st</SelectItem>
                                  <SelectItem value="2nd">2nd</SelectItem>
                                  <SelectItem value="3rd">3rd</SelectItem>
                                  <SelectItem value="4th">4th</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-description-${subject._id || subject.id}`}>Description</Label>
                            <Textarea
                              id={`edit-description-${subject._id || subject.id}`}
                              value={editSubject.description}
                              onChange={(e) => setEditSubject({ ...editSubject, description: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-type-${subject._id || subject.id}`}>Subject Type</Label>
                            <Input
                              id={`edit-type-${subject._id || subject.id}`}
                              placeholder="e.g. Core, Elective"
                              value={editSubject.subjectType}
                              onChange={(e) => setEditSubject({ ...editSubject, subjectType: e.target.value })}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button type="submit" className="flex items-center space-x-2">
                              <Save className="h-4 w-4" />
                              <span>Save Changes</span>
                            </Button>
                            <Button type="button" variant="outline" onClick={cancelEditSubject}>Cancel</Button>
                          </div>
                        </form>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>
                            Notes ({(subjectNotes[(subject._id || subject.id)] || []).length})
                          </span>
                        </h4>
                        <div className="space-y-2">
                          {((subjectNotes[(subject._id || subject.id)] || []).length > 0) ? (
                            (subjectNotes[(subject._id || subject.id)]).map((note) => (
                              <div key={note._id || note.id} className="flex items-center justify-between p-2 bg-muted rounded border">
                                <span className="text-sm text-muted-foreground">{note.title}</span>
                                <Button size="sm" variant="ghost" onClick={() => handleDeleteNote(subject._id || subject.id, note._id || note.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground">No notes yet</div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <Play className="h-4 w-4" />
                          <span>
                            Videos ({(subjectVideos[(subject._id || subject.id)] || []).length})
                          </span>
                        </h4>
                        <div className="space-y-2">
                          {((subjectVideos[(subject._id || subject.id)] || []).length > 0) ? (
                            (subjectVideos[(subject._id || subject.id)]).map((video) => (
                              <div key={video._id || video.id} className="flex items-center justify-between p-2 bg-muted rounded border">
                                <span className="text-sm text-muted-foreground">{video.title}</span>
                                <Button size="sm" variant="ghost" onClick={() => handleDeleteVideo(subject._id || subject.id, video._id || video.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground">No videos yet</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminPage
