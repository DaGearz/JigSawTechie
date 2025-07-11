// API route for client demo access
import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

// GET /api/client/demos - Get demos for authenticated client
export async function GET(request: NextRequest) {
  try {
    // Get user from session with multiple fallback methods
    let user = null;
    let authError = null;

    // Method 1: Try session-based auth
    const sessionResult = await supabase.auth.getUser();
    if (sessionResult.data?.user) {
      user = sessionResult.data.user;
    } else {
      // Method 2: Try token from Authorization header
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        const tokenResult = await supabase.auth.getUser(token);
        if (tokenResult.data?.user) {
          user = tokenResult.data.user;
        } else {
          authError = tokenResult.error;
        }
      } else {
        authError = sessionResult.error;
      }
    }

    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required",
          details: authError?.message || "No user found",
          debug: {
            hasAuthHeader: !!request.headers.get("authorization"),
            sessionError: sessionResult.error?.message,
          },
        },
        { status: 401 }
      );
    }

    // Get demos using a simpler query to avoid relationship issues
    const { data: userProjects, error: projectsError } = await supabaseAdmin
      .from("projects")
      .select("id")
      .eq("client_id", user.id);

    if (projectsError) {
      return NextResponse.json(
        {
          error: "Failed to fetch user projects",
          details: projectsError.message,
        },
        { status: 500 }
      );
    }

    if (!userProjects || userProjects.length === 0) {
      return NextResponse.json({
        success: true,
        demos: [],
        message: "No projects found for user",
      });
    }

    const projectIds = userProjects.map((p) => p.id);

    // Get demos for user's projects
    const { data: userDemos, error: demosError } = await supabaseAdmin
      .from("demo_projects")
      .select("*")
      .in("project_id", projectIds)
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

    return NextResponse.json({
      success: true,
      demos: userDemos || [],
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
