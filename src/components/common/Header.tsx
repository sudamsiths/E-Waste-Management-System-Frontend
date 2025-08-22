import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const EcoTechNavbar = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const [username, setUsername] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
    
    // Set active item based on current path
    if (location.pathname === '/Navigate') {
      setActiveItem('Home');
    } else if (location.pathname === '/services') {
      setActiveItem('Services');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    // Clear all authentication data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("rememberMe");
    
    // Set logout success message to display on login page
    localStorage.setItem("logoutSuccess", "true");
    
    // Navigate to login page
    navigate('/login');
  };

  // Get user initials for avatar placeholder
  const getUserInitials = () => {
    if (!username) return "U";
    return username.charAt(0).toUpperCase();
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigationClick = (item: string, href: string) => {
    setActiveItem(item);
    
    // Handle route navigation based on item name
    switch (item) {
      case 'Home':
        navigate('/Navigate');
        setIsMobileMenuOpen(false);
        return;
      case 'Services':
        navigate('/services');
        setIsMobileMenuOpen(false);
        return;
      default:
        // Handle other navigation items with anchor links
        if (href.startsWith('#')) {
          // If we're not on the home page and it's an anchor link, go to home first
          if (location.pathname !== '/Navigate') {
            navigate('/Navigate');
          }
          // For anchor links on the same page, just close the mobile menu
          setIsMobileMenuOpen(false);
        }
    }
  };

  const navigationItems = [
    { name: 'Home', href: '/Navigate' },
    { name: 'Branches', href: '#branches' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'Shop', href: '#shop' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-3 sm:px-6 py-2 sm:py-3 fixed w-full z-50" style={{height: 'auto', minHeight: '70px', maxHeight: '90px'}}>
      <div className="max-w-full mx-auto h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo Section - Far Left (Responsive) */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="flex-shrink-0">
              <img
                src="src/assets/img/E_waste_management_system_logo_2-removebg-preview.png"
                alt="EcoTech Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
            <button 
              onClick={() => handleNavigationClick('Home', '/Navigate')}
              style={{cursor:'pointer'}} 
              className="flex items-center focus:outline-none"
            >
              <span className="text-xl sm:text-2xl font-bold text-green-500">Eco</span>
              <span className="text-xl sm:text-2xl font-bold text-red-500">Tech</span>
            </button>
          </div>

          {/* Navigation Menu - Center (Hidden on mobile) */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8 flex-1 justify-center">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigationClick(item.name, item.href)}
                className={`relative px-2 py-2 text-sm xl:text-base font-medium transition-colors duration-200 ${
                  activeItem === item.name
                    ? 'text-gray-800'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {item.name}
                {activeItem === item.name && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Right Side Actions - Far Right */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-4 flex-shrink-0">
            
            {/* Search Icon (Hidden on small screens) */}
            <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Request Pickup Button (Responsive) */}
            <button className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors duration-200 text-xs sm:text-sm font-medium touch-manipulation" style={{cursor:'pointer'}}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline">Request Pickup</span>
              <span className="sm:hidden">Pickup</span>
            </button>

            {/* Welcome message (Hidden on smaller screens) */}
            {username && (
              <div className="hidden md:block text-right mr-1 sm:mr-3">
                <div className="text-xs sm:text-sm text-gray-600 truncate max-w-[120px] xl:max-w-none">Welcome</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-800 truncate max-w-[120px] xl:max-w-none">{username}</div>
              </div>
            )}

            {/* Profile Icon Dropdown - Right aligned with improved mobile support */}
            <div className="profile-dropdown relative">
              <button 
                className="flex items-center justify-center p-1 hover:bg-gray-100 rounded-full transition-colors duration-200 touch-manipulation min-w-[44px] min-h-[44px]"
                onClick={toggleProfileDropdown}
                aria-expanded={showProfileDropdown}
                aria-label="User profile menu"
              >
                {/* User profile image or initials */}
                {localStorage.getItem("userProfileImage") ? (
                  <img 
                    src={localStorage.getItem("userProfileImage") || ""} 
                    alt={username || "User"}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-green-500"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                    {getUserInitials()}
                  </div>
                )}
              </button>
              
              {/* Profile Dropdown Menu - Mobile optimized */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{username}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200">
                    Your Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200">
                    Settings
                  </Link>
                  <Link to="/tickets" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200">
                    Your Tickets
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100 active:bg-gray-200"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button - Improved touch target */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              <svg 
                className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${
                  isMobileMenuOpen ? 'rotate-90' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
  
      {/* Mobile Menu - Improved animation and spacing */}
      <div 
        className={`lg:hidden fixed left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{top: isMobileMenuOpen ? '70px' : '-100%', maxHeight: isMobileMenuOpen ? 'calc(100vh - 70px)' : '0', overflowY: 'auto'}}
      >
        <div className="px-4 py-4">
          
          {/* Mobile Navigation Links - Improved touch targets */}
          <div className="flex flex-col space-y-2 mb-6">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigationClick(item.name, item.href)}
                className={`px-4 py-3 text-base font-medium transition-colors duration-200 rounded-lg min-h-[44px] flex items-center ${
                  activeItem === item.name
                    ? 'text-green-600 bg-green-50 border-l-4 border-green-500'
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Mobile Actions - Better spacing and touch targets */}
          <div className="space-y-4">
            
            {/* Mobile Search and Profile */}
            <div className="flex items-center justify-around py-4 bg-gray-50 rounded-lg">
              <button className="flex flex-col items-center p-3 hover:bg-gray-100 rounded-lg transition-colors min-w-[70px] min-h-[70px]">
                <svg className="w-6 h-6 text-gray-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-xs text-gray-600">Search</span>
              </button>
              
              <Link to="/profile" className="flex flex-col items-center p-3 hover:bg-gray-100 rounded-lg transition-colors min-w-[70px] min-h-[70px]">
                {localStorage.getItem("userProfileImage") ? (
                  <img 
                    src={localStorage.getItem("userProfileImage") || ""} 
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover mb-1 border-2 border-green-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold mb-1">
                    {getUserInitials()}
                  </div>
                )}
                <span className="text-xs text-gray-600">Profile</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="flex flex-col items-center p-3 hover:bg-gray-100 rounded-lg transition-colors min-w-[70px] min-h-[70px]"
              >
                <svg className="w-6 h-6 text-red-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-xs text-red-500">Sign Out</span>
              </button>
            </div>

            {/* User Info Card */}
            {username && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Welcome</div>
                    <div className="text-base font-semibold text-gray-800 truncate max-w-[200px]">{username}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Spacer for fixed header */}
      {isMobileMenuOpen && <div className="lg:hidden h-screen w-full bg-black bg-opacity-50 fixed inset-0 z-30" onClick={() => setIsMobileMenuOpen(false)}></div>}
    </nav>
  );
};

export default EcoTechNavbar;