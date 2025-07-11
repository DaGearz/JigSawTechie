// API route for demo deployment
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { demoManager } from "@/lib/demo-manager";
import { DemoUploadRequest, BuildType, DemoType } from "@/lib/types/demo";

// POST /api/demo/deploy - Deploy a new demo
export async function POST(request: NextRequest) {
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

    // Check if user is admin - use email from auth object
    if (user.email !== "todd@jigsawtechie.com") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      project_id,
      demo_name,
      demo_type = "integrated",
      build_type,
      local_path,
      external_url,
      external_description,
    } = body;

    // Validate required fields
    if (!project_id || !demo_name || !demo_type) {
      return NextResponse.json(
        { error: "Missing required fields: project_id, demo_name, demo_type" },
        { status: 400 }
      );
    }

    // Validate demo type specific fields
    if (demo_type === "integrated") {
      if (!build_type || !local_path) {
        return NextResponse.json(
          {
            error:
              "Missing required fields for integrated demo: build_type, local_path",
          },
          { status: 400 }
        );
      }
    } else if (demo_type === "external") {
      if (!external_url) {
        return NextResponse.json(
          { error: "Missing required field for external demo: external_url" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid demo_type. Must be "integrated" or "external"' },
        { status: 400 }
      );
    }

    // Validate build type
    const validBuildTypes: BuildType[] = ["static", "nextjs", "react", "html"];
    if (!validBuildTypes.includes(build_type)) {
      return NextResponse.json(
        {
          error:
            "Invalid build_type. Must be one of: static, nextjs, react, html",
        },
        { status: 400 }
      );
    }

    // Check if project exists
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, name, client_id")
      .eq("id", project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if demo already exists for this project
    const { data: existingDemo } = await supabase
      .from("demo_projects")
      .select("id")
      .eq("project_id", project_id)
      .single();

    if (existingDemo) {
      return NextResponse.json(
        {
          error:
            "Demo already exists for this project. Delete the existing demo first.",
        },
        { status: 409 }
      );
    }

    let result;

    if (demo_type === "external") {
      // Handle external demo - just create database record
      result = await demoManager.createExternalDemo({
        project_id,
        demo_name,
        external_url,
        external_description,
        created_by: user.id,
      });
    } else {
      // Handle integrated demo - deploy files
      const deployRequest: DemoUploadRequest = {
        project_id,
        demo_name,
        build_type,
        local_path,
      };

      result = await demoManager.deployDemo(deployRequest);
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Deployment failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        demo_type === "external"
          ? "External demo link added successfully"
          : "Demo deployed successfully",
      demo_id: result.demo_id,
      demo_url: result.demo_url,
    });
  } catch (error) {
    console.error("Demo deployment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/demo/deploy - Get deployment status (admin only)
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

    // Check if user is admin - use email from auth object
    if (user.email !== "todd@jigsawtechie.com") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get all demos with deployment status
    const { data: demos, error } = await supabase
      .from("demo_projects")
      .select(
        `
        id,
        demo_name,
        demo_slug,
        demo_url,
        status,
        build_type,
        file_size_mb,
        deployed_at,
        last_updated,
        created_at,
        project:projects(
          id,
          name,
          client_id,
          client:auth.users(id, email, raw_user_meta_data)
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch demos" },
        { status: 500 }
      );
    }

    // Get deployment statistics
    const stats = {
      total_demos: demos?.length || 0,
      ready_demos: demos?.filter((d) => d.status === "ready").length || 0,
      building_demos: demos?.filter((d) => d.status === "building").length || 0,
      error_demos: demos?.filter((d) => d.status === "error").length || 0,
      total_file_size_mb:
        demos?.reduce((sum, d) => sum + (d.file_size_mb || 0), 0) || 0,
    };

    return NextResponse.json({
      success: true,
      demos: demos || [],
      stats,
    });
  } catch (error) {
    console.error("Demo status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
