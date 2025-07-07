'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { demoService } from '@/lib/demo-manager';
import { DemoProject } from '@/lib/types/demo';
import { User } from '@supabase/supabase-js';

export default function DemoPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [demo, setDemo] = useState<DemoProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAuthAndAccess();
  }, [slug]);

  const checkAuthAndAccess = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        // Redirect to login with return URL
        router.push(`/login?redirect=/demo/${slug}`);
        return;
      }
      
      setUser(user);
      
      // Get demo information
      const demoData = await demoService.getDemoBySlug(slug);
      
      if (!demoData) {
        setError('Demo not found');
        setLoading(false);
        return;
      }
      
      setDemo(demoData);
      
      // Check if user has access to this demo
      const canAccess = await demoService.canUserAccessDemo(user.id, slug);
      
      if (!canAccess) {
        setError('You do not have permission to access this demo');
        setLoading(false);
        return;
      }
      
      setHasAccess(true);
      
      // Log the access
      await demoService.logDemoAccess(
        demoData.id,
        user.id,
        // Get IP and user agent from headers if available
        undefined, // IP address would need to be passed from server
        navigator.userAgent
      );
      
      setLoading(false);
      
    } catch (err) {
      console.error('Error checking demo access:', err);
      setError('An error occurred while loading the demo');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading Demo...</h2>
          <p className="text-gray-600">Verifying access permissions</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess || !demo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Demo not available</h2>
        </div>
      </div>
    );
  }

  // Demo is ready - show the iframe or redirect to demo files
  return (
    <div className="min-h-screen bg-white">
      {/* Demo Header */}
      <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src="/logo-white.png" alt="JigsawTechie" className="h-6" />
          <span className="text-sm">Demo: {demo.demo_name}</span>
          <span className={`px-2 py-1 rounded text-xs ${
            demo.status === 'ready' ? 'bg-green-600' : 
            demo.status === 'building' ? 'bg-yellow-600' : 'bg-red-600'
          }`}>
            {demo.status}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-300">
            {user?.email}
          </span>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Demo Content */}
      {demo.status === 'ready' ? (
        <DemoFrame demoSlug={slug} demoName={demo.demo_name} />
      ) : (
        <DemoStatusMessage demo={demo} />
      )}
    </div>
  );
}

// Component to display demo in iframe
function DemoFrame({ demoSlug, demoName }: { demoSlug: string; demoName: string }) {
  const [iframeError, setIframeError] = useState(false);
  
  const demoUrl = `/demos/${demoSlug}/`;
  
  if (iframeError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Demo Loading Error</h3>
          <p className="text-gray-600 mb-4">The demo files may not be ready yet.</p>
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Demo in New Tab
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <iframe
      src={demoUrl}
      title={demoName}
      className="w-full h-screen border-0"
      onError={() => setIframeError(true)}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
  );
}

// Component to show demo status when not ready
function DemoStatusMessage({ demo }: { demo: DemoProject }) {
  const getStatusMessage = () => {
    switch (demo.status) {
      case 'building':
        return {
          title: 'Demo is Building',
          message: 'Your demo is currently being prepared. This usually takes a few minutes.',
          color: 'blue'
        };
      case 'preparing':
        return {
          title: 'Demo is Preparing',
          message: 'Files are being uploaded and processed for your demo.',
          color: 'yellow'
        };
      case 'error':
        return {
          title: 'Demo Build Error',
          message: 'There was an issue building your demo. Please contact support.',
          color: 'red'
        };
      default:
        return {
          title: 'Demo Status Unknown',
          message: 'Please contact support for assistance.',
          color: 'gray'
        };
    }
  };
  
  const status = getStatusMessage();
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className={`bg-${status.color}-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
          {status.color === 'blue' && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          )}
          {status.color === 'yellow' && (
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {status.color === 'red' && (
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{status.title}</h2>
        <p className="text-gray-600 mb-6">{status.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Status
        </button>
      </div>
    </div>
  );
}
