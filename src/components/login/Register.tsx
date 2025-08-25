import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface FormData {
  fullName: string;
  contactNumber: string; 
  username: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface ValidationErrors {
  fullName?: string;
  contactNumber?: string; 
  username?: string;
  email?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

type UserType = 'customer' | 'admin';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('customer');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    contactNumber: '', // Initialize as empty string
    username: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    // Validate contact number for format like 0722151182
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else {
      // Remove all non-digit characters
      const digits = formData.contactNumber.replace(/\D/g, '');
      
      // Check if it follows the local number format (e.g. 0722151182 - 10 digits starting with 0)
      if (digits.length !== 10) {
        newErrors.contactNumber = 'Phone number should be 10 digits (e.g., 0722151182)';
      }
      
      // Check if it starts with 0
      if (digits.length > 0 && !digits.startsWith('0')) {
        newErrors.contactNumber = 'Phone number should start with 0';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Update the contact input handler to better format the numbers
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Allow only digits for the phone format 0722151182
    value = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    
    setFormData(prev => ({ ...prev, contactNumber: value }));
    
    // Clear any existing error when the user is typing
    if (errors.contactNumber) {
      setErrors(prev => ({ ...prev, contactNumber: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      // Just keep the digits, no need for additional formatting
      const phoneNumber = formData.contactNumber.replace(/\D/g, '');
      
      // Ensure it's in the correct format
      if (phoneNumber.length !== 10 || !phoneNumber.startsWith('0')) {
        setErrors(prev => ({ 
          ...prev, 
          contactNumber: 'Phone number should be 10 digits and start with 0 (e.g., 0722151182)' 
        }));
        setIsSubmitting(false);
        return;
      }
      
      // Prepare user data with the properly formatted phone number
      const userData = {
        fullName: formData.fullName,
        contactNo: phoneNumber, // Changed from contactNumber to contactNo to match backend entity field name
        username: formData.username,
        email: formData.email,
        address: formData.address,
        password: formData.password,
        role: userType.toUpperCase()
      };

      console.log('Sending registration data:', userData);
      console.log('Contact number type:', typeof userData.contactNo);
      
      // Make sure the API request doesn't convert the data
      const response = await axios.post('http://localhost:8081/users/register', userData, {
        headers: {
          'Content-Type': 'application/json'
        },
        transformRequest: [(data) => {
          // Prevent automatic transformation by Axios
          return JSON.stringify(data);
        }]
      });
      
      console.log('Registration successful:', response.data);
      
      // Store registration success in localStorage for display on login page
      localStorage.setItem("registrationSuccess", "true");
      localStorage.setItem("registeredUsername", formData.username);
      
      // Navigate to login page or show success message
      navigate('/login', { state: { registrationSuccess: true } });
      
    } catch (error) {
      console.error('Registration failed:', error);
      
      // Handle API errors
      if (axios.isAxiosError(error) && error.response) {
        // API returned an error response
        const errorMessage = error.response.data?.message || 'Registration failed. Please try again.';
        setApiError(errorMessage);
      } else {
        // Network error or other issues
        setApiError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen relative overflow-hidden font-inter bg-gradient-to-br from-gray-900 via-green-900 to-gray-800">
      {/* Background decorative elements - simplified for mobile */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-green-400 opacity-10 right-4 sm:right-32 bottom-32"></div>
        <div className="absolute w-24 h-24 sm:w-40 sm:h-40 rounded-full bg-green-500 opacity-15 left-4 sm:left-32 top-20"></div>
        <div className="absolute w-40 h-40 sm:w-60 sm:h-60 rounded-full bg-green-600 opacity-20 right-8 sm:right-40 top-20"></div>
        <div className="absolute w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-green-400 opacity-12 left-2 sm:left-10 bottom-24"></div>
        <div className="absolute w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-green-400 opacity-60 left-16 sm:left-72 top-40 sm:top-72"></div>
        <div className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-green-500 opacity-80 right-20 sm:right-80 top-60 sm:top-96"></div>
        <div className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-yellow-300 opacity-70 left-8 sm:left-36 bottom-40 sm:bottom-96"></div>
      </div>


        {/* Right Panel */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <div className="w-full max-w-4xl bg-gradient-to-b from-green-900/50 to-green-800/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-12">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-green-400 text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Create Account</h2>

              {/* User Type Toggle */}
              <div className="flex items-center justify-center space-x-0 mb-6 sm:mb-8">
                <button
                  type="button"
                  onClick={() => setUserType('customer')}
                  className={`px-4 sm:px-8 py-3 sm:py-3 rounded-l-full text-sm font-bold transition-all min-h-[44px] ${
                    userType === 'customer'
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-gray-900'
                      : 'border-2 border-green-700 text-green-700 hover:bg-green-700/10'
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('admin')}
                  className={`px-4 sm:px-8 py-3 sm:py-3 rounded-r-full text-sm font-bold transition-all min-h-[44px] ${
                    userType === 'admin'
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-gray-900'
                      : 'border-2 border-green-700 text-green-700 hover:bg-green-700/10'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Display API error if any */}
            {apiError && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-400 text-sm">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Name and Contact Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="form-group">
                  <label className="block text-green-400 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange('fullName')}
                      placeholder="Enter your full name"
                      className="w-full h-12 sm:h-12 text-base bg-gradient-to-b from-green-800/40 to-green-900/40 border-2 border-green-700 rounded-xl px-4 pr-12 text-yellow-200 placeholder-yellow-200/70 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-green-400">
                        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M2 13c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                  </div>
                  {errors.fullName && (
                    <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="block text-green-400 text-sm font-medium mb-2">
                    Contact Number * 
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.contactNumber}
                      onChange={handleContactChange}
                      placeholder="Enter your number (e.g., 0722151182)"
                      className="w-full h-12 sm:h-12 text-base bg-gradient-to-b from-green-800/40 to-green-900/40 border-2 border-green-700 rounded-xl px-4 pr-12 text-yellow-200 placeholder-yellow-200/70 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-green-400">
                        <path d="M3 2c-.5 0-1 .5-1 1v10c0 .5.5 1 1 1h10c.5 0 1-.5 1-1V3c0-.5-.5-1-1-1H3zm5 2c1.5 0 3 1.5 3 3s-1.5 3-3 3-3-1.5-3-3 1.5-3 3-3z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                  </div>
                  {errors.contactNumber && (
                    <p className="text-red-400 text-xs mt-1">{errors.contactNumber}</p>
                  )}
                  <p className="text-yellow-200/70 text-xs mt-1">Format: 10 digits starting with 0 (e.g., 0722151182)</p>
                </div>
              </div>

              {/* Username and username Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="form-group">
                  <label className="block text-green-400 text-sm font-medium mb-2">
                    Username *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange('username')}
                      placeholder="Choose username"
                      className="w-full h-12 sm:h-12 text-base bg-gradient-to-b from-green-800/40 to-green-900/40 border-2 border-green-700 rounded-xl px-4 pr-12 text-yellow-200 placeholder-yellow-200/70 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-green-400">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="8" cy="6" r="2" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M5 12c0-1.5 1-2 3-2s3 .5 3 2" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                  </div>
                  {errors.username && (
                    <p className="text-red-400 text-xs mt-1">{errors.username}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="block text-green-400 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      placeholder="Enter email address"
                      className="w-full h-12 sm:h-12 text-base bg-gradient-to-b from-green-800/40 to-green-900/40 border-2 border-green-700 rounded-xl px-4 pr-12 text-yellow-200 placeholder-yellow-200/70 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-green-400">
                        <rect x="2" y="4" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M2 4l6 4 6-4" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="form-group">
                <label className="block text-green-400 text-sm font-medium mb-2">
                  Address *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange('address')}
                    placeholder="Enter your complete address"
                    className="w-full h-12 sm:h-12 text-base bg-gradient-to-b from-green-800/40 to-green-900/40 border-2 border-green-700 rounded-xl px-4 pr-12 text-yellow-200 placeholder-yellow-200/70 focus:outline-none focus:border-green-400 transition-colors"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-green-400">
                      <path d="M8 2c2 0 4 2 4 4 0 3-4 7-4 7s-4-4-4-7c0-2 2-4 4-4z" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="8" cy="6" r="1" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                </div>
                {errors.address && (
                  <p className="text-red-400 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="form-group">
                  <label className="block text-green-400 text-sm font-medium mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      placeholder="Create password"
                      className="w-full h-12 sm:h-12 text-base bg-gradient-to-b from-green-800/40 to-green-900/40 border-2 border-green-700 rounded-xl px-4 pr-12 text-yellow-200 placeholder-yellow-200/70 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300 min-w-[44px] min-h-[44px] flex items-center justify-center -m-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="4" y="6" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M6 6V4c0-1 1-2 2-2s2 1 2 2v2" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="block text-green-400 text-sm font-medium mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      placeholder="Confirm password"
                      className="w-full h-12 sm:h-12 text-base bg-gradient-to-b from-green-800/40 to-green-900/40 border-2 border-green-700 rounded-xl px-4 pr-12 text-yellow-200 placeholder-yellow-200/70 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300 min-w-[44px] min-h-[44px] flex items-center justify-center -m-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        {formData.confirmPassword && formData.password === formData.confirmPassword ? (
                          <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        ) : (
                          <>
                            <rect x="4" y="6" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M6 6V4c0-1 1-2 2-2s2 1 2 2v2" stroke="currentColor" strokeWidth="1.5"/>
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-3">
                <label className="flex items-start cursor-pointer min-h-[44px] py-2">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange('agreeToTerms')}
                    className="sr-only"
                  />
                  <div className="relative mt-1">
                    <div className={`w-5 h-5 border-2 rounded ${formData.agreeToTerms ? 'bg-green-400 border-green-400' : 'border-green-400'}`}>
                      {formData.agreeToTerms && (
                        <svg className="w-4 h-4 text-gray-900 absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M6 10l-3-3 1-1 2 2 6-6 1 1-7 7z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-yellow-200 text-sm leading-relaxed">
                    I agree to the{' '}
                    <a href="#" className="text-green-400 underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-green-400 underline">Privacy Policy</a>
                  </span>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-400 text-xs mt-1">{errors.agreeToTerms}</p>
              )}

              {/* Password Requirements */}
              <div className="text-xs text-green-700 bg-green-900/20 rounded-lg p-3">
                <p className="font-medium mb-2">Password Requirements:</p>
                <ul className="space-y-1 text-yellow-200/80">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number and special character</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 sm:h-14 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base sm:text-lg rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 min-h-[48px]"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                      <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Create {userType === 'admin' ? 'Admin' : 'Customer'} Account</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center space-x-4 my-6">
                <div className="flex-1 h-px bg-green-600"></div>
                <span className="text-green-700 text-sm">or</span>
                <div className="flex-1 h-px bg-green-600"></div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 h-12 sm:h-12 border-2 border-green-700 rounded-xl text-yellow-200 hover:bg-green-700/10 transition-colors min-h-[48px]"
                >
                  <img src="src/assets/img/google logo.png" style={{ width: '80px', height: '45px', padding: '5px', marginLeft: '-15px',marginRight: '-15px' }} alt="" />
                  <span className="text-sm" style={{marginRight: '5px'}}>Continue with Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 h-12 sm:h-12 border-2 border-green-700 rounded-xl text-yellow-200 hover:bg-green-700/10 transition-colors min-h-[48px]"
                >
                  <img src="src/assets/img/microsoft logo.png" style={{ width: '50px', height: '45px', padding: '5px', marginLeft: '-15px',marginRight: '-5px' }} alt="" />
                  <span className="text-sm" style={{marginRight: '5px'}}>Continue with Microsoft</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center space-x-2 h-12 sm:h-12 border-2 border-green-700 rounded-xl text-yellow-200 hover:bg-green-700/10 transition-colors min-h-[48px]"
                >
                  <img src="src/assets/img/github logo.png" style={{ width: '100px', height: '45px', padding: '5px', marginLeft: '-25px',marginRight: '-10px' }} alt="" />
                  <span className="text-sm" style={{marginRight: '5px'}}>Continue with GitHub</span>
                </button>
              </div>

        

               <div className=" text-center mt-6 pt-4 border-t border-green-700/30">
                <p className="text-yellow-200 text-sm">
                  Already have an account?
                </p>
                <a href="/login" className="text-green-400 text-sm font-bold underline mt-1 flex items-center justify-center">
                  Sign In
                </a>
              </div>

              {/* Mobile Sign In Link */}
              <div className="lg:hidden text-center mt-6 pt-4 border-t border-green-700/30">
                <p className="text-yellow-200 text-sm">
                  Already have an account?
                </p>
                <a href="/login" className="text-green-400 text-sm font-bold underline mt-1 inline-block min-h-[44px] flex items-center justify-center">
                  Sign In
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};


export default Register;
