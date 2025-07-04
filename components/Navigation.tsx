"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { authService, User as UserType } from "@/lib/auth";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      console.log("Navigation - Current user loaded:", currentUser);
      setUser(currentUser);
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setShowUserMenu(false);
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/portfolio", label: "Demo" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center py-2">
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-bold text-primary-600">
                Jigsaw<span className="text-secondary-500">Techie</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}

            {/* Authentication-aware navigation */}
            {!isLoading && (
              <>
                {user ? (
                  <>
                    {/* Dashboard Link */}
                    <Link
                      href={
                        user?.role === "admin"
                          ? "/admin"
                          : user?.id
                            ? `/dashboard/${user.id}`
                            : "/login"
                      }
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      onClick={() => {
                        console.log("Dashboard clicked - User:", user);
                        console.log("User role:", user?.role);
                        console.log("User ID:", user?.id);
                        console.log(
                          "Target URL:",
                          user?.role === "admin"
                            ? "/admin"
                            : user?.id
                              ? `/dashboard/${user.id}`
                              : "/login"
                        );
                      }}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>

                    {/* User Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        <User className="w-4 h-4" />
                        <span>{user.name}</span>
                      </button>

                      {/* User Dropdown */}
                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                          <div className="px-4 py-2 text-sm text-gray-500 border-b">
                            {user.email}
                          </div>
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Login/Register for guests */}
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      href="/quote"
                      className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                    >
                      Get Quote
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobile Authentication Navigation */}
                {!isLoading && (
                  <>
                    {user ? (
                      <>
                        {/* Dashboard Link */}
                        <Link
                          href={
                            user?.role === "admin"
                              ? "/admin"
                              : user?.id
                                ? `/dashboard/${user.id}`
                                : "/login"
                          }
                          className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                          onClick={() => {
                            console.log(
                              "Mobile Dashboard clicked - User:",
                              user
                            );
                            console.log("Mobile User role:", user?.role);
                            console.log("Mobile User ID:", user?.id);
                            console.log(
                              "Mobile Target URL:",
                              user?.role === "admin"
                                ? "/admin"
                                : user?.id
                                  ? `/dashboard/${user.id}`
                                  : "/login"
                            );
                            setIsOpen(false);
                          }}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>

                        {/* User Info */}
                        <div className="px-3 py-2 text-sm text-gray-500 border-t border-gray-200 mt-2">
                          <div className="font-medium">
                            {user?.name || "User"}
                          </div>
                          <div className="text-xs">
                            {user?.email || "No email"}
                          </div>
                        </div>

                        {/* Logout */}
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          className="flex items-center space-x-2 w-full text-left text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Login */}
                        <Link
                          href="/login"
                          className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 border-t border-gray-200 mt-2"
                          onClick={() => setIsOpen(false)}
                        >
                          Login
                        </Link>

                        {/* Get Quote */}
                        <Link
                          href="/quote"
                          className="bg-primary-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700 transition-colors duration-200 mt-2"
                          onClick={() => setIsOpen(false)}
                        >
                          Get Quote
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;
