import React, { useState, useEffect } from "react";
import ClientInterface02 from "../Clientinterface/ClientInterface02";
import ClientInterface01 from "../Clientinterface/Clientinterface01";
import Clientinterface03 from "../Clientinterface/Clientinterface03";
import Clientinterface04 from "../Clientinterface/Clientinterface04";
import Footer from "./Footer";
import Header from "./Header";
import AdminDashboard from "../Admininterface/AdminDashboard";

function navigate() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Show welcome message when user first arrives
  useEffect(() => {
    const username = localStorage.getItem("username");
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
  }, []);

  // Close welcome message
  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

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
