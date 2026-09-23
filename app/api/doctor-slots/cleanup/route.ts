// app/api/doctor-slots/cleanup/route.ts
import { NextResponse } from 'next/server';
import { cleanupPastSlots } from '@/lib/slots-cleanup';

export async function POST() {
  try {
    const result = await cleanupPastSlots();
    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result.deleted} past slot(s).`,
      ...result,
    });
  } catch (error: any) {
    console.error('Error in cleanup route:', error);
    return NextResponse.json({ error: error?.message || 'Failed to cleanup past slots' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await cleanupPastSlots();
    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result.deleted} past slot(s).`,
      ...result,
    });
  } catch (error: any) {
    console.error('Error in cleanup route:', error);
    return NextResponse.json({ error: error?.message || 'Failed to cleanup past slots' }, { status: 500 });
  }
}
