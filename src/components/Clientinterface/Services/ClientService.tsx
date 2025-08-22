import React from 'react';

const ClientService: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen bg-[#D1FFAF] overflow-hidden">
      {/* Desktop/Tablet Layout - Hidden on mobile */}
      <div className="hidden md:block relative w-full h-[800px] xl:h-[900px] lg:h-[700px]">
        {/* Background Image - Desktop */}
        <img
          src="/src/assets/img/composition-different-trashed-objects.jpg"
          alt="E-waste collection"
          className="absolute object-cover flex-shrink-0
                     w-[1073px] h-[716px] -left-[37px] top-[84px]
                     xl:w-[1200px] xl:h-[800px] xl:-left-[50px] xl:top-[100px]
                     lg:w-[900px] lg:h-[600px] lg:-left-6 lg:top-[70px]"
          style={{ aspectRatio: '535/357' }}
        />

        {/* Main Heading - Desktop */}
        <div className="absolute flex-shrink-0 text-black font-inter
                        w-[466px] h-[296px] left-[799px] top-[246px]
                        xl:w-[520px] xl:h-[320px] xl:left-[900px] xl:top-[280px]
                        lg:w-[400px] lg:h-[250px] lg:left-[600px] lg:top-[200px]">
          <h1 className="text-black font-bold leading-tight
                         text-[75px]
                         xl:text-[85px]
                         lg:text-[60px]">
            Agent Collect Your E Waste
          </h1>
        </div>

        {/* Call to Action Button - Desktop */}
        <button className="absolute cursor-pointer bg-[#219B1D] rounded-[35px] border border-white
                          w-[221px] h-16 left-[799px] top-[575px]
                          xl:w-[250px] xl:h-[70px] xl:left-[900px] xl:top-[650px]
                          lg:w-[200px] lg:h-[60px] lg:left-[600px] lg:top-[480px]
                          hover:bg-[#1a7a17] transition-colors duration-300
                          focus:outline-none focus:ring-4 focus:ring-green-300"
               style={{ boxShadow: '0 4px 4px 0 rgba(113,252,81,0.82)' }}>
          <span className="text-white font-inter font-normal
                           text-xl
                           xl:text-2xl
                           lg:text-lg">
            Send an Request
          </span>
        </button>
      </div>

      {/* Mobile Layout - Visible only on mobile */}
      <div className="md:hidden flex flex-col min-h-screen">
        {/* Mobile Header Section */}
        <div className="relative flex-shrink-0 h-[300px] min-[480px]:h-[350px] mb-6">
          <img
            src="/src/assets/img/composition-different-trashed-objects.jpg"
            alt="E-waste collection"
            className="w-full h-full object-cover rounded-b-3xl"
          />
          {/* Mobile Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-b-3xl"></div>
        </div>

        {/* Mobile Content Section */}
        <div className="flex-1 px-6 py-4 flex flex-col justify-center items-center text-center">
          {/* Mobile Heading */}
          <h1 className="text-black font-inter font-bold leading-tight mb-8
                         text-[28px] min-[480px]:text-[32px] sm:text-[36px]
                         max-w-sm min-[480px]:max-w-md">
            Agent Collect Your E Waste
          </h1>

          {/* Mobile Description */}
          <p className="text-gray-700 font-inter text-base min-[480px]:text-lg mb-10 max-w-sm leading-relaxed">
            Get your electronic waste collected by our professional agents.
            Safe, secure, and environmentally responsible disposal.
          </p>

          {/* Mobile Call to Action Button */}
          <button className="bg-[#219B1D] rounded-[35px] border border-white
                            w-full max-w-[280px] h-[56px] min-[480px]:h-[60px]
                            hover:bg-[#1a7a17] active:bg-[#156314]
                            transition-all duration-300
                            focus:outline-none focus:ring-4 focus:ring-green-300
                            shadow-lg
                            touch-manipulation"
                  style={{ boxShadow: '0 4px 4px 0 rgba(113,252,81,0.82)' }}>
            <span className="text-white font-inter font-medium text-lg min-[480px]:text-xl">
              Send a Request
            </span>
          </button>

          {/* Mobile Additional Info */}
          <div className="mt-8 px-4">
            <div className="flex items-center justify-center text-sm min-[480px]:text-base text-gray-600 mb-4">
              <svg className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Free pickup • Certified disposal • Quick response</span>
            </div>

            {/* Mobile Features Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Fast Service</span>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Certified</span>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Eco-Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientService;
