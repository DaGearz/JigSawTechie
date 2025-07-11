import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import AdmZip from "adm-zip";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
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
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (profile?.is_admin !== true) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("projectId") as string;

    if (!file || !projectId) {
      return NextResponse.json(
        { error: "Missing file or projectId" },
        { status: 400 }
      );
    }

    // Create project directory
    const projectDir = join(process.cwd(), "public", "demos", projectId);
    if (!existsSync(projectDir)) {
      await mkdir(projectDir, { recursive: true });
    }

    // Save uploaded zip file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const zipPath = join(projectDir, "demo.zip");
    await writeFile(zipPath, buffer);

    // Extract zip file
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(projectDir, true);

    // Update database with demo info
    await supabase.from("demo_management").upsert({
      project_id: projectId,
      demo_url: `${process.env.DEMO_SERVER_URL}/${projectId}`,
      status: "active",
      last_deployed: new Date().toISOString(),
      file_size: buffer.length,
    });

    // Log the deployment
    await supabase.from("demo_access_logs").insert({
      project_id: projectId,
      action: "deployed",
      user_id: user.id,
      metadata: {
        file_size: buffer.length,
        deployment_time: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      projectId,
      size: buffer.length,
      url: `${process.env.DEMO_SERVER_URL}/${projectId}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
