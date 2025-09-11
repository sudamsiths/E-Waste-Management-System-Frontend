import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

interface ValidationErrors {
  username?: string;
  password?: string;
}

interface LoginResponse {
  token?: string;
  role?: string;
  username?: string;
  userId?: string;
  message?: string;
}

const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState<"customer" | "admin">("customer");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);
  const [registeredUsername, setRegisteredUsername] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [logoutSuccess, setLogoutSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Check for existing success information - registration and login
    const regSuccess = localStorage.getItem("registrationSuccess");
    const regUsername = localStorage.getItem("registeredUsername");
    const loginSuccessFlag = localStorage.getItem("loginSuccess");
    
    // Set registration success if present
    if (regSuccess === "true") {
      setRegistrationSuccess(true);
      setRegisteredUsername(regUsername);
      
      // Pre-fill the username field
      if (regUsername) {
        setUsername(regUsername);
      }
      
      // Clear the registration success flags after 5 seconds
      setTimeout(() => {
        setRegistrationSuccess(false);
        localStorage.removeItem("registrationSuccess");
        localStorage.removeItem("registeredUsername");
      }, 5000);
    }
    
    // Show login success message if coming back to login page
    if (loginSuccessFlag === "true") {
      setLoginSuccess(true);
      
      // Clear the login success flag after 5 seconds
      setTimeout(() => {
        setLoginSuccess(false);
        localStorage.removeItem("loginSuccess");
      }, 5000);
    }
    
    // Check for logout success message
    const logoutSuccessFlag = localStorage.getItem("logoutSuccess");
    if (logoutSuccessFlag === "true") {
      setLogoutSuccess(true);
      
      // Immediately remove the flag to prevent it from showing on refresh
      localStorage.removeItem("logoutSuccess");
      
      // Clear the logout success state after showing message
      setTimeout(() => {
        setLogoutSuccess(false);
      }, 5000);
    }
    
    // Also check location state for registration success
    const locationState = location.state as { registrationSuccess?: boolean };
    if (locationState?.registrationSuccess) {
      setRegistrationSuccess(true);
    }
  }, [location]);

  const validateUsername = (username: string): string | undefined => {
    if (!username) {
      return "Username is required";
    }
    if (!usernameRegex.test(username)) {
      return "Please enter a valid username";
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError) newErrors.username = usernameError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (errors.username) {
      const usernameError = validateUsername(value);
      setErrors((prev) => ({ ...prev, username: usernameError }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (errors.password) {
      const passwordError = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: passwordError }));
    }
  };

  // Enhanced role validation function
  const validateUserRole = (backendRole: string, selectedRole: string): { isValid: boolean; errorMessage?: string } => {
    const normalizedBackendRole = backendRole.toUpperCase();
    const normalizedSelectedRole = selectedRole.toUpperCase();

    if (normalizedBackendRole !== normalizedSelectedRole) {
      if (normalizedSelectedRole === "ADMIN" && normalizedBackendRole === "CUSTOMER") {
        return {
          isValid: false,
          errorMessage: "Access Denied: You cannot login to the Admin Dashboard. Your account is registered as a Customer. Please select 'Customer' and try again."
        };
      } else if (normalizedSelectedRole === "CUSTOMER" && normalizedBackendRole === "ADMIN") {
        return {
          isValid: false,
          errorMessage: "Access Denied: You cannot login to the Customer Dashboard. Your account is registered as an Admin. Please select 'Admin' and try again."
        };
      } else {
        return {
          isValid: false,
          errorMessage: `Role mismatch: You've selected "${selectedRole}" but your account is registered as "${backendRole.toLowerCase()}". Please select the correct role and try again.`
        };
      }
    }

    return { isValid: true };
  };

  // Enhanced navigation function
  const navigateBasedOnRole = (userRole: string) => {
    const normalizedRole = userRole.toUpperCase();
    
    console.log(`Navigating user with role: ${normalizedRole}`);
    
    if (normalizedRole === "ADMIN") {
      console.log("Admin role detected, navigating to AdminDashboard");
      navigate("/AdminDashboard", { 
        state: { 
          loginSuccess: true, 
          userRole: normalizedRole,
          username: username 
        } 
      });
    } else if (normalizedRole === "CUSTOMER") {
      console.log("Customer role detected, navigating to client dashboard");
      navigate("/Navigate", { 
        state: { 
          loginSuccess: true, 
          userRole: normalizedRole,
          username: username 
        } 
      });
    } else {
      console.error("Unknown role detected:", normalizedRole);
      setLoginError("Unknown user role. Please contact support.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const loginData = {
        username,
        password,
        role: userType.toUpperCase(), // Send the selected role to backend
      };

      console.log("Attempting login with data:", { ...loginData, password: "***" });

      const response = await axios.post<LoginResponse | string>(
        "http://localhost:8081/users/login",
        JSON.stringify(loginData),
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000, // 10s
        }
      );

      console.log("Login response received:", response.data);

      let token: string;
      let userRole: string;
      let userName: string;
      let userId: string;

      // Handle different response formats
      if (typeof response.data === 'string') {
        token = response.data;
        userRole = userType.toUpperCase();
        userName = username;
        userId = '';
      } else {
        token = response.data.token || '';
        userRole = response.data.role || userType.toUpperCase();
        userName = response.data.username || username;
        userId = response.data.userId || '';
      }

      console.log("Extracted user data:", { userRole, userName, userId });

      // Enhanced role validation
      const roleValidation = validateUserRole(userRole, userType);
      
      if (!roleValidation.isValid) {
        setLoginError(roleValidation.errorMessage || "Role validation failed");
        setIsSubmitting(false);
        return;
      }

      // Verify token exists
      if (!token) {
        throw new Error("No authentication token received from server");
      }

      // Store auth data in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", userRole.toUpperCase());
      localStorage.setItem("username", userName);
      localStorage.setItem("userId", userId);

      // Handle remember me option
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("lastLoginUsername", username);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("lastLoginUsername");
      }

      // Set login success flag for when user returns to login page
      localStorage.setItem("loginSuccess", "true");
      
      // Show success message briefly before redirecting
      setLoginSuccess(true);
      
      console.log("Login successful, preparing navigation...");
      
      // Add a slight delay before navigation to show the success message
      setTimeout(() => {
        navigateBasedOnRole(userRole);
      }, 800);

    } catch (error) {
      console.error("Login failed:", error);

      if (axios.isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        const serverData = error.response.data;
        const errorMessage =
          typeof serverData === "string"
            ? serverData
            : serverData?.message || (typeof serverData === "object" ? JSON.stringify(serverData) : "Login failed");

        console.log("Error response:", { statusCode, errorMessage });

        if (statusCode === 401) {
          setLoginError("Invalid credentials. Please check your username and password.");
        } else if (statusCode === 403) {
          setLoginError("Access denied. You don't have permission to access this resource.");
        } else if (statusCode === 400) {
          if (errorMessage.toLowerCase().includes("role")) {
            // Handle role mismatch from backend
            if (userType === "admin") {
              setLoginError("Access Denied: You cannot login to the Admin Dashboard. Your account is registered as a Customer. Please select 'Customer' and try again.");
            } else {
              setLoginError("Access Denied: You cannot login to the Customer Dashboard. Your account is registered as an Admin. Please select 'Admin' and try again.");
            }
          } else {
            setLoginError(errorMessage);
          }
        } else if (statusCode === 422) {
          setLoginError("Invalid input data. Please check your credentials and try again.");
        } else {
          setLoginError(errorMessage);
        }
      } else if ((error as Error).message?.includes("timeout")) {
        setLoginError("Request timed out. The server may be busy — try again later.");
      } else {
        setLoginError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear error when user changes role selection
  const handleRoleChange = (newRole: "customer" | "admin") => {
    setUserType(newRole);
    if (loginError && loginError.toLowerCase().includes("role")) {
      setLoginError(null);
    }
  };

  return (
    <div className="login-container font-['Inter']">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      />

      <div className="decorative-elements">
        <div className="circle-1">
          <svg width="160" height="183" viewBox="0 0 160 183" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.15" d="M80 182.689C124.183 182.689 160 141.937 160 91.6667C160 41.3965 124.183 0.644447 80 0.644447C35.8172 0.644447 0 41.3965 0 91.6667C0 141.937 35.8172 182.689 80 182.689Z" fill="#4A8B7A"/>
          </svg>
        </div>
        <div className="circle-2">
          <svg width="240" height="274" viewBox="0 0 240 274" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.2" d="M120 273.089C186.274 273.089 240 211.961 240 136.556C240 61.1503 186.274 0.0222168 120 0.0222168C53.7258 0.0222168 0 61.1503 0 136.556C0 211.961 53.7258 273.089 120 273.089Z" fill="#2D6B5F"/>
          </svg>
        </div>
        <div className="circle-3">
          <svg width="200" height="229" viewBox="0 0 200 229" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.1" d="M100 228.222C155.228 228.222 200 177.282 200 114.444C200 51.6067 155.228 0.666687 100 0.666687C44.7715 0.666687 0 51.6067 0 114.444C0 177.282 44.7715 228.222 100 228.222Z" fill="#0CF6A0"/>
          </svg>
        </div>
        <div className="circle-4">
          <svg width="120" height="137" viewBox="0 0 120 137" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.12" d="M60 136.6C93.1371 136.6 120 106.036 120 68.3333C120 30.6307 93.1371 0.0666504 60 0.0666504C26.8629 0.0666504 0 30.6307 0 68.3333C0 106.036 26.8629 136.6 60 136.6Z" fill="#5A9D85"/>
          </svg>
        </div>
        <div className="dot-1"><svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.6" d="M3 7.74668C4.65685 7.74668 6 6.21848 6 4.33335C6 2.44821 4.65685 0.920013 3 0.920013C1.34315 0.920013 0 2.44821 0 4.33335C0 6.21848 1.34315 7.74668 3 7.74668Z" fill="#67AE6E"/></svg></div>
        <div className="dot-2"><svg width="4" height="6" viewBox="0 0 4 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.8" d="M2 5.38668C3.10457 5.38668 4 4.36788 4 3.11113C4 1.85437 3.10457 0.835571 2 0.835571C0.89543 0.835571 0 1.85437 0 3.11113C0 4.36788 0.89543 5.38668 2 5.38668Z" fill="#90C67C"/></svg></div>
        <div className="dot-3"><svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.7" d="M3 5.73332C4.38071 5.73332 5.5 4.45982 5.5 2.88888C5.5 1.31793 4.38071 0.0444336 3 0.0444336C1.61929 0.0444336 0.5 1.31793 0.5 2.88888C0.5 4.45982 1.61929 5.73332 3 5.73332Z" fill="#5A9D85"/></svg></div>
      </div>

      <div className={`branding-section`}>
        <div className="logo-container">
          <img src="src/assets/img/E_waste_Management_System_Logo-removebg-preview.png" alt="E-Waste Manager Logo"/>
        </div>
        <h1 className="brand-title">E-Waste Manager</h1>
        <p className="brand-subtitle">Sustainable Electronic Waste Management</p>
        <p className="brand-motto">"Empowering a Greener Tomorrow through Responsible E-Waste Disposal"</p>
        <div className="feature-list">
          <ul>
            <li>Real-Time Tracking System</li>
            <li>Efficient Pickup Scheduling</li>
            <li>Secure Data Management</li>
            <li>Environmental Impact Reports</li>
          </ul>
        </div>
        <p className="brand-description">Join us in making a difference by managing electronic waste responsibly and sustainably.</p>
      </div>

      <div className={`login-section`}>
        <div className={`login-card `}>
          {/* Registration success alert */}
          {registrationSuccess && (
            <div className="success-alert mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg flex items-center animate-bounce-in">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Registration successful! {registeredUsername ? `Welcome ${registeredUsername}, please login.` : 'Please login to continue.'}</span>
            </div>
          )}
          
          {/* Login success alert */}
          {loginSuccess && (
            <div className="success-alert mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-800 rounded-lg flex items-center animate-bounce-in">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Login successful! Redirecting to {userType === 'admin' ? 'Admin' : 'Customer'} dashboard...</span>
            </div>
          )}
          
          {/* Logout success alert */}
          {logoutSuccess && (
            <div className="success-alert mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-800 rounded-lg flex items-center animate-bounce-in">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>You've been successfully logged out.</span>
            </div>
          )}

          <h2 className="welcome-title">Welcome Back</h2>
          <p className="welcome-subtitle">Sign in to your account</p>

          {loginError && (
            <div className="error-alert mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                <path d="M8 1C4.13 1 1 4.13 1 8s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" fill="#ff6b6b" fillOpacity="0.2" stroke="#ff6b6b"/>
                <path d="M8 5v4M8 11h.01" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="ml-2 text-sm text-red-700">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {/* User Type Selection - Moved to top for better UX */}
            <div className="user-type-selection mb-4">
              <div className="user-type-label">Login as:</div>
              <div className="radio-group">
                <label className="radio-option">
                  <input 
                    type="radio" 
                    name="userType" 
                    value="customer" 
                    checked={userType === "customer"} 
                    onChange={(e) => handleRoleChange(e.target.value as "customer" | "admin")} 
                    className="radio-input"
                  />
                  <div className="radio-custom">
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10.5" cy="10.5" r="9.5" stroke="#90C67C" strokeWidth="2"/>
                      {userType === "customer" && <circle cx="10.5" cy="10.5" r="5" fill="#328E6E" />}
                    </svg>
                  </div>
                  <span>Customer</span>
                </label>
                <label className="radio-option">
                  <input 
                    type="radio" 
                    name="userType" 
                    value="admin" 
                    checked={userType === "admin"} 
                    onChange={(e) => handleRoleChange(e.target.value as "customer" | "admin")} 
                    className="radio-input"
                  />
                  <div className="radio-custom">
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10.5" cy="10.5" r="9.5" stroke="#90C67C" strokeWidth="2"/>
                      {userType === "admin" && <circle cx="10.5" cy="10.5" r="5" fill="#328E6E" />}
                    </svg>
                  </div>
                  <span>Admin</span>
                </label>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Username</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Enter your username"
                  className={`username-input ${errors.username ? "error" : ""}`}
                  aria-invalid={!!errors.username}
                  aria-describedby={errors.username ? "username-error" : undefined}
                />
                <div className="username-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2C6.34 2 5 3.34 5 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 8c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" fill="none" stroke={errors.username ? "#ff6b6b" : "#90C67C"} strokeWidth="1.5"/>
                  </svg>
                </div>
              </div>
              {errors.username && (
                <div className="error-message" id="username-error">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 1C4.13 1 1 4.13 1 8s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 13c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="#ff6b6b"/>
                    <path d="M8 4v4M8 10h.01" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {errors.username}
                </div>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  className={`password-input ${errors.password ? "error" : ""}`}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <div className="password-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke={errors.password ? "#ff6b6b" : "#90C67C"} strokeWidth="1.5"/>
                      <circle cx="8" cy="8" r="3" stroke={errors.password ? "#ff6b6b" : "#90C67C"} strokeWidth="1.5"/>
                      <path d="M1 1l14 14" stroke={errors.password ? "#ff6b6b" : "#90C67C"} strokeWidth="1.5"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke={errors.password ? "#ff6b6b" : "#90C67C"} strokeWidth="1.5"/>
                      <circle cx="8" cy="8" r="3" stroke={errors.password ? "#ff6b6b" : "#90C67C"} strokeWidth="1.5"/>
                    </svg>
                  )}
                </div>
              </div>
              {errors.password && (
                <div className="error-message" id="password-error">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 1C4.13 1 1 4.13 1 8s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 13c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="#ff6b6b"/>
                    <path d="M8 4v4M8 10h.01" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {errors.password}
                </div>
              )}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  className="checkbox-input"
                />
                <div className="checkbox-custom">
                  <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 1.55005H4C2.34315 1.55005 1 2.92528 1 4.62172V14.8606C1 16.557 2.34315 17.9323 4 17.9323H14C15.6569 17.9323 17 16.557 17 14.8606V4.62172C17 2.92528 15.6569 1.55005 14 1.55005Z" stroke="#90C67C" strokeWidth="2"/>
                    {rememberMe && <path d="M5 9.74116L8 12.8128L13 6.66949" stroke="#90C67C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
                  </svg>
                </div>
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              className={`sign-in-btn ${isSubmitting || loginSuccess ? "submitting" : ""} transition-all duration-300 hover:shadow-lg`} 
              disabled={isSubmitting || loginSuccess}
            >
              {isSubmitting ? (
                <div className="loading-spinner">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 2a8 8 0 0 1 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                       <animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="1s" repeatCount="indefinite"/>
                    </path>
                  </svg>
                  Signing In...
                </div>
              ) : loginSuccess ? (
                <div className="success-spinner">
                  <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Success! Redirecting to {userType === 'admin' ? 'Admin' : 'Customer'} Dashboard
                </div>
              ) : (
                `Sign In as ${userType === 'admin' ? 'Admin' : 'Customer'}`
              )}
            </button>

            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">or</span>
              <div className="divider-line"></div>
            </div>

            <div className="signup-link">
              Don't have an account?{" "}
              <Link to="/register" className="signup-text">Sign up</Link>
            </div>
          </form>

          {/* Role Information Card */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-0.5">
                <circle cx="10" cy="10" r="9" stroke="#4A8B7A" strokeWidth="2"/>
                <path d="M10 6v4M10 14h.01" stroke="#4A8B7A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div className="text-sm">
                <p className="font-medium text-gray-700 mb-1">Role Selection Guide:</p>
                <ul className="text-gray-600 space-y-1">
                  <li><strong>Customer:</strong> Schedule pickups, track waste, view reports</li>
                  <li><strong>Admin:</strong> Manage all operations, users, and system settings</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2">
                  Make sure to select the role that matches your account registration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;