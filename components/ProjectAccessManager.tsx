"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Save, Users } from "lucide-react";

interface ProjectAccessManagerProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

interface ProjectAccess {
  id: string;
  access_level: string;
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
}

export default function ProjectAccessManager({
  project,
  isOpen,
  onClose,
  onUpdate,
}: ProjectAccessManagerProps) {
  const [projectAccess, setProjectAccess] = useState<ProjectAccess[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserAccessLevel, setNewUserAccessLevel] = useState<string>("client");

  useEffect(() => {
    if (isOpen && project?.id) {
      loadProjectAccess();
    }
  }, [isOpen, project?.id]);

  const loadProjectAccess = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/project-access?project_id=${project.id}`);
      const data = await response.json();

      if (data.success) {
        setProjectAccess(data.access || []);
      } else {
        setError(data.error || "Failed to load project access");
      }
    } catch (err) {
      setError("Failed to load project access");
      console.error("Load project access error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUserEmail.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/project-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: project.id,
          user_email: newUserEmail.trim(),
          access_level: newUserAccessLevel,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setNewUserEmail("");
        setNewUserAccessLevel("client");
        await loadProjectAccess(); // Reload the access list
      } else {
        setError(result.error || "Failed to add user");
      }
    } catch (err) {
      setError("Failed to add user");
      console.error("Add user error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this user's access?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/project-access", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: project.id,
          user_id: userId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await loadProjectAccess(); // Reload the access list
      } else {
        setError(result.error || "Failed to remove user");
      }
    } catch (err) {
      setError("Failed to remove user");
      console.error("Remove user error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccessLevel = async (userId: string, newAccessLevel: string) => {
    try {
      setLoading(true);
      setError(null);

      const userAccess = projectAccess.find(access => access.user.id === userId);
      if (!userAccess) return;

      const response = await fetch("/api/project-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: project.id,
          user_email: userAccess.user.email,
          access_level: newAccessLevel,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await loadProjectAccess(); // Reload the access list
      } else {
        setError(result.error || "Failed to update access level");
      }
    } catch (err) {
      setError("Failed to update access level");
      console.error("Update access level error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "editor":
        return "bg-blue-100 text-blue-800";
      case "client":
        return "bg-green-100 text-green-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Manage Access: {project?.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Add New User */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add User</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Email
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Level
                </label>
                <select
                  value={newUserAccessLevel}
                  onChange={(e) => setNewUserAccessLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="client">Client</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleAddUser}
                disabled={loading || !newUserEmail.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Current Access List */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Access</h3>
            {loading && projectAccess.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-gray-500">Loading...</div>
              </div>
            ) : projectAccess.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-gray-500">No users have access to this project</div>
              </div>
            ) : (
              <div className="space-y-3">
                {projectAccess.map((access) => (
                  <div
                    key={access.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {access.user.name || access.user.email}
                      </div>
                      <div className="text-sm text-gray-500">{access.user.email}</div>
                      {access.user.role && (
                        <div className="text-xs text-gray-400">Role: {access.user.role}</div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <select
                        value={access.access_level}
                        onChange={(e) => handleUpdateAccessLevel(access.user.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      >
                        <option value="viewer">Viewer</option>
                        <option value="client">Client</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getAccessLevelColor(
                          access.access_level
                        )}`}
                      >
                        {access.access_level}
                      </span>
                      <button
                        onClick={() => handleRemoveUser(access.user.id)}
                        disabled={loading}
                        className="p-1 text-red-400 hover:text-red-600 disabled:opacity-50"
                        title="Remove access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
