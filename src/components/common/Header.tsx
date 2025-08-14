import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EcoTechNavbar = () => {
  const [activeItem, setActiveItem] = useState('Home');

  const navigationItems = [
    { name: 'Home', href: '#home' },
    { name: 'Branches', href: '#branches' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'Shop', href: '#shop' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3" style={{height: '90px'}}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          {/* Logo Image */}
          <div className="flex-shrink-0">
            <img
              src="src/assets/img/E_waste_management_system_logo_2-removebg-preview.png"
              alt="EcoTech Logo" style={{height: '64px'}}
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Brand Text */}
          <div className="flex items-center">
            <div className="text-4xl font-bold">
                <button style={{cursor:'pointer', color: 'green'}} className="flex items-center">
              <span className="text-green-500">Eco</span>
              <span className="text-red-500">Tech</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setActiveItem(item.name)}
              className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                activeItem === item.name
                  ? 'text-green-600'
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              {item.name}
              {activeItem === item.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 rounded-full"></div>
              )}
            </a>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Icon */}
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Shopping Cart with Badge */}
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a1 1 0 001 1h8a1 1 0 001-1v-6m-9 0h10" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
          </button>

          {/* Request Pickup Button */}
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors duration-200" style={{cursor:'pointer'}}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">Request Pickup</span>
          </button>

          {/* Phone Contact */}
          <div className="hidden lg:flex bg-green-500 text-white px-4 py-2 rounded-md items-center space-x-2" style={{cursor:'pointer', marginRight:'-25px'}}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div className="text-xs">
              <div className="text-green-100">Need assistance?</div>
              <div className="font-semibold">+94 72 215 1182</div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-md">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {/* Close max-w-7xl container */}
      </div>
  
        {/* Mobile Menu (Hidden by default) */}
        <div className="md:hidden mt-4 border-t border-gray-100 pt-4">
        <div className="flex flex-col space-y-2">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setActiveItem(item.name)}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                activeItem === item.name
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              } rounded-md`}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Mobile Phone Contact */}
        <div className="mt-4 p-3 bg-green-500 text-white rounded-md">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div className="text-sm">
              <div className="text-green-100">Need assistance?</div>
              <div className="font-semibold">+94 72 215 1182</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EcoTechNavbar;