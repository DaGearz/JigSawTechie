#!/usr/bin/env node

/**
 * JigsawTechie Demo CLI - Deploy Demo
 * Deploys a local project to the demo server
 */

const fs = require("fs-extra");
const path = require("path");
const archiver = require("archiver");
const FormData = require("form-data");

// Handle fetch for different Node.js versions
let fetch;
try {
  // Try to use built-in fetch (Node.js 18+)
  fetch = globalThis.fetch;
  if (!fetch) {
    // Fallback to node-fetch for older versions
    fetch = require("node-fetch");
  }
} catch (error) {
  console.error(
    "❌ Error: Could not load fetch. Please install node-fetch or use Node.js 18+"
  );
  process.exit(1);
}

const CONFIG_FILE = ".jigsawtechie-config.json";
const DEMO_SERVER_URL =
  "https://demo-server-jd7ue3fyo-todd-williams-projects-28975c01.vercel.app";

// Alternative: Use the main JigsawTechie server for demo uploads
const MAIN_SERVER_URL = "https://jigsaw-techie-website.vercel.app";

async function getAdminToken() {
  try {
    if (await fs.pathExists(CONFIG_FILE)) {
      const config = await fs.readJson(CONFIG_FILE);
      return config.adminToken;
    }
  } catch (error) {
    // Config file doesn't exist or is invalid
  }

  console.error("❌ Authentication not set up");
  console.log("");
  console.log("Please run: node cli/setup-auth.js <your-token>");
  console.log("");
  process.exit(1);
}

async function createZip(sourceDir, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve());
    archive.on("error", reject);

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function deployDemo() {
  const sourceDir = process.argv[2];
  const projectId = process.argv[3];

  if (!sourceDir || !projectId) {
    console.error("❌ Error: Missing required arguments");
    console.log("");
    console.log(
      "Usage: node cli/deploy-demo.js <source-directory> <project-id>"
    );
    console.log("");
    console.log(
      "Example: node cli/deploy-demo.js ./my-website abc123-def456-ghi789"
    );
    process.exit(1);
  }

  if (!(await fs.pathExists(sourceDir))) {
    console.error(`❌ Error: Source directory "${sourceDir}" does not exist`);
    process.exit(1);
  }

  try {
    console.log("🔐 Getting authentication token...");
    const token = await getAdminToken();

    console.log("📦 Creating deployment package...");
    const zipPath = path.join(
      process.cwd(),
      `demo-${projectId}-${Date.now()}.zip`
    );
    await createZip(sourceDir, zipPath);

    console.log("🚀 Uploading to demo server...");
    const formData = new FormData();
    formData.append("file", fs.createReadStream(zipPath));
    formData.append("projectId", projectId);

    const response = await fetch(`${DEMO_SERVER_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    // Clean up zip file
    await fs.remove(zipPath);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }

    const result = await response.json();

    console.log("✅ Demo deployed successfully!");
    console.log(`🌐 Demo URL: ${DEMO_SERVER_URL}/${projectId}`);
    console.log(`📊 Upload size: ${(result.size / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

deployDemo();
