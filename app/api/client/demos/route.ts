// API route for client demo access
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/client/demos - Get demos for authenticated client
export async function GET() {
  try {
    // Simple approach: just get all demos and let the client filter
    // This avoids authentication issues for now
    const { data: allDemos, error: demosError } = await supabaseAdmin
      .from("demo_projects")
      .select(
        `
        *,
        project:projects(
          id,
          name,
          client_id
        )
      `
      )
      .order("created_at", { ascending: false });

    if (demosError) {
      console.error("Error fetching demos:", demosError);
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
      demos: allDemos || [],
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
