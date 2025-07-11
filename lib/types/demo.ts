// 🎯 Demo System TypeScript Types
// Types for the integrated demo hosting system

export interface DemoProject {
  id: string;
  project_id: string;
  demo_name: string;
  demo_slug: string; // URL-friendly version for /demo/[slug]
  demo_path: string; // Local file path on server
  demo_url: string; // Full URL: jigsawtechie.com/demo/[slug]
  status: DemoStatus;
  build_type: BuildType;
  demo_type: DemoType; // 'integrated' or 'external'
  external_url?: string; // External URL for external demos
  external_description?: string; // Description for external demos
  file_size_mb?: number;
  deployed_at?: string;
  last_updated: string;
  created_at: string;
  created_by: string;

  // Joined data
  project?: {
    id: string;
    name: string;
    client_id: string;
    client?: {
      id: string;
      email: string;
      full_name?: string;
    };
  };
}

export type DemoStatus =
  | "preparing" // Demo is being set up
  | "building" // Files are being processed
  | "ready" // Demo is live and accessible
  | "error" // Something went wrong
  | "archived"; // Demo is no longer active

export type BuildType =
  | "static" // Static HTML/CSS/JS files
  | "nextjs" // Next.js build output
  | "react" // React build output
  | "html"; // Simple HTML files

export type DemoType =
  | "integrated" // Hosted on jigsawtechie.com with authentication
  | "external"; // External link to Vercel/other hosting

export interface DemoAccessLog {
  id: string;
  demo_id: string;
  user_id: string;
  accessed_at: string;
  ip_address?: string;
  user_agent?: string;
  session_duration?: number; // in seconds

  // Joined data
  demo?: DemoProject;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export interface DemoPermission {
  id: string;
  demo_id: string;
  user_id: string;
  permission_type: PermissionType;
  granted_by: string;
  granted_at: string;
  expires_at?: string;

  // Joined data
  demo?: DemoProject;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
  granted_by_user?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export type PermissionType =
  | "view" // Can view the demo
  | "admin" // Can manage the demo
  | "edit"; // Can edit demo settings

// Demo upload/deployment interfaces
export interface DemoUploadRequest {
  project_id: string;
  demo_name: string;
  build_type: BuildType;
  files?: FileList; // For file upload
  local_path?: string; // For local folder selection
}

export interface DemoDeploymentResult {
  success: boolean;
  demo_id?: string;
  demo_url?: string;
  error?: string;
  warnings?: string[];
}

// Demo management interfaces
export interface DemoStats {
  total_demos: number;
  ready_demos: number;
  building_demos: number;
  error_demos: number;
  total_file_size_mb: number;
  total_access_count: number;
}

export interface DemoAccessCheck {
  can_access: boolean;
  reason?: string;
  permission_type?: PermissionType;
}

// Client dashboard demo interface
export interface ClientDemoInfo {
  demo_id: string;
  demo_name: string;
  demo_url: string;
  status: DemoStatus;
  last_updated: string;
  access_count: number;
  project_name: string;
}

// Admin demo management interface
export interface AdminDemoInfo extends DemoProject {
  access_count: number;
  last_accessed?: string;
  client_email: string;
  client_name?: string;
  file_count?: number;
}

// Demo file management
export interface DemoFile {
  path: string;
  name: string;
  size: number;
  type: "file" | "directory";
  last_modified: string;
}

export interface DemoFileStructure {
  demo_id: string;
  root_path: string;
  files: DemoFile[];
  total_size: number;
  file_count: number;
}

// Demo deployment configuration
export interface DemoConfig {
  build_command?: string;
  output_directory?: string;
  environment_variables?: Record<string, string>;
  custom_domain?: string;
  password_protection?: boolean;
  password?: string;
}

// API response types
export interface DemoApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DemoListResponse extends DemoApiResponse {
  data: {
    demos: DemoProject[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface DemoAccessResponse extends DemoApiResponse {
  data: {
    can_access: boolean;
    demo?: DemoProject;
    permission_type?: PermissionType;
  };
}

// Utility types
export type DemoSortField =
  | "created_at"
  | "last_updated"
  | "demo_name"
  | "status"
  | "file_size_mb";

export type SortOrder = "asc" | "desc";

export interface DemoListFilters {
  status?: DemoStatus[];
  build_type?: BuildType[];
  project_id?: string;
  client_id?: string;
  search?: string;
  sort_field?: DemoSortField;
  sort_order?: SortOrder;
  page?: number;
  limit?: number;
}

// Demo URL generation
export const generateDemoUrl = (
  slug: string,
  baseUrl: string = "https://jigsawtechie.com"
): string => {
  return `${baseUrl}/demo/${slug}`;
};

// Demo slug generation
export const generateDemoSlug = (projectName: string): string => {
  return projectName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

// Demo status helpers
export const getDemoStatusColor = (status: DemoStatus): string => {
  switch (status) {
    case "ready":
      return "green";
    case "building":
      return "blue";
    case "preparing":
      return "yellow";
    case "error":
      return "red";
    case "archived":
      return "gray";
    default:
      return "gray";
  }
};

export const getDemoStatusLabel = (status: DemoStatus): string => {
  switch (status) {
    case "ready":
      return "Live & Ready";
    case "building":
      return "Building...";
    case "preparing":
      return "Preparing";
    case "error":
      return "Error";
    case "archived":
      return "Archived";
    default:
      return "Unknown";
  }
};

// Build type helpers
export const getBuildTypeLabel = (buildType: BuildType): string => {
  switch (buildType) {
    case "nextjs":
      return "Next.js";
    case "react":
      return "React";
    case "static":
      return "Static Files";
    case "html":
      return "HTML";
    default:
      return "Unknown";
  }
};
