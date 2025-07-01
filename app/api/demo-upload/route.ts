import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import AdmZip from "adm-zip";

// Initialize Supabase client with environment variable checks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase environment variables not found during build");
}

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is available
    if (!supabase) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Verify the token with Supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get project ID and file from form data
    const formData = await request.formData();
    const projectId = formData.get("projectId") as string;
    const file = formData.get("file") as File;

    if (!projectId || !file) {
      return NextResponse.json(
        { error: "Missing projectId or file" },
        { status: 400 }
      );
    }

    // Verify project exists and user has access
    const { data: project } = await supabase
      .from("projects")
      .select("id, name")
      .eq("id", projectId)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Create demo directory
    const demoDir = join(process.cwd(), "public", "demos", projectId);
    if (!existsSync(demoDir)) {
      await mkdir(demoDir, { recursive: true });
    }

    // Save and extract the uploaded zip file
    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = new AdmZip(buffer);

    // Extract all files to the demo directory
    zip.extractAllTo(demoDir, true);

    // Update project with demo URL
    const demoUrl = `${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }/demos/${projectId}`;

    await supabase
      .from("projects")
      .update({
        demo_url: demoUrl,
        demo_status: "ready",
        demo_last_updated: new Date().toISOString(),
      })
      .eq("id", projectId);

    return NextResponse.json({
      success: true,
      message: "Demo deployed successfully",
      demoUrl,
      projectId,
      projectName: project.name,
      uploadSize: `${(buffer.length / 1024).toFixed(2)} KB`,
    });
  } catch (error) {
    console.error("Demo upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Demo upload endpoint - POST only",
    usage: "POST with multipart/form-data containing projectId and file (zip)",
  });
}
