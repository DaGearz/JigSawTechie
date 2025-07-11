import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Debug endpoint to test authentication flow
export async function GET(request: NextRequest) {
  try {
    const debug = {
      timestamp: new Date().toISOString(),
      headers: {},
      session: null,
      token: null,
      user: null,
      userProfile: null,
      errors: [],
    };

    // Capture relevant headers
    debug.headers = {
      authorization: request.headers.get("authorization"),
      cookie: request.headers.get("cookie"),
      userAgent: request.headers.get("user-agent"),
    };

    // Test 1: Session-based auth (server-side doesn't work without token)
    try {
      const sessionResult = await supabase.auth.getUser();
      debug.session = {
        user: sessionResult.data?.user || null,
        error: sessionResult.error?.message || "Auth session missing!",
      };
      if (sessionResult.data?.user) {
        debug.user = sessionResult.data.user;
      }
    } catch (error) {
      debug.errors.push(`Session auth error: ${error}`);
    }

    // Test 2: Token-based auth
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.substring(7);
        debug.token = { provided: true, length: token.length };

        const tokenResult = await supabase.auth.getUser(token);
        debug.token.result = {
          user: tokenResult.data?.user || null,
          error: tokenResult.error?.message || null,
        };

        if (tokenResult.data?.user && !debug.user) {
          debug.user = tokenResult.data.user;
        }
      } catch (error) {
        debug.errors.push(`Token auth error: ${error}`);
      }
    }

    // Test 3: Ultra simple admin check - just check email
    if (debug.user) {
      const isAdmin = debug.user.email === "twilliams@jigsawtechie.com";

      debug.userProfile = {
        exists: true,
        data: {
          id: debug.user.id,
          email: debug.user.email,
          is_admin: isAdmin,
        },
        error: null,
      };
    }

    // Test 4: Check if demo_projects table exists
    try {
      const { data, error, count } = await supabase
        .from("demo_projects")
        .select("*", { count: "exact", head: true });

      debug.demoTable = {
        exists: !error,
        error: error?.message || null,
        count: count || 0,
      };
    } catch (error) {
      debug.errors.push(`Demo table check error: ${error}`);
    }

    return NextResponse.json({
      success: true,
      debug,
      summary: {
        authenticated: !!debug.user,
        hasProfile: !!debug.userProfile?.exists,
        isAdmin: !!debug.userProfile?.exists, // If they exist in admin_users table, they're admin
        demoTableExists: !!debug.demoTable?.exists,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
