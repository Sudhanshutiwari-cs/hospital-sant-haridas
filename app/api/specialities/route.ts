import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET() {
  try {
    const { data: specialities, error } = await supabase
      .from('specialities')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error

    return NextResponse.json({ specialities })
  } catch (error) {
    console.error('Error fetching specialities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch specialities' },
      { status: 500 }
    )
  }
}