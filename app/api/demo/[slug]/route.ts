// API route for demo access and management
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { demoClientService } from "@/lib/demo-client";

// GET /api/demo/[slug] - Get demo information
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

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

    // Get demo information
    const demo = await demoClientService.getDemoBySlug(slug);

    if (!demo) {
      return NextResponse.json({ error: "Demo not found" }, { status: 404 });
    }

    // Check access permissions
    const canAccess = await demoClientService.canUserAccessDemo(user.id, slug);

    if (!canAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Log the access
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    await demoClientService.logDemoAccess(
      demo.id,
      user.id,
      clientIP,
      userAgent
    );

    return NextResponse.json({
      success: true,
      demo: {
        id: demo.id,
        demo_name: demo.demo_name,
        demo_slug: demo.demo_slug,
        demo_url: demo.demo_url,
        status: demo.status,
        build_type: demo.build_type,
        last_updated: demo.last_updated,
        project: demo.project,
      },
    });
  } catch (error) {
    console.error("Demo API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/demo/[slug] - Update demo (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const body = await request.json();

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

    // Check if user is admin - check role in database
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || userProfile?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get demo
    const demo = await demoClientService.getDemoBySlug(slug);

    if (!demo) {
      return NextResponse.json({ error: "Demo not found" }, { status: 404 });
    }

    // Update demo status or other properties
    if (body.status) {
      const updated = await demoClientService.updateDemoStatus(
        demo.id,
        body.status
      );

      if (!updated) {
        return NextResponse.json(
          { error: "Failed to update demo" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Demo updated successfully",
    });
  } catch (error) {
    console.error("Demo update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/demo/[slug] - Delete demo (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

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

    // Check if user is admin - check role in database
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || userProfile?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Delete demo (this will remove files and database record)
    const { demoManager } = await import("@/lib/demo-manager");
    const deleted = await demoManager.deleteDemo(slug);

    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete demo" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Demo deleted successfully",
    });
  } catch (error) {
    console.error("Demo deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
