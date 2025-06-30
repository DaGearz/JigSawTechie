"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";
import AdminLogin from "@/components/AdminLogin";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function Register() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Redirect based on role
          if (currentUser.role === "admin") {
            router.push("/admin");
          } else {
            router.push(`/dashboard/${currentUser.id}`);
          }
          return;
        }
      } catch (error) {
        console.log("No authenticated user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleRegistrationSuccess = () => {
    // After successful registration, redirect to login
    router.push("/login?message=registration-success");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back to Home */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Registration Form */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>
              <p className="text-gray-600">
                Create your Jigsaw Techie account
              </p>
            </div>

            {/* Use the existing AdminLogin component in signup mode */}
            <AdminLogin
              onLoginSuccess={handleRegistrationSuccess}
              requireAdmin={false}
              embedded={true}
              defaultMode="signup"
            />

            {/* Additional Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in here
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
