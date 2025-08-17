import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EcoTechNavbar = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const [username, setUsername] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    // Clear all authentication data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("rememberMe");
    
    // Navigate to login page
    navigate('/login');
  };

  const navigationItems = [
    { name: 'Home', href: '#home' },
    { name: 'Branches', href: '#branches' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'Shop', href: '#shop' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3" style={{height: '90px'}}>
      <div className="max-w-full mx-auto h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo Section - Far Left */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="flex-shrink-0">
              <img
                src="src/assets/img/E_waste_management_system_logo_2-removebg-preview.png"
                alt="EcoTech Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            <button 
              style={{cursor:'pointer'}} 
              className="flex items-center focus:outline-none"
            >
              <span className="text-2xl font-bold text-green-500">Eco</span>
              <span className="text-2xl font-bold text-red-500">Tech</span>
            </button>
          </div>

          {/* Navigation Menu - Center */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setActiveItem(item.name)}
                className={`relative px-4 py-2 text-base font-medium transition-colors duration-200 ${
                  activeItem === item.name
                    ? 'text-gray-800'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {item.name}
                {activeItem === item.name && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-full"></div>
                )}
              </a>
            ))}
          </div>

          {/* Right Side Actions - Far Right */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            
            {/* Search Icon */}
            <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Shopping Cart with Badge */}
            <button className="hidden sm:block relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a1 1 0 001 1h8a1 1 0 001-1v-6m-9 0h10" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                1
              </span>
            </button>

            {/* Request Pickup Button */}
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline">Request Pickup</span>
              <span className="sm:hidden">Pickup</span>
            </button>

            {/* User Welcome and Logout */}
            {username && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Welcome</div>
                  <div className="text-sm font-semibold text-gray-800">{username}</div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-1 text-sm font-medium transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Log out</span>
                </button>
              </div>
            )}

            {/* Mobile User Info */}
            {username && (
              <div className="md:hidden flex items-center space-x-2">
                <span className="text-xs text-gray-600">{username}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                >
                  Out
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
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
  
      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden bg-white border-t border-gray-200`}>
        <div className="px-6 py-4">
          
          {/* Mobile Navigation Links */}
          <div className="flex flex-col space-y-3 mb-6">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => {
                  setActiveItem(item.name);
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-3 text-base font-medium transition-colors duration-200 rounded-lg ${
                  activeItem === item.name
                    ? 'text-green-600 bg-green-50 border-l-4 border-green-500'
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Actions */}
          <div className="space-y-4">
            
            {/* Mobile Search and Cart */}
            <div className="flex items-center justify-around py-4 bg-gray-50 rounded-lg">
              <button className="flex flex-col items-center p-3 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-gray-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-xs text-gray-600">Search</span>
              </button>
              
              <button className="flex flex-col items-center p-3 hover:bg-gray-100 rounded-lg transition-colors relative">
                <svg className="w-6 h-6 text-gray-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a1 1 0 001 1h8a1 1 0 001-1v-6m-9 0h10" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">1</span>
                <span className="text-xs text-gray-600">Cart</span>
              </button>
            </div>

            {/* Mobile User Info */}
            {username && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Welcome</div>
                    <div className="text-base font-semibold text-gray-800">{username}</div>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EcoTechNavbar;