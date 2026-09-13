// app/dashboard/roles/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Plus,
  KeyRound,
  Stethoscope,
  Briefcase,
  Users,
  Lock,
  X,
  Sparkles,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface Role {
  id: string;
  role_name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export default function RolesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newRole, setNewRole] = useState({
    role_name: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/current-user');
      const userData = await userRes.json();
      setCurrentUser(userData);

      if (userData.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      const res = await fetch('/api/roles');
      setRoles(await res.json());
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRole = async () => {
    if (!newRole.role_name.trim()) {
      alert('Please enter a role name');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole),
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchData();
        setNewRole({
          role_name: '',
          description: '',
        });
      } else {
        const err = await res.json();
        alert('Failed to create role: ' + (err.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating role:', error);
    } finally {
      setCreating(false);
    }
  };

  const getRoleIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'admin':
        return <KeyRound className="w-5 h-5 text-indigo-600" />;
      case 'doctor':
        return <Stethoscope className="w-5 h-5 text-blue-600" />;
      case 'receptionist':
        return <Briefcase className="w-5 h-5 text-emerald-600" />;
      default:
        return <Users className="w-5 h-5 text-slate-600" />;
    }
  };

  const getRoleBadgeStyle = (name: string) => {
    switch (name.toLowerCase()) {
      case 'admin':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
      case 'doctor':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'receptionist':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRolePermissions = (name: string) => {
    switch (name.toLowerCase()) {
      case 'admin':
        return ['Full System Access', 'Staff & User Management', 'Revenue Analytics', 'System Configuration'];
      case 'doctor':
        return ['Patient Appointments View', 'Clinical Records & OPD', 'Time Slots Regulate', 'Prescriptions'];
      case 'receptionist':
        return ['Book & Confirm Visits', 'Collect OPD Payments', 'Patient Registration', 'Doctor Roster View'];
      default:
        return ['Read Basic Profiles', 'Dashboard Access'];
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-900 border-t-transparent"></div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Loading access roles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Roles & Permissions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage granular clinical access levels, administrative permissions, and security roles.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm shadow-sm transition-all active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Role</span>
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Defined Roles</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{roles.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">RBAC Status</p>
            <p className="text-lg font-bold text-emerald-600 mt-0.5">Enforced</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Admin Tier</p>
            <p className="text-lg font-bold text-indigo-600 mt-0.5">Tier 1 Superuser</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Auth Scope</p>
            <p className="text-lg font-bold text-slate-800 mt-0.5">Hospital Wide</p>
          </div>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roles.map((role) => {
          const permissions = getRolePermissions(role.role_name);

          return (
            <div
              key={role.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center">
                      {getRoleIcon(role.role_name)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 capitalize">
                        {role.role_name}
                      </h3>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRoleBadgeStyle(role.role_name)}`}>
                        {role.role_name}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 min-h-[32px] mb-4">
                  {role.description || 'System defined operational role with standard department privileges.'}
                </p>

                {/* Permissions tag cloud */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Access Capabilities
                  </span>
                  <div className="space-y-1">
                    {permissions.map((perm, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Created {new Date(role.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="font-mono text-[10px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                  ID: {role.id.slice(0, 8)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-900/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Add New Role</h2>
                  <p className="text-xs text-slate-500">Create a customized access control tier</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Role Identifier <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. nurse, lab_technician, accountant"
                  value={newRole.role_name}
                  onChange={(e) => setNewRole({ ...newRole, role_name: e.target.value.toLowerCase().trim() })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Role Description
                </label>
                <textarea
                  placeholder="Describe the duties and intended access rights of this role..."
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowAddModal(false)}
                  disabled={creating}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createRole}
                  disabled={creating || !newRole.role_name}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs shadow-sm transition-all disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {creating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Role'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}