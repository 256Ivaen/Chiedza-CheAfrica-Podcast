"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { Plus, User, LogOut, ChevronRight, Menu } from "lucide-react";

const MainLayout = ({
  children,
  activeSection = "dashboard",
  setActiveSection,
}) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const user = {
    email: localStorage.getItem("email") || "admin@example.com",
    role: localStorage.getItem("role") || "admin",
    userId: localStorage.getItem("userId") || "",
    initials: (localStorage.getItem("email") || "A")
      .charAt(0)
      .toUpperCase(),
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
      if (!e.target.closest(".mobile-menu-container")) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateBlog = () => {
    navigate("/blogs/create");
    setActiveSection("blogs-create");
    setShowMobileMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");

    setShowUserMenu(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        userRole={user.role}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isMobile={isMobile}
      />

      <div
        className={`transition-all duration-300 ${
          isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                </button>
              )}

              {!isMobile && !sidebarOpen && (
                <motion.button
                  onClick={() => toggleSidebar(true)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="hidden sm:inline">Expand Sidebar</span>
                </motion.button>
              )}
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={handleCreateBlog}
                  className="px-4 py-2 bg-primary text-secondary rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create Blog
                </button>
              </div>

              {isMobile && (
                <div className="relative mobile-menu-container">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Plus className="h-5 w-5 text-gray-600" />
                  </button>

                  <AnimatePresence>
                    {showMobileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                      >
                        <button
                          onClick={handleCreateBlog}
                          className="w-full flex items-center gap-2 px-4 py-3 text-xs text-left hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Create Blog
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-secondary">
                      {user.initials}
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-w-[90vw]"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-secondary" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-900 capitalize">
                              {user.role}
                            </p>
                            <p className="text-xs text-gray-600">
                              {user.email}
                            </p>
                            <p className="text-xs text-green-500 mt-1 flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Online
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="h-[calc(100vh-4rem)] flex flex-col">{children}</main>
      </div>

      {isMobile && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="relative">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-6 w-6 text-secondary" />
            </button>

            <AnimatePresence>
              {showMobileMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  className="absolute bottom-16 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl"
                >
                  <button
                    onClick={handleCreateBlog}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs text-left hover:bg-gray-50 transition-colors rounded-t-lg"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">Create Blog</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;