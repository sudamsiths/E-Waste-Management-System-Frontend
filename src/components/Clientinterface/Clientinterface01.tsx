import { useState, useEffect } from "react";
import Header from "../common/Header";
import { Link } from "react-router-dom"; // Fixed import from "react-router" to "react-router-dom"

function UserInterface() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;

  const images = [
    "src/assets/img/recycle-all-it-s-worth-poster.jpg",
    "src/assets/img/composition-different-trashed-objects.jpg",
    "src/assets/img/recycle-icon-compact-fluorescent-light-bulb-against-white-background.jpg",
    "src/assets/img/many-kinds-garbage-were-scattered-dark-floor.jpg"
  ];

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
              
              {/* First slide content */}
              {index === 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                  <div className="text-left text-white px-8 md:px-16 py-6 max-w-2xl mx-4 md:mx-10">
                    <span className="inline-block px-4 py-1 bg-green-600 rounded-full text-xs md:text-sm font-semibold mb-4 tracking-wider animate-fade-in">SUSTAINABLE FUTURE</span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight animate-fade-in-left">
                      Recycle Your <span className="text-green-400">Electronic</span> Waste
                    </h1>
                    <p className="text-lg md:text-xl mb-6 leading-relaxed text-gray-200 animate-fade-in-left animation-delay-300">
                      Join the movement towards a sustainable future. Every piece of e-waste recycled today 
                      is a step towards protecting our environment and conserving valuable resources.
                    </p>
                    <div className="flex flex-wrap gap-4 animate-fade-in-left animation-delay-600">
                      <Link to="/ClientRequest" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 flex items-center gap-2">
                        <span style={{cursor: 'pointer'}}>Schedule Pickup</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                      <Link to="/learn-more" className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300" style={{cursor: 'pointer'}}>
                        Learn More
                      </Link>
                    </div>
                    <div className="mt-8 flex items-center gap-4 animate-fade-in-left animation-delay-900">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-xs font-bold">
                            {i}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-300">Join <span className="text-white font-bold">5,000+</span> people who already recycled their e-waste</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Second slide content */}
              {index === 1 && (
                <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-transparent flex items-center justify-end">
                  <div className="text-right text-white px-8 md:px-16 py-6 max-w-2xl mx-4 md:mx-10">
                    <span className="inline-block px-4 py-1 bg-amber-600 rounded-full text-xs md:text-sm font-semibold mb-4 tracking-wider animate-fade-in">WASTE REDUCTION</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight animate-fade-in-right">
                      Transform <span className="text-amber-400">Waste</span> into Resources
                    </h2>
                    <p className="text-lg md:text-xl mb-6 leading-relaxed text-gray-200 animate-fade-in-right animation-delay-300">
                      Your discarded electronics contain valuable materials that can be recovered and reused. 
                      Help reduce landfill waste by properly recycling your electronic devices.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Third slide content */}
              {index === 2 && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent flex items-start pt-20 md:pt-32">
                  <div className="text-center text-white px-8 md:px-16 py-6 max-w-3xl mx-auto">
                    <span className="inline-block px-4 py-1 bg-blue-600 rounded-full text-xs md:text-sm font-semibold mb-4 tracking-wider animate-fade-in">ENERGY EFFICIENCY</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight animate-fade-up">
                      Bright Ideas for <span className="text-blue-400">Energy</span> Conservation
                    </h2>
                    <p className="text-lg md:text-xl mb-6 leading-relaxed text-gray-200 animate-fade-up animation-delay-300">
                      Recycling one million laptops saves enough energy to power 3,500 homes for a year.
                      Make the switch to energy-efficient electronics and responsibly recycle your old ones.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Fourth slide content */}
              {index === 3 && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end pb-20 md:pb-32">
                  <div className="text-center text-white px-8 md:px-16 py-6 max-w-3xl mx-auto">
                    <span className="inline-block px-4 py-1 bg-red-600 rounded-full text-xs md:text-sm font-semibold mb-4 tracking-wider animate-fade-in">ENVIRONMENTAL IMPACT</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight animate-fade-up">
                      Prevent <span className="text-red-400">Toxic</span> Pollution
                    </h2>
                    <p className="text-lg md:text-xl mb-6 leading-relaxed text-gray-200 animate-fade-up animation-delay-300">
                      E-waste contains harmful substances like lead, mercury, and cadmium that can contaminate soil and water. 
                      Proper disposal prevents these toxins from harming our environment and communities.
                    </p>
                  </div>
                </div>
              )}
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