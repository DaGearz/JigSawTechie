// 🗂️ Demo File Management System
// Handles demo file uploads, storage, and organization

import fs from "fs/promises";
import path from "path";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { supabase, supabaseAdmin } from "./supabase";
import {
  DemoProject,
  DemoUploadRequest,
  DemoDeploymentResult,
  DemoFileStructure,
  DemoFile,
  BuildType,
  generateDemoSlug,
  generateDemoUrl,
} from "./types/demo";

export class DemoManager {
  private readonly DEMO_BASE_PATH: string;
  private readonly MAX_FILE_SIZE_MB = 100; // 100MB limit per demo
  private readonly ALLOWED_EXTENSIONS = [
    ".html",
    ".css",
    ".js",
    ".json",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".pdf",
    ".txt",
    ".md",
  ];

  constructor() {
    // Demo files stored in public/demos directory
    this.DEMO_BASE_PATH = path.join(process.cwd(), "public", "demos");
    this.ensureDemoDirectory();
  }

  /**
   * Ensure the demos directory exists
   */
  private async ensureDemoDirectory(): Promise<void> {
    try {
      await fs.access(this.DEMO_BASE_PATH);
    } catch {
      await fs.mkdir(this.DEMO_BASE_PATH, { recursive: true });
    }
  }

