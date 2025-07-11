// 🎯 Client-Safe Demo Service
// Database operations that can be used in client components

import { supabaseAdmin } from "./supabase";
import { DemoProject } from "./types/demo";

export class DemoClientService {
  /**
   * Get all demos (admin only) - client-safe version
   */
  async getAllDemos(): Promise<DemoProject[]> {
    const { data, error } = await supabaseAdmin
      .from("demo_projects")
      .select(
        `
        *,
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
      console.error("Error fetching demos:", error);
      return [];
    }

    return data || [];
  }

  /**
   * Get demos for a specific user (client) - includes team access
   */
  async getUserDemos(userId: string): Promise<DemoProject[]> {
    // Get demos for projects owned by user
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
      .eq("project.client_id", userId)
      .order("created_at", { ascending: false });

    if (ownedError) {
      console.error("Error fetching owned demos:", ownedError);
      return [];
    }

    // Get demos for projects where user has team access
    const { data: accessDemos, error: accessError } = await supabaseAdmin
      .from("demo_projects")
      .select(
        `
        *,
        project:projects!inner(
          id,
          name,
          client_id,
          project_access!inner(user_id, access_level, permissions)
        )
      `
      )
      .eq("project.project_access.user_id", userId)
      .order("created_at", { ascending: false });

    if (accessError) {
      console.warn("Could not fetch team access demos:", accessError);
    }

    // Combine both sets of demos, avoiding duplicates
    const allDemos = [...(ownedDemos || [])];
    if (accessDemos) {
      for (const demo of accessDemos) {
        if (!allDemos.find((d) => d.id === demo.id)) {
          allDemos.push(demo);
        }
      }
    }

    const data = allDemos;

    // Filter demos where user has demo access permissions
    const filteredDemos = (data || []).filter((demo) => {
      // Primary client always has access
      if (demo.project?.client_id === userId) {
        return true;
      }

      // Check team access permissions
      const userAccess = demo.project?.project_access?.find(
        (access: any) => access.user_id === userId
      );
      return userAccess && userAccess.permissions?.view_demo === true;
    });

    return filteredDemos;
  }

  /**
   * Get demo by slug
   */
  async getDemoBySlug(slug: string): Promise<DemoProject | null> {
    const { data, error } = await supabaseAdmin
      .from("demo_projects")
      .select(
        `
        *,
        project:projects(
          id,
          name,
          client_id,
          client:auth.users(id, email, raw_user_meta_data)
        )
      `
      )
      .eq("demo_slug", slug)
      .single();

    if (error) {
      console.error("Error fetching demo:", error);
      return null;
    }

    return data;
  }

  /**
   * Check if user can access demo
   */
  async canUserAccessDemo(userId: string, demoSlug: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin.rpc("can_access_demo", {
      demo_slug: demoSlug,
      user_id: userId,
    });

    if (error) {
      console.error("Error checking demo access:", error);
      return false;
    }

    return data === true;
  }

  /**
   * Log demo access
   */
  async logDemoAccess(
    demoId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await supabaseAdmin.from("demo_access_logs").insert({
      demo_id: demoId,
      user_id: userId,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  }

  /**
   * Update demo status
   */
  async updateDemoStatus(demoId: string, status: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from("demo_projects")
      .update({
        status,
        last_updated: new Date().toISOString(),
      })
      .eq("id", demoId);

    return !error;
  }
}

export const demoClientService = new DemoClientService();
