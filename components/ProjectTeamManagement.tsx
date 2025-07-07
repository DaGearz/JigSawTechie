'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Eye, 
  EyeOff,
  Mail,
  Shield,
  Calendar
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TeamMember {
  id: string;
  email: string;
  name?: string;
  access_level: string;
  permissions: {
    view_demo: boolean;
    view_files: boolean;
    comment: boolean;
    approve: boolean;
    download: boolean;
  };
  granted_at: string;
  granted_by_email?: string;
}

interface ProjectTeamManagementProps {
  projectId: string;
  projectName: string;
  onTeamUpdate?: () => void;
}

export default function ProjectTeamManagement({ 
  projectId, 
  projectName, 
  onTeamUpdate 
}: ProjectTeamManagementProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberAccess, setNewMemberAccess] = useState('viewer');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadTeamMembers();
  }, [projectId]);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('project_access')
        .select(`
          user_id,
          access_level,
          permissions,
          granted_at,
          user:auth.users(id, email, raw_user_meta_data),
          granted_by_user:auth.users!granted_by(email)
        `)
        .eq('project_id', projectId);

      if (error) {
        console.error('Error loading team members:', error);
        return;
      }

      const members: TeamMember[] = (data || []).map(member => ({
        id: member.user_id,
        email: member.user?.email || 'Unknown',
        name: member.user?.raw_user_meta_data?.full_name,
        access_level: member.access_level,
        permissions: member.permissions,
        granted_at: member.granted_at,
        granted_by_email: member.granted_by_user?.email
      }));

      setTeamMembers(members);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async () => {
    if (!newMemberEmail.trim()) {
      alert('Please enter an email address');
      return;
    }

    try {
      setAdding(true);

      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('id, email')
        .eq('email', newMemberEmail.trim())
        .single();

      if (userError || !userData) {
        alert('User not found. They need to create an account first.');
        return;
      }

      // Get current admin user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        alert('Authentication error');
        return;
      }

      // Add to project team
      const permissions = {
        view_demo: true,
        view_files: newMemberAccess !== 'viewer',
        comment: newMemberAccess === 'collaborator',
        approve: newMemberAccess === 'collaborator',
        download: newMemberAccess !== 'viewer'
      };

      const { error: insertError } = await supabase
        .from('project_access')
        .insert({
          project_id: projectId,
          user_id: userData.id,
          access_level: newMemberAccess,
          permissions,
          granted_by: currentUser.id
        });

      if (insertError) {
        if (insertError.code === '23505') {
          alert('User is already a team member');
        } else {
          alert(`Error adding team member: ${insertError.message}`);
        }
        return;
      }

      alert('Team member added successfully!');
      setShowAddModal(false);
      setNewMemberEmail('');
      setNewMemberAccess('viewer');
      await loadTeamMembers();
      onTeamUpdate?.();

    } catch (error) {
      console.error('Error adding team member:', error);
      alert('Failed to add team member');
    } finally {
      setAdding(false);
    }
  };

  const removeTeamMember = async (memberId: string, memberEmail: string) => {
    if (!confirm(`Remove ${memberEmail} from the project team?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('project_access')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', memberId);

      if (error) {
        alert(`Error removing team member: ${error.message}`);
        return;
      }

      alert('Team member removed successfully');
      await loadTeamMembers();
      onTeamUpdate?.();

    } catch (error) {
      console.error('Error removing team member:', error);
      alert('Failed to remove team member');
    }
  };

  const toggleDemoAccess = async (memberId: string, currentAccess: boolean) => {
    try {
      const { error } = await supabase
        .from('project_access')
        .update({
          permissions: {
            ...teamMembers.find(m => m.id === memberId)?.permissions,
            view_demo: !currentAccess
          }
        })
        .eq('project_id', projectId)
        .eq('user_id', memberId);

      if (error) {
        alert(`Error updating permissions: ${error.message}`);
        return;
      }

      await loadTeamMembers();
      onTeamUpdate?.();

    } catch (error) {
      console.error('Error updating permissions:', error);
      alert('Failed to update permissions');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Project Team</h3>
        </div>
        <p className="text-gray-500">Loading team members...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">
            Project Team ({teamMembers.length})
          </h3>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {teamMembers.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium mb-2">No team members yet</p>
          <p className="mb-4">Add team members to give them access to this project and its demos.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add First Team Member
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {teamMembers.map((member) => (
            <div key={member.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {member.name || member.email}
                      </h4>
                      {member.name && (
                        <p className="text-sm text-gray-500">{member.email}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.access_level === 'collaborator' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.access_level}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Added {new Date(member.granted_at).toLocaleDateString()}</span>
                    </div>
                    {member.granted_by_email && (
                      <div className="flex items-center space-x-1">
                        <Shield className="w-3 h-3" />
                        <span>by {member.granted_by_email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-6 flex items-center space-x-2">
                  <button
                    onClick={() => toggleDemoAccess(member.id, member.permissions.view_demo)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-xs transition-colors ${
                      member.permissions.view_demo
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    title={member.permissions.view_demo ? 'Demo access enabled' : 'Demo access disabled'}
                  >
                    {member.permissions.view_demo ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3" />
                    )}
                    <span>Demo</span>
                  </button>

                  <button
                    onClick={() => removeTeamMember(member.id, member.email)}
                    className="flex items-center space-x-1 bg-red-100 text-red-800 px-3 py-1 rounded text-xs hover:bg-red-200 transition-colors"
                  >
                    <UserMinus className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Add Team Member</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewMemberEmail('');
                  setNewMemberAccess('viewer');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="user@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  User must already have an account
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Level
                </label>
                <select
                  value={newMemberAccess}
                  onChange={(e) => setNewMemberAccess(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="viewer">Viewer (Demo access only)</option>
                  <option value="collaborator">Collaborator (Full access)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewMemberEmail('');
                  setNewMemberAccess('viewer');
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                disabled={adding}
              >
                Cancel
              </button>
              <button
                onClick={addTeamMember}
                disabled={adding || !newMemberEmail.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {adding && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                <span>{adding ? 'Adding...' : 'Add Member'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
