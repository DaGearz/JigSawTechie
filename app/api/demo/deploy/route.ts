// API route for demo deployment
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { demoManager } from '@/lib/demo-manager';
import { DemoUploadRequest, BuildType } from '@/lib/types/demo';

// POST /api/demo/deploy - Deploy a new demo
export async function POST(request: NextRequest) {
  try {
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if user is admin
    const { data: userData } = await supabase
      .from('auth.users')
      .select('email')
      .eq('id', user.id)
      .single();
    
    if (userData?.email !== 'todd@jigsawtechie.com') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { project_id, demo_name, build_type, local_path } = body;
    
    // Validate required fields
    if (!project_id || !demo_name || !build_type || !local_path) {
      return NextResponse.json(
        { error: 'Missing required fields: project_id, demo_name, build_type, local_path' },
        { status: 400 }
      );
    }
    
    // Validate build type
    const validBuildTypes: BuildType[] = ['static', 'nextjs', 'react', 'html'];
    if (!validBuildTypes.includes(build_type)) {
      return NextResponse.json(
        { error: 'Invalid build_type. Must be one of: static, nextjs, react, html' },
        { status: 400 }
      );
    }
    
    // Check if project exists
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, name, client_id')
      .eq('id', project_id)
      .single();
    
    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Check if demo already exists for this project
    const { data: existingDemo } = await supabase
      .from('demo_projects')
      .select('id')
      .eq('project_id', project_id)
      .single();
    
    if (existingDemo) {
      return NextResponse.json(
        { error: 'Demo already exists for this project. Delete the existing demo first.' },
        { status: 409 }
      );
    }
    
    // Create deployment request
    const deployRequest: DemoUploadRequest = {
      project_id,
      demo_name,
      build_type,
      local_path
    };
    
    // Deploy the demo
    const result = await demoManager.deployDemo(deployRequest);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Deployment failed' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Demo deployed successfully',
      demo_id: result.demo_id,
      demo_url: result.demo_url
    });
    
  } catch (error) {
    console.error('Demo deployment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/demo/deploy - Get deployment status (admin only)
export async function GET(request: NextRequest) {
  try {
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if user is admin
    const { data: userData } = await supabase
      .from('auth.users')
      .select('email')
      .eq('id', user.id)
      .single();
    
    if (userData?.email !== 'todd@jigsawtechie.com') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    // Get all demos with deployment status
    const { data: demos, error } = await supabase
      .from('demo_projects')
      .select(`
        id,
        demo_name,
        demo_slug,
        demo_url,
        status,
        build_type,
        file_size_mb,
        deployed_at,
        last_updated,
        created_at,
        project:projects(
          id,
          name,
          client_id,
          client:auth.users(id, email, raw_user_meta_data)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch demos' },
        { status: 500 }
      );
    }
    
    // Get deployment statistics
    const stats = {
      total_demos: demos?.length || 0,
      ready_demos: demos?.filter(d => d.status === 'ready').length || 0,
      building_demos: demos?.filter(d => d.status === 'building').length || 0,
      error_demos: demos?.filter(d => d.status === 'error').length || 0,
      total_file_size_mb: demos?.reduce((sum, d) => sum + (d.file_size_mb || 0), 0) || 0
    };
    
    return NextResponse.json({
      success: true,
      demos: demos || [],
      stats
    });
    
  } catch (error) {
    console.error('Demo status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
