// API route for deleting demos
import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { demoManager } from "@/lib/demo-manager";

// POST /api/demo/delete - Delete demo completely
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

    // Ultra simple admin check - just check email
    if (user.email !== "twilliams@jigsawtechie.com") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { demo_id } = body;

    // Validate required fields
    if (!demo_id) {
      return NextResponse.json(
        { error: "Missing required field: demo_id" },
        { status: 400 }
      );
    }

    // Get existing demo
    const { data: existingDemo, error: demoError } = await supabaseAdmin
      .from("demo_projects")
      .select("*")
      .eq("id", demo_id)
      .single();

    if (demoError || !existingDemo) {
      return NextResponse.json({ error: "Demo not found" }, { status: 404 });
    }

    // If it's an integrated demo, delete the files
    if (existingDemo.demo_type === "integrated" && existingDemo.demo_slug) {
      const deleteResult = await demoManager.deleteDemo(existingDemo.demo_slug);
      if (!deleteResult) {
        console.warn("Failed to delete demo files, but continuing with database cleanup");
      }
    }

    // Delete demo access logs first (foreign key constraint)
    await supabaseAdmin
      .from("demo_access_logs")
      .delete()
      .eq("demo_id", demo_id);

    // Delete demo record
    const { error: deleteError } = await supabaseAdmin
      .from("demo_projects")
      .delete()
      .eq("id", demo_id);

    if (deleteError) {
      return NextResponse.json(
        { error: `Failed to delete demo: ${deleteError.message}` },
        { status: 500 }
      );
    }

    // Update project to remove demo reference
    const { error: projectError } = await supabaseAdmin
      .from("projects")
      .update({
        has_demo: false,
        demo_id: null,
      })
      .eq("id", existingDemo.project_id);

    if (projectError) {
      console.warn("Failed to update project demo status:", projectError);
    }

    return NextResponse.json({
      success: true,
      message: "Demo deleted successfully",
    });
  } catch (error) {
    console.error("Demo delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
