// app/dashboard/receptionists/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  UserCheck,
  UserCircle,
  Phone,
  Mail,
  X,
  ChevronDown,
  CheckCircle,
  Key,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';

interface Receptionist {
  id: string;
  user_id: string | null;
  role_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  roles?: {
    role_name: string;
  };
}

export default function ReceptionistsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Add Receptionist form state
  const [newReceptionist, setNewReceptionist] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    create_account: true,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Edit Receptionist state
  const [editReceptionist, setEditReceptionist] = useState({
    id: '',
    full_name: '',
    email: '',
    phone: '',
  });

  // Account modal state (for existing receptionists or resetting password)
  const [accountModalMember, setAccountModalMember] = useState<Receptionist | null>(null);
  const [accountPassword, setAccountPassword] = useState('');
  const [showAccountPassword, setShowAccountPassword] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Success credentials modal state
  const [credentialsModal, setCredentialsModal] = useState<{
    name: string;
    email: string;
    password: string;
    isNew: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const fetchData = async () => {
    try {
      // Get session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Check if staff and admin
      const { data: staffData } = await supabase
        .from('staff')
        .select('id, roles(role_name)')
        .eq('user_id', session.user.id)
        .single();

      if (!staffData || staffData.roles?.role_name !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setCurrentUser({
        role: 'admin',
      });

      // Fetch receptionists via API
      const res = await fetch('/api/receptionists');
      if (!res.ok) {
        throw new Error('Failed to fetch receptionists');
      }
      const data = await res.json();
      setReceptionists(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching receptionists:', error);
      setLoading(false);
    }
  };

  const createReceptionist = async () => {
    try {
      setCreateError(null);
      if (!newReceptionist.full_name.trim()) {
        setCreateError('Full name is required');
        return;
      }
      if (!newReceptionist.email.trim()) {
        setCreateError('Email is required');
        return;
      }
      if (newReceptionist.create_account && (!newReceptionist.password || newReceptionist.password.length < 6)) {
        setCreateError('Password must be at least 6 characters long');
        return;
      }

      setCreateLoading(true);

      const res = await fetch('/api/receptionists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReceptionist),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create receptionist');
      }

      const createdPassword = newReceptionist.create_account ? newReceptionist.password : '';
      const recName = newReceptionist.full_name;
      const recEmail = newReceptionist.email.trim().toLowerCase();

      setShowAddModal(false);
      setNewReceptionist({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        create_account: true,
      });

      await fetchData();

      if (createdPassword) {
        setCredentialsModal({
          name: recName,
          email: recEmail,
          password: createdPassword,
          isNew: true,
        });
      }
    } catch (error: any) {
      console.error('Error creating receptionist:', error);
      setCreateError(error.message || 'Failed to create receptionist');
    } finally {
      setCreateLoading(false);
    }
  };

  const openAccountModal = (member: Receptionist) => {
    setAccountModalMember(member);
    setAccountPassword(generateRandomPassword());
    setShowAccountPassword(true);
    setAccountError(null);
  };

  const handleAccountSubmit = async () => {
    if (!accountModalMember) return;
    if (!accountPassword || accountPassword.length < 6) {
      setAccountError('Password must be at least 6 characters long');
      return;
    }

    try {
      setAccountLoading(true);
      setAccountError(null);

      const res = await fetch('/api/receptionists/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receptionist_id: accountModalMember.id,
          password: accountPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to configure login credentials');
      }

      const isNew = !accountModalMember.user_id;
      const savedName = accountModalMember.full_name;
      const savedEmail = accountModalMember.email;
      const savedPass = accountPassword;

      setAccountModalMember(null);
      await fetchData();

      setCredentialsModal({
        name: savedName,
        email: savedEmail,
        password: savedPass,
        isNew,
      });
    } catch (err: any) {
      console.error('Error configuring receptionist login:', err);
      setAccountError(err.message || 'Failed to configure login credentials');
    } finally {
      setAccountLoading(false);
    }
  };

  const openEditModal = (member: Receptionist) => {
    setEditReceptionist({
      id: member.id,
      full_name: member.full_name,
      email: member.email,
      phone: member.phone || '',
    });
    setShowEditModal(true);
  };

  const updateReceptionist = async () => {
    try {
      const res = await fetch(`/api/receptionists/${editReceptionist.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editReceptionist.id,
          full_name: editReceptionist.full_name,
          email: editReceptionist.email.trim().toLowerCase(),
          phone: editReceptionist.phone || null,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to update receptionist');
      }

      setShowEditModal(false);
      fetchData();
    } catch (error: any) {
      console.error('Error updating receptionist:', error);
      alert(error.message || 'Failed to update receptionist');
    }
  };

  const deleteReceptionist = async (id: string) => {
    if (!confirm('Are you sure you want to delete this receptionist?')) return;

    try {
      const res = await fetch(`/api/receptionists/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to delete receptionist');
      }

      fetchData();
    } catch (error: any) {
      console.error('Error deleting receptionist:', error);
      alert(error.message || 'Failed to delete receptionist');
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/receptionists/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !currentStatus }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to update status');
      }

      fetchData();
    } catch (error: any) {
      console.error('Error updating receptionist status:', error);
      alert(error.message || 'Failed to update status');
    }
  };

  const filteredReceptionists = receptionists.filter(member => {
    const term = searchTerm.toLowerCase();
    return (
      member.full_name?.toLowerCase().includes(term) ||
      member.email?.toLowerCase().includes(term) ||
      member.phone?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Receptionists</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage hospital reception desk staff and portal login accounts
          </p>
        </div>
        <button
          onClick={() => {
            setCreateError(null);
            setNewReceptionist({
              full_name: '',
              email: '',
              phone: '',
              password: generateRandomPassword(),
              create_account: true,
            });
            setShowNewPassword(true);
            setShowAddModal(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Receptionist</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search receptionists by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Receptionists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReceptionists.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-800 truncate">
                    {member.full_name}
                  </h3>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700">
                    Front Desk Receptionist
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate font-mono text-xs">{member.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span>{member.phone || 'No phone recorded'}</span>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {member.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {member.user_id ? (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                      title="Receptionist can log in with their email and password"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Login Active
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"
                      title="No login account created yet"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      No Login
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {member.user_id ? (
                    <button
                      onClick={() => openAccountModal(member)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Reset Login Password"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => openAccountModal(member)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                      title="Create Login Account"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Setup Login</span>
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(member)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Receptionist"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteReceptionist(member.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Receptionist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleStatus(member.id, member.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      member.is_active
                        ? 'text-yellow-600 hover:bg-yellow-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={member.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {member.is_active ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReceptionists.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <UserCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 font-medium text-lg">No receptionists found</p>
          <p className="text-gray-400 text-sm mt-1">
            Click "Add Receptionist" to set up a new front-desk account.
          </p>
        </div>
      )}

      {/* Add Receptionist Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !createLoading && setShowAddModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Add Receptionist</h2>
                  <p className="text-xs text-gray-500">Create staff profile & portal login</p>
                </div>
              </div>
              <button
                disabled={createLoading}
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {createError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newReceptionist.full_name}
                  onChange={(e) =>
                    setNewReceptionist({ ...newReceptionist, full_name: e.target.value })
                  }
                  placeholder="e.g. Priya Sharma"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={newReceptionist.email}
                  onChange={(e) =>
                    setNewReceptionist({ ...newReceptionist, email: e.target.value })
                  }
                  placeholder="e.g. priya.reception@hospital.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={newReceptionist.phone}
                  onChange={(e) =>
                    setNewReceptionist({ ...newReceptionist, phone: e.target.value })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Login Credentials Section */}
              <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/70 border border-blue-200/80 rounded-xl p-4 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      Receptionist Portal Login
                    </span>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 cursor-pointer select-none bg-white px-2 py-0.5 rounded border border-blue-200">
                    <input
                      type="checkbox"
                      checked={newReceptionist.create_account}
                      onChange={(e) =>
                        setNewReceptionist({
                          ...newReceptionist,
                          create_account: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span>Create Login</span>
                  </label>
                </div>

                {newReceptionist.create_account ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-semibold text-gray-700">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const p = generateRandomPassword();
                          setNewReceptionist({ ...newReceptionist, password: p });
                          setShowNewPassword(true);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                      >
                        <Key className="w-3 h-3" />
                        <span>Auto-Generate</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newReceptionist.password}
                        onChange={(e) =>
                          setNewReceptionist({ ...newReceptionist, password: e.target.value })
                        }
                        placeholder="Enter password (min 6 chars)"
                        className="w-full bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-600">
                      Receptionist will log in at <span className="font-semibold text-blue-700">/login</span> to manage appointments and patient registrations.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    Account creation skipped. Login can be set up later.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50/50">
              <button
                disabled={createLoading}
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                disabled={createLoading}
                onClick={createReceptionist}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-semibold flex items-center gap-2"
              >
                {createLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{createLoading ? 'Creating...' : 'Create Receptionist'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Receptionist Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Edit Receptionist</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={editReceptionist.full_name}
                  onChange={(e) =>
                    setEditReceptionist({ ...editReceptionist, full_name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={editReceptionist.email}
                  onChange={(e) =>
                    setEditReceptionist({ ...editReceptionist, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editReceptionist.phone}
                  onChange={(e) =>
                    setEditReceptionist({ ...editReceptionist, phone: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50/50">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={updateReceptionist}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Setup / Reset Login Modal */}
      {accountModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !accountLoading && setAccountModalMember(null)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {accountModalMember.user_id
                      ? 'Reset Receptionist Password'
                      : 'Create Receptionist Login'}
                  </h2>
                  <p className="text-xs text-gray-500">{accountModalMember.full_name}</p>
                </div>
              </div>
              <button
                disabled={accountLoading}
                onClick={() => setAccountModalMember(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {accountError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{accountError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Login Email
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-mono">
                  {accountModalMember.email}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    {accountModalMember.user_id ? 'New Password' : 'Set Password'} <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountPassword(generateRandomPassword());
                      setShowAccountPassword(true);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <Key className="w-3 h-3" />
                    <span>Generate Secure</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showAccountPassword ? 'text' : 'password'}
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                    placeholder="Enter password (min 6 chars)"
                    className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccountPassword(!showAccountPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showAccountPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
                <p className="font-semibold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Receptionist Portal Access
                </p>
                <p className="text-blue-700">
                  The receptionist can immediately log in at <span className="font-semibold underline">/login</span> using this email and password.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50/50">
              <button
                disabled={accountLoading}
                onClick={() => setAccountModalMember(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                disabled={accountLoading}
                onClick={handleAccountSubmit}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm font-semibold flex items-center gap-2"
              >
                {accountLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>
                  {accountLoading
                    ? 'Saving...'
                    : accountModalMember.user_id
                    ? 'Update Password'
                    : 'Create Login Account'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Created/Updated Success Modal */}
      {credentialsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCredentialsModal(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-center relative">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xs rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">
                {credentialsModal.isNew
                  ? 'Receptionist Account Created!'
                  : 'Password Updated!'}
              </h3>
              <p className="text-emerald-100 text-xs mt-1">
                Portal credentials are ready to be used
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                    Receptionist
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {credentialsModal.name}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                    Login Email
                  </span>
                  <span className="text-sm font-mono text-gray-800 break-all">
                    {credentialsModal.email}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                    Password
                  </span>
                  <span className="text-sm font-mono font-bold text-indigo-700 bg-white px-2.5 py-1 rounded border border-indigo-100 inline-block mt-0.5">
                    {credentialsModal.password}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                    Login Portal URL
                  </span>
                  <span className="text-xs text-blue-600 underline break-all">
                    {typeof window !== 'undefined'
                      ? `${window.location.origin}/login`
                      : '/login'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  const origin =
                    typeof window !== 'undefined' ? window.location.origin : '';
                  const message = `Sant Haridas Hospital - Receptionist Portal Credentials\nReceptionist: ${credentialsModal.name}\nLogin Portal: ${origin}/login\nEmail: ${credentialsModal.email}\nPassword: ${credentialsModal.password}`;
                  copyToClipboard(message);
                }}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Credentials Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Login Credentials</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setCredentialsModal(null)}
                className="w-full py-2 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
