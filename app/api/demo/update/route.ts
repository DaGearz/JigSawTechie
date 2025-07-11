// API route for updating demo configurations
import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { demoManager } from "@/lib/demo-manager";

// POST /api/demo/update - Update demo configuration
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
    const {
      demo_id,
      demo_type,
      external_url,
      external_description,
      build_type,
      local_path,
    } = body;

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

    let updateData: any = {
      demo_type: demo_type,
      last_updated: new Date().toISOString(),
    };

    if (demo_type === "external") {
      // Update to external demo
      if (!external_url) {
        return NextResponse.json(
          { error: "External URL is required for external demos" },
          { status: 400 }
        );
      }

      updateData.external_url = external_url;
      updateData.external_description = external_description || "";
      updateData.demo_url = external_url; // Use external URL as demo URL
      updateData.status = "ready";
    } else if (demo_type === "integrated") {
      // Update to integrated demo
      if (!build_type || !local_path) {
        return NextResponse.json(
          {
            error:
              "Build type and local path are required for integrated demos",
          },
          { status: 400 }
        );
      }

      // Deploy the integrated demo
      const deployResult = await demoManager.deployDemo({
        project_id: existingDemo.project_id,
        demo_name: existingDemo.demo_name,
        build_type: build_type,
        local_path: local_path,
      });

      if (!deployResult.success) {
        return NextResponse.json(
          { error: deployResult.error || "Failed to deploy integrated demo" },
          { status: 500 }
        );
      }

      updateData.build_type = build_type;
      updateData.demo_path = `/demos/${existingDemo.demo_slug}`;
      updateData.demo_url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://jigsawtechie.com"}/demos/${existingDemo.demo_slug}`;
      updateData.external_url = null;
      updateData.external_description = null;
      updateData.status = "ready";
    } else if (demo_type === "none") {
      // Disable demo - keep record but mark as disabled
      updateData.status = "disabled";
      updateData.demo_url = null;
      updateData.external_url = null;
    } else {
      return NextResponse.json(
        { error: 'Invalid demo_type. Must be "external", "integrated", or "none"' },
        { status: 400 }
      );
    }

    // Update demo record
    const { error: updateError } = await supabaseAdmin
      .from("demo_projects")
      .update(updateData)
      .eq("id", demo_id);

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to update demo: ${updateError.message}` },
        { status: 500 }
      );
    }

    // Update project demo status
    const { error: projectError } = await supabaseAdmin
      .from("projects")
      .update({
        has_demo: demo_type !== "none",
        demo_id: demo_type !== "none" ? demo_id : null,
      })
      .eq("id", existingDemo.project_id);

    if (projectError) {
      console.warn("Failed to update project demo status:", projectError);
    }

    return NextResponse.json({
      success: true,
      message: `Demo ${demo_type === "none" ? "disabled" : "updated"} successfully`,
      demo_id: demo_id,
      demo_url: updateData.demo_url,
    });
  } catch (error) {
    console.error("Demo update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
