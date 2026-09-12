// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Verify user role
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (doctorData) {
          router.replace('/dashboard');
          return;
        }

        const { data: staffData } = await supabase
          .from('staff')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (staffData) {
          router.replace('/dashboard');
          return;
        }
      }

      setCheckingSession(false);
    } catch (error) {
      console.error('Session check error:', error);
      setCheckingSession(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        console.error('Auth error:', authError);
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Check doctor
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', data.user.id)
          .single();

        if (doctorData) {
          console.log('Doctor logged in');
          router.replace('/dashboard');
          return;
        }

        // Check staff
        const { data: staffData } = await supabase
          .from('staff')
          .select('id')
          .eq('user_id', data.user.id)
          .single();

        if (staffData) {
          console.log('Staff logged in');
          router.replace('/dashboard');
          return;
        }

        // No role found
        setError('User role not found. Please contact administrator.');
        await supabase.auth.signOut();
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa]">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#1a9fa8]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf6f7] via-white to-[#eaf6f7] flex items-center justify-center px-3 sm:px-4 py-8">
      <div className="w-full max-w-md">
        {/* Top: back to site link */}
        <div className="flex justify-center mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-[#1a9fa8] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl w-full p-5 sm:p-8 border border-gray-100">
          {/* Header with hospital branding */}
          <div className="text-center mb-6 sm:mb-8">
            <Link href="/" className="inline-block mb-3">
              <img
                src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
                alt="Sant Haridas Hospital"
                className="h-14 sm:h-16 w-auto object-contain mx-auto"
              />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a3a5c]">
              Sant Haridas Hospital
            </h1>
            <p className="text-[13px] sm:text-sm text-gray-600 mt-1">
              Staff & Doctor Login Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-[13px] sm:text-[14px]">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[13px] sm:text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1a9fa8] focus:border-[#1a9fa8] transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-[13px] sm:text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1a9fa8] focus:border-[#1a9fa8] transition-colors"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 sm:py-3 px-4 rounded-lg text-white font-semibold text-[14px] sm:text-[15px] transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#1a9fa8] hover:bg-[#158791]'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Help text */}
          <div className="mt-6 text-center">
            <p className="text-[12px] text-gray-500">
              Forgot your password? Contact{' '}
              <a
                href="mailto:santharidashospital@gmail.com"
                className="text-[#1a9fa8] hover:underline font-medium"
              >
                santharidashospital@gmail.com
              </a>
            </p>
          </div>

          {/* Footer links */}
          <div className="mt-6 border-t border-gray-200 pt-5 flex items-center justify-center gap-4 flex-wrap text-[12px] text-gray-500">
            <Link href="/" className="hover:text-[#1a9fa8] transition-colors">
              Home
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/contact" className="hover:text-[#1a9fa8] transition-colors">
              Contact
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/book-appointment" className="hover:text-[#1a9fa8] transition-colors">
              Book Appointment
            </Link>
          </div>
        </div>

        {/* Patient login alternate */}
        <div className="mt-4 text-center">
          <p className="text-[12px] text-gray-500">
            Are you a patient?{' '}
            <Link
              href="/patient/login"
              className="text-[#1a9fa8] font-semibold hover:underline"
            >
              Patient Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}