  /**
   * Deploy a demo from local project files
   */
  async deployDemo(request: DemoUploadRequest): Promise<DemoDeploymentResult> {
    try {
      // Generate demo slug
      const demoSlug = generateDemoSlug(request.demo_name);
      const demoPath = path.join(this.DEMO_BASE_PATH, demoSlug);
      const demoUrl = generateDemoUrl(demoSlug);

      // Create demo record in database using admin client
      const { data: demoProject, error: dbError } = await supabaseAdmin
        .from("demo_projects")
        .insert({
          project_id: request.project_id,
          demo_name: request.demo_name,
          demo_slug: demoSlug,
          demo_path: `/demos/${demoSlug}`,
          demo_url: demoUrl,
          status: "building",
          build_type: request.build_type,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      // Copy files from local project
      if (request.local_path) {
        await this.copyLocalProject(
          request.local_path,
          demoPath,
          request.build_type
        );
      }

      // Calculate file size
      const fileSize = await this.calculateDirectorySize(demoPath);

      // Update demo record with deployment info using admin client
      await supabaseAdmin
        .from("demo_projects")
        .update({
          status: "ready",
          deployed_at: new Date().toISOString(),
          file_size_mb: Math.round((fileSize / (1024 * 1024)) * 100) / 100,
        })
        .eq("id", demoProject.id);

      // Update project to indicate it has a demo using admin client
      await supabaseAdmin
        .from("projects")
        .update({
          has_demo: true,
          demo_id: demoProject.id,
        })
        .eq("id", request.project_id);

      return {
        success: true,
        demo_id: demoProject.id,
        demo_url: demoUrl,
      };
    } catch (error) {
      console.error("Demo deployment error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Create an external demo record (no file deployment)
   */
  async createExternalDemo(request: {
    project_id: string;
    demo_name: string;
    external_url: string;
    external_description?: string;
    created_by: string;
  }): Promise<DemoDeploymentResult> {
    try {
      // Generate demo slug for consistency
      const demoSlug = generateDemoSlug(request.demo_name);

      // Create demo record in database using admin client
      const { data: demoProject, error: demoError } = await supabaseAdmin
        .from("demo_projects")
        .insert({
          project_id: request.project_id,
          demo_name: request.demo_name,
          demo_slug: demoSlug,
          demo_path: "", // No local path for external demos
          demo_url: request.external_url, // Use external URL
          demo_type: "external",
          external_url: request.external_url,
          external_description: request.external_description,
          status: "ready", // External demos are immediately ready
          build_type: "static", // Default value
          created_by: request.created_by,
        })
        .select()
        .single();

      if (demoError) {
        throw new Error(`Failed to create external demo: ${demoError.message}`);
      }

      // Update project to mark it has a demo using admin client
      await supabaseAdmin
        .from("projects")
        .update({
          has_demo: true,
          demo_id: demoProject.id,
        })
        .eq("id", request.project_id);

      return {
        success: true,
        demo_id: demoProject.id,
        demo_url: request.external_url,
      };
    } catch (error) {
      console.error("External demo creation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Copy files from local project to demo directory
   */
  private async copyLocalProject(
    sourcePath: string,
    targetPath: string,
    buildType: BuildType
  ): Promise<void> {
    // Ensure target directory exists
    await fs.mkdir(targetPath, { recursive: true });

    // Determine source directory based on build type
    let actualSourcePath = sourcePath;

    switch (buildType) {
      case "nextjs":
        // For Next.js, copy the .next/static and public directories
        actualSourcePath = path.join(sourcePath, ".next");
        if (await this.pathExists(actualSourcePath)) {
          await this.copyDirectory(
            actualSourcePath,
            path.join(targetPath, "_next")
          );
        }
        // Also copy public directory
        const publicPath = path.join(sourcePath, "public");
        if (await this.pathExists(publicPath)) {
          await this.copyDirectory(publicPath, targetPath);
        }
        break;

      case "react":
        // For React, copy the build directory
        actualSourcePath = path.join(sourcePath, "build");
        if (await this.pathExists(actualSourcePath)) {
          await this.copyDirectory(actualSourcePath, targetPath);
        }
        break;

      case "static":
      case "html":
        // Copy all files from source
        await this.copyDirectory(sourcePath, targetPath);
        break;
    }

    // Ensure there's an index.html file
    await this.ensureIndexFile(targetPath, buildType);
  }

  /**
   * Copy directory recursively with file filtering
   */
  private async copyDirectory(source: string, target: string): Promise<void> {
    await fs.mkdir(target, { recursive: true });

    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const targetPath = path.join(target, entry.name);

      if (entry.isDirectory()) {
        // Skip certain directories
        if (this.shouldSkipDirectory(entry.name)) {
          continue;
        }
        await this.copyDirectory(sourcePath, targetPath);
      } else {
        // Check file extension and size
        if (this.isAllowedFile(entry.name)) {
          const stats = await fs.stat(sourcePath);
          if (stats.size < this.MAX_FILE_SIZE_MB * 1024 * 1024) {
            await fs.copyFile(sourcePath, targetPath);
          }
        }
      }
    }
  }

  /**
   * Ensure there's an index.html file for the demo
   */
  private async ensureIndexFile(
    demoPath: string,
    buildType: BuildType
  ): Promise<void> {
    const indexPath = path.join(demoPath, "index.html");

    try {
      await fs.access(indexPath);
      // File exists, we're good
    } catch {
      // Create a basic index.html file
      const indexContent = this.generateIndexHtml(buildType);
      await fs.writeFile(indexPath, indexContent);
    }
  }

  /**
   * Generate basic index.html content
   */
  private generateIndexHtml(buildType: BuildType): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo - JigsawTechie</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
        .demo-container { max-width: 800px; margin: 0 auto; }
        .error { color: #e74c3c; }
        .info { color: #3498db; }
    </style>
</head>
<body>
    <div class="demo-container">
        <h1>Demo Loading...</h1>
        <p class="info">This is a ${buildType} demo hosted by JigsawTechie.</p>
        <p>If you're seeing this message, the demo files may still be processing.</p>
        <p><a href="https://jigsawtechie.com">← Back to JigsawTechie</a></p>
    </div>
</body>
</html>`;
  }

  /**
   * Check if a path exists
   */
  private async pathExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if directory should be skipped during copy
   */
  private shouldSkipDirectory(dirName: string): boolean {
    const skipDirs = [
      "node_modules",
      ".git",
      ".next",
      "build",
      "dist",
      ".vercel",
      ".env",
      "coverage",
      ".nyc_output",
    ];
    return skipDirs.includes(dirName) || dirName.startsWith(".");
  }

  /**
   * Check if file is allowed based on extension
   */
  private isAllowedFile(fileName: string): boolean {
    const ext = path.extname(fileName).toLowerCase();
    return this.ALLOWED_EXTENSIONS.includes(ext) || fileName === "index.html";
  }

  /**
   * Calculate total size of directory
   */
  private async calculateDirectorySize(dirPath: string): Promise<number> {
    let totalSize = 0;

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          totalSize += await this.calculateDirectorySize(fullPath);
        } else {
          const stats = await fs.stat(fullPath);
          totalSize += stats.size;
        }
      }
    } catch (error) {
      console.error("Error calculating directory size:", error);
    }

    return totalSize;
  }

  /**
   * Get demo file structure
   */
  async getDemoFileStructure(
    demoSlug: string
  ): Promise<DemoFileStructure | null> {
    try {
      const demoPath = path.join(this.DEMO_BASE_PATH, demoSlug);
      const files = await this.listDirectoryFiles(demoPath);
      const totalSize = await this.calculateDirectorySize(demoPath);

      return {
        demo_id: demoSlug,
        root_path: demoPath,
        files,
        total_size: totalSize,
        file_count: files.length,
      };
    } catch (error) {
      console.error("Error getting demo file structure:", error);
      return null;
    }
  }

  /**
   * List files in directory
   */
  private async listDirectoryFiles(
    dirPath: string,
    relativePath = ""
  ): Promise<DemoFile[]> {
    const files: DemoFile[] = [];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relPath = path.join(relativePath, entry.name);
        const stats = await fs.stat(fullPath);

        files.push({
          path: relPath,
          name: entry.name,
          size: stats.size,
          type: entry.isDirectory() ? "directory" : "file",
          last_modified: stats.mtime.toISOString(),
        });

        // Recursively list subdirectories (limit depth)
        if (entry.isDirectory() && relativePath.split("/").length < 3) {
          const subFiles = await this.listDirectoryFiles(fullPath, relPath);
          files.push(...subFiles);
        }
      }
    } catch (error) {
      console.error("Error listing directory files:", error);
    }

    return files;
  }

  /**
   * Delete demo files and database record
   */
  async deleteDemo(demoSlug: string): Promise<boolean> {
    try {
      const demoPath = path.join(this.DEMO_BASE_PATH, demoSlug);

      // Remove files
      await fs.rm(demoPath, { recursive: true, force: true });

      // Remove database record using admin client
      await supabaseAdmin
        .from("demo_projects")
        .delete()
        .eq("demo_slug", demoSlug);

      return true;
    } catch (error) {
      console.error("Error deleting demo:", error);
      return false;
    }
  }
}

// Export singleton instance
export const demoManager = new DemoManager();

// Demo Service for database operations
export class DemoService {
  /**
   * Get all demos (admin only)
   */
  async getAllDemos(): Promise<DemoProject[]> {
    const { data, error } = await supabase
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
    const { data: ownedDemos, error: ownedError } = await supabase
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
    const { data: accessDemos, error: accessError } = await supabase
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
    const { data, error } = await supabase
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
    const { error } = await supabase
      .from("demo_projects")
      .update({
        status,
        last_updated: new Date().toISOString(),
      })
      .eq("id", demoId);

    return !error;
  }
}

export const demoService = new DemoService();
