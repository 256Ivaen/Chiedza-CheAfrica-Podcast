"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Save,
  Eye,
  EyeOff,
  Mail,
  Shield,
  CheckCircle,
} from "lucide-react";
import { get, post } from "../../utils/service";
import { toast } from "sonner";

const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  // Fetch profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await get("auth/profile");

      if (response?.success && response?.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.current_password) {
      errors.current_password = "Current password is required";
    }

    if (!passwordForm.new_password) {
      errors.new_password = "New password is required";
    } else if (passwordForm.new_password.length < 6) {
      errors.new_password = "Password must be at least 6 characters";
    }

    if (!passwordForm.confirm_password) {
      errors.confirm_password = "Please confirm your password";
    } else if (passwordForm.new_password !== passwordForm.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await post("auth/change-password", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });

      if (response.success) {
        toast.success(response.message || "Password changed successfully!");
        setPasswordForm({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        setPasswordErrors({});
      } else {
        toast.error(response.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-base font-bold text-gray-900 mb-0.5">Settings</h1>
            <p className="text-xs text-gray-500">
              Manage your account settings and preferences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info - Left Side */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Profile Information
                </h2>

                {loading ? (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <SkeletonBox className="w-20 h-20 rounded-full mb-3" />
                      <SkeletonBox className="h-4 w-32 mb-2" />
                      <SkeletonBox className="h-3 w-24" />
                    </div>
                  </div>
                ) : profile ? (
                  <div className="space-y-4">
                    {/* Avatar */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                        <span className="text-2xl font-bold text-primary">
                          {profile.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {profile.email}
                      </h3>
                      <p className="text-xs text-gray-500 capitalize">
                        {profile.role?.replace("_", " ")}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-0.5">Email</p>
                          <p className="text-xs font-medium text-gray-900 break-all">
                            {profile.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Shield className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-0.5">Role</p>
                          <p className="text-xs font-medium text-gray-900 capitalize">
                            {profile.role?.replace("_", " ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-0.5">Account Created</p>
                          <p className="text-xs font-medium text-gray-900">
                            {new Date(profile.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xs text-gray-500">Failed to load profile</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Change Password - Right Side */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Change Password
                </h2>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Current Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="current_password"
                        value={passwordForm.current_password}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        className={`w-full px-3 py-2 pr-10 border ${
                          passwordErrors.current_password
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.current_password && (
                      <p className="text-xs text-red-500 mt-1">
                        {passwordErrors.current_password}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="new_password"
                        value={passwordForm.new_password}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                        className={`w-full px-3 py-2 pr-10 border ${
                          passwordErrors.new_password
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.new_password && (
                      <p className="text-xs text-red-500 mt-1">
                        {passwordErrors.new_password}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        value={passwordForm.confirm_password}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                        className={`w-full px-3 py-2 pr-10 border ${
                          passwordErrors.confirm_password
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-xs`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirm_password && (
                      <p className="text-xs text-red-500 mt-1">
                        {passwordErrors.confirm_password}
                      </p>
                    )}
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-xs font-semibold text-blue-900 mb-2">
                      Password Requirements
                    </h4>
                    <ul className="space-y-1">
                      <li className="text-xs text-blue-700 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        At least 6 characters long
                      </li>
                      <li className="text-xs text-blue-700 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        Use a strong, unique password
                      </li>
                      <li className="text-xs text-blue-700 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        Don't reuse passwords from other accounts
                      </li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full sm:w-auto px-4 py-2 bg-primary text-secondary rounded-sm hover:bg-primary/90 disabled:opacity-50 transition-colors text-xs font-medium uppercase inline-flex items-center justify-center gap-2"
                    >
                      {passwordLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full"
                          />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>

              {/* Additional Settings Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-6 mt-6"
              >
                <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <SettingsIcon className="w-4 h-4 text-primary" />
                  Account Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-xs font-medium text-gray-900 mb-1">
                        Account Status
                      </p>
                      <p className="text-xs text-gray-500">
                        Your account is active and in good standing
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                      Active
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-xs font-medium text-gray-900 mb-1">
                        Last Login
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start justify-between py-3">
                    <div>
                      <p className="text-xs font-medium text-gray-900 mb-1">
                        Account ID
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {profile?.id || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}