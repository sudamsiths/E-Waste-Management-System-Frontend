import React, { useState } from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Clientinterface03 from "../Clientinterface03";
import Clientinterface04 from "../Clientinterface04";

const ClientService: React.FC = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);

  // Function to handle request button click
  const handleRequestClick = () => {
    setShowRequestForm(true);
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission with backend API
    alert(
      "Your request has been submitted successfully! Our agent will contact you soon."
    );
    setShowRequestForm(false);
  };

  // Function to handle form cancellation
  const handleCancel = () => {
    setShowRequestForm(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-20" style={{ marginTop: "-7px"}}>
        {/* Hero Section */}
        <div className="relative w-full bg-[#D1FFAF]">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center">
              {/* Left side - Image */}
              <div className="w-full md:w-1/2 mb-8 md:mb-0">
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  {/* <div className="bg-green-600/20 absolute inset-0 z-0"></div> */}
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src="src/assets/img/image-removebg-preview.png"
                      alt="E-waste collection"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>

              {/* Right side - Content */}
              <div className="w-full md:w-1/2 md:pl-12">
                <h2 className="text-green-600 font-semibold mb-2">
                  OUR SERVICES
                </h2>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
                  Agent Collect Your E-Waste
                </h1>

                <p className="text-gray-700 mb-8 text-lg">
                  Our professional agents will collect your electronic waste
                  directly from your location. We ensure safe, secure, and
                  environmentally responsible disposal of all e-waste items.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-base text-gray-700">
                        Scheduled pickups at your convenience
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-base text-gray-700">
                        Certified e-waste handling & disposal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-base text-gray-700">
                        Eco-friendly processing & recycling
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleRequestClick}
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-300"
                >
                  Send a Request
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Request Form Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Request E-Waste Pickup
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="items"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    E-Waste Items
                  </label>
                  <textarea
                    id="items"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Describe the e-waste items you want to dispose of"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Clientinterface03 />
      <Clientinterface04 />

      <Footer />
    </div>
  );
};

export default ClientService;
