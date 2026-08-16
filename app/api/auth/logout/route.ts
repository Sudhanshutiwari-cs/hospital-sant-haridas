// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function POST() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}