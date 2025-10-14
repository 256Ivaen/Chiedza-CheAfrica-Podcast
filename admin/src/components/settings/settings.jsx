"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { upload, post, get } from '../../utils/service';
import { toast } from 'sonner';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import {
  FiCheck as CheckIcon,
  FiX as XIcon,
  FiShield as ShieldIcon,
  FiMail as MailIcon,
  FiLoader as LoadingIcon,
  FiCamera as CameraIcon,
  FiCrop as CropIcon,
  FiImage as ImagePlusIcon,
  FiUserPlus as UserPlusIcon,
  FiUsers as UsersIcon,
  FiTrash2 as TrashIcon,
} from 'react-icons/fi';

// Utility
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Profile Image Crop Modal
const ProfileImageCropModal = ({ isOpen, onClose, imageSrc, onCropComplete }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: '%', width: 80 }, 1, width, height),
      width,
      height
    );
    setCrop(crop);
  };

  const getCroppedImg = async (image, crop) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = 400;
    canvas.height = 400;
    ctx.imageSmoothingQuality = 'high';

    const sourceWidth = crop.width * scaleX;
    const sourceHeight = crop.height * scaleY;
    const sourceX = crop.x * scaleX;
    const sourceY = crop.y * scaleY;

    ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 400, 400);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Canvas is empty');
            return;
          }
          const croppedImageUrl = URL.createObjectURL(blob);
          resolve({ blob, url: croppedImageUrl });
        },
        'image/jpeg',
        0.95
      );
    });
  };

  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current) {
      try {
        const { blob, url } = await getCroppedImg(imgRef.current, completedCrop);
        onCropComplete(url, blob);
        onClose();
      } catch (error) {
        console.error('Error cropping image:', error);
      }
    }
  };

  if (!isOpen) return null;

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-end">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-50 w-full bg-white rounded-t-xl max-h-[90vh] flex flex-col border-t border-gray-200">
          <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <CropIcon className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Crop Profile Picture</h3>
                  <p className="text-xs text-gray-600">Adjust to square format</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <XIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-white">
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                <ImagePlusIcon className="w-3 h-3" />
                <span>Output: 400 × 400 pixels</span>
              </div>
              <p className="text-xs text-gray-500">Drag corners to adjust crop area</p>
            </div>

            <div className="flex justify-center mb-4">
              <div className="max-w-full overflow-hidden rounded-lg border border-gray-300">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  className="max-w-full h-auto"
                >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    className="max-w-full h-auto block"
                    style={{ maxHeight: '300px' }}
                  />
                </ReactCrop>
              </div>
            </div>

            {completedCrop && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-xs text-green-700">
                  <CheckIcon className="w-3 h-3" />
                  <span>Ready to crop: {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)} → 400 × 400</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCropComplete}
                disabled={!completedCrop}
                className="flex-1 px-4 py-3 bg-primary text-secondary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <CheckIcon className="w-4 h-4" />
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <CropIcon className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Crop Profile Picture</h3>
              <p className="text-xs text-gray-600">Adjust your profile image to square format</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 bg-white overflow-auto max-h-[calc(90vh-140px)]">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <ImagePlusIcon className="w-4 h-4" />
              <span>Output Resolution: 400 × 400 pixels (Square Format)</span>
            </div>
            <p className="text-xs text-gray-500">
              Drag the corners to adjust the crop area. The final image will be optimized for profile display.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="max-w-full max-h-96 overflow-hidden rounded-lg border border-gray-300">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                className="max-w-full h-auto"
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  className="max-w-full h-auto block"
                  style={{ maxHeight: '400px' }}
                />
              </ReactCrop>
            </div>
          </div>

          {completedCrop && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-green-700">
                <CheckIcon className="w-4 h-4" />
                <span>
                  Crop area selected: {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)} 
                  → will be resized to 400 × 400
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Perfect for profile pictures and avatars</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCropComplete}
              disabled={!completedCrop}
              className="px-6 py-2 bg-primary text-secondary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium flex items-center gap-2 shadow-sm"
            >
              <CheckIcon className="w-4 h-4" />
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Invite User Modal
const InviteUserModal = ({ isOpen, onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setLoading(true);
    try {
      const response = await post('auth/register', { email, role });
      
      if (response.success) {
        toast.success(response.message || 'User invited successfully!');
        onInvite();
        setEmail('');
        setRole('admin');
        onClose();
      } else {
        toast.error(response.message || 'Failed to invite user');
      }
    } catch (error) {
      console.error('Error inviting user:', error);
      toast.error(error.response?.data?.message || 'Failed to invite user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <UserPlusIcon className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Invite New User</h3>
              <p className="text-xs text-gray-600">Send an invitation email</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              An invitation email with temporary credentials will be sent to the user.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2 bg-primary text-secondary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingIcon className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlusIcon className="w-4 h-4" />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Skeleton Loader
const SkeletonLoader = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

// Badge Component
const Badge = ({ className, children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    primary: "bg-primary/20 text-primary",
  };

  return (
    <div className={cn("inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap", variants[variant], className)}>
      {children}
    </div>
  );
};

// Main Settings Component
export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Profile image states
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [profileImageCropSrc, setProfileImageCropSrc] = useState(null);
  const [profileImageUploading, setProfileImageUploading] = useState(false);
  const profileImageInputRef = useRef(null);

  // Invite user modal
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    if (userId && email) {
      setUserData({
        userId,
        email,
        role,
        profile_pic: localStorage.getItem('profile_pic') || null
      });
    }
    setLoading(false);
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await get('auth/users');
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.role === 'super_admin' || userData?.role === 'admin') {
      fetchUsers();
    }
  }, [userData]);

  // Profile image handlers
  const handleProfileImageClick = () => {
    profileImageInputRef.current?.click();
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setProfileImageCropSrc(url);
      setShowProfileImageModal(true);
    }
  };

  const handleProfileImageCropComplete = async (croppedUrl, croppedBlob) => {
    setProfileImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', croppedBlob, 'profile.jpg');
      
      // You'll need to create an upload endpoint for profile pictures
      const uploadResponse = await upload('media/upload', formData);
      if (uploadResponse?.success) {
        const profilePicUrl = uploadResponse.data?.url;
        
        localStorage.setItem('profile_pic', profilePicUrl);
        
        setUserData(prev => ({
          ...prev,
          profile_pic: profilePicUrl
        }));
        
        toast.success('Profile picture updated successfully!');
      } else {
        toast.error('Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setProfileImageUploading(false);
    }
  };

  const closeProfileImageModal = () => {
    if (profileImageCropSrc) {
      URL.revokeObjectURL(profileImageCropSrc);
    }
    setProfileImageCropSrc(null);
    setShowProfileImageModal(false);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await post(`auth/users/${userId}/delete`);
      if (response.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-start gap-6 pb-8">
            <SkeletonLoader className="w-24 h-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <SkeletonLoader className="h-8 w-64" />
              <SkeletonLoader className="h-4 w-32" />
              <SkeletonLoader className="h-4 w-96" />
            </div>
          </div>
          <div className="space-y-6">
            <SkeletonLoader className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">No user data available. Please log in again.</p>
          </div>
        </div>
      </div>
    );
  }

  const currentUserRole = userData?.role;
  const canManageUsers = currentUserRole === 'super_admin' || currentUserRole === 'admin';

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex flex-wrap items-start gap-6 pb-8 border-b border-gray-200">
          <div className="relative">
            <div
              className="cursor-pointer relative group"
              onClick={handleProfileImageClick}
            >
              <img
                src={userData?.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.email || 'User')}&background=F9D769&color=734D20&size=96&rounded=true`}
                alt={userData?.email || 'User'}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <CameraIcon className="w-6 h-6 text-white" />
              </div>
              {profileImageUploading && (
                <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                </div>
              )}
            </div>
            <button
              onClick={handleProfileImageClick}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
            >
              <CameraIcon className="w-3 h-3 text-secondary" />
            </button>
            <input
              type="file"
              ref={profileImageInputRef}
              onChange={handleProfileImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {userData?.email || 'User'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="text-xs">
                User ID: {userData?.userId}
              </Badge>
              <Badge variant="primary" className="text-xs capitalize">
                {userData?.role?.replace('_', ' ') || 'Admin'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <ShieldIcon className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between py-4 px-5 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-4">
                <MailIcon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Email Address</p>
                  <p className="text-xs text-gray-600">{userData?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-600" />
                <Badge variant="success">Verified</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 px-5 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-4">
                <ShieldIcon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Account Role</p>
                  <p className="text-xs text-gray-600 capitalize">{userData?.role?.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        {canManageUsers && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <UsersIcon className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
              </div>
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <UserPlusIcon className="w-4 h-4" />
                Invite User
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {usersLoading ? (
                <div className="p-8 text-center">
                  <LoadingIcon className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                </div>
              ) : users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                                  <span className="text-sm font-medium text-secondary">
                                    {user.email?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.email}</div>
                                <div className="text-xs text-gray-500">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="primary" className="capitalize">
                              {user.role?.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {user.id !== userData.userId && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                disabled={currentUserRole !== 'super_admin' && user.role === 'super_admin'}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">No users found</p>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="mt-4 px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Invite Your First User
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modals */}
        <ProfileImageCropModal
          isOpen={showProfileImageModal}
          onClose={closeProfileImageModal}
          imageSrc={profileImageCropSrc}
          onCropComplete={handleProfileImageCropComplete}
        />

        <InviteUserModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onInvite={fetchUsers}
        />
      </div>
    </div>
  );
}