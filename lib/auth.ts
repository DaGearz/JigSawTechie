import { supabase } from "./supabase";

export interface User {
  id: string;
  email: string;
  role: "admin" | "client";
  name: string;
  phone?: string;
  company?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  quote_id?: string;
  client_id: string;
  name: string;
  description?: string;
  status: "planning" | "development" | "review" | "completed" | "on_hold";
  preview_url?: string;
  preview_password?: string;
  live_url?: string;
  demo_url?: string;
  demo_password?: string;
  demo_status?:
    | "not_ready"
    | "ready"
    | "in_review"
    | "approved"
    | "needs_changes";
  demo_notes?: string;
  demo_updated_at?: string;
  start_date?: string;
  target_completion?: string;
  actual_completion?: string;
  billing_type?: "individual" | "company";
  company_id?: string;
  billing_contact_id?: string;
  created_at: string;
  updated_at: string;
  // New access control fields
  user_access_level?: "viewer" | "client" | "editor" | "admin";
  access_id?: string;
  project_access?: Array<{
    id: string;
    access_level: string;
    user: {
      id: string;
      email: string;
      name: string;
      role?: string;
    };
  }>;
}

export interface Company {
  id: string;
  name: string;
  billing_email?: string;
  billing_address?: string;
  phone?: string;
  website?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyRole {
  id: string;
  company_id: string;
  user_id: string;
  role: "owner" | "admin" | "manager" | "member" | "billing_contact";
  permissions: {
    view_all_projects: boolean;
    manage_team: boolean;
    billing_access: boolean;
  };
  assigned_by: string;
  assigned_at: string;
}

export interface ProjectAccess {
  id: string;
  project_id: string;
  user_id: string;
  access_level: "owner" | "collaborator" | "viewer";
  permissions: {
    view_demo: boolean;
    view_files: boolean;
    comment: boolean;
    approve: boolean;
    download: boolean;
  };
  granted_by: string;
  granted_at: string;
}

export const authService = {
  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },

