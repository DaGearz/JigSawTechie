// Debug endpoint for client demos
import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Get user from session - try multiple methods
    let user = null;
    let authError = null;
    let authMethod = "none";

    // Method 1: Session-based auth
    const sessionResult = await supabase.auth.getUser();
    if (sessionResult.data?.user) {
      user = sessionResult.data.user;
      authMethod = "session";
    } else {
      // Method 2: Token-based auth from Authorization header
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        const tokenResult = await supabase.auth.getUser(token);
        if (tokenResult.data?.user) {
          user = tokenResult.data.user;
          authMethod = "bearer_token";
        } else {
          authError = tokenResult.error;
        }
      } else {
        // Method 3: Try to get from cookies
        const cookies = request.headers.get("cookie");
        if (cookies) {
          // Extract Supabase auth token from cookies
          const authTokenMatch = cookies.match(
            /sb-oyzycafkfmrrqmpwgtdg-auth-token=([^;]+)/
          );
          if (authTokenMatch) {
            try {
              const tokenData = JSON.parse(
                decodeURIComponent(authTokenMatch[1])
              );
              if (tokenData.access_token) {
                const cookieResult = await supabase.auth.getUser(
                  tokenData.access_token
                );
                if (cookieResult.data?.user) {
                  user = cookieResult.data.user;
                  authMethod = "cookie";
                } else {
                  authError = cookieResult.error;
                }
              }
            } catch (e) {
              authError = { message: "Failed to parse cookie token" };
            }
          }
        }

        if (!user && !authError) {
          authError = sessionResult.error || {
            message: "No auth method worked",
          };
        }
      }
    }

    const debug = {
      timestamp: new Date().toISOString(),
      user: user ? { id: user.id, email: user.email } : null,
      authMethod,
      authError: authError?.message || null,
      headers: {
        authorization: request.headers.get("authorization")
          ? "present"
          : "missing",
        cookie: request.headers.get("cookie") ? "present" : "missing",
      },
      tests: {},
    };

    if (!user) {
      return NextResponse.json({
        success: false,
        debug,
        message: "No authenticated user found",
      });
    }

    // Test 1: Check if user has any projects
    const { data: projects, error: projectsError } = await supabaseAdmin
      .from("projects")
      .select("id, name, client_id")
      .eq("client_id", user.id);

    debug.tests.projects = {
      count: projects?.length || 0,
      data: projects,
      error: projectsError?.message || null,
    };

    // Test 2: Check all demo projects
    const { data: allDemos, error: allDemosError } = await supabaseAdmin
      .from("demo_projects")
      .select("*");

    debug.tests.allDemos = {
      count: allDemos?.length || 0,
      data: allDemos,
      error: allDemosError?.message || null,
    };

    // Test 3: Try the actual query that's failing
    const { data: ownedDemos, error: ownedError } = await supabaseAdmin
      .from("demo_projects")
      .select(
        `
        *,
        project:projects!inner(
          id,
          name,
          client_id
        )
      `
      )
      .eq("project.client_id", user.id)
      .order("created_at", { ascending: false });

    debug.tests.ownedDemos = {
      count: ownedDemos?.length || 0,
      data: ownedDemos,
      error: ownedError?.message || null,
    };

    return NextResponse.json({
      success: true,
      debug,
      message: "Debug information collected",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : null,
      },
      { status: 500 }
    );
  }
}
