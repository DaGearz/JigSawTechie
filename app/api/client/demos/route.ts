// API route for client demo access
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/client/demos?userId=xxx - Get demos for specific client
export async function GET(request: NextRequest) {
  try {
    // Get userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          error: "User ID required",
          message: "Please provide userId parameter",
        },
        { status: 400 }
      );
    }

    // Get projects user has access to via project_access table
    const { data: userProjectAccess, error: projectsError } =
      await supabaseAdmin
        .from("project_access")
        .select(
          `
        project_id,
        access_level,
        project:projects(
          id,
          name,
          has_demo
        )
      `
        )
        .eq("user_id", userId);

    if (projectsError) {
      return NextResponse.json(
        {
          error: "Failed to fetch user project access",
          details: projectsError.message,
        },
        { status: 500 }
      );
    }

    if (!userProjectAccess || userProjectAccess.length === 0) {
      return NextResponse.json({
        success: true,
        demos: [],
        message: "No project access found for user",
      });
    }

    // Filter projects where user has at least 'client' access level for demo viewing
    const accessibleProjects = userProjectAccess.filter(
      (access) =>
        access.access_level === "client" ||
        access.access_level === "editor" ||
        access.access_level === "admin"
    );

    if (accessibleProjects.length === 0) {
      return NextResponse.json({
        success: true,
        demos: [],
        message: "No demo access for user projects",
      });
    }

    const projectIds = accessibleProjects.map((access) => access.project_id);

    // Get demos for accessible projects with access level info
    const { data: userDemos, error: demosError } = await supabaseAdmin
      .from("demo_projects")
      .select(
        `
        *,
        project:projects(
          id,
          name
        )
      `
      )
      .in("project_id", projectIds)
      .eq("status", "ready")
      .order("created_at", { ascending: false });

    if (demosError) {
      return NextResponse.json(
        {
          error: "Failed to fetch demos",
          details: demosError.message,
        },
        { status: 500 }
      );
    }

    // Add access level information to each demo
    const demosWithAccess = (userDemos || []).map((demo) => {
      const projectAccess = accessibleProjects.find(
        (access) => access.project_id === demo.project_id
      );
      return {
        ...demo,
        user_access_level: projectAccess?.access_level || "viewer",
      };
    });

    return NextResponse.json({
      success: true,
      demos: demosWithAccess,
    });
  } catch (error) {
    console.error("Client demos API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
