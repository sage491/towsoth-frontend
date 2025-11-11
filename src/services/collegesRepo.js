import { supabase } from './supabase'

// Colleges repository backed by Supabase table `colleges`
// Schema:
// id uuid primary key, name text unique not null, active boolean default true, created_at timestamptz default now()

function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase client not configured')
  }
}

export async function listColleges() {
  ensureSupabase()
  const { data, error } = await supabase
    .from('colleges')
    .select('*')
    .order('name', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createCollege(name) {
  ensureSupabase()
  const { data, error } = await supabase
    .from('colleges')
    .insert({ name })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCollege(id, fields) {
  ensureSupabase()
  const { data, error } = await supabase
    .from('colleges')
    .update(fields)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCollege(id) {
  ensureSupabase()
  const { error } = await supabase
    .from('colleges')
    .delete()
    .eq('id', id)
  if (error) throw error
  return { id }
}