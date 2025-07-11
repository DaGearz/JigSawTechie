// API route for fetching demos
import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

// GET /api/demos - Fetch all demos (admin only)
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
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Ultra simple admin check - just check email
    if (user.email !== "twilliams@jigsawtechie.com") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Fetch demos from database using admin client to bypass RLS
    const { data: demos, error: demosError } = await supabaseAdmin
      .from("demo_projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (demosError) {
      console.error("Error fetching demos:", demosError);
      return NextResponse.json(
        { error: "Failed to fetch demos", details: demosError.message },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format (simplified)
    const transformedDemos = (demos || []).map((demo) => ({
      id: demo.id,
      project_id: demo.project_id || null,
      demo_name: demo.project_name || "Unnamed Demo",
      demo_slug: demo.slug || "",
      demo_path: demo.local_path || "",
      demo_url: demo.external_url || `http://localhost:3000/demos/${demo.slug}`,
      status: demo.status || "ready",
      build_type: "static",
      demo_type: demo.demo_type || "integrated",
      external_url: demo.external_url || null,
      external_description: demo.external_description || "",
      file_size_mb: 0,
      deployed_at: demo.created_at,
      last_updated: demo.updated_at,
      created_at: demo.created_at,
      created_by: user.id,
      project: null, // Simplified - no project joins for now
    }));

    return NextResponse.json({
      success: true,
      demos: transformedDemos,
      total: transformedDemos.length,
    });
  } catch (error) {
    console.error("Demos API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/demos - Create a new demo (redirect to deploy endpoint)
export async function POST(request: NextRequest) {
  // Redirect POST requests to the deploy endpoint
  const body = await request.text();
  const deployRequest = new Request(new URL("/api/demo/deploy", request.url), {
    method: "POST",
    headers: request.headers,
    body: body,
  });

  // Forward to deploy endpoint
  const { POST: deployHandler } = await import("../demo/deploy/route");
  return deployHandler(deployRequest as NextRequest);
}
