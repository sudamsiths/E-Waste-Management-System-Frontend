import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Settings, Home, User, Clock, FileText, Camera, Trash2 } from 'lucide-react';
import Header from '../../common/Header';

interface FormData {
  fullName: string;
  contactNo: string;
  username: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
}

interface UserData {
  userId?: number;
  fullName: string;
  contactNo: string;
  username: string;
  email: string;
  address: string;
  role?: string;
}

function ClientAccountSetting() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    contactNo: '',
    username: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [originalData, setOriginalData] = useState<FormData>({
    fullName: '',
    contactNo: '',
    username: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('Profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentUsername, setCurrentUsername] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loadingProfileData, setLoadingProfileData] = useState(true);

  // Get logged-in user data from localStorage
  useEffect(() => {
    const username = localStorage.getItem('username');
    
    if (username) {
      setCurrentUsername(username);
      fetchUserData(username);
    } else {
      // Redirect to login if no user is logged in
      setMessage({ type: 'error', text: 'Please log in to access your profile' });
      // In a real app, you would redirect to login page
      // window.location.href = '/login';
    }
  }, []);

  // Fetch user data from backend
  const fetchUserData = async (username: string) => {
    try {
      setLoadingProfileData(true);
      console.log("Fetching data for username:", username);
      
      const response = await fetch(`http://localhost:8081/users/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      console.log("API Response status:", response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const userData: UserData = await response.json();
      console.log("Retrieved user data:", userData);
      
      const formattedData = {
        fullName: userData.fullName || '',
        contactNo: userData.contactNo || '',
        username: userData.username || '',
        email: userData.email || '',
        address: userData.address || '',
        password: '',
        confirmPassword: ''
      };
      
      console.log("Formatted user data:", formattedData);
      setFormData(formattedData);
      setOriginalData(formattedData);
      setMessage({ type: '', text: '' }); // Clear any previous errors
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error 
          ? `Failed to load profile: ${error.message}` 
          : 'Network error while loading user data'
      });
    } finally {
      setLoadingProfileData(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setMessage({ type: 'error', text: 'Full name is required' });
      return false;
    }
    
    if (!formData.contactNo.trim()) {
      setMessage({ type: 'error', text: 'Contact number is required' });
      return false;
    }
    
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      return false;
    }
    
    if (!formData.address.trim()) {
      setMessage({ type: 'error', text: 'Address is required' });
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return false;
    }
    
    // Validate password if provided
    if (formData.password) {
      if (formData.password.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match' });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      // Prepare data for API - only send fields that have values
      const updateData: any = {
        username: currentUsername, // Always include current username
        fullName: formData.fullName.trim(),
        contactNo: formData.contactNo.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
      };

      // Only include password if it's provided and not empty
      if (formData.password && formData.password.trim()) {
        updateData.password = formData.password;
      }

      console.log("Updating user:", currentUsername);
      console.log("Update data:", JSON.stringify(updateData, null, 2));
      
      // Use the simplified update endpoint
      const response = await fetch(`http://localhost:8081/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log("Update response status:", response.status);

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Update error response:", errorResponse);
        throw new Error(errorResponse.message || `Update failed: ${response.status}`);
      }

      const updatedUser = await response.json();
      console.log("Update successful:", updatedUser);
      
      // Update localStorage if username changed (though username is readonly in this form)
      if (updatedUser.username && updatedUser.username !== currentUsername) {
        localStorage.setItem('username', updatedUser.username);
        setCurrentUsername(updatedUser.username);
      }
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Update original data (excluding password fields)
      const updatedFormData = {
        ...formData,
        password: '',
        confirmPassword: ''
      };
      setOriginalData(updatedFormData);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error 
          ? `Update failed: ${error.message}` 
          : 'Network error while updating profile. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setMessage({ type: '', text: '' });
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    // Refresh user data when profile is clicked
    if (!showProfileMenu && currentUsername) {
      fetchUserData(currentUsername);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: Home, color: 'text-gray-600' },
    { name: 'Profile', icon: User, color: 'text-green-600', active: true },
    { name: 'Requests', icon: FileText, color: 'text-gray-600' },
    { name: 'History', icon: Clock, color: 'text-gray-600' },
    { name: 'Settings', icon: Settings, color: 'text-gray-600' }
  ];

  if (loadingProfileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen">
          <div className="p-4 md:p-6">
            {/* Logo Section */}
            <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-green-50 border border-green-100">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div>
                <div className="text-gray-800 text-sm font-bold">EcoWaste</div>
                <div className="text-gray-500 text-xs">Management</div>
              </div>
            </div>

            {/* User Profile Section (Visible in sidebar) */}
            <div className="mb-6 p-4 border border-gray-100 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer"
                  onClick={handleProfileClick}
                >
                  {getInitials(formData.fullName || 'User')}
                </div>
                <div>
                  <div className="text-gray-800 text-sm font-medium">{formData.fullName || 'User'}</div>
                  <div className="text-gray-500 text-xs">{formData.email || 'No email'}</div>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.name === activeNavItem;
                
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveNavItem(item.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-green-50 text-green-700 border-l-4 border-green-500 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 md:px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-gray-900 text-xl md:text-3xl font-bold">Profile Settings</h1>
              <p className="text-gray-600 text-sm md:text-base mt-2">
                Update your personal information and account settings
              </p>
            </div>
            
            {/* Profile Menu (Visible in header for mobile) */}
            <div className="relative md:hidden">
              <button 
                onClick={handleProfileClick}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-600 hover:bg-green-100"
              >
                <User className="w-5 h-5" />
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                        {getInitials(formData.fullName || 'User')}
                      </div>
                      <div>
                        <div className="text-gray-800 font-medium">{formData.fullName}</div>
                        <div className="text-gray-500 text-sm">{formData.email}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                      View Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                      Account Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-8">
            {/* Message Alert */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-8 max-w-5xl">
              <form onSubmit={handleSubmit}>
                {/* Profile Photo Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-8 border-b border-gray-100">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-lg font-bold mb-4 shadow-lg">
                      {getInitials(formData.fullName || 'User')}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                        Change
                      </button>
                      <button 
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Picture</h3>
                    <p className="text-gray-600 text-sm">
                      Update your profile picture to help others recognize you
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  {/* Name and Contact Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        name="contactNo"
                       value={formData.contactNo}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter your contact number"
                      />
                    </div>
                  </div>

                  {/* Username and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Username *
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500 bg-gray-50 cursor-not-allowed"
                        placeholder="Username (cannot be changed)"
                      />
                      <p className="text-xs text-gray-500 mt-1">Username cannot be modified</p>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Address Section */}
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-colors"
                      placeholder="Enter your full address"
                    />
                  </div>

                  {/* Change Password Section */}
                  <div className="pt-6 border-t border-gray-100">
                    <div className="mb-6">
                      <h3 className="text-gray-900 text-lg font-semibold mb-2">Change Password</h3>
                      <p className="text-gray-600 text-sm">Leave blank to keep your current password</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-8 border-t border-gray-100 mt-8">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientAccountSetting;