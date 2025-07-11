// API route for demo deployment
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { demoManager } from "@/lib/demo-manager";
import { DemoUploadRequest, BuildType, DemoType } from "@/lib/types/demo";

// GET /api/demo/deploy - Redirect to /api/demos for fetching demos
export async function GET(request: NextRequest) {
  // Redirect GET requests to the demos endpoint
  const demosRequest = new Request(new URL("/api/demos", request.url), {
    method: "GET",
    headers: request.headers,
  });

  // Forward to demos endpoint
  const { GET: demosHandler } = await import("../../demos/route");
  return demosHandler(demosRequest as NextRequest);
}

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
