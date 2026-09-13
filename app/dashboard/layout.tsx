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
  LogOut,
  HeartPulse,
  ChevronRight,
  UserCheck,
  Menu,
  X,
  ExternalLink,
  Shield,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  section?: string;
  badge?: string;
}

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile drawer when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-400 rounded-full animate-spin"></div>
          <Activity className="w-6 h-6 text-teal-400 absolute" />
        </div>
        <p className="text-slate-400 text-sm font-medium tracking-wide animate-pulse">
          Loading Sant Haridas Hospital Portal...
        </p>
      </div>
    );
  }

  if (!currentUser) return null;

  // Navigation Items
  const adminNavItems: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'OVERVIEW' },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar, section: 'CLINICAL' },
    { name: 'Patients', href: '/dashboard/patients', icon: Users, section: 'CLINICAL' },
    { name: 'Doctors', href: '/dashboard/doctors', icon: Stethoscope, section: 'STAFF & SCHEDULES' },
    { name: 'Receptionists', href: '/dashboard/receptionists', icon: UserCheck, section: 'STAFF & SCHEDULES' },
    { name: 'Schedules', href: '/dashboard/schedules', icon: Clock, section: 'STAFF & SCHEDULES' },
    { name: 'Slots', href: '/dashboard/slots', icon: Timer, section: 'STAFF & SCHEDULES' },
    { name: 'Blogs & Articles', href: '/dashboard/blogs', icon: HeartPulse, section: 'MARKETING' },
  ];

  const doctorNavItems: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'OVERVIEW' },
    { name: 'My Appointments', href: '/dashboard/appointments', icon: Calendar, section: 'MY CLINIC' },
    { name: 'My Schedule', href: '/dashboard/schedules', icon: Clock, section: 'MY CLINIC' },
    { name: 'My Slots', href: '/dashboard/slots', icon: Timer, section: 'MY CLINIC' },
  ];

  const receptionistNavItems: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'OVERVIEW' },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar, section: 'FRONT DESK' },
    { name: 'Patients', href: '/dashboard/patients', icon: Users, section: 'FRONT DESK' },
  ];

  const navigation: NavigationItem[] =
    currentUser.role === 'admin'
      ? adminNavItems
      : currentUser.role === 'doctor'
      ? doctorNavItems
      : receptionistNavItems;

  const currentNav = navigation.find((item) => item.href === pathname);
  const currentPageTitle = currentNav?.name || 'Hospital Dashboard';

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* ── Mobile Header Bar (< lg) ── */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#0f172a] text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors"
            aria-label="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center flex-shrink-0 shadow-xs">
              <img
                src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
                alt="Sant Haridas Hospital"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block leading-tight">
                Sant Haridas
              </span>
              <span className="text-[10px] text-teal-300 font-semibold tracking-wide uppercase">
                {currentUser.role} Portal
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="View Live Website"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-950/40 text-red-300 hover:bg-red-900/60 text-xs transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Mobile Backdrop Overlay ── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ── Sidebar (Desktop & Mobile Slide-Out) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#0f172a] text-slate-300 flex flex-col transition-all duration-300 shadow-2xl lg:shadow-none border-r border-slate-800 overflow-hidden ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-[#0b1329] shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center flex-shrink-0 shadow-md ring-1 ring-white/10">
              <img
                src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
                alt="Sant Haridas Hospital"
                className="w-full h-full object-contain"
              />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="min-w-0">
                <h1 className="text-white font-bold text-sm leading-tight tracking-tight truncate">
                  Sant Haridas
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider">
                    {currentUser.role} Portal
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 items-center justify-center transition-colors shrink-0"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-200 ${
                isCollapsed ? '' : 'rotate-180'
              }`}
            />
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className={`px-4 py-2.5 border-b border-slate-800/80 bg-[#0d172e] shrink-0 ${isCollapsed && !isMobileOpen ? 'text-center' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0">
              {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-semibold truncate leading-tight">
                  {currentUser.fullName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30 capitalize">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-0.5 no-scrollbar custom-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {navigation.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const showSection =
              (!isCollapsed || isMobileOpen) &&
              item.section &&
              (idx === 0 || navigation[idx - 1]?.section !== item.section);

            return (
              <div key={item.name}>
                {showSection && (
                  <p className="px-3 pt-2.5 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {item.section}
                  </p>
                )}
                <Link
                  href={item.href}
                  className={`group relative flex items-center overflow-hidden ${
                    isCollapsed && !isMobileOpen ? 'justify-center' : 'space-x-3'
                  } px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/25 to-blue-600/15 text-white font-semibold shadow-inner border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                  title={isCollapsed && !isMobileOpen ? item.name : ''}
                >
                  {/* Left glowing bar on active */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-teal-400 rounded-r-full shadow-lg shadow-teal-400/50" />
                  )}
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-teal-300' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="truncate text-xs sm:text-sm">{item.name}</span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Sidebar Actions */}
        <div className="p-2.5 border-t border-slate-800/80 bg-[#0b1329] space-y-0.5 shrink-0">
          {/* Quick link to live website */}
          <Link
            href="/"
            target="_blank"
            className={`flex items-center ${
              isCollapsed && !isMobileOpen ? 'justify-center' : 'space-x-2.5'
            } px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-teal-300 hover:bg-slate-800/50 transition-colors`}
            title="View Live Website"
          >
            <ExternalLink className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span className="truncate">View Live Website</span>}
          </Link>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              isCollapsed && !isMobileOpen ? 'justify-center' : 'space-x-2.5'
            } px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300/80 hover:text-rose-200 hover:bg-rose-950/40 transition-colors`}
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span className="truncate">Sign Out</span>}
          </button>
        </div>
      </aside>


      {/* ── Main Layout Workspace ── */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        {/* Top Header Bar (Desktop Sticky) */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xs">
          <div className="flex items-center justify-between gap-4">
            {/* Page title & breadcrumb */}
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
                <span>Portal</span>
                <span>/</span>
                <span className="text-teal-700 font-semibold capitalize">
                  {currentUser.role}
                </span>
                <span>/</span>
                <span className="text-slate-600">{currentPageTitle}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
                {currentPageTitle}
              </h1>
            </div>

            {/* Right Header Tools */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Live operational badge */}
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Hospital Online</span>
              </div>

              {/* Date pill */}
              <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{todayFormatted}</span>
              </div>

              {/* Live site button */}
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
                <span>Live Site</span>
              </Link>

              {/* User avatar chip */}
              <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-none">
                    {currentUser.fullName}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize mt-0.5">
                    {currentUser.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}