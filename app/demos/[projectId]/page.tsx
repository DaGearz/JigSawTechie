import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface DemoPageProps {
  params: {
    projectId: string;
  };
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { projectId } = params;

  try {
    // Verify project exists
    const { data: project } = await supabase
      .from('projects')
      .select('id, name, demo_url')
      .eq('id', projectId)
      .single();

    if (!project) {
      notFound();
    }

    // Check if demo files exist
    const demoDir = join(process.cwd(), 'public', 'demos', projectId);
    const indexPath = join(demoDir, 'index.html');

    if (!existsSync(indexPath)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Demo Not Available</h1>
            <p className="text-gray-600 mb-4">
              The demo for project "{project.name}" has not been deployed yet.
            </p>
            <p className="text-sm text-gray-500">Project ID: {projectId}</p>
          </div>
        </div>
      );
    }

    // Log the access
    await supabase
      .from('demo_access_logs')
      .insert({
        project_id: projectId,
        access_type: 'view',
        ip_address: '127.0.0.1', // In production, get from headers
        user_agent: 'Demo Viewer',
        created_at: new Date().toISOString()
      });

    // Read and serve the demo HTML
    const htmlContent = await readFile(indexPath, 'utf-8');

    // Inject base tag to ensure relative paths work correctly
    const modifiedHtml = htmlContent.replace(
      '<head>',
      `<head>\n    <base href="/demos/${projectId}/">`
    );

    return (
      <div className="w-full h-screen">
        <div 
          className="w-full h-full"
          dangerouslySetInnerHTML={{ __html: modifiedHtml }}
        />
      </div>
    );

  } catch (error) {
    console.error('Demo viewing error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Demo</h1>
          <p className="text-gray-600 mb-4">
            There was an error loading the demo. Please try again later.
          </p>
          <p className="text-sm text-gray-500">Project ID: {projectId}</p>
        </div>
      </div>
    );
  }
}

// Generate metadata for the demo page
export async function generateMetadata({ params }: DemoPageProps) {
  const { projectId } = params;

  const { data: project } = await supabase
    .from('projects')
    .select('name')
    .eq('id', projectId)
    .single();

  return {
    title: project ? `Demo: ${project.name}` : 'Project Demo',
    description: 'Interactive demo preview',
  };
}
