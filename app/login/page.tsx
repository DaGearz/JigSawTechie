"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";
import AdminLogin from "@/components/AdminLogin";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        // User is already logged in, redirect to appropriate dashboard
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push(`/dashboard/${user.id}`);
        }
        return;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push(`/dashboard/${user.id}`);
        }
      }
    } catch (error) {
      console.error("Post-login redirect failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back to Home Link */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full mx-4">
          {/* Temporarily Down Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Site Temporarily Private
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    We're implementing major dashboard improvements. The site is
                    temporarily restricted to authenticated users only.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
              <p className="text-gray-600">
                Access your dashboard - Admin or Client
              </p>
            </div>

            {/* Use the existing AdminLogin component but without admin requirement */}
            <AdminLogin
              onLoginSuccess={handleLoginSuccess}
              requireAdmin={false}
              embedded={true}
            />

            {/* Additional Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign up here
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Need a website?{" "}
                <Link
                  href="/quote"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Get a quote
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
