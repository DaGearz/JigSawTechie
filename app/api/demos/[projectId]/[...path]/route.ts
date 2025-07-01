import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { lookup } from 'mime-types';

interface RouteParams {
  params: {
    projectId: string;
    path: string[];
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId, path } = params;
    
    // Construct the file path
    const filePath = path.join('/');
    const fullPath = join(process.cwd(), 'public', 'demos', projectId, filePath);

    // Security check: ensure the path is within the demo directory
    const demoDir = join(process.cwd(), 'public', 'demos', projectId);
    if (!fullPath.startsWith(demoDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    // Check if file exists
    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read the file
    const fileContent = await readFile(fullPath);
    
    // Determine content type
    const mimeType = lookup(fullPath) || 'application/octet-stream';
    
    // Return the file with appropriate headers
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Demo file serving error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