  // Get current user with profile data
  async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.log("No authenticated user found:", error?.message);
        return null;
      }

      console.log("Auth user found:", user.id, user.email);

      // First, try to get the profile
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        return null;
      }

      if (profile) {
        console.log("Profile found:", profile);
        return profile;
      }

      // Profile doesn't exist, create it
      console.log("No profile found, creating new profile for:", user.id);

      const userName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User";

      const userRole = user.user_metadata?.role || "client";

      const { data: newProfile, error: createError } = await supabase
        .from("users")
        .insert({
          id: user.id,
          email: user.email || "",
          name: userName,
          role: userRole,
        })
        .select()
        .single();

      if (createError) {
        console.error("Failed to create profile:", createError);

        // Try one more time with upsert
        const { data: upsertProfile, error: upsertError } = await supabase
          .from("users")
          .upsert({
            id: user.id,
            email: user.email || "",
            name: userName,
            role: userRole,
          })
          .select()
          .single();

        if (upsertError) {
          console.error("Failed to upsert profile:", upsertError);
          return null;
        }

        console.log("Profile created via upsert:", upsertProfile);
        return upsertProfile;
      }

      console.log("Profile created:", newProfile);
      return newProfile;
    } catch (error) {
      console.error("getCurrentUser error:", error);
      return null;
    }
  },

  // Check if current user is admin
  async isAdmin(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user?.role === "admin";
    } catch {
      return false;
    }
  },

  // Check if current user is client
  async isClient(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user?.role === "client";
    } catch {
      return false;
    }
  },

  // Listen for auth state changes
  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  },

  // Create admin user (run this once to set up your admin account)
  async createAdminUser(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: "admin",
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  },

  // Create client user (for client portal)
  async createClientUser(
    email: string,
    password: string,
    name: string,
    company?: string,
    phone?: string
  ) {
    // Create auth user - the trigger will handle creating the profile
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: "client",
          company,
          phone,
        },
      },
    });

    if (authError) {
      throw authError;
    }

    return authData;
  },

  // Get user's projects (for clients) - includes team access
  async getUserProjects(): Promise<Project[]> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    // Get projects where user is primary client first
    const { data: ownedProjects, error: ownedError } = await supabase
      .from("projects")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });

    if (ownedError) {
      throw ownedError;
    }

    // Get projects where user has team access
    const { data: accessProjects, error: accessError } = await supabase
      .from("projects")
      .select(
        `
        *,
        project_access!inner(access_level, permissions)
      `
      )
      .eq("project_access.user_id", user.id)
      .order("created_at", { ascending: false });

    if (accessError) {
      console.warn("Could not fetch team access projects:", accessError);
    }

    // Combine both sets of projects, avoiding duplicates
    const allProjects = [...(ownedProjects || [])];
    if (accessProjects) {
      for (const project of accessProjects) {
        if (!allProjects.find((p) => p.id === project.id)) {
          allProjects.push(project);
        }
      }
    }

    const data = allProjects;

    // Add role information to each project
    const projectsWithRole = (data || []).map((project) => ({
      ...project,
      user_access_level:
        project.client_id === user.id
          ? "owner"
          : project.user_role?.[0]?.access_level || "viewer",
      user_permissions:
        project.client_id === user.id
          ? {
              view_demo: true,
              view_files: true,
              comment: true,
              approve: true,
              download: true,
            }
          : project.user_role?.[0]?.permissions || { view_demo: false },
    }));

    return projectsWithRole;
  },

  // Convert quote to project and create client account
  async convertQuoteToProject(
    quoteId: string,
    projectName?: string
  ): Promise<{
    project: Project;
    client: User;
    isNewClient: boolean;
  }> {
    // Get the quote details
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", quoteId)
      .single();

    if (quoteError || !quote) {
      throw new Error("Quote not found");
    }

    // Check if client already exists
    let client: User;
    let isNewClient = false;

    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", quote.email)
      .single();

    if (existingUser) {
      client = existingUser;
    } else {
      // Create new client account
      const tempPassword = Math.random().toString(36).slice(-8) + "!A1";

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: quote.email,
        password: tempPassword,
        options: {
          data: {
            name: quote.name,
            role: "client",
            company: quote.company,
            phone: quote.phone,
          },
        },
      });

      if (authError) {
        throw new Error(
          `Failed to create client account: ${authError.message}`
        );
      }

      // Create user profile
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert({
          id: authData.user!.id,
          email: quote.email,
          name: quote.name,
          role: "client",
          company: quote.company,
          phone: quote.phone,
        })
        .select()
        .single();

      if (userError) {
        throw new Error(`Failed to create user profile: ${userError.message}`);
      }

      client = userData;
      isNewClient = true;
    }

    // Create project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        quote_id: quoteId,
        client_id: client.id,
        name: projectName || `${quote.project_type} for ${quote.name}`,
        description: quote.description,
        status: "planning",
      })
      .select()
      .single();

    if (projectError) {
      throw new Error(`Failed to create project: ${projectError.message}`);
    }

    // Update quote status to accepted
    await supabase
      .from("quotes")
      .update({ status: "accepted" })
      .eq("id", quoteId);

    return {
      project,
      client,
      isNewClient,
    };
  },

  // Convert project request to project (admin only)
  async convertProjectRequestToProject(
    requestId: string,
    projectName?: string
  ): Promise<{
    project: Project;
    client: User;
  }> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    // Get the project request details
    const { data: request, error: requestError } = await supabase
      .from("project_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (requestError || !request) {
      throw new Error("Project request not found");
    }

    // Get the client details
    const { data: client, error: clientError } = await supabase
      .from("users")
      .select("*")
      .eq("id", request.client_id)
      .single();

    if (clientError || !client) {
      throw new Error("Client not found");
    }

    // Create the project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        client_id: request.client_id,
        name: projectName || request.title,
        description: request.description,
        status: "planning",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (projectError || !project) {
      throw new Error(`Failed to create project: ${projectError?.message}`);
    }

    // Update project request status to converted and link to project
    await supabase
      .from("project_requests")
      .update({
        status: "converted",
        converted_project_id: project.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    return {
      project,
      client,
    };
  },

  // Get all projects (for admin)
  async getAllProjects(): Promise<Project[]> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        client:users!client_id(name, email, company)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  // Convert quote to client project (admin only)
  async createProjectFromQuote(
    quoteId: string,
    clientEmail: string,
    projectName: string,
    description?: string
  ) {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    // First, create or get the client user
    let clientUser = await this.getClientByEmail(clientEmail);

    if (!clientUser) {
      // Create a temporary password for the client
      const tempPassword = Math.random().toString(36).slice(-12);
      const clientName = clientEmail.split("@")[0]; // Use email prefix as default name

      await this.createClientUser(clientEmail, tempPassword, clientName);
      clientUser = await this.getClientByEmail(clientEmail);
    }

    if (!clientUser) {
      throw new Error("Failed to create client user");
    }

    // Create the project
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          quote_id: quoteId,
          client_id: clientUser.id,
          name: projectName,
          description,
          status: "planning",
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Get client by email
  async getClientByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("role", "client")
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  },

  // Get client by ID
  async getClientById(id: string): Promise<User | null> {
    try {
      // First try to get any user with this ID
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching client by ID:", error);
        return null;
      }

      // Check if user exists and is a client
      if (!data) {
        console.error("No user found with ID:", id);
        return null;
      }

      if (data.role !== "client") {
        console.error("User is not a client:", data.role);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Exception in getClientById:", error);
      return null;
    }
  },

  // Update project status and details (admin only)
  async updateProject(projectId: string, updates: Partial<Project>) {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", projectId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Get all clients (admin only)
  async getAllClients(): Promise<User[]> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "client")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  // ===== COMPANY MANAGEMENT =====

  // Create company (admin only)
  async createCompany(
    companyData: Omit<Company, "id" | "created_at" | "updated_at">
  ): Promise<Company> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const { data, error } = await supabase
      .from("companies")
      .insert(companyData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create company: ${error.message}`);
    }

    return data;
  },

  // Get all companies (admin only)
  async getAllCompanies(): Promise<Company[]> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  },

  // Get company by ID (admin only)
  async getCompanyById(id: string): Promise<Company | null> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  },

  // Update company (admin only)
  async updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const { data, error } = await supabase
      .from("companies")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update company: ${error.message}`);
    }

    return data;
  },

  // Delete company (admin only)
  async deleteCompany(id: string): Promise<void> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const { error } = await supabase.from("companies").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete company: ${error.message}`);
    }
  },

  // Get company users with roles (admin only)
  async getCompanyUsers(
    companyId: string
  ): Promise<(User & { company_role?: CompanyRole })[]> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *,
        company_roles!inner(*)
      `
      )
      .eq("company_roles.company_id", companyId)
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  },

  // Add user to company with role (admin only)
  async addUserToCompany(
    userId: string,
    companyId: string,
    role: CompanyRole["role"],
    permissions?: CompanyRole["permissions"]
  ): Promise<CompanyRole> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error("Not authenticated");

    const defaultPermissions = {
      view_all_projects: role === "owner" || role === "admin",
      manage_team: role === "owner" || role === "admin",
      billing_access: role === "owner" || role === "billing_contact",
    };

    const { data, error } = await supabase
      .from("company_roles")
      .insert({
        user_id: userId,
        company_id: companyId,
        role,
        permissions: permissions || defaultPermissions,
        assigned_by: currentUser.id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add user to company: ${error.message}`);
    }

    return data;
  },

  // Remove user from company (admin only)
  async removeUserFromCompany(
    userId: string,
    companyId: string
  ): Promise<void> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const { error } = await supabase
      .from("company_roles")
      .delete()
      .eq("user_id", userId)
      .eq("company_id", companyId);

    if (error) {
      throw new Error(`Failed to remove user from company: ${error.message}`);
    }
  },

  // Update user company role (admin only)
  async updateUserCompanyRole(
    userId: string,
    companyId: string,
    role: CompanyRole["role"],
    permissions?: CompanyRole["permissions"]
  ): Promise<CompanyRole> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const defaultPermissions = {
      view_all_projects: role === "owner" || role === "admin",
      manage_team: role === "owner" || role === "admin",
      billing_access: role === "owner" || role === "billing_contact",
    };

    const { data, error } = await supabase
      .from("company_roles")
      .update({
        role,
        permissions: permissions || defaultPermissions,
      })
      .eq("user_id", userId)
      .eq("company_id", companyId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user company role: ${error.message}`);
    }

    return data;
  },

  // ===== PROJECT ACCESS MANAGEMENT =====

  // Grant project access to user (admin only)
  async grantProjectAccess(
    projectId: string,
    userId: string,
    accessLevel: ProjectAccess["access_level"],
    permissions?: ProjectAccess["permissions"]
  ): Promise<ProjectAccess> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error("Not authenticated");

    const defaultPermissions = {
      view_demo: true,
      view_files: accessLevel === "owner" || accessLevel === "collaborator",
      comment: accessLevel === "owner" || accessLevel === "collaborator",
      approve: accessLevel === "owner",
      download: accessLevel === "owner" || accessLevel === "collaborator",
    };

    const { data, error } = await supabase
      .from("project_access")
      .insert({
        project_id: projectId,
        user_id: userId,
        access_level: accessLevel,
        permissions: permissions || defaultPermissions,
        granted_by: currentUser.id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to grant project access: ${error.message}`);
    }

    return data;
  },

  // Revoke project access (admin only)
  async revokeProjectAccess(projectId: string, userId: string): Promise<void> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const { error } = await supabase
      .from("project_access")
      .delete()
      .eq("project_id", projectId)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to revoke project access: ${error.message}`);
    }
  },

  // Update project access permissions (admin only)
  async updateProjectAccess(
    projectId: string,
    userId: string,
    accessLevel?: ProjectAccess["access_level"],
    permissions?: ProjectAccess["permissions"]
  ): Promise<ProjectAccess> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const updates: any = {};
    if (accessLevel) updates.access_level = accessLevel;
    if (permissions) updates.permissions = permissions;

    const { data, error } = await supabase
      .from("project_access")
      .update(updates)
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update project access: ${error.message}`);
    }

    return data;
  },

  // Get project access list (admin only)
  async getProjectAccess(
    projectId: string
  ): Promise<(ProjectAccess & { user: User })[]> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const { data, error } = await supabase
      .from("project_access")
      .select(
        `
        *,
        user:users(*)
      `
      )
      .eq("project_id", projectId)
      .order("granted_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  // Get users with access to a project (admin only)
  async getProjectUsers(projectId: string): Promise<any[]> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    try {
      const { data, error } = await supabase
        .from("project_access")
        .select(
          `
          *,
          users(id, name, email, role)
        `
        )
        .eq("project_id", projectId)
        .order("granted_at", { ascending: false });

      if (error) {
        console.error("Error fetching project users:", error);
        return [];
      }

      // Transform the data to include project_access info in user objects
      return (data || []).map((access: any) => ({
        ...access.users,
        project_access: {
          access_level: access.access_level,
          permissions: access.permissions,
          granted_at: access.granted_at,
        },
      }));
    } catch (error) {
      console.error("Exception in getProjectUsers:", error);
      return [];
    }
  },

  // Get user's accessible projects (for clients)
  async getUserAccessibleProjects(): Promise<Project[]> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    // Get projects where user is the primary client first
    const { data: ownedProjects, error: ownedError } = await supabase
      .from("projects")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });

    if (ownedError) {
      throw ownedError;
    }

    // Get projects where user has team access
    const { data: accessProjects, error: accessError } = await supabase
      .from("projects")
      .select(
        `
        *,
        project_access!inner(access_level, permissions)
      `
      )
      .eq("project_access.user_id", user.id)
      .order("created_at", { ascending: false });

    if (accessError) {
      console.warn("Could not fetch team access projects:", accessError);
    }

    // Combine both sets of projects, avoiding duplicates
    const allProjects = [...(ownedProjects || [])];
    if (accessProjects) {
      for (const project of accessProjects) {
        if (!allProjects.find((p) => p.id === project.id)) {
          allProjects.push(project);
        }
      }
    }

    const data = allProjects;

    return data || [];
  },

  // Check if user has access to specific project
  async hasProjectAccess(
    projectId: string,
    userId?: string
  ): Promise<{
    hasAccess: boolean;
    accessLevel?: ProjectAccess["access_level"];
    permissions?: ProjectAccess["permissions"];
  }> {
    const user = userId ? { id: userId } : await this.getCurrentUser();
    if (!user) return { hasAccess: false };

    // Check if user is the project owner (primary client)
    const { data: project } = await supabase
      .from("projects")
      .select("client_id")
      .eq("id", projectId)
      .single();

    if (project?.client_id === user.id) {
      return {
        hasAccess: true,
        accessLevel: "owner",
        permissions: {
          view_demo: true,
          view_files: true,
          comment: true,
          approve: true,
          download: true,
        },
      };
    }

    // Check project access table
    const { data: access } = await supabase
      .from("project_access")
      .select("access_level, permissions")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .single();

    if (access) {
      return {
        hasAccess: true,
        accessLevel: access.access_level,
        permissions: access.permissions,
      };
    }

    return { hasAccess: false };
  },

  // ===== DEMO MANAGEMENT FUNCTIONS =====

  // Update project demo settings (admin only)
  async updateProjectDemo(
    projectId: string,
    demoData: {
      demo_url?: string;
      demo_password?: string;
      demo_status?:
        | "not_ready"
        | "ready"
        | "in_review"
        | "approved"
        | "needs_changes";
      demo_notes?: string;
    }
  ): Promise<Project> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) throw new Error("Admin access required");

    const { data, error } = await supabase
      .from("projects")
      .update({
        ...demoData,
        demo_updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update demo: ${error.message}`);
    }

    return data;
  },

  // Generate demo password
  generateDemoPassword(): string {
    return "demo_" + Math.random().toString(36).substring(2, 10);
  },

  // Generate demo auth token for subdomain access
  async generateDemoAuthToken(userId: string): Promise<string> {
    try {
      const response = await fetch("/api/demo/generate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate demo token");
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Error generating demo token:", error);
      throw error;
    }
  },

  // Get demo URL for project
  getDemoUrl(projectId: string): string {
    const demoBaseUrl =
      process.env.NEXT_PUBLIC_DEMO_URL || "https://demo.jigsawtechie.com";
    return `${demoBaseUrl}/${projectId}`;
  },

  // Check if user has demo access to project
  async hasProjectDemoAccess(
    projectId: string,
    userId?: string
  ): Promise<boolean> {
    const currentUser = userId ? { id: userId } : await this.getCurrentUser();
    if (!currentUser) return false;

    const { data, error } = await supabase
      .from("projects")
      .select("client_id, demo_status")
      .eq("id", projectId)
      .single();

    if (error || !data) return false;

    // Client has access to their own project demos
    if (data.client_id === currentUser.id) return true;

    // Check if user has team access (future feature)
    // const { data: teamAccess } = await supabase
    //   .from("project_team_access")
    //   .select("can_view_demo")
    //   .eq("project_id", projectId)
    //   .eq("user_id", currentUser.id)
    //   .single();

    // return teamAccess?.can_view_demo || false;

    return false;
  },

  // Log demo activity
  async logDemoActivity(
    projectId: string,
    activityType:
      | "demo_accessed"
      | "feedback_submitted"
      | "demo_approved"
      | "demo_rejected",
    details?: any
  ): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) return;

    await supabase.from("demo_activity").insert({
      project_id: projectId,
      user_id: user.id,
      activity_type: activityType,
      details,
      created_at: new Date().toISOString(),
    });
  },
};
