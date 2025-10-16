import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { notesAPI, progressAPI } from '@/services/api'
import { ArrowLeft, FileText, Play, CheckCircle, Clock, Loader2, Zap, BookOpen } from 'lucide-react'
import FloatingElements from '@/components/animations/FloatingElements'
import InlinePDFViewer from '@/components/NoteViewer'

const NoteViewer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)

  // Fetch note data on component mount
  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch note details
        const noteData = await notesAPI.getById(id)
        setNote(noteData.data)
        
        // Set completion status
        setCompleted(noteData.data.progress === 'completed')
        
      } catch (err) {
        console.error('Failed to fetch note data:', err)
        setError(err.message || 'Failed to load note')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchNoteData()
    }
  }, [id])

  // Handle completion toggle
  const handleCompletionToggle = async (value) => {
    try {
      setUpdating(true)
      
      // Update progress in backend
      await progressAPI.updateProgress({
        noteId: id,
        status: value ? 'completed' : 'pending'
      })
      
      // Update local state
      setCompleted(value)
    } catch (err) {
      console.error('Failed to update progress:', err)
      // Revert the toggle if there was an error
      setCompleted(!value)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-400">Loading content...</p>
        </div>
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {error ? 'Error loading content' : 'Content not found'}
          </h1>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          <Button onClick={() => navigate(-1)} className="bg-blue-600 hover:bg-blue-700">Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      {/* Floating Background Elements */}
      <FloatingElements />
      
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                  {note?.type === 'pdf' ? <FileText className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
                </div>
                <h1 className="text-xl font-semibold">{note.title}</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">
                <Zap className="h-4 w-4 mr-2" />
                {note?.type === 'pdf' ? 'PDF Document' : 'Video Content'}
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="completion-toggle" className="cursor-pointer text-slate-300">
                  {completed ? 'Completed' : 'Mark as completed'}
                </Label>
                <Switch 
                  id="completion-toggle" 
                  checked={completed} 
                  onCheckedChange={handleCompletionToggle}
                  disabled={updating}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Card className="mb-8 bg-slate-800 border-slate-700 overflow-hidden">
          <CardHeader className="border-b border-slate-700">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <CardTitle className="text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {note.title}
                  </CardTitle>
                  {completed ? 
                    <CheckCircle className="h-5 w-5 text-green-500" /> : 
                    <Clock className="h-5 w-5 text-slate-400" />
                  }
                </div>
                <CardDescription className="text-base text-slate-400">{note.description}</CardDescription>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${note.type === 'pdf' ? 'bg-red-900/30 text-red-300 border border-red-700/30' : 'bg-blue-900/30 text-blue-300 border border-blue-700/30'}`}>
                  {note.type.toUpperCase()}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-hidden bg-slate-900 border-t border-slate-700">
              {(() => {
                const displayUrl = note?.file_url || note?.fileURL || note?.url || note?.videoURL || ''
                if (note.type === 'pdf') {
                  return (
                    <InlinePDFViewer url={displayUrl} title={note.title} />
                  )
                }
                if (note.type === 'video') {
                  return (
                    <div className="aspect-video">
                      <iframe
                        src={displayUrl}
                        className="w-full h-full"
                        title={note.title}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  )
                }
                return (
                <div className="p-8 text-center text-slate-400">
                  <p>Unsupported content type</p>
                </div>
                )
              })()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NoteViewer