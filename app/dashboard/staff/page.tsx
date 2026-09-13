// app/dashboard/staff/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/receptionists');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );
}