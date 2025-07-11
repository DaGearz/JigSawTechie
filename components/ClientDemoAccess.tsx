"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Globe,
  Calendar,
  User,
} from "lucide-react";
import {
  DemoProject,
  getDemoStatusColor,
  getDemoStatusLabel,
} from "@/lib/types/demo";

interface ClientDemoAccessProps {
  userId: string;
  projectId?: string; // If provided, show only demos for this project
}

export default function ClientDemoAccess({
  userId,
  projectId,
}: ClientDemoAccessProps) {
  const [demos, setDemos] = useState<DemoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserDemos();
  }, [userId, projectId]);

  const loadUserDemos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use dedicated client API endpoint with userId parameter
      const response = await fetch(`/api/client/demos?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        let userDemos = data.demos;

        // If projectId is specified, filter further
        if (projectId) {
          userDemos = userDemos.filter(
            (demo: DemoProject) => demo.project_id === projectId
          );
        }

        setDemos(userDemos);
      } else {
        setError(data.error || "Failed to load demos");
      }
    } catch (err) {
      setError("Failed to load demos");
      console.error("Error loading user demos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async (demo: DemoProject) => {
    // Navigate to the demo page
    window.open(`/demo/${demo.demo_slug}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <RefreshCw className="w-5 h-5 animate-spin text-gray-400 mr-2" />
        <span className="text-gray-600">Loading demos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
        <button
          onClick={loadUserDemos}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (demos.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <Globe className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">
          {projectId
            ? "No demo available for this project yet"
            : "No demos available yet"}
        </p>
      </div>
    );
  }

  // If projectId is specified, show inline demo access
  if (projectId) {
    const demo = demos[0]; // Should only be one demo per project
    return (
      <DemoAccessButton demo={demo} onAccess={() => handleDemoAccess(demo)} />
    );
  }

  // Show all demos for the user
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Your Project Demos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demos.map((demo) => (
          <DemoCard
            key={demo.id}
            demo={demo}
            onAccess={() => handleDemoAccess(demo)}
          />
        ))}
      </div>
    </div>
  );
}

// Component for inline demo access button (used in project cards)
function DemoAccessButton({
  demo,
  onAccess,
}: {
  demo: DemoProject;
  onAccess: () => void;
}) {
  const getStatusIcon = () => {
    switch (demo.status) {
      case "ready":
        return <CheckCircle className="w-4 h-4" />;
      case "building":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getButtonClass = () => {
    switch (demo.status) {
      case "ready":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "building":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "error":
        return "bg-red-600 hover:bg-red-700 text-white";
      default:
        return "bg-gray-400 cursor-not-allowed text-white";
    }
  };

  return (
    <button
      onClick={demo.status === "ready" ? onAccess : undefined}
      disabled={demo.status !== "ready"}
      className={`flex items-center space-x-1 px-3 py-2 rounded text-sm transition-colors ${getButtonClass()}`}
      title={
        demo.status === "ready"
          ? "View Demo"
          : `Demo Status: ${getDemoStatusLabel(demo.status)}`
      }
    >
      {getStatusIcon()}
      <span>
        {demo.status === "ready"
          ? "View Demo"
          : getDemoStatusLabel(demo.status)}
      </span>
    </button>
  );
}

// Component for demo cards (used in demo list view)
function DemoCard({
  demo,
  onAccess,
}: {
  demo: DemoProject;
  onAccess: () => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              {demo.demo_name}
            </h4>
            <p className="text-sm text-gray-600">{demo.project?.name}</p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full bg-${getDemoStatusColor(demo.status)}-100 text-${getDemoStatusColor(demo.status)}-800`}
          >
            {getDemoStatusLabel(demo.status)}
          </span>
        </div>

        <div className="space-y-2 text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>
              Updated {new Date(demo.last_updated).toLocaleDateString()}
            </span>
          </div>
          {demo.deployed_at && (
            <div className="flex items-center">
              <Globe className="w-3 h-3 mr-1" />
              <span>
                Deployed {new Date(demo.deployed_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {demo.file_size_mb && `${demo.file_size_mb.toFixed(1)} MB`}
          </div>

          <div className="flex items-center space-x-2">
            {demo.status === "ready" && (
              <>
                <button
                  onClick={onAccess}
                  className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </button>
                <a
                  href={demo.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </>
            )}

            {demo.status === "building" && (
              <div className="flex items-center space-x-1 text-blue-600 text-xs">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Building...</span>
              </div>
            )}

            {demo.status === "error" && (
              <div className="flex items-center space-x-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                <span>Error</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for getting user demos (can be used in other components)
export function useUserDemos(userId: string) {
  const [demos, setDemos] = useState<DemoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDemos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/client/demos?userId=${userId}`);
        const data = await response.json();

        if (data.success) {
          setDemos(data.demos);
        } else {
          setError(data.error || "Failed to load demos");
        }
      } catch (err) {
        setError("Failed to load demos");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadDemos();
    }
  }, [userId]);

  return { demos, loading, error, refetch: () => setLoading(true) };
}
