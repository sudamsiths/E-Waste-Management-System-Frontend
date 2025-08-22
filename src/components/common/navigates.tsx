import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClientInterface02 from "../Clientinterface/ClientInterface02";
import ClientInterface01 from "../Clientinterface/Clientinterface01";
import Clientinterface03 from "../Clientinterface/Clientinterface03";
import Clientinterface04 from "../Clientinterface/Clientinterface04";
import Footer from "./Footer";
import Header from "./Header";

function navigate() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const navigate = useNavigate();

  // Check authentication and role on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const username = localStorage.getItem("username");

    // Check if user is authenticated
    if (!token) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    // Strict role check for customer dashboard
    if (role !== "CUSTOMER") {
      // Show unauthorized message and redirect after delay
      setUnauthorized(true);

      // Store the unauthorized attempt reason
      localStorage.setItem(
        "authError",
        "You don't have permission to access the Customer Dashboard. Redirecting to appropriate dashboard..."
      );

      setTimeout(() => {
        // Redirect admin users to admin dashboard
        if (role === "ADMIN") {
          navigate("/AdminDashboard");
        } else {
          // If role is undefined or something else, go to login
          navigate("/login");
        }
      }, 3000);
      return;
    }

    // Set username for welcome message
    setUsername(username);

    // Check if user just logged in
    const justLoggedIn = localStorage.getItem("loginSuccess") === "true";

    if (justLoggedIn) {
      setShowWelcome(true);

      // Clear login success flag after showing welcome
      localStorage.removeItem("loginSuccess");

      // Auto-hide welcome message after 5 seconds
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [navigate]);

  // Close welcome message
  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  // Show unauthorized message if needed
  if (unauthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="flex items-center justify-center text-red-600 mb-6">
            <svg
              className="h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-center text-2xl font-bold text-gray-800 mb-2">
            Unauthorized Access
          </h1>
          <p className="text-center text-gray-600 mb-6">
            You don't have permission to access the Customer Dashboard.
            Redirecting you to the Admin Dashboard.
          </p>
          <div className="flex justify-center">
            <div className="inline-block h-2 w-32 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full bg-red-500 animate-progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      {/* Welcome message on successful login */}
      {showWelcome && (
        <div className="fixed top-20 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg max-w-md animate-slide-in-right flex items-start">
          <div className="flex-1">
            <p className="font-bold">Welcome {username}!</p>
            <p className="text-sm">
              You've successfully logged in to the E-Waste Management System.
            </p>
          </div>
          <button
            onClick={handleCloseWelcome}
            className="ml-4 text-green-500 hover:text-green-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="flex-grow w-full">
        <ClientInterface01 />

        {/* Remove gaps between these components by using negative margin or removing padding */}
        <div className="bg-white w-full overflow-hidden">
          <ClientInterface02 />
          <Clientinterface03 />
          <Clientinterface04 />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default navigate;
