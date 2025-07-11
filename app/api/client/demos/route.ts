// API route for client demo access
import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

// GET /api/client/demos - Get demos for authenticated client
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

    // Get demos for projects owned by the user using admin client
    const { data: ownedDemos, error: ownedError } = await supabaseAdmin
      .from("demo_projects")
      .select(
        `
        *,
        project:projects!inner(
          id,
          name,
          client_id
        )
      `
      )
      .eq("project.client_id", user.id)
      .order("created_at", { ascending: false });

    if (ownedError) {
      console.error("Error fetching owned demos:", ownedError);
      return NextResponse.json(
        { error: "Failed to fetch demos" },
        { status: 500 }
      );
    }

    // Get demos for projects where user has team access using admin client
    const { data: accessDemos, error: accessError } = await supabaseAdmin
      .from("demo_projects")
      .select(
        `
        *,
        project:projects!inner(
          id,
          name,
          client_id,
          project_access!inner(user_id, access_level, permissions)
        )
      `
      )
      .eq("project.project_access.user_id", user.id)
      .order("created_at", { ascending: false });

    if (accessError) {
      console.warn("Could not fetch team access demos:", accessError);
    }

    // Combine both sets of demos, avoiding duplicates
    const allDemos = [...(ownedDemos || [])];
    if (accessDemos) {
      for (const demo of accessDemos) {
        if (!allDemos.find((d) => d.id === demo.id)) {
          allDemos.push(demo);
        }
      }
    }

    return NextResponse.json({
      success: true,
      demos: allDemos,
    });
  } catch (error) {
    console.error("Client demos API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
