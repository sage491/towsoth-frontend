import { createClient } from '@supabase/supabase-js'

// Prefer Vite-prefixed env vars; fallback to non-prefixed if present
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || import.meta.env.SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // Log once so admins know to configure env; avoid hard crash in dev
  console.warn('Supabase env not set: VITE_SUPABASE_URL/VITE_SUPABASE_KEY')
}

// Guard client creation to prevent runtime crashes when env is missing
export const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null

export const CONTENT_BUCKET = 'towsoth-content'

export function buildContentPath({ type, subjectId, title, extension }) {
  const safeTitle = String(title || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .substring(0, 60)
  const folder = type === 'video' ? 'videos' : 'notes'
  const ext = extension ? `.${extension.replace(/^\./, '')}` : ''
  return `${folder}/${subjectId}/${safeTitle}-${Date.now()}${ext}`
}

export async function uploadToSupabase(file, path) {
  if (!supabase) throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_KEY in .env')
  const { data, error } = await supabase.storage.from(CONTENT_BUCKET).upload(path, file, {
    upsert: false,
    // Let Supabase infer MIME; browsers set it on File objects
  })
  if (error) throw new Error(error.message || 'Failed to upload to Supabase')
  return data
}

export function getPublicUrl(path) {
  if (!supabase) return null
  const { data } = supabase.storage.from(CONTENT_BUCKET).getPublicUrl(path)
  return data?.publicUrl || null
}

// --- New helpers for JSON storage ---
export async function downloadFromSupabase(path) {
  if (!supabase) throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_KEY in .env')
  const { data, error } = await supabase.storage.from(CONTENT_BUCKET).download(path)
  if (error) throw new Error(error.message || 'Failed to download from Supabase')
  return data // Blob
}

export async function readJSONFromSupabase(path) {
  try {
    const blob = await downloadFromSupabase(path)
    const text = await blob.text()
    return JSON.parse(text)
  } catch (err) {
    // Not found or parse error -> indicate missing
    return null
  }
}

export async function writeJSONToSupabase(path, obj) {
  if (!supabase) throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_KEY in .env')
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
  const { data, error } = await supabase.storage.from(CONTENT_BUCKET).upload(path, blob, {
    upsert: true,
    contentType: 'application/json'
  })
  if (error) throw new Error(error.message || 'Failed to upload JSON to Supabase')
  return data
}

// --- Supabase Auth helpers ---
export async function signInSupabase(email, password) {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message || 'Supabase sign-in failed')
  return data
}

export async function signOutSupabase() {
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function getSupabaseUser() {
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}

export async function isSupabaseAuthenticated() {
  const user = await getSupabaseUser()
  return !!user
}