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

    // Get demos using a simpler query to avoid relationship issues
    const { data: userProjects, error: projectsError } = await supabaseAdmin
      .from("projects")
      .select("id")
      .eq("client_id", userId);

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
