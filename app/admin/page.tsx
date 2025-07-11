"use client";

import { useState, useEffect } from "react";
import { quoteService, Quote, supabase } from "@/lib/supabase";
import { authService, User } from "@/lib/auth";
import DemoManagement from "@/components/DemoManagement";
import ProjectAccessManager from "@/components/ProjectAccessManager";
// import ThreadedMessaging from "@/components/ThreadedMessaging";
import {
  Calendar,
  Mail,
  Phone,
  Building,
  Globe,
  Clock,
  DollarSign,
  LogOut,
  Plus,
  CheckCircle,
  ExternalLink,
  Users,
  Edit,
  Trash2,
  UserPlus,
  Settings,
  X,
  User as UserIcon,
  FileText,
  MessageCircle,
  Upload,
} from "lucide-react";

export default function AdminDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [convertingQuote, setConvertingQuote] = useState<string | null>(null);
  const [clients, setClients] = useState<User[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "quotes" | "clients" | "companies" | "requests" | "messages" | "demos"
  >("quotes");

  // Communication system state
  const [projectRequests, setProjectRequests] = useState<any[]>([]);
  const [clientMessages, setClientMessages] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showCreateCompany, setShowCreateCompany] = useState(false);
  const [creatingCompany, setCreatingCompany] = useState(false);
  const [showThreadedMessaging, setShowThreadedMessaging] = useState(false);
  const [demoProjects, setDemoProjects] = useState<any[]>([]);
  const [selectedDemoProject, setSelectedDemoProject] = useState<any>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [adminToken, setAdminToken] = useState<string>("");
  const [demoForm, setDemoForm] = useState({
    demo_url: "",
    demo_password: "",
    demo_status: "not_ready",
    demo_notes: "",
  });
  const [companyForm, setCompanyForm] = useState({
    name: "",
    billing_email: "",
    billing_address: "",
    phone: "",
    website: "",
    notes: "",
    owner_email: "", // Email of the person who will be the company owner
  });
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [companyUsers, setCompanyUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    email: "",
    role: "member" as
      | "owner"
      | "admin"
      | "manager"
      | "member"
      | "billing_contact",
  });

  // Project Access Management State
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectAccess, setShowProjectAccess] = useState(false);
  //   access_level: "viewer" as "owner" | "collaborator" | "viewer",
  //   permissions: {
  //     view_demo: true,
  //     view_files: false,
  //     comment: false,
  //     approve: false,
  //     download: false,
  //   },
  // });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadQuotes();
      loadClients();
      loadProjects();
      loadCompanies();
      loadProjectRequests();
      loadClientMessages();
      loadNotifications();
      loadDemoProjects();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser && currentUser.role === "admin") {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    checkAuth();
  };

  const getAdminToken = () => {
    try {
      const authData = localStorage.getItem(
        "sb-oyzycafkfmrrqmpwgtdg-auth-token"
      );
      if (authData) {
        const parsed = JSON.parse(authData);
        const token = parsed.access_token;
        setAdminToken(token);
        setShowTokenModal(true);
      } else {
        alert("No authentication token found. Please login again.");
      }
    } catch (error) {
      console.error("Error getting token:", error);
      alert("Error retrieving token. Please login again.");
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setQuotes([]);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const data = await quoteService.getAllQuotes();
      setQuotes(data);
    } catch (err) {
      setError("Failed to load quotes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await authService.getAllClients();
      setClients(data);
    } catch (err) {
      console.error("Failed to load clients:", err);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await authService.getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  const loadCompanies = async () => {
    try {
      const data = await authService.getAllCompanies();
      setCompanies(data);
    } catch (err) {
      console.error("Failed to load companies:", err);
    }
  };

  // Communication system loading functions
  const loadProjectRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("project_requests")
        .select(
          `
          *,
          users:client_id(name, email)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjectRequests(data || []);
    } catch (error) {
      console.error("Failed to load project requests:", error);
    }
  };

  const loadClientMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("client_messages")
        .select(
          `
          *,
          sender:sender_id(name, email),
          recipient:recipient_id(name, email)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClientMessages(data || []);
    } catch (error) {
      console.error("Failed to load client messages:", error);
    }
  };

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  const loadDemoProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();

      if (data.success) {
        setDemoProjects(data.projects || []);
      } else {
        console.error("Failed to load projects:", data.error);
      }
    } catch (error) {
      console.error("Failed to load demo projects:", error);
    }
  };

  const createCompany = async () => {
    if (!companyForm.name.trim()) {
      alert("Company name is required");
      return;
    }

    if (!companyForm.owner_email.trim()) {
      alert("Owner email is required");
      return;
    }

    try {
      setCreatingCompany(true);

      // Create the company first
      const company = await authService.createCompany({
        name: companyForm.name,
        billing_email: companyForm.billing_email,
        billing_address: companyForm.billing_address,
        phone: companyForm.phone,
        website: companyForm.website,
        notes: companyForm.notes,
      });

      // Check if owner user exists
      console.log("Checking if owner user exists:", companyForm.owner_email);
      let ownerUser = await authService.getClientByEmail(
        companyForm.owner_email
      );
      console.log("Existing owner user:", ownerUser);

      if (!ownerUser) {
        // Create new user account for the owner
        const tempPassword = Math.random().toString(36).slice(-12) + "!A1";
        const ownerName = companyForm.owner_email.split("@")[0]; // Use email prefix as default name

        console.log("Creating new user account...");
        try {
          const createResult = await authService.createClientUser(
            companyForm.owner_email,
            tempPassword,
            ownerName,
            companyForm.name
          );
          console.log("User creation result:", createResult);

          // Wait a moment for user to be created
          await new Promise((resolve) => setTimeout(resolve, 1000));

          ownerUser = await authService.getClientByEmail(
            companyForm.owner_email
          );
          console.log("Owner user after creation:", ownerUser);

          // TODO: Send welcome email with login instructions
          console.log(
            `New user created for ${companyForm.owner_email} with temp password: ${tempPassword}`
          );
        } catch (userError: any) {
          console.error("Failed to create owner user:", userError);
          alert(
            `Company created but failed to create owner account: ${userError.message}`
          );
        }
      }

      // Assign owner role to the user
      if (ownerUser) {
        console.log(
          "Assigning owner role to user:",
          ownerUser.id,
          "for company:",
          company.id
        );
        try {
          const roleResult = await authService.addUserToCompany(
            ownerUser.id,
            company.id,
            "owner",
            {
              view_all_projects: true,
              manage_team: true,
              billing_access: true,
            }
          );
          console.log("Role assignment result:", roleResult);
        } catch (roleError: any) {
          console.error("Failed to assign owner role:", roleError);
          alert(
            `Company created but failed to assign owner role: ${roleError.message}`
          );
        }
      } else {
        console.error("No owner user found - cannot assign role");
      }

      // Reset form and close modal
      setCompanyForm({
        name: "",
        billing_email: "",
        billing_address: "",
        phone: "",
        website: "",
        notes: "",
        owner_email: "",
      });
      setShowCreateCompany(false);

      // Reload companies list
      await loadCompanies();

      const message = ownerUser
        ? "Company created successfully and owner assigned!"
        : "Company created successfully! Owner will receive setup instructions via email.";
      alert(message);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Failed to create company:", error);
      alert(`Failed to create company: ${errorMessage}`);
    } finally {
      setCreatingCompany(false);
    }
  };

  // Load company users for management
  const loadCompanyUsers = async (companyId: string) => {
    try {
      const users = await authService.getCompanyUsers(companyId);
      setCompanyUsers(users);
    } catch (error) {
      console.error("Failed to load company users:", error);
    }
  };

  // Load all users for adding to company
  const loadAllUsers = async () => {
    try {
      const users = await authService.getAllClients();
      setAllUsers(users);
    } catch (error) {
      console.error("Failed to load all users:", error);
    }
  };

  // Open user management modal
  const openUserManagement = async (company: any) => {
    setSelectedCompany(company);
    setShowUserManagement(true);
    await loadCompanyUsers(company.id);
    await loadAllUsers();
  };

  // Add user to company
  const addUserToCompany = async () => {
    if (!selectedCompany || !addUserForm.email.trim()) {
      alert("Please enter a valid email");
      return;
    }

    try {
      // Check if user exists
      let user = await authService.getClientByEmail(addUserForm.email);

      if (!user) {
        // Create new user if doesn't exist
        const tempPassword = Math.random().toString(36).slice(-12) + "!A1";
        const userName = addUserForm.email.split("@")[0];

        await authService.createClientUser(
          addUserForm.email,
          tempPassword,
          userName,
          selectedCompany.name
        );

        user = await authService.getClientByEmail(addUserForm.email);
        console.log(
          `New user created: ${addUserForm.email} with password: ${tempPassword}`
        );
      }

      if (user) {
        await authService.addUserToCompany(
          user.id,
          selectedCompany.id,
          addUserForm.role
        );

        // Refresh company users
        await loadCompanyUsers(selectedCompany.id);

        // Reset form
        setAddUserForm({ email: "", role: "member" });
        setShowAddUser(false);

        alert("User added to company successfully!");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Failed to add user to company:", error);
      alert(`Failed to add user: ${errorMessage}`);
    }
  };

  // Remove user from company
  const removeUserFromCompany = async (userId: string, userName: string) => {
    if (!selectedCompany) return;

    if (confirm(`Remove ${userName} from ${selectedCompany.name}?`)) {
      try {
        await authService.removeUserFromCompany(userId, selectedCompany.id);
        await loadCompanyUsers(selectedCompany.id);
        alert("User removed from company successfully!");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Failed to remove user:", error);
        alert(`Failed to remove user: ${errorMessage}`);
      }
    }
  };

  // Update user role in company
  const updateUserRole = async (userId: string, newRole: string) => {
    if (!selectedCompany) return;

    try {
      await authService.updateUserCompanyRole(
        userId,
        selectedCompany.id,
        newRole as any
      );
      await loadCompanyUsers(selectedCompany.id);
      alert("User role updated successfully!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Failed to update user role:", error);
      alert(`Failed to update role: ${errorMessage}`);
    }
  };

  // ===== PROJECT ACCESS MANAGEMENT FUNCTIONS ===== TEMPORARILY DISABLED
  /*
  // Load project users with access
  const loadProjectUsers = async (projectId: string) => {
    try {
      const users = await authService.getProjectUsers(projectId);
      setProjectUsers(users);
    } catch (error) {
      console.error("Failed to load project users:", error);
    }
  };

  // Open project access management modal
  const openProjectAccess = async (project: any) => {
    setSelectedProject(project);
    setShowProjectAccess(true);
    await loadProjectUsers(project.id);
    await loadAllUsers();
  };
  */

  /*
  // Add user to project
  const addUserToProject = async () => {
    if (!selectedProject || !addProjectUserForm.email.trim()) {
      alert("Please enter a valid email");
      return;
    }

    try {
      // Check if user exists
      let user = await authService.getClientByEmail(addProjectUserForm.email);

      if (!user) {
        // Create new user if doesn't exist
        const tempPassword = Math.random().toString(36).slice(-12) + "!A1";
        const userName = addProjectUserForm.email.split("@")[0];

        await authService.createClientUser(
          addProjectUserForm.email,
          tempPassword,
          userName,
          "Project Access"
        );

        user = await authService.getClientByEmail(addProjectUserForm.email);
        console.log(
          `New user created: ${addProjectUserForm.email} with password: ${tempPassword}`
        );
      }

      if (user) {
        await authService.grantProjectAccess(
          selectedProject.id,
          user.id,
          addProjectUserForm.access_level,
          addProjectUserForm.permissions
        );

        // Refresh project users
        await loadProjectUsers(selectedProject.id);

        // Reset form
        setAddProjectUserForm({
          email: "",
          access_level: "viewer",
          permissions: {
            view_demo: true,
            view_files: false,
            comment: false,
            approve: false,
            download: false,
          },
        });
        setShowAddProjectUser(false);

        alert("User added to project successfully!");
      }
    } catch (error: any) {
      console.error("Failed to add user to project:", error);
      alert(`Failed to add user: ${error.message}`);
    }
  };
  */

  /*
  // Remove user from project
  const removeUserFromProject = async (userId: string) => {
    if (!selectedProject) return;

    if (
      !confirm(
        "Are you sure you want to remove this user's access to the project?"
      )
    ) {
      return;
    }

    try {
      await authService.revokeProjectAccess(selectedProject.id, userId);
      await loadProjectUsers(selectedProject.id);
      alert("User access removed successfully!");
    } catch (error: any) {
      console.error("Failed to remove user from project:", error);
      alert(`Failed to remove user: ${error.message}`);
    }
  };

  // Update user project access level
  const updateUserProjectAccess = async (
    userId: string,
    accessLevel: string
  ) => {
    if (!selectedProject) return;

    try {
      const permissions = {
        view_demo: true,
        view_files: accessLevel === "owner" || accessLevel === "collaborator",
        comment: accessLevel === "owner" || accessLevel === "collaborator",
        approve: accessLevel === "owner",
        download: accessLevel === "owner" || accessLevel === "collaborator",
      };

      await authService.updateProjectAccess(
        selectedProject.id,
        userId,
        accessLevel as "owner" | "collaborator" | "viewer",
        permissions
      );

      await loadProjectUsers(selectedProject.id);
      alert("User access updated successfully!");
    } catch (error: any) {
      console.error("Failed to update user access:", error);
      alert(`Failed to update access: ${error.message}`);
    }
  };
  */

  const updateQuoteStatus = async (id: string, status: Quote["status"]) => {
    try {
      await quoteService.updateQuoteStatus(id, status);
      await loadQuotes(); // Refresh the list
    } catch (err) {
      console.error("Failed to update quote status:", err);
    }
  };

  const convertToProject = async (quoteId: string) => {
    try {
      setConvertingQuote(quoteId);
      const result = await authService.convertQuoteToProject(quoteId);

      // Refresh quotes list to show updated status
      await loadQuotes();

      // Show success message with option to view client dashboard
      const viewDashboard = confirm(
        `Project created successfully!\n\n` +
          `Client: ${result.client.name}\n` +
          `Project: ${result.project.name}\n` +
          `${
            result.isNewClient
              ? "New client account created."
              : "Existing client account used."
          }\n\n` +
          `Would you like to view the client dashboard now?`
      );

      if (viewDashboard) {
        window.open(`/dashboard/${result.client.id}`, "_blank");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Failed to convert quote to project:", error);
      alert(`Failed to convert quote to project: ${errorMessage}`);
    } finally {
      setConvertingQuote(null);
    }
  };

  const getClientIdFromEmail = async (
    email: string
  ): Promise<string | null> => {
    try {
      const client = await authService.getClientByEmail(email);
      return client?.id || null;
    } catch (error) {
      console.error("Failed to get client ID:", error);
      return null;
    }
  };

  const openClientDashboard = async (email: string) => {
    const clientId = await getClientIdFromEmail(email);
    if (clientId) {
      window.open(`/dashboard/${clientId}`, "_blank");
    } else {
      alert(
        "Client account not found. Create a project first to generate client access."
      );
    }
  };

  const getStatusColor = (status: Quote["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "reviewing":
        return "bg-yellow-100 text-yellow-800";
      case "quoted":
        return "bg-purple-100 text-purple-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quotes...</p>
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
            onClick={loadQuotes}
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quote Requests</h1>
            <p className="text-gray-600 mt-2">
              Manage and track all quote requests
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={getAdminToken}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Get CLI Token</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Quotes</h3>
            <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {quotes.filter((q) => q.status === "new").length} new
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Active Clients
            </h3>
            <p className="text-2xl font-bold text-blue-600">{clients.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {projects.length} projects
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Project Requests
            </h3>
            <p className="text-2xl font-bold text-purple-600">
              {projectRequests.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {projectRequests.filter((r) => r.status === "pending").length}{" "}
              pending
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Unread Messages
            </h3>
            <p className="text-2xl font-bold text-orange-600">
              {
                clientMessages.filter(
                  (m) => !m.is_read && m.recipient_id === user?.id
                ).length
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {clientMessages.length} total
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Companies</h3>
            <p className="text-2xl font-bold text-green-600">
              {companies.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">managed accounts</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab("quotes")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "quotes"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Quotes ({quotes.length})
              </button>
              <button
                onClick={() => setActiveTab("clients")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "clients"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Clients & Projects ({clients.length})
              </button>
              <button
                onClick={() => setActiveTab("companies")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "companies"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Building className="w-4 h-4 inline mr-2" />
                Companies ({companies.length})
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "requests"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Project Requests ({projectRequests.length})
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "messages"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Messages (
                {
                  clientMessages.filter(
                    (m) => !m.is_read && m.recipient_id === user?.id
                  ).length
                }
                )
              </button>
              <button
                onClick={() => setActiveTab("demos")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "demos"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Globe className="w-4 h-4 inline mr-2" />
                Demo Management ({demoProjects.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Quotes List */}
        {activeTab === "quotes" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Recent Quotes
              </h2>
            </div>

            {quotes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>
                  No quotes yet. When customers submit quote requests, they'll
                  appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {quotes.map((quote) => (
                  <div key={quote.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {quote.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span className="flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {quote.email}
                              </span>
                              {quote.phone && (
                                <span className="flex items-center">
                                  <Phone className="w-4 h-4 mr-1" />
                                  {quote.phone}
                                </span>
                              )}
                              {quote.company && (
                                <span className="flex items-center">
                                  <Building className="w-4 h-4 mr-1" />
                                  {quote.company}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">
                              Project:
                            </span>{" "}
                            {quote.project_type}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Budget:
                            </span>{" "}
                            {quote.budget}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Timeline:
                            </span>{" "}
                            {quote.timeline}
                          </div>
                        </div>

                        <div className="mt-2">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {quote.description}
                          </p>
                        </div>
                      </div>

                      <div className="ml-6 flex flex-col items-end space-y-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            quote.status
                          )}`}
                        >
                          {quote.status}
                        </span>

                        <select
                          value={quote.status}
                          onChange={(e) =>
                            updateQuoteStatus(
                              quote.id,
                              e.target.value as Quote["status"]
                            )
                          }
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="new">New</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="quoted">Quoted</option>
                          <option value="accepted">Accepted</option>
                          <option value="declined">Declined</option>
                          <option value="completed">Completed</option>
                        </select>

                        {/* Convert to Project Button */}
                        {(quote.status === "quoted" ||
                          quote.status === "new" ||
                          quote.status === "reviewing") && (
                          <button
                            onClick={() => convertToProject(quote.id)}
                            disabled={convertingQuote === quote.id}
                            className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {convertingQuote === quote.id ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                <span>Converting...</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3" />
                                <span>Create Project</span>
                              </>
                            )}
                          </button>
                        )}

                        {quote.status === "accepted" && (
                          <>
                            <div className="flex items-center space-x-1 text-green-600 text-xs">
                              <CheckCircle className="w-3 h-3" />
                              <span>Project Created</span>
                            </div>
                            <button
                              onClick={() => openClientDashboard(quote.email)}
                              className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>View Client Dashboard</span>
                            </button>
                          </>
                        )}

                        <span className="text-xs text-gray-500">
                          {new Date(quote.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Clients & Projects List */}
        {activeTab === "clients" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Clients & Projects
              </h2>
            </div>

            {clients.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>
                  No clients yet. Create projects from quotes to generate client
                  accounts.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {clients.map((client) => {
                  const clientProjects = projects.filter(
                    (p) => p.client_id === client.id
                  );
                  return (
                    <div key={client.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {client.name}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center">
                                  <Mail className="w-4 h-4 mr-1" />
                                  {client.email}
                                </span>
                                {client.phone && (
                                  <span className="flex items-center">
                                    <Phone className="w-4 h-4 mr-1" />
                                    {client.phone}
                                  </span>
                                )}
                                {client.company && (
                                  <span className="flex items-center">
                                    <Building className="w-4 h-4 mr-1" />
                                    {client.company}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Client Projects */}
                          {clientProjects.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Projects ({clientProjects.length})
                              </h4>
                              <div className="space-y-2">
                                {clientProjects.map((project) => (
                                  <div
                                    key={project.id}
                                    className="bg-gray-50 rounded p-3"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                          {project.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {project.description}
                                        </p>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span
                                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            project.status === "planning"
                                              ? "bg-blue-100 text-blue-800"
                                              : project.status === "development"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : project.status === "review"
                                                  ? "bg-purple-100 text-purple-800"
                                                  : project.status ===
                                                      "completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                          }`}
                                        >
                                          {project.status}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="ml-6 flex flex-col items-end space-y-2">
                          <button
                            onClick={() =>
                              window.open(`/dashboard/${client.id}`, "_blank")
                            }
                            className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View Dashboard</span>
                          </button>

                          <span className="text-xs text-gray-500">
                            Joined{" "}
                            {new Date(client.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Project Requests Tab */}
        {activeTab === "requests" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Project Requests
              </h2>
            </div>

            {projectRequests.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium mb-2">
                  No project requests yet
                </p>
                <p>
                  When clients submit project requests, they'll appear here for
                  your review.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {projectRequests.map((request) => (
                  <div key={request.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {request.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              request.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : request.status === "reviewing"
                                  ? "bg-blue-100 text-blue-800"
                                  : request.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : request.status === "declined"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {request.status}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              request.priority === "urgent"
                                ? "bg-red-100 text-red-800"
                                : request.priority === "high"
                                  ? "bg-orange-100 text-orange-800"
                                  : request.priority === "normal"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {request.priority} priority
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                          <span className="font-medium">From:</span>{" "}
                          {request.users?.name} ({request.users?.email})
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <span className="font-medium text-gray-700">
                              Type:
                            </span>{" "}
                            {request.project_type}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Budget:
                            </span>{" "}
                            {request.budget_range}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Timeline:
                            </span>{" "}
                            {request.timeline}
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {request.description}
                          </p>
                        </div>

                        {request.features && request.features.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">
                              Requested Features:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {request.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {request.additional_info && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">
                              Additional Info:
                            </span>
                            <p className="text-sm text-gray-600 mt-1">
                              {request.additional_info}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="ml-6 flex flex-col items-end space-y-2">
                        <select
                          value={request.status}
                          onChange={async (e) => {
                            try {
                              const { error } = await supabase
                                .from("project_requests")
                                .update({
                                  status: e.target.value,
                                  reviewed_by: user?.id,
                                  reviewed_at: new Date().toISOString(),
                                })
                                .eq("id", request.id);

                              if (error) throw error;
                              await loadProjectRequests();
                            } catch (error) {
                              console.error(
                                "Error updating request status:",
                                error
                              );
                              alert("Failed to update status");
                            }
                          }}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="approved">Approved</option>
                          <option value="declined">Declined</option>
                        </select>

                        {request.status === "approved" && (
                          <button
                            onClick={async () => {
                              if (
                                confirm("Convert this request to a project?")
                              ) {
                                try {
                                  setLoading(true);
                                  await authService.convertProjectRequestToProject(
                                    request.id
                                  );
                                  alert("Project created successfully!");
                                  // Refresh the project requests data
                                  await loadProjectRequests();
                                } catch (error) {
                                  console.error(
                                    "Error creating project:",
                                    error
                                  );
                                  alert(
                                    `Failed to create project: ${error instanceof Error ? error.message : "Unknown error"}`
                                  );
                                } finally {
                                  setLoading(false);
                                }
                              }
                            }}
                            className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Create Project</span>
                          </button>
                        )}

                        <button
                          onClick={() =>
                            window.open(
                              `/dashboard/${request.client_id}`,
                              "_blank"
                            )
                          }
                          className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Client</span>
                        </button>

                        <span className="text-xs text-gray-500">
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Client Messages
              </h2>
              <button
                onClick={() => setShowThreadedMessaging(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open Chat Interface</span>
              </button>
            </div>

            <div className="p-8 text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium mb-2">
                Enhanced Messaging System
              </p>
              <p className="mb-4">
                Use the new threaded messaging interface for better
                communication with clients.
              </p>
              <button
                onClick={() => setShowThreadedMessaging(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Chat Interface
              </button>
            </div>
          </div>
        )}

        {/* Threaded Messaging Modal - Temporarily Disabled */}
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
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Threaded Messaging Temporarily Disabled
                </h3>
                <p className="text-gray-600">
                  This feature is being updated and will be available soon.
                </p>
              </div>
              {/* <ThreadedMessaging
                currentUserId={user?.id || ""}
                currentUserRole="admin"
                onClose={() => setShowThreadedMessaging(false)}
              /> */}
            </div>
          </div>
        )}

        {/* Demo Management Tab */}
        {activeTab === "demos" && <DemoManagement projects={projects} />}

        {/* Companies Management */}
        {activeTab === "companies" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Company Management
              </h2>
              <button
                onClick={() => setShowCreateCompany(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Company</span>
              </button>
            </div>

            {companies.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Building className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium mb-2">No companies yet</p>
                <p>Create companies to organize clients and manage billing.</p>
                <button
                  onClick={() => setShowCreateCompany(true)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Company
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {companies.map((company) => (
                  <div key={company.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <Building className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {company.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              {company.billing_email && (
                                <span className="flex items-center">
                                  <Mail className="w-4 h-4 mr-1" />
                                  {company.billing_email}
                                </span>
                              )}
                              {company.phone && (
                                <span className="flex items-center">
                                  <Phone className="w-4 h-4 mr-1" />
                                  {company.phone}
                                </span>
                              )}
                              {company.website && (
                                <span className="flex items-center">
                                  <Globe className="w-4 h-4 mr-1" />
                                  {company.website}
                                </span>
                              )}
                            </div>
                            {company.billing_address && (
                              <p className="text-sm text-gray-600 mt-2">
                                {company.billing_address}
                              </p>
                            )}
                            {company.notes && (
                              <p className="text-sm text-gray-600 mt-2 italic">
                                {company.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="ml-6 flex items-center space-x-2">
                        <button
                          onClick={() => {
                            // TODO: Implement edit company
                            alert("Edit company functionality coming soon!");
                          }}
                          className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => openUserManagement(company)}
                          className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Manage Users</span>
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete ${company.name}?`
                              )
                            ) {
                              // TODO: Implement delete company
                              alert(
                                "Delete company functionality coming soon!"
                              );
                            }
                          }}
                          className="flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                      Created{" "}
                      {new Date(company.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Company Modal */}
        {showCreateCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Create New Company
                </h3>
                <button
                  onClick={() => setShowCreateCompany(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createCompany();
                }}
                className="space-y-4"
              >
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={companyForm.name}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company name"
                    required
                  />
                </div>

                {/* Owner Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Owner Email *
                  </label>
                  <input
                    type="email"
                    value={companyForm.owner_email}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        owner_email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="owner@company.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This person will be assigned as company owner with full
                    access. If they don't have an account, one will be created.
                  </p>
                </div>

                {/* Billing Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Email
                  </label>
                  <input
                    type="email"
                    value={companyForm.billing_email}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        billing_email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="billing@company.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={companyForm.phone}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={companyForm.website}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        website: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://company.com"
                  />
                </div>

                {/* Billing Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Address
                  </label>
                  <textarea
                    value={companyForm.billing_address}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        billing_address: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Business St, City, State 12345"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={companyForm.notes}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, notes: e.target.value })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Internal notes about this company..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateCompany(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      creatingCompany ||
                      !companyForm.name.trim() ||
                      !companyForm.owner_email.trim()
                    }
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {creatingCompany ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Create Company</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Management Modal */}
        {showUserManagement && selectedCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Manage Users - {selectedCompany.name}
                </h3>
                <button
                  onClick={() => setShowUserManagement(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Add User Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Add User to Company
                  </h4>
                  <button
                    onClick={() => setShowAddUser(!showAddUser)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add User</span>
                  </button>
                </div>

                {showAddUser && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={addUserForm.email}
                        onChange={(e) =>
                          setAddUserForm({
                            ...addUserForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="user@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={addUserForm.role}
                        onChange={(e) =>
                          setAddUserForm({
                            ...addUserForm,
                            role: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="member">Member</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                        <option value="billing_contact">Billing Contact</option>
                        <option value="owner">Owner</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={addUserToCompany}
                        disabled={!addUserForm.email.trim()}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add User
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Users List */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Current Users ({companyUsers.length})
                </h4>

                {companyUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p>No users assigned to this company yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {companyUsers.map((user: any) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <UserIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">
                              {user.name}
                            </h5>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {/* Role Dropdown */}
                          <select
                            value={user.company_roles?.[0]?.role || "member"}
                            onChange={(e) =>
                              updateUserRole(user.id, e.target.value)
                            }
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="member">Member</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                            <option value="billing_contact">
                              Billing Contact
                            </option>
                            <option value="owner">Owner</option>
                          </select>

                          {/* Remove Button */}
                          <button
                            onClick={() =>
                              removeUserFromCompany(user.id, user.name)
                            }
                            className="flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowUserManagement(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Project Access Management Modal - TEMPORARILY DISABLED */}
        {/* Project Access Management Modal */}
        <ProjectAccessManager
          project={selectedProject}
          isOpen={showProjectAccess}
          onClose={() => {
            setShowProjectAccess(false);
            setSelectedProject(null);
          }}
          onUpdate={() => {
            loadDemoProjects(); // Reload projects to show updated access
          }}
        />
                  <button
                    onClick={() => setShowAddProjectUser(!showAddProjectUser)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add User</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowProjectAccess(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        */}

        {/* Demo Management Modal */}
        {showDemoModal && selectedDemoProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  Demo Management: {selectedDemoProject.name}
                </h2>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demo URL
                  </label>
                  <input
                    type="url"
                    value={demoForm.demo_url}
                    onChange={(e) =>
                      setDemoForm({ ...demoForm, demo_url: e.target.value })
                    }
                    placeholder="https://demo.jigsawtechie.com/project-id"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demo Password
                  </label>
                  <input
                    type="text"
                    value={demoForm.demo_password}
                    onChange={(e) =>
                      setDemoForm({
                        ...demoForm,
                        demo_password: e.target.value,
                      })
                    }
                    placeholder="Optional password for demo access"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demo Status
                  </label>
                  <select
                    value={demoForm.demo_status}
                    onChange={(e) =>
                      setDemoForm({ ...demoForm, demo_status: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="not_ready">Not Ready</option>
                    <option value="ready">Ready</option>
                    <option value="live">Live</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demo Notes
                  </label>
                  <textarea
                    value={demoForm.demo_notes}
                    onChange={(e) =>
                      setDemoForm({ ...demoForm, demo_notes: e.target.value })
                    }
                    placeholder="Internal notes about this demo..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    CLI Deployment
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Use the CLI tool to deploy local projects to this demo URL:
                  </p>
                  <code className="block bg-blue-100 text-blue-900 p-2 rounded text-sm">
                    node cli/deploy-demo.js ./project-folder{" "}
                    {selectedDemoProject.id}
                  </code>
                </div>
              </div>

              <div className="flex justify-end space-x-4 p-6 border-t">
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const { error } = await supabase
                        .from("projects")
                        .update({
                          demo_url: demoForm.demo_url || null,
                          demo_password: demoForm.demo_password || null,
                          demo_status: demoForm.demo_status,
                          demo_notes: demoForm.demo_notes || null,
                          demo_last_updated: new Date().toISOString(),
                        })
                        .eq("id", selectedDemoProject.id);

                      if (error) throw error;

                      await loadDemoProjects();
                      setShowDemoModal(false);
                      alert("Demo settings updated successfully!");
                    } catch (error) {
                      console.error("Error updating demo:", error);
                      alert("Failed to update demo settings");
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deploy Demo Modal */}
        {showDeployModal && selectedDemoProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Upload className="w-6 h-6 mr-2 text-purple-600" />
                  Deploy Demo: {selectedDemoProject.name}
                </h2>
                <button
                  onClick={() => setShowDeployModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Project Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Project Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Project ID:</span>
                      <div className="font-mono bg-white p-2 rounded border mt-1">
                        {selectedDemoProject.id}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Project Name:</span>
                      <div className="font-medium mt-1">
                        {selectedDemoProject.name}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CLI Commands */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">
                    CLI Deployment Commands
                  </h3>

                  {/* For Regular HTML/CSS/JS Projects */}
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <div className="mb-2 text-gray-300">
                      # For HTML/CSS/JS projects (run from JigsawTechie
                      directory):
                    </div>
                    <div className="select-all">
                      node cli/deploy-demo.js /full/path/to/your-project-folder{" "}
                      {selectedDemoProject.id}
                    </div>
                  </div>

                  {/* For React Projects */}
                  <div className="bg-blue-900 text-blue-100 p-4 rounded-lg font-mono text-sm">
                    <div className="mb-2 text-blue-200">
                      # For React/Vite projects (run from JigsawTechie
                      directory):
                    </div>
                    <div className="space-y-1">
                      <div className="select-all">
                        # Build in your project directory first
                      </div>
                      <div className="select-all">
                        node cli/deploy-demo.js /full/path/to/your-project/build{" "}
                        {selectedDemoProject.id}
                      </div>
                      <div className="select-all"># OR for Vite projects:</div>
                      <div className="select-all">
                        node cli/deploy-demo.js /full/path/to/your-project/dist{" "}
                        {selectedDemoProject.id}
                      </div>
                    </div>
                  </div>

                  {/* For Next.js Projects */}
                  <div className="bg-purple-900 text-purple-100 p-4 rounded-lg font-mono text-sm">
                    <div className="mb-2 text-purple-200">
                      # For Next.js projects (export first):
                    </div>
                    <div className="space-y-1">
                      <div className="select-all">npm run build</div>
                      <div className="select-all">npm run export</div>
                      <div className="select-all">
                        node cli/deploy-demo.js ./out {selectedDemoProject.id}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">
                    📋 Deployment Steps:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                    <li>
                      Make sure you've run:{" "}
                      <code className="bg-yellow-100 px-1 rounded">
                        node cli/setup-auth.js YOUR_TOKEN
                      </code>
                    </li>
                    <li>Navigate to your project directory in terminal</li>
                    <li>If it's a React/Next.js project, build it first</li>
                    <li>Copy and paste the appropriate command above</li>
                    <li>After deployment, set the demo URL in "Manage Demo"</li>
                  </ol>
                </div>

                {/* Quick Copy Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `node cli/deploy-demo.js ./your-project-folder ${selectedDemoProject.id}`
                      );
                      alert("HTML/CSS/JS command copied to clipboard!");
                    }}
                    className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    📋 Copy HTML Command
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `npm run build && node cli/deploy-demo.js ./build ${selectedDemoProject.id}`
                      );
                      alert("React command copied to clipboard!");
                    }}
                    className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    📋 Copy React Command
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedDemoProject.id);
                      alert("Project ID copied to clipboard!");
                    }}
                    className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition-colors"
                  >
                    📋 Copy Project ID
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-4 p-6 border-t mt-6">
                <button
                  onClick={() => setShowDeployModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDeployModal(false);
                    setSelectedDemoProject(selectedDemoProject);
                    setDemoForm({
                      demo_url: selectedDemoProject.demo_url || "",
                      demo_password: selectedDemoProject.demo_password || "",
                      demo_status:
                        selectedDemoProject.demo_status || "not_ready",
                      demo_notes: selectedDemoProject.demo_notes || "",
                    });
                    setShowDemoModal(true);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Manage Demo Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CLI Token Modal */}
        {showTokenModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-green-600" />
                  CLI Authentication Token
                </h2>
                <button
                  onClick={() => setShowTokenModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">
                    🔐 Your CLI Token
                  </h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Copy this token and use it to set up CLI authentication.
                    This token is valid for your current session.
                  </p>
                </div>

                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="mb-2 text-gray-300">
                    # Run this command in your terminal:
                  </div>
                  <div className="select-all break-all">
                    node cli/setup-auth.js {adminToken}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `node cli/setup-auth.js ${adminToken}`
                      );
                      alert("CLI setup command copied to clipboard!");
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    📋 Copy Setup Command
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(adminToken);
                      alert("Token copied to clipboard!");
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    📋 Copy Token Only
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    📋 Next Steps:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    <li>Copy the setup command above</li>
                    <li>Open your terminal in the project directory</li>
                    <li>Paste and run the command</li>
                    <li>You're ready to deploy demos!</li>
                  </ol>
                </div>
              </div>

              <div className="flex justify-end space-x-4 p-6 border-t mt-6">
                <button
                  onClick={() => setShowTokenModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
