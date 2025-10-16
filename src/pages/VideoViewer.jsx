import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Play, ExternalLink, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { videosAPI, progressAPI } from '@/services/api'

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

const VideoViewer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [video, setVideo] = useState(null)
  const [watched, setWatched] = useState(false)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await videosAPI.getById(id)
        const data = res?.data || res
        setVideo(data)
        setWatched(Boolean(data?.watched || (data?.progress === 'completed')))
      } catch (err) {
        console.error('Failed to fetch video data:', err)
        setError(err.message || 'Failed to load video')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchVideoData()
  }, [id])

  const markWatched = async () => {
    if (!video?.id) return
    try {
      setUpdating(true)
      await progressAPI.updateProgress({
        videoId: video.id,
        status: 'completed',
      })
      setWatched(true)
    } catch (err) {
      console.error('Failed to mark video watched:', err)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-red-500 font-medium">{error}</p>
          <Button variant="ghost" className="mt-3" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    )
  }

  const displayUrl = normalizeVideoUrlForEmbed(video?.video_url || video?.videoURL || video?.url || '')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Play className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">{video?.title || 'Video'}</CardTitle>
                  {watched && <CheckCircle className="h-5 w-5 text-blue-500" />}
                </div>
                <CardDescription className="text-muted-foreground">{video?.description}</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">VIDEO</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-hidden bg-black">
              <div className="aspect-video">
                <iframe
                  src={displayUrl}
                  className="w-full h-full"
                  title={video?.title || 'Video'}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" asChild>
                  <a href={video?.video_url || video?.videoURL || '#'} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Video Link
                  </a>
                </Button>
              </div>
              <div>
                {watched ? (
                  <Button size="sm" className="bg-blue-600 text-white" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" /> Watched
                  </Button>
                ) : (
                  <Button size="sm" className="bg-muted hover:bg-muted/80" onClick={markWatched} disabled={updating}>
                    {updating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Mark Watched
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default VideoViewer