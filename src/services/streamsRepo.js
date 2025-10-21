import { supabase } from './supabase'

// Streams repository backed by Supabase Database table `streams`
// Schema suggestion:
// CREATE TABLE public.streams (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   name text UNIQUE NOT NULL,
//   created_at timestamptz DEFAULT now()
// );
// RLS recommended (see SQL in assistant message).

function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase client not configured')
  }
}

export async function listStreams() {
  ensureSupabase()
  const { data, error } = await supabase
    .from('streams')
    .select('*')
    .order('name', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createStream(name) {
  ensureSupabase()
  const { data, error } = await supabase
    .from('streams')
    .insert({ name })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateStream(id, name) {
  ensureSupabase()
  const { data, error } = await supabase
    .from('streams')
    .update({ name })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteStream(id) {
  ensureSupabase()
  const { error } = await supabase
    .from('streams')
    .delete()
    .eq('id', id)
  if (error) throw error
  return { id }
}