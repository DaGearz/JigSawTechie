"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { authService, User, Project } from "@/lib/auth";
import AdminLogin from "@/components/AdminLogin";
import ProjectRequestModal from "@/components/ProjectRequestModal";
import ThreadedMessaging from "@/components/ThreadedMessaging";
import ClientDemoAccess from "@/components/ClientDemoAccess";
import {
  Calendar,
  Clock,
  Globe,
  FileText,
  Download,
  Eye,
  LogOut,
  Shield,
  Plus,
  MessageCircle,
  ExternalLink,
  X,
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
  const [clientInfo, setClientInfo] = useState<User | null>(null);

  // Communication modals
  const [showProjectRequestModal, setShowProjectRequestModal] = useState(false);
  const [showThreadedMessaging, setShowThreadedMessaging] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProjects();
      if (user.role === "admin") {
        loadClientInfo();
      }
    }
  }, [isAuthenticated, user]);

  const checkAuth = async () => {
    try {
      // SECURITY: Prevent access to /dashboard/admin or other reserved routes
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

  const loadClientInfo = async () => {
    try {
      // Get client info for admin viewing
      const client = await authService.getClientById(clientId);
      setClientInfo(client);
    } catch (error) {
      console.error("Failed to load client info:", error);
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
      {/* Admin Viewing Banner */}
      {user?.role === "admin" && clientInfo && (
        <div className="bg-blue-600 text-white px-4 py-3">
          <div className="container mx-auto flex items-center justify-center">
            <Shield className="w-5 h-5 mr-2" />
            <span className="font-medium">
              Admin View: Viewing {clientInfo.name}'s Dashboard (
              {clientInfo.email})
            </span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
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
                  onClick={() => setShowThreadedMessaging(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Open Messages</span>
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

                  <div className="flex flex-wrap gap-2">
                    {/* New Demo Access Component */}
                    <ClientDemoAccess
                      userId={
                        user?.role === "admin" ? clientId : user?.id || ""
                      }
                      projectId={project.id}
                    />
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
                    {/* Project-specific messaging */}
                    {user?.role === "client" && (
                      <button
                        onClick={() => setShowThreadedMessaging(true)}
                        className="flex items-center space-x-1 bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Demo Section - Show all user demos */}
        {user?.role === "client" && projects.length > 0 && (
          <div className="mt-12">
            <ClientDemoAccess userId={user?.id || ""} />
          </div>
        )}
      </div>

      {/* Floating Communication Panel for Clients */}
      {user?.role === "client" && (
        <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-40">
          <button
            onClick={() => setShowThreadedMessaging(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center group"
            title="Open Messages"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute right-full mr-3 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Open Messages
            </span>
          </button>

          <button
            onClick={() => setShowProjectRequestModal(true)}
            className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center group"
            title="Request New Project"
          >
            <Plus className="w-6 h-6" />
            <span className="absolute right-full mr-3 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              New Project
            </span>
          </button>
        </div>
      )}

      {/* Communication Modals */}
      <ProjectRequestModal
        isOpen={showProjectRequestModal}
        onClose={() => setShowProjectRequestModal(false)}
        clientId={clientId}
        onSuccess={() => {
          console.log("Project request submitted successfully!");
        }}
      />

      {/* Threaded Messaging Modal */}
      {showThreadedMessaging && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[80vh] relative">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setShowThreadedMessaging(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ThreadedMessaging
              currentUserId={clientId}
              currentUserRole="client"
              onClose={() => setShowThreadedMessaging(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
