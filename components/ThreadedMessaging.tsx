"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  MessageCircle,
  Send,
  Reply,
  X,
  User,
  Clock,
  ArrowLeft,
  Plus,
} from "lucide-react";

interface MessageThread {
  thread_id: string;
  thread_subject: string;
  thread_starter_id: string;
  thread_recipient_id: string;
  thread_started_at: string;
  reply_count: number;
  last_activity: string;
  has_unread: boolean;
  starter_name: string;
  starter_email: string;
  recipient_name: string;
  recipient_email: string;
}

interface ThreadMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_read: boolean;
  reply_to_id: string | null;
  created_at: string;
  sender_name: string;
  sender_email: string;
  recipient_name: string;
  recipient_email: string;
}

interface ThreadedMessagingProps {
  currentUserId: string;
  currentUserRole: "admin" | "client";
  onClose?: () => void;
}

export default function ThreadedMessaging({
  currentUserId,
  currentUserRole,
  onClose,
}: ThreadedMessagingProps) {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showNewThread, setShowNewThread] = useState(false);

  // New thread form
  const [newThreadForm, setNewThreadForm] = useState({
    recipient_id: "",
    subject: "",
    message: "",
    message_type: "general",
    priority: "normal",
  });

  const [adminUsers, setAdminUsers] = useState<any[]>([]);

  useEffect(() => {
    loadThreads();
    if (currentUserRole === "client") {
      loadAdminUsers();
    }
  }, []);

  useEffect(() => {
    if (selectedThread) {
      loadThreadMessages(selectedThread);
    }
  }, [selectedThread]);

  const loadAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email")
        .eq("role", "admin")
        .order("name");

      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error) {
      console.error("Error loading admin users:", error);
    }
  };

  const loadThreads = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("message_threads")
        .select("*")
        .or(
          `thread_starter_id.eq.${currentUserId},thread_recipient_id.eq.${currentUserId}`
        )
        .order("last_activity", { ascending: false });

      if (error) throw error;
      setThreads(data || []);
    } catch (error) {
      console.error("Error loading threads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadThreadMessages = async (threadId: string) => {
    try {
      const { data, error } = await supabase.rpc("get_thread_messages", {
        thread_uuid: threadId,
      });

      if (error) throw error;
      setThreadMessages(data || []);

      // Mark messages as read
      await markThreadAsRead(threadId);
    } catch (error) {
      console.error("Error loading thread messages:", error);
    }
  };

  const markThreadAsRead = async (threadId: string) => {
    try {
      await supabase
        .from("client_messages")
        .update({ is_read: true })
        .eq("thread_id", threadId)
        .eq("recipient_id", currentUserId);
    } catch (error) {
      console.error("Error marking thread as read:", error);
    }
  };

  const sendReply = async () => {
    if (!selectedThread || !replyMessage.trim()) return;

    try {
      setIsSending(true);

      // Get the other participant in the thread
      const thread = threads.find((t) => t.thread_id === selectedThread);
      if (!thread) return;

      const recipientId =
        thread.thread_starter_id === currentUserId
          ? thread.thread_recipient_id
          : thread.thread_starter_id;

      const { data, error } = await supabase.rpc("reply_to_thread", {
        p_thread_id: selectedThread,
        p_sender_id: currentUserId,
        p_recipient_id: recipientId,
        p_message: replyMessage,
      });

      if (error) throw error;

      setReplyMessage("");
      await loadThreadMessages(selectedThread);
      await loadThreads(); // Refresh thread list to update last activity
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setIsSending(false);
    }
  };

  const startNewThread = async () => {
    if (!newThreadForm.subject.trim() || !newThreadForm.message.trim()) {
      alert("Subject and message are required");
      return;
    }

    if (currentUserRole === "client" && !newThreadForm.recipient_id) {
      alert("Please select a recipient");
      return;
    }

    try {
      setIsSending(true);

      const recipientId =
        currentUserRole === "admin"
          ? newThreadForm.recipient_id
          : adminUsers[0]?.id; // Default to first admin for clients

      const { data, error } = await supabase.rpc("start_message_thread", {
        p_sender_id: currentUserId,
        p_recipient_id: recipientId,
        p_subject: newThreadForm.subject,
        p_message: newThreadForm.message,
        p_message_type: newThreadForm.message_type,
        p_priority: newThreadForm.priority,
      });

      if (error) throw error;

      setNewThreadForm({
        recipient_id: "",
        subject: "",
        message: "",
        message_type: "general",
        priority: "normal",
      });
      setShowNewThread(false);
      await loadThreads();
    } catch (error) {
      console.error("Error starting new thread:", error);
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffInHours < 168) {
      // Less than a week
      return date.toLocaleDateString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg h-[600px] flex">
      {/* Thread List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
          <button
            onClick={() => setShowNewThread(true)}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="w-8 h-8 mx-auto text-gray-300 mb-2" />
              <p>No messages yet</p>
            </div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread.thread_id}
                onClick={() => setSelectedThread(thread.thread_id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedThread === thread.thread_id ? "bg-blue-50 border-blue-200" : ""
                } ${thread.has_unread ? "bg-blue-25" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {thread.thread_subject}
                      </h4>
                      {thread.has_unread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {currentUserId === thread.thread_starter_id
                        ? `To: ${thread.recipient_name}`
                        : `From: ${thread.starter_name}`}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {thread.reply_count} {thread.reply_count === 1 ? "reply" : "replies"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(thread.last_activity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Thread Messages or New Thread Form */}
      <div className="flex-1 flex flex-col">
        {showNewThread ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">New Message</h3>
              <button
                onClick={() => setShowNewThread(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-4">
              {currentUserRole === "client" && adminUsers.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Send to
                  </label>
                  <select
                    value={newThreadForm.recipient_id}
                    onChange={(e) =>
                      setNewThreadForm((prev) => ({ ...prev, recipient_id: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select recipient</option>
                    {adminUsers.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.name} ({admin.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={newThreadForm.subject}
                  onChange={(e) =>
                    setNewThreadForm((prev) => ({ ...prev, subject: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Message subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={8}
                  value={newThreadForm.message}
                  onChange={(e) =>
                    setNewThreadForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your message..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewThread(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={startNewThread}
                  disabled={isSending}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                >
                  {isSending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        ) : selectedThread ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedThread(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {threads.find((t) => t.thread_id === selectedThread)?.thread_subject}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {threadMessages.length} {threadMessages.length === 1 ? "message" : "messages"}
                  </p>
                </div>
              </div>
              {onClose && (
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {threadMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === currentUserId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === currentUserId
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="w-3 h-3" />
                      <span className="text-xs font-medium">
                        {message.sender_id === currentUserId ? "You" : message.sender_name}
                      </span>
                      <Clock className="w-3 h-3" />
                      <span className="text-xs opacity-75">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <textarea
                  rows={2}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendReply();
                    }
                  }}
                />
                <button
                  onClick={sendReply}
                  disabled={isSending || !replyMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                >
                  {isSending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium mb-2">Select a conversation</p>
              <p>Choose a thread from the left to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
