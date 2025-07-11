// API route for project management with new access model
import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

// GET /api/projects - Get all projects (admin) or user's accessible projects
export async function GET(request: NextRequest) {
  try {
    // Get user from session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    if (userProfile?.role === "admin") {
      // Admin: Get all projects with access information
      const { data: projects, error } = await supabaseAdmin
        .from("projects")
        .select(`
          *,
          project_access(
            id,
            access_level,
            user:users(
              id,
              email,
              name,
              role
            )
          ),
          created_by_user:users!projects_created_by_fkey(
            id,
            email,
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch projects", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        projects: projects || [],
        user_role: "admin",
      });
    } else {
      // Regular user: Get only accessible projects
      const { data: projectAccess, error } = await supabaseAdmin
        .from("project_access")
        .select(`
          id,
          access_level,
          project:projects(
            *,
            created_by_user:users!projects_created_by_fkey(
              id,
              email,
              name
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch accessible projects", details: error.message },
          { status: 500 }
        );
      }

      // Transform to include access level with project data
      const accessibleProjects = (projectAccess || []).map((access) => ({
        ...access.project,
        user_access_level: access.access_level,
        access_id: access.id,
      }));

      return NextResponse.json({
        success: true,
        projects: accessibleProjects,
        user_role: userProfile?.role || "client",
      });
    }
  } catch (error) {
    console.error("Projects API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project (admin only)
export async function POST(request: NextRequest) {
  try {
    // Get user from session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || userProfile?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, company_id, initial_users } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    // Create project
    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .insert({
        name,
        company_id: company_id || null,
        created_by: user.id,
        has_demo: false,
      })
      .select()
      .single();

    if (projectError) {
      return NextResponse.json(
        { error: "Failed to create project", details: projectError.message },
        { status: 500 }
      );
    }

    // Add initial users to project access if provided
    if (initial_users && Array.isArray(initial_users) && initial_users.length > 0) {
      const accessRecords = initial_users.map((userAccess: any) => ({
        project_id: project.id,
        user_id: userAccess.user_id,
        access_level: userAccess.access_level || "client",
      }));

      const { error: accessError } = await supabaseAdmin
        .from("project_access")
        .insert(accessRecords);

      if (accessError) {
        console.warn("Failed to add initial users to project:", accessError);
      }
    }

    return NextResponse.json({
      success: true,
      project,
      message: "Project created successfully",
    });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
