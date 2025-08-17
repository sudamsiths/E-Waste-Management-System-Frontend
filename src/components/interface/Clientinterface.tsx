import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../common/Header";

function UserInterface() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;
  const navigate = useNavigate();

  const images = [
    "src/assets/img/recycle-all-it-s-worth-poster.jpg",
    "src/assets/img/composition-different-trashed-objects.jpg",
    "src/assets/img/recycle-icon-compact-fluorescent-light-bulb-against-white-background.jpg",
    "src/assets/img/many-kinds-garbage-were-scattered-dark-floor.jpg"
  ];

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <>
      <Header />
      <div id="animation-carousel" className="relative w-full h-screen">
        {/* Carousel wrapper */}
        <div className="relative h-full overflow-hidden">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={image} 
                className="absolute block w-full h-full object-cover top-0 left-0" 
                alt={`Carousel item ${index + 1}`} 
              />
            </div>
          ))}
        </div>
        
        {/* Slider controls */}
        <button 
          type="button" 
          className="absolute top-1/2 left-4 z-30 flex items-center justify-center -translate-y-1/2 cursor-pointer group focus:outline-none" 
          onClick={prevSlide}
        >
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-5 h-5 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        
        <button 
          type="button" 
          className="absolute top-1/2 right-4 z-30 flex items-center justify-center -translate-y-1/2 cursor-pointer group focus:outline-none" 
          onClick={nextSlide}
        >
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-5 h-5 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>

        {/* Carousel indicators */}
        <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default UserInterface;