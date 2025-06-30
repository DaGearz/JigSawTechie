"use client";

import { useState } from "react";
import { X, Send, Loader } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProjectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  onSuccess?: () => void;
}

interface ProjectRequestForm {
  title: string;
  description: string;
  project_type: string;
  budget_range: string;
  timeline: string;
  priority: string;
  features: string[];
  additional_info: string;
}

export default function ProjectRequestModal({
  isOpen,
  onClose,
  clientId,
  onSuccess,
}: ProjectRequestModalProps) {
  const [formData, setFormData] = useState<ProjectRequestForm>({
    title: "",
    description: "",
    project_type: "",
    budget_range: "",
    timeline: "",
    priority: "normal",
    features: [],
    additional_info: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const projectTypes = [
    "Website Design & Development",
    "E-commerce Store",
    "Mobile App",
    "Web Application",
    "Website Redesign",
    "SEO & Marketing",
    "Custom Development",
    "Other",
  ];

  const budgetRanges = [
    "$1,000 - $2,500",
    "$2,500 - $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000+",
    "Let's discuss",
  ];

  const timelines = [
    "ASAP (Rush job)",
    "1 month",
    "2-3 months",
    "3-6 months",
    "6+ months",
    "Flexible",
  ];

  const commonFeatures = [
    "Responsive Design",
    "Content Management System",
    "E-commerce Functionality",
    "User Authentication",
    "Payment Processing",
    "Search Functionality",
    "Social Media Integration",
    "Analytics & Reporting",
    "Email Marketing Integration",
    "Multi-language Support",
    "API Integration",
    "Custom Forms",
  ];

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const { error } = await supabase
        .from("project_requests")
        .insert({
          client_id: clientId,
          title: formData.title,
          description: formData.description,
          project_type: formData.project_type,
          budget_range: formData.budget_range,
          timeline: formData.timeline,
          priority: formData.priority,
          features: formData.features,
          additional_info: formData.additional_info,
        });

      if (error) throw error;

      setSubmitStatus("success");
      setTimeout(() => {
        onSuccess?.();
        onClose();
        // Reset form
        setFormData({
          title: "",
          description: "",
          project_type: "",
          budget_range: "",
          timeline: "",
          priority: "normal",
          features: [],
          additional_info: "",
        });
        setSubmitStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Error submitting project request:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Request New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {submitStatus === "success" ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Submitted!</h3>
            <p className="text-gray-600">
              Your project request has been sent successfully. We'll review it and get back to you soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., New Company Website"
              />
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Type *
              </label>
              <select
                required
                value={formData.project_type}
                onChange={(e) => setFormData(prev => ({ ...prev, project_type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select project type</option>
                {projectTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Budget & Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range *
                </label>
                <select
                  required
                  value={formData.budget_range}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget_range: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select budget range</option>
                  {budgetRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline *
                </label>
                <select
                  required
                  value={formData.timeline}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select timeline</option>
                  {timelines.map(timeline => (
                    <option key={timeline} value={timeline}>{timeline}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your project goals, target audience, and key requirements..."
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desired Features (select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {commonFeatures.map(feature => (
                  <label key={feature} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                rows={3}
                value={formData.additional_info}
                onChange={(e) => setFormData(prev => ({ ...prev, additional_info: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional details, inspiration, or specific requirements..."
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low - No rush</option>
                <option value="normal">Normal - Standard timeline</option>
                <option value="high">High - Prefer faster delivery</option>
                <option value="urgent">Urgent - Need ASAP</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>

            {submitStatus === "error" && (
              <div className="text-center text-red-600 text-sm">
                There was an error submitting your request. Please try again.
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
