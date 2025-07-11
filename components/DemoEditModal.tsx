"use client";

import { useState, useEffect } from "react";
import { X, Globe, HardDrive, Trash2, Save } from "lucide-react";
import { DemoProject, DemoType, BuildType } from "@/lib/types/demo";

interface DemoEditModalProps {
  demo: DemoProject;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function DemoEditModal({
  demo,
  isOpen,
  onClose,
  onUpdate,
}: DemoEditModalProps) {
  const [demoType, setDemoType] = useState<DemoType>(demo.demo_type || "external");
  const [externalUrl, setExternalUrl] = useState(demo.external_url || "");
  const [externalDescription, setExternalDescription] = useState(demo.external_description || "");
  const [buildType, setBuildType] = useState<BuildType>(demo.build_type || "static");
  const [localPath, setLocalPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDemoType(demo.demo_type || "external");
      setExternalUrl(demo.external_url || "");
      setExternalDescription(demo.external_description || "");
      setBuildType(demo.build_type || "static");
      setLocalPath("");
      setError(null);
    }
  }, [isOpen, demo]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const updateData: any = {
        demo_id: demo.id,
        demo_type: demoType,
      };

      if (demoType === "external") {
        if (!externalUrl.trim()) {
          setError("External URL is required");
          return;
        }
        updateData.external_url = externalUrl.trim();
        updateData.external_description = externalDescription.trim();
      } else if (demoType === "integrated") {
        if (!localPath.trim()) {
          setError("Local path is required for integrated demos");
          return;
        }
        updateData.build_type = buildType;
        updateData.local_path = localPath.trim();
      }

      const response = await fetch("/api/demo/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        onUpdate();
        onClose();
      } else {
        setError(result.error || "Failed to update demo");
      }
    } catch (err) {
      setError("Failed to update demo");
      console.error("Demo update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this demo? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/demo/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ demo_id: demo.id }),
      });

      const result = await response.json();

      if (result.success) {
        onUpdate();
        onClose();
      } else {
        setError(result.error || "Failed to delete demo");
      }
    } catch (err) {
      setError("Failed to delete demo");
      console.error("Demo delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/demo/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          demo_id: demo.id,
          demo_type: "none", // Special type to disable demo
        }),
      });

      const result = await response.json();

      if (result.success) {
        onUpdate();
        onClose();
      } else {
        setError(result.error || "Failed to disable demo");
      }
    } catch (err) {
      setError("Failed to disable demo");
      console.error("Demo disable error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Demo: {demo.demo_name}
          </h2>
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

          {/* Demo Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Demo Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDemoType("external")}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  demoType === "external"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">External Link</span>
                </div>
                <p className="text-sm text-gray-600">
                  Link to external website (Vercel, GitHub Pages, etc.)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDemoType("integrated")}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  demoType === "integrated"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <HardDrive className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Integrated Demo</span>
                </div>
                <p className="text-sm text-gray-600">
                  Deploy files to jigsawtechie.com/demos/
                </p>
              </button>
            </div>
          </div>

          {/* External Demo Settings */}
          {demoType === "external" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  External URL *
                </label>
                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://your-demo-site.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={externalDescription}
                  onChange={(e) => setExternalDescription(e.target.value)}
                  placeholder="Brief description of the demo..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Integrated Demo Settings */}
          {demoType === "integrated" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Build Type
                </label>
                <select
                  value={buildType}
                  onChange={(e) => setBuildType(e.target.value as BuildType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="static">Static Files</option>
                  <option value="nextjs">Next.js</option>
                  <option value="react">React</option>
                  <option value="html">HTML</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local Project Path *
                </label>
                <input
                  type="text"
                  value={localPath}
                  onChange={(e) => setLocalPath(e.target.value)}
                  placeholder="C:\path\to\your\project"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Full path to your local project directory
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-3">
              <button
                onClick={handleDisable}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-orange-700 border border-orange-300 rounded hover:bg-orange-50 disabled:opacity-50"
              >
                <span>Disable Demo</span>
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-red-700 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
