import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    
    // Check if demo exists in database
    const { data: demo, error } = await supabase
      .from('demo_management')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (error || !demo) {
      return NextResponse.json({ error: 'Demo not found' }, { status: 404 });
    }

    if (demo.status !== 'active') {
      return NextResponse.json({ error: 'Demo is not active' }, { status: 403 });
    }

    // Check if password is required
    const password = request.nextUrl.searchParams.get('password');
    if (demo.password && demo.password !== password) {
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Demo Access Required</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px; }
            .form { background: #f5f5f5; padding: 20px; border-radius: 8px; }
            input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
            button { background: #007cba; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="form">
            <h2>🔒 Demo Access Required</h2>
            <p>This demo requires a password to access.</p>
            <form method="GET">
              <input type="password" name="password" placeholder="Enter demo password" required>
              <button type="submit">Access Demo</button>
            </form>
          </div>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Log the access
    await supabase
      .from('demo_access_logs')
      .insert({
        project_id: projectId,
        action: 'viewed',
        metadata: {
          user_agent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || 'unknown',
          timestamp: new Date().toISOString()
        }
      });

    // Increment access count
    await supabase
      .from('demo_management')
      .update({ 
        access_count: (demo.access_count || 0) + 1,
        last_accessed: new Date().toISOString()
      })
      .eq('project_id', projectId);

    // Serve the demo file
    const demoPath = join(process.cwd(), 'public', 'demos', projectId, 'index.html');
    
    if (!existsSync(demoPath)) {
      return NextResponse.json({ error: 'Demo files not found' }, { status: 404 });
    }

    const content = await readFile(demoPath, 'utf-8');
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('Demo serve error:', error);
    return NextResponse.json(
      { error: 'Failed to serve demo' },
      { status: 500 }
    );
  }
}
