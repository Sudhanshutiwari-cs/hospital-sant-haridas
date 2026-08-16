// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">M</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">MediCare</h1>
          <p className="text-gray-600 mt-2">Hospital Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 text-center mb-3">Demo Credentials</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@medicare.com');
                setPassword('Admin@123456');
              }}
              className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg"
            >
              <span className="text-sm">
                <strong>Admin:</strong> admin@medicare.com / Admin@123456
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('doctor@medicare.com');
                setPassword('Doctor@123456');
              }}
              className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg"
            >
              <span className="text-sm">
                <strong>Doctor:</strong> doctor@medicare.com / Doctor@123456
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('reception@medicare.com');
                setPassword('Reception@123456');
              }}
              className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg"
            >
              <span className="text-sm">
                <strong>Receptionist:</strong> reception@medicare.com / Reception@123456
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}