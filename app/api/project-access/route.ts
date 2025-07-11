// API route for managing project access
import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

// POST /api/project-access - Add user to project
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

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabaseAdmin
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

    // Parse request body
    const body = await request.json();
    const { project_id, user_email, access_level } = body;

    if (!project_id || !user_email || !access_level) {
      return NextResponse.json(
        { error: "Missing required fields: project_id, user_email, access_level" },
        { status: 400 }
      );
    }

    // Validate access level
    const validAccessLevels = ["viewer", "client", "editor", "admin"];
    if (!validAccessLevels.includes(access_level)) {
      return NextResponse.json(
        { error: "Invalid access level. Must be: viewer, client, editor, or admin" },
        { status: 400 }
      );
    }

    // Find user by email
    const { data: targetUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, email, name")
      .eq("email", user_email)
      .single();

    if (userError || !targetUser) {
      return NextResponse.json(
        { error: "User not found with that email" },
        { status: 404 }
      );
    }

    // Check if user already has access to this project
    const { data: existingAccess, error: existingError } = await supabaseAdmin
      .from("project_access")
      .select("id, access_level")
      .eq("project_id", project_id)
      .eq("user_id", targetUser.id)
      .single();

    if (existingAccess) {
      // Update existing access level
      const { error: updateError } = await supabaseAdmin
        .from("project_access")
        .update({ access_level })
        .eq("id", existingAccess.id);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update access level", details: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Updated ${targetUser.email}'s access level to ${access_level}`,
        action: "updated",
      });
    } else {
      // Create new access record
      const { data: newAccess, error: createError } = await supabaseAdmin
        .from("project_access")
        .insert({
          project_id,
          user_id: targetUser.id,
          access_level,
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json(
          { error: "Failed to grant access", details: createError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Granted ${targetUser.email} ${access_level} access to project`,
        action: "created",
        access: newAccess,
      });
    }
  } catch (error) {
    console.error("Project access API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/project-access - Remove user from project
export async function DELETE(request: NextRequest) {
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

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabaseAdmin
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

    // Parse request body
    const body = await request.json();
    const { project_id, user_id } = body;

    if (!project_id || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields: project_id, user_id" },
        { status: 400 }
      );
    }

    // Remove access
    const { error: deleteError } = await supabaseAdmin
      .from("project_access")
      .delete()
      .eq("project_id", project_id)
      .eq("user_id", user_id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to remove access", details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User access removed successfully",
    });
  } catch (error) {
    console.error("Remove project access error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/project-access?project_id=xxx - Get all users with access to a project
export async function GET(request: NextRequest) {
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

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabaseAdmin
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

    // Get project_id from query parameters
    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get("project_id");

    if (!project_id) {
      return NextResponse.json(
        { error: "project_id parameter is required" },
        { status: 400 }
      );
    }

    // Get all users with access to this project
    const { data: projectAccess, error } = await supabaseAdmin
      .from("project_access")
      .select(`
        id,
        access_level,
        created_at,
        user:users(
          id,
          email,
          name,
          role
        )
      `)
      .eq("project_id", project_id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch project access", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      access: projectAccess || [],
    });
  } catch (error) {
    console.error("Get project access error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
