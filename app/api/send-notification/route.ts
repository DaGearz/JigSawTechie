import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { EmailNotificationService } from "@/lib/email-notifications";

// Initialize Supabase client with environment variable checks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

    const { messageId, type } = await request.json();

    if (!messageId || !type) {
      return NextResponse.json(
        { error: "Missing messageId or type" },
        { status: 400 }
      );
    }

    // Get message details
    const { data: message, error: messageError } = await supabase
      .from("client_messages")
      .select(
        `
        *,
        sender_user:sender_id(name, email, role),
        recipient_user:recipient_id(name, email, role),
        project:project_id(name)
      `
      )
      .eq("id", messageId)
      .single();

    if (messageError || !message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Initialize email service
    const emailService = new EmailNotificationService();

    // Determine email details based on message
    const isFromAdmin = message.sender_user?.role === "admin";
    const recipient = isFromAdmin
      ? message.recipient_user
      : message.sender_user;
    const sender = isFromAdmin ? message.sender_user : message.recipient_user;

    if (!recipient?.email) {
      return NextResponse.json(
        { error: "Recipient email not found" },
        { status: 400 }
      );
    }

    // Send email notification
    const emailData = {
      to: recipient.email,
      toName: recipient.name || "User",
      fromName: "JigsawTechie",
      subject: message.subject,
      message: message.message,
      priority: message.priority || "normal",
      isReply: type === "reply",
      projectName: message.project?.name,
      senderName: sender?.name || "JigsawTechie Team",
    };

    const success = await emailService.notifyNewMessage(emailData);

    if (success) {
      // Mark notification as sent (you could add a notifications_sent table)
      console.log(`Email notification sent for message ${messageId}`);

      return NextResponse.json({
        success: true,
        message: "Email notification sent successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send email notification" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Send notification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Email notification endpoint - POST only",
    usage: "POST with messageId and type (new|reply)",
  });
}
