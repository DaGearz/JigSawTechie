"use client";

import { useState, useEffect } from "react";
import { X, Send, Loader, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { User as UserType } from "@/lib/auth";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  onSuccess?: () => void;
}

interface MessageForm {
  subject: string;
  message: string;
  message_type: string;
  priority: string;
}

export default function MessageModal({
  isOpen,
  onClose,
  clientId,
  onSuccess,
}: MessageModalProps) {
  const [formData, setFormData] = useState<MessageForm>({
    subject: "",
    message: "",
    message_type: "general",
    priority: "normal",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [adminUsers, setAdminUsers] = useState<UserType[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<string>("");

  const messageTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "project_inquiry", label: "Project Question" },
    { value: "support", label: "Technical Support" },
    { value: "feedback", label: "Feedback" },
  ];

  const priorities = [
    { value: "low", label: "Low - No rush" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High - Important" },
    { value: "urgent", label: "Urgent - Need immediate attention" },
  ];

  // Load admin users when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAdminUsers();
    }
  }, [isOpen]);

  const loadAdminUsers = async () => {
    try {
      // Get all admin users
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, role")
        .eq("role", "admin")
        .order("name");

      if (error) throw error;

      setAdminUsers(data || []);

      // Auto-select first admin if only one exists
      if (data && data.length === 1) {
        setSelectedAdmin(data[0].id);
      }
    } catch (error) {
      console.error("Error loading admin users:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Determine recipient - use selected admin or first admin
      const recipientId =
        selectedAdmin || (adminUsers.length > 0 ? adminUsers[0].id : null);

      if (!recipientId) {
        throw new Error("No admin user available to receive message");
      }

      const { error } = await supabase.from("client_messages").insert({
        sender_id: clientId,
        recipient_id: recipientId,
        subject: formData.subject,
        message: formData.message,
        message_type: formData.message_type,
        priority: formData.priority,
      });

      if (error) {
        throw error;
      }

      setSubmitStatus("success");
      setTimeout(() => {
        onSuccess?.();
        onClose();
        // Reset form
        setFormData({
          subject: "",
          message: "",
          message_type: "general",
          priority: "normal",
        });
        setSubmitStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Contact Support</h2>
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Message Sent!
            </h3>
            <p className="text-gray-600">
              Your message has been sent successfully. We'll get back to you as
              soon as possible!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Admin Selection (if multiple admins) */}
            {adminUsers.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send to
                </label>
                <select
                  value={selectedAdmin}
                  onChange={(e) => setSelectedAdmin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select team member</option>
                  {adminUsers.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name} ({admin.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Message Type & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Type
                </label>
                <select
                  value={formData.message_type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message_type: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {messageTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of your message"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide as much detail as possible..."
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Quick Response Guaranteed</p>
                  <p>
                    We typically respond to messages within 24 hours during
                    business days. For urgent matters, please mark as "Urgent"
                    priority.
                  </p>
                </div>
              </div>
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
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>

            {submitStatus === "error" && (
              <div className="text-center text-red-600 text-sm">
                There was an error sending your message. Please try again.
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
