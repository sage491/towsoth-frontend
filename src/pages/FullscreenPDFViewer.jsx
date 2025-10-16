import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, LayoutDashboard } from 'lucide-react'

// Helper to append viewer params via URL fragment so querystrings remain intact
const buildPdfViewerUrl = (rawUrl) => {
  if (!rawUrl) return ''
  const hasHash = rawUrl.includes('#')
  const viewerParams = 'toolbar=0&navpanes=0&scrollbar=0&view=FitH'
  return `${rawUrl}${hasHash ? '&' : '#'}${viewerParams}`
}

const FullscreenPDFViewer = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const rawUrl = params.get('url') || ''
  const src = buildPdfViewerUrl(rawUrl)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top navigation bar - transparent/blurred */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/40 backdrop-blur supports-[backdrop-filter]:backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-foreground/80 hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back</span>
            </Button>
          </div>
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-foreground/80 hover:text-foreground">
              <LayoutDashboard className="h-4 w-4 mr-1" />
              <span>Dashboard</span>
            </Button>
          </div>
        </div>
      </div>

      {/* PDF viewer area */}
      <div className="pt-14">
        {src ? (
          <iframe
            src={src}
            title="PDF Viewer"
            className="w-full h-[calc(100vh-56px)] border-0"
          />
        ) : (
          <div className="h-[calc(100vh-56px)] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="font-medium">No PDF URL provided</p>
              <p className="text-sm mt-1">Append ?url=YOUR_SUPABASE_PDF_URL to view a document.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FullscreenPDFViewer