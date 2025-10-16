import React, { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist/build/pdf'
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

// Configure PDF.js worker (bundler-friendly via ?url)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc

/**
 * Inline PDF.js canvas renderer
 * - Renders each page as a <canvas> stacked vertically
 * - No toolbar, download, print, or zoom controls
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
  const [pageNumbers, setPageNumbers] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Normalize height/maxHeight prop
  const containerMaxHeight = maxHeight ?? (height != null ? (typeof height === 'number' ? `${height}px` : height) : undefined)

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
    const scale = containerWidth / viewport.width
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

  // Render all pages initially and on resize
  useEffect(() => {
    let ignore = false
    const drawAll = async () => {
      for (const n of pageNumbers) {
        if (ignore) break
        await renderPage(n)
      }
    }
    if (pageNumbers.length) drawAll()

    const onResize = () => {
      // Re-render to fit new width
      drawAll()
    }
    window.addEventListener('resize', onResize)
    return () => {
      ignore = true
      window.removeEventListener('resize', onResize)
    }
  }, [pageNumbers])

  const setCanvasRef = (pageNumber) => (el) => {
    if (!el) return
    canvasMapRef.current.set(pageNumber, el)
  }

  if (error) {
    return (
      <div className="border border-border rounded-md p-4 text-sm text-muted-foreground">
        {error}
      </div>
    )
  }

  return (
    <div className={`border border-border rounded-md bg-muted/30 ${className}`} aria-label={title}>
      <div
        ref={containerRef}
        className="w-full p-4 space-y-6"
        style={containerMaxHeight ? { maxHeight: containerMaxHeight, overflowY: 'auto' } : undefined}
      >
        {loading && (
          <div className="text-sm text-muted-foreground">Loading PDF…</div>
        )}
        {!loading && pageNumbers.length === 0 && (
          <div className="text-sm text-muted-foreground">No pages to display.</div>
        )}
        {pageNumbers.map((n) => (
          <canvas key={n} ref={setCanvasRef(n)} className="w-full block" />
        ))}
      </div>
    </div>
  )
}

export default NoteViewer