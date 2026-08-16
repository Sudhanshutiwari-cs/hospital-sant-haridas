// lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wkhqzpeijlkzonbuamik.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraHF6cGVpamxrem9uYnVhbWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwODY0OTQsImV4cCI6MjEwMTY2MjQ5NH0.CbYRmeZLzp6dR9koh5S7cK69sfDCe7ouN1bsqvhza6g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})