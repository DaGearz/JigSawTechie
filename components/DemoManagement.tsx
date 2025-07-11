"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Upload,
  Settings,
  ExternalLink,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  HardDrive,
} from "lucide-react";
import {
  DemoProject,
  BuildType,
  DemoType,
  getDemoStatusColor,
  getDemoStatusLabel,
  getBuildTypeLabel,
} from "@/lib/types/demo";

interface DemoManagementProps {
  projects: any[]; // Existing projects from admin dashboard
}

export default function DemoManagement({ projects }: DemoManagementProps) {
  const [demos, setDemos] = useState<DemoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [deployForm, setDeployForm] = useState({
    demo_name: "",
    demo_type: "integrated" as DemoType,
    build_type: "static" as BuildType,
    local_path: "",
    external_url: "",
    external_description: "",
  });
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    loadDemos();
  }, []);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    try {
      const authData = localStorage.getItem(
        "sb-oyzycafkfmrrqmpwgtdg-auth-token"
      );
      if (authData) {
        const parsed = JSON.parse(authData);
        const token = parsed.access_token;
        return {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
    return {
      "Content-Type": "application/json",
    };
  };

  const loadDemos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/demos", {
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (data.success) {
        setDemos(data.demos || []);
      } else {
        setError(data.error || "Failed to load demos");
        console.error("Demo loading error:", data);
      }
    } catch (err) {
      setError("Failed to load demos");
      console.error("Error loading demos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeployDemo = async () => {
    // Validation based on demo type
    if (!selectedProject || !deployForm.demo_name) {
      alert("Please fill in all required fields");
      return;
    }

    if (deployForm.demo_type === "integrated" && !deployForm.local_path) {
      alert("Please provide the local project path for integrated demos");
      return;
    }

    if (deployForm.demo_type === "external" && !deployForm.external_url) {
      alert("Please provide the external URL for external demos");
      return;
    }

    try {
      setDeploying(true);

      const response = await fetch("/api/demo/deploy", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          project_id: selectedProject.id,
          demo_name: deployForm.demo_name,
          demo_type: deployForm.demo_type,
          build_type: deployForm.build_type,
          local_path: deployForm.local_path,
          external_url: deployForm.external_url,
          external_description: deployForm.external_description,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          deployForm.demo_type === "external"
            ? "External demo link added successfully!"
            : "Demo deployed successfully!"
        );
        setShowDeployModal(false);
        setDeployForm({
          demo_name: "",
          demo_type: "integrated",
          build_type: "static",
          local_path: "",
          external_url: "",
          external_description: "",
        });
        setSelectedProject(null);
        await loadDemos(); // Reload demos
      } else {
        alert(`Deployment failed: ${data.error}`);
      }
    } catch (err) {
      alert("Deployment failed: Network error");
      console.error("Deployment error:", err);
    } finally {
      setDeploying(false);
    }
  };

  const handleDeleteDemo = async (demo: DemoProject) => {
    if (
      !confirm(
        `Are you sure you want to delete the demo for "${demo.demo_name}"? This will remove all demo files.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/demo/${demo.demo_slug}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (data.success) {
        alert("Demo deleted successfully");
        await loadDemos(); // Reload demos
      } else {
        alert(`Failed to delete demo: ${data.error}`);
      }
    } catch (err) {
      alert("Failed to delete demo: Network error");
      console.error("Delete error:", err);
    }
  };

  const getProjectsWithoutDemos = () => {
    const demoProjectIds = demos.map((d) => d.project_id);
    return projects.filter((p) => !demoProjectIds.includes(p.id));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Demo Management</h2>
        </div>
        <div className="p-8 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Loading demos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Demo Management</h2>
        </div>
        <div className="p-8 text-center">
          <AlertCircle className="w-8 h-8 mx-auto text-red-400 mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadDemos}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          Demo Management ({demos.length})
        </h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadDemos}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          {getProjectsWithoutDemos().length > 0 && (
            <button
              onClick={() => setShowDeployModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Deploy New Demo</span>
            </button>
          )}
        </div>
      </div>

      {demos.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Globe className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium mb-2">No demos deployed yet</p>
          <p className="mb-4">
            Deploy demos from your existing projects to showcase your work.
          </p>
          {getProjectsWithoutDemos().length > 0 && (
            <button
              onClick={() => setShowDeployModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Deploy Your First Demo
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {demos.map((demo) => (
            <div key={demo.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {demo.demo_name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full bg-${getDemoStatusColor(demo.status)}-100 text-${getDemoStatusColor(demo.status)}-800`}
                    >
                      {getDemoStatusLabel(demo.status)}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {getBuildTypeLabel(demo.build_type)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>
                        {demo.project?.client?.email || "Unknown client"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Updated{" "}
                        {new Date(demo.last_updated).toLocaleDateString()}
                      </span>
                    </div>
                    {demo.file_size_mb && (
                      <div className="flex items-center space-x-2">
                        <HardDrive className="w-4 h-4" />
                        <span>{demo.file_size_mb.toFixed(1)} MB</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <a
                        href={demo.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 truncate"
                      >
                        {demo.demo_url}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="ml-6 flex flex-col space-y-2">
                  {demo.status === "ready" && (
                    <button
                      onClick={() => window.open(demo.demo_url, "_blank")}
                      className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Demo</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteDemo(demo)}
                    className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deploy Demo Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Deploy New Demo
              </h2>
              <button
                onClick={() => {
                  setShowDeployModal(false);
                  setSelectedProject(null);
                  setDeployForm({
                    demo_name: "",
                    build_type: "static",
                    local_path: "",
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Project
                </label>
                <select
                  value={selectedProject?.id || ""}
                  onChange={(e) => {
                    const project = getProjectsWithoutDemos().find(
                      (p) => p.id === e.target.value
                    );
                    setSelectedProject(project);
                    if (project) {
                      setDeployForm((prev) => ({
                        ...prev,
                        demo_name: `Demo: ${project.name}`,
                      }));
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a project...</option>
                  {getProjectsWithoutDemos().map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} ({project.client?.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demo Name
                </label>
                <input
                  type="text"
                  value={deployForm.demo_name}
                  onChange={(e) =>
                    setDeployForm((prev) => ({
                      ...prev,
                      demo_name: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter demo name..."
                />
              </div>

              {/* Demo Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demo Type
                </label>
                <select
                  value={deployForm.demo_type}
                  onChange={(e) =>
                    setDeployForm((prev) => ({
                      ...prev,
                      demo_type: e.target.value as DemoType,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="integrated">
                    🏠 Integrated (Host on JigsawTechie)
                  </option>
                  <option value="external">
                    🔗 External Link (Vercel/Other)
                  </option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {deployForm.demo_type === "integrated"
                    ? "Deploy files to jigsawtechie.com with authentication"
                    : "Just link to an external URL (backup option)"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <select
                  value={deployForm.build_type}
                  onChange={(e) =>
                    setDeployForm((prev) => ({
                      ...prev,
                      build_type: e.target.value as BuildType,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="static">Static Files</option>
                  <option value="nextjs">Next.js</option>
                  <option value="react">React</option>
                  <option value="html">HTML</option>
                </select>
              </div>

              {/* Conditional Fields Based on Demo Type */}
              {deployForm.demo_type === "integrated" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Local Project Path
                  </label>
                  <input
                    type="text"
                    value={deployForm.local_path}
                    onChange={(e) =>
                      setDeployForm((prev) => ({
                        ...prev,
                        local_path: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="C:\path\to\your\project"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Full path to your local project directory
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      External Demo URL
                    </label>
                    <input
                      type="url"
                      value={deployForm.external_url}
                      onChange={(e) =>
                        setDeployForm((prev) => ({
                          ...prev,
                          external_url: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://vivie-demo.vercel.app"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL where the demo is hosted (Vercel, Netlify, etc.)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={deployForm.external_description}
                      onChange={(e) =>
                        setDeployForm((prev) => ({
                          ...prev,
                          external_description: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Notes about this external demo..."
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional notes about the external demo
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => {
                  setShowDeployModal(false);
                  setSelectedProject(null);
                  setDeployForm({
                    demo_name: "",
                    build_type: "static",
                    local_path: "",
                  });
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                disabled={deploying}
              >
                Cancel
              </button>
              <button
                onClick={handleDeployDemo}
                disabled={
                  deploying ||
                  !selectedProject ||
                  !deployForm.demo_name ||
                  (deployForm.demo_type === "integrated" &&
                    !deployForm.local_path) ||
                  (deployForm.demo_type === "external" &&
                    !deployForm.external_url)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {deploying && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>{deploying ? "Deploying..." : "Deploy Demo"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
