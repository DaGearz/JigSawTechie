"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { authService, User, Project } from "@/lib/auth";
import AdminLogin from "@/components/AdminLogin";
import ProjectRequestModal from "@/components/ProjectRequestModal";
import MessageModal from "@/components/MessageModal";
import {
  Calendar,
  Clock,
  Globe,
  FileText,
  Download,
  Eye,
  LogOut,
  Plus,
  MessageCircle,
  ExternalLink,
  X,
  Send,
  CheckCircle,
} from "lucide-react";

export default function ClientDashboard() {
  const params = useParams();
  const clientId = params.clientId as string;

  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Communication modals
  const [showProjectRequestModal, setShowProjectRequestModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProjects();
    }
  }, [isAuthenticated, user]);

  const checkAuth = async () => {
    try {
      // SECURITY: Prevent access to /client/admin or other reserved routes
      if (
        clientId === "admin" ||
        clientId === "administrator" ||
        clientId === "root"
      ) {
        setError("Invalid route. Admin access is at /admin");
        setAuthLoading(false);
        return;
      }

      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        // Check if user is admin or the specific client
        if (currentUser.role === "admin" || currentUser.id === clientId) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setError("Access denied. You can only view your own projects.");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      let userProjects: Project[];

      if (user?.role === "admin") {
        // Admin can see all projects, but filter by clientId if specified
        userProjects = await authService.getAllProjects();
        if (clientId !== "all") {
          userProjects = userProjects.filter((p) => p.client_id === clientId);
        }
      } else {
        // Client can only see their own projects
        userProjects = await authService.getUserProjects();
      }

      setProjects(userProjects);
    } catch (err: any) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    checkAuth();
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setProjects([]);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "development":
        return "bg-yellow-100 text-yellow-800";
      case "review":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "on_hold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <AdminLogin onLoginSuccess={handleLoginSuccess} requireAdmin={false} />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={loadProjects}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {successMessage}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-green-400 hover:text-green-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === "admin" ? "Client Projects" : "My Projects"}
            </h1>
            <p className="text-gray-600 mt-2">
              {user?.role === "admin"
                ? "Manage client projects and previews"
                : "Track your project progress and access previews"}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {user?.role === "client" && (
              <button
                onClick={() => setShowProjectRequestModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Request Project</span>
              </button>
            )}
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Projects Yet
            </h3>
            <p className="text-gray-600 mb-6">
              {user?.role === "admin"
                ? "Create projects from quotes in the admin dashboard."
                : "Ready to start your next project? Let's discuss your ideas!"}
            </p>

            {/* Client Action Buttons */}
            {user?.role === "client" && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => setShowProjectRequestModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Request New Project</span>
                </button>

                <button
                  onClick={() => setShowMessageModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Contact Support</span>
                </button>

                <a
                  href="/"
                  className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Our Services</span>
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status.replace("_", " ")}
                    </span>
                  </div>

                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    {project.start_date && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Started:{" "}
                        {new Date(project.start_date).toLocaleDateString()}
                      </div>
                    )}
                    {project.target_completion && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Target:{" "}
                        {new Date(
                          project.target_completion
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {project.preview_url && (
                      <a
                        href={project.preview_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Live Site</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Communication Modals */}
      <ProjectRequestModal
        isOpen={showProjectRequestModal}
        onClose={() => setShowProjectRequestModal(false)}
        clientId={clientId}
        onSuccess={() => {
          setSuccessMessage(
            "Project request submitted successfully! We'll review it and get back to you soon."
          );
          setTimeout(() => setSuccessMessage(null), 5000);
        }}
      />

      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        clientId={clientId}
        onSuccess={() => {
          setSuccessMessage(
            "Message sent successfully! We'll respond as soon as possible."
          );
          setTimeout(() => setSuccessMessage(null), 5000);
        }}
      />
    </div>
  );
}
