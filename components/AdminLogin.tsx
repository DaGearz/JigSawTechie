"use client";

import { useState } from "react";
import { authService } from "@/lib/auth";
import { Lock, Mail, Eye, EyeOff, User } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  requireAdmin?: boolean; // Optional prop to control admin requirement
  embedded?: boolean; // Optional prop to control if it's embedded in another component
  defaultMode?: "login" | "signup"; // Optional prop to set initial mode
}

export default function AdminLogin({
  onLoginSuccess,
  requireAdmin = true,
  embedded = false,
  defaultMode = "login",
}: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // For admin routes, force login mode only - no signup allowed
  const [mode, setMode] = useState(requireAdmin ? "login" : defaultMode);
  const [name, setName] = useState(""); // Add missing name state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (mode === "signup") {
        // Create account
        if (requireAdmin) {
          await authService.createAdminUser(email, password, name);
        } else {
          await authService.createClientUser(email, password, name);
        }
        setError(
          "Account created successfully! Please check your email to confirm your account before signing in."
        );
        setMode("login");
      } else {
        // Sign in
        await authService.signIn(email, password);

        // Check if user is admin (only if required)
        if (requireAdmin) {
          const isAdmin = await authService.isAdmin();
          if (!isAdmin) {
            await authService.signOut();
            setError("Access denied. Admin privileges required.");
            return;
          }
        }

        onLoginSuccess();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("Email not confirmed")) {
        setError(
          "Please check your email and click the confirmation link before signing in."
        );
      } else if (errorMessage.includes("Invalid login credentials")) {
        setError("Invalid email or password.");
      } else if (errorMessage.includes("User already registered")) {
        setError(
          "An account with this email already exists. Please sign in instead."
        );
      } else {
        setError(errorMessage || "Authentication failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <>
      {!embedded && (
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === "login"
              ? requireAdmin
                ? "Admin Login"
                : "Sign In"
              : requireAdmin
              ? "Create Admin Account"
              : "Create Account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === "login"
              ? requireAdmin
                ? "Access the Jigsaw Techie admin dashboard"
                : "Access your Jigsaw Techie dashboard"
              : requireAdmin
              ? "Set up your admin account for the first time"
              : "Create your Jigsaw Techie account"}
          </p>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div
            className={`border px-4 py-3 rounded-md text-sm ${
              error.includes("created") || error.includes("check your email")
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
              ? "Sign in"
              : requireAdmin
              ? "Create Admin Account"
              : "Create Account"}
          </button>
        </div>
        {/* Only show signup toggle for non-admin routes */}
        {!requireAdmin && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
              }}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {mode === "login"
                ? "Need to create an account?"
                : "Already have an account? Sign in"}
            </button>
          </div>
        )}
      </form>

      {!embedded && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            {requireAdmin
              ? "Jigsaw Techie Admin Portal • Secure Access Required"
              : "Jigsaw Techie Client Portal • Secure Access"}
          </p>
        </div>
      )}
    </>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">{formContent}</div>
    </div>
  );
}
