// API route for client demo access
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/client/demos - Get demos for authenticated client
export async function GET() {
  try {
    // Use SSR client to get authenticated user from cookies
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Authentication required",
          details: authError?.message || "No user found",
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
