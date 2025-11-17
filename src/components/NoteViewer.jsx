import React, { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist/build/pdf'
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

// Configure PDF.js worker (bundler-friendly via ?url)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc

/**
 * Inline PDF.js canvas renderer
 * - Renders each page as a <canvas> stacked vertically
 * - Minimal toolbar with zoom controls (no download/print)
 * - Supports pinch-to-zoom on touch and trackpad pinch (Ctrl+wheel)
 * - Fits width to container, responsive on resize
 * Props:
 * - url: public URL to the PDF (required)
 * - title: optional title for accessibility
 * - height: optional max container height (number | string) – alias for maxHeight
 * - maxHeight: optional max container height (e.g., '80vh') with overflow-y: auto
 */
const NoteViewer = ({ url, title = 'PDF Document', height, maxHeight, className = '' }) => {
  const containerRef = useRef(null)
  const pdfRef = useRef(null)
  const canvasMapRef = useRef(new Map()) // pageNumber -> canvas element
  const pinchDataRef = useRef({ startDistance: 0, startZoom: 1 })
  const [pageNumbers, setPageNumbers] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [isPinching, setIsPinching] = useState(false)
  const MIN_ZOOM = 0.5
  const MAX_ZOOM = 3
  const ZOOM_STEP = 0.1

  const clampZoom = (z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +z.toFixed(3)))

  // Normalize height/maxHeight prop
  const containerMaxHeight = maxHeight ?? (height != null ? (typeof height === 'number' ? `${height}px` : height) : undefined)
  const renderLockRef = useRef(false)
  const prevScrollRef = useRef(0)

  // Load PDF document
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!url) {
        setError('No file URL available for preview.')
        return
      }
      setLoading(true)
      setError(null)
      try {
        const task = pdfjsLib.getDocument(url)
        const pdf = await task.promise
        if (cancelled) return
        pdfRef.current = pdf
        const nums = Array.from({ length: pdf.numPages }, (_, i) => i + 1)
        setPageNumbers(nums)
      } catch (e) {
        console.error('PDF.js load error', e)
        if (!cancelled) setError('Failed to load PDF document.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [url])

  // Render a specific page into its canvas, fitting width
  const renderPage = async (pageNumber) => {
    const pdf = pdfRef.current
    const canvas = canvasMapRef.current.get(pageNumber)
    const container = containerRef.current
    if (!pdf || !canvas || !container) return

    const page = await pdf.getPage(pageNumber)
    const viewport = page.getViewport({ scale: 1 })

    const containerWidth = container.clientWidth
    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const baseScale = containerWidth / viewport.width
    const scale = baseScale * zoom
    const scaledViewport = page.getViewport({ scale })

    const ctx = canvas.getContext('2d')
    canvas.width = Math.floor(scaledViewport.width * dpr)
    canvas.height = Math.floor(scaledViewport.height * dpr)
    canvas.style.width = `${Math.floor(scaledViewport.width)}px`
    canvas.style.height = `${Math.floor(scaledViewport.height)}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const renderTask = page.render({ canvasContext: ctx, viewport: scaledViewport })
    await renderTask.promise
  }

  // Render all pages initially and on resize/zoom
  useEffect(() => {
    let ignore = false
    const drawAll = async () => {
      const el = containerRef.current
      const prevTop = el ? el.scrollTop : 0
      renderLockRef.current = true
      for (const n of pageNumbers) {
        if (ignore) break
        await renderPage(n)
      }
      renderLockRef.current = false
      if (el) el.scrollTop = prevTop
    }
    if (pageNumbers.length) drawAll()

    const onResize = () => {
      drawAll()
    }
    window.addEventListener('resize', onResize)
    return () => {
      ignore = true
      window.removeEventListener('resize', onResize)
    }
  }, [pageNumbers, zoom])

  const setCanvasRef = (pageNumber) => (el) => {
    if (!el) return
    canvasMapRef.current.set(pageNumber, el)
  }

  const handleZoomIn = () => setZoom((z) => clampZoom(z + ZOOM_STEP))
  const handleZoomOut = () => setZoom((z) => clampZoom(z - ZOOM_STEP))
  const handleResetZoom = () => setZoom(1)

  // Touch pinch and trackpad pinch (Ctrl+wheel) handlers
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const getDistance = (touches) => {
      if (!touches || touches.length < 2) return 0
      const [t1, t2] = touches
      const dx = t1.clientX - t2.clientX
      const dy = t1.clientY - t2.clientY
      return Math.hypot(dx, dy)
    }

    const onTouchStart = (e) => {
      if (e.touches && e.touches.length === 2) {
        pinchDataRef.current.startDistance = getDistance(e.touches)
        pinchDataRef.current.startZoom = zoom
        setIsPinching(true)
      }
    }

    const onTouchMove = (e) => {
      if (!isPinching || !e.touches || e.touches.length < 2) return
      const dist = getDistance(e.touches)
      const startDist = pinchDataRef.current.startDistance || 1
      const startZoom = pinchDataRef.current.startZoom || 1
      const factor = dist / startDist
      const nextZoom = clampZoom(startZoom * factor)
      setZoom(nextZoom)
      // Prevent browser zoom or scroll-jank during pinch
      e.preventDefault()
    }

    const onTouchEnd = (e) => {
      if (!e.touches || e.touches.length < 2) {
        setIsPinching(false)
      }
    }

    const onWheel = (e) => {
      // Trackpad pinch usually sends wheel with ctrlKey
      if (e.ctrlKey) {
        e.preventDefault()
        const change = -e.deltaY * 0.0015 // tune sensitivity
        setZoom((z) => clampZoom(z + change))
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('wheel', onWheel)
    }
  }, [zoom, isPinching])

  if (error) {
    return (
      <div className="border border-border rounded-md p-4 text-sm text-muted-foreground">
        {error}
      </div>
    )
  }

  return (
    <div className={`border border-border rounded-md bg-muted/30 ${className}`} aria-label={title}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/60 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut} aria-label="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn} aria-label="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleResetZoom} aria-label="Reset zoom">
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</div>
      </div>

      <div
        ref={containerRef}
        className="w-full p-4 space-y-6 flex flex-col items-center"
        style={containerMaxHeight ? { maxHeight: containerMaxHeight, overflowY: 'auto', overscrollBehavior: 'contain', overflowAnchor: 'none' } : { overscrollBehavior: 'contain', overflowAnchor: 'none' }}
      >
        {loading && (
          <div className="text-sm text-muted-foreground">Loading PDF…</div>
        )}
        {!loading && pageNumbers.length === 0 && (
          <div className="text-sm text-muted-foreground">No pages to display.</div>
        )}
        {pageNumbers.map((n) => (
          <canvas key={n} ref={setCanvasRef(n)} className="block mx-auto" />
        ))}
      </div>
    </div>
  )
}

export default NoteViewer