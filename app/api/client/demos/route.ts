// API route for client demo access
import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

// GET /api/client/demos - Get demos for authenticated client
export async function GET(request: NextRequest) {
  try {
    // Try to get user from session first
    let user = null;
    let authError = null;

    // First try session-based auth
    const sessionResult = await supabase.auth.getUser();
    if (sessionResult.data?.user) {
      user = sessionResult.data.user;
    } else {
      // If session auth fails, try token-based auth
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

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required", details: authError?.message },
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
        {
          error: "Failed to fetch demos",
          details: ownedError.message,
          user_id: user.id,
        },
        { status: 500 }
      );
    }

    // For now, just return owned demos (team access can be added later)
    const allDemos = ownedDemos || [];

    return NextResponse.json({
      success: true,
      demos: allDemos,
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
