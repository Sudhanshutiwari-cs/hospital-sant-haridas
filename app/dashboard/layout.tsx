// app/dashboard/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  Clock,
  Timer,
  Briefcase,
  LogOut,
  HeartPulse,
  UserCircle,
  ChevronRight,
  Building2,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace('/login');
        return;
      }

      // Check doctor
      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id, full_name, email')
        .eq('user_id', session.user.id)
        .single();

      if (doctorData) {
        setCurrentUser({
          role: 'doctor',
          fullName: doctorData.full_name,
          email: doctorData.email,
          doctorId: doctorData.id,
        });
        setLoading(false);
        return;
      }

      // Check staff
      const { data: staffData } = await supabase
        .from('staff')
        .select('id, full_name, email, roles(role_name)')
        .eq('user_id', session.user.id)
        .single();

      if (staffData) {
        setCurrentUser({
          role: staffData.roles?.role_name || 'receptionist',
          fullName: staffData.full_name,
          email: staffData.email,
          staffId: staffData.id,
        });
        setLoading(false);
        return;
      }

      // No role found
      await supabase.auth.signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Auth error:', error);
      router.replace('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) return null;

  const navigation = currentUser.role === 'admin' ? [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Patients', href: '/dashboard/patients', icon: Users },
    { name: 'Doctors', href: '/dashboard/doctors', icon: Stethoscope },
    { name: 'Schedules', href: '/dashboard/schedules', icon: Clock },
    { name: 'Slots', href: '/dashboard/slots', icon: Timer },
    { name: 'Staff', href: '/dashboard/staff', icon: Briefcase },
  ] : currentUser.role === 'doctor' ? [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'My Schedule', href: '/dashboard/schedules', icon: Clock },
    { name: 'My Slots', href: '/dashboard/slots', icon: Timer },
  ] : [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Patients', href: '/dashboard/patients', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 ${isCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-slate-200 transition-all duration-300 shadow-sm`}>
        {/* Logo Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-slate-800 text-lg font-bold leading-tight">Sant Haridas</h1>
                <p className="text-slate-500 text-xs">Hospital</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* User Profile */}
        <div className={`px-4 py-4 border-b border-slate-200 ${isCollapsed ? 'text-center' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-blue-600" />
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-slate-800 font-medium">{currentUser.fullName}</p>
                <p className="text-xs text-slate-500 capitalize">{currentUser.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {!isCollapsed && (
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Menu
            </p>
          )}
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title={isCollapsed ? item.name : ''}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace('/login');
            }}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200`}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isCollapsed ? 'ml-20' : 'ml-72'} transition-all duration-300`}>
        <header className="bg-white border-b border-slate-200">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-slate-800">
              {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
            </h2>
            <p className="text-sm text-slate-500">Welcome back, {currentUser.fullName}</p>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}