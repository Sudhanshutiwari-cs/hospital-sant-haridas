// app/dashboard/roles/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
      }
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Roles Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold capitalize">{role.role_name}</h3>
              <span className="text-2xl">
                {role.role_name === 'admin' ? '🔑' :
                 role.role_name === 'doctor' ? '👨‍⚕️' :
                 role.role_name === 'receptionist' ? '💼' : '👤'}
              </span>
            </div>
            <p className="text-gray-600">{role.description || 'No description'}</p>
            <div className="mt-4 text-sm text-gray-500">
              Created: {new Date(role.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Role</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Role Name *"
                value={newRole.role_name}
                onChange={(e) => setNewRole({...newRole, role_name: e.target.value})}
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                placeholder="Description"
                value={newRole.description}
                onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createRole}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}