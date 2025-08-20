import Footer from "../common/Footer";

const Clientinterface04: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <div className="bg-[#CDEEAB] flex w-full flex-col items-center justify-center px-4 pt-4 pb-16 sm:px-6 sm:pt-6 sm:pb-20 md:px-8 md:pt-8 md:pb-24 lg:px-16 lg:pt-8 lg:pb-24">
        {/* Section Label - Centered */}
        <div className="text-[#8BC34A] text-center text-lg sm:text-xl font-normal font-['Inter']">
          Our Service
        </div>

        {/* Main Heading - Centered */}
        <div className="text-[#2C3E50] text-center mt-6 sm:mt-8 md:mt-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-['Inter'] px-2">
          Our E-Waste Services
        </div>

        {/* Services Grid - All Cards Centered */}
        <div className="w-full max-w-7xl mt-8 sm:mt-12 md:mt-16 lg:mt-20">
          {/* Top Row - 3 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 justify-items-center">
            {/* E-Waste Collection Card - Made Square */}
            <div className="w-full max-w-[280px] flex flex-col relative aspect-square items-center justify-center px-4 py-6 rounded-2xl shadow-lg overflow-hidden">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/0d7b5c9191bcc3f313d8b61d2e2595eadb5e278a?placeholderIfAbsent=true"
                className="absolute inset-0 h-full w-full object-cover object-center"
                alt="Card background"
              />
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* E-waste Collection Icon - Made Square */}
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white rounded-lg shadow-md mb-4">
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 7V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-[#2C3E50] text-xl md:text-2xl font-bold mb-3 text-center">
                  E-Waste Collection
                </div>
                <div className="text-[#7F8C8D] text-sm md:text-base text-center leading-relaxed">
                  Safe and responsible collection of electronic waste from households and businesses.
                </div>
              </div>
            </div>

            {/* E-Waste Recycling Card - Made Square */}
            <div className="w-full max-w-[280px] flex flex-col relative aspect-square items-center justify-center px-4 py-6 rounded-2xl shadow-lg overflow-hidden">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/0fab618205636d44c4b4f623943e9e32d5942849?placeholderIfAbsent=true"
                className="absolute inset-0 h-full w-full object-cover object-center"
                alt="Card background"
              />
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* E-waste Recycling Icon - Made Square */}
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white rounded-lg shadow-md mb-4">
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 19L12 14L17 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 5L12 10L7 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 10L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 16.7L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 16.7L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 7.3L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 7.3L8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-[#2C3E50] text-xl md:text-2xl font-bold mb-3 text-center">
                  E-Waste Recycling
                </div>
                <div className="text-[#7F8C8D] text-sm md:text-base text-center leading-relaxed">
                  Professional recycling of electronic components to recover valuable materials.
                </div>
              </div>
            </div>

            {/* Home E-Waste Pickup Card - Made Square */}
            <div className="w-full max-w-[280px] flex flex-col relative aspect-square items-center justify-center px-4 py-6 rounded-2xl shadow-lg overflow-hidden sm:col-span-2 lg:col-span-1 sm:max-w-[280px] sm:mx-auto">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/46cd56d069f5e98892a84fccdbadf0c5744c34b4?placeholderIfAbsent=true"
                className="absolute inset-0 h-full w-full object-cover object-center"
                alt="Card background"
              />
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Home E-waste Pickup Icon - Made Square */}
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white rounded-lg shadow-md mb-4">
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11 8.5H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 15.5H12M15 15.5H12M12 15.5V18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-[#2C3E50] text-xl md:text-2xl font-bold mb-3 text-center">
                  Home E-Waste Pickup
                </div>
                <div className="text-[#7F8C8D] text-sm md:text-base text-center leading-relaxed">
                  Convenient doorstep collection of old electronics and appliances.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - 3 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 justify-items-center mt-8 sm:mt-12 md:mt-16">
            {/* Corporate E-Waste Solutions Card - Made Square */}
            <div className="w-full max-w-[280px] flex flex-col relative aspect-square items-center justify-center px-4 py-6 rounded-2xl shadow-lg overflow-hidden">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/6cf7ca9f4d748d6655e1e1caa6787f0dd28f64b1?placeholderIfAbsent=true"
                className="absolute inset-0 h-full w-full object-cover object-center"
                alt="Card background"
              />
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Corporate E-waste Solutions Icon - Made Square */}
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white rounded-lg shadow-md mb-4">
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 14H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-[#2C3E50] text-xl md:text-2xl font-bold mb-3 text-center">
                  Corporate E-Waste Solutions
                </div>
                <div className="text-[#7F8C8D] text-sm md:text-base text-center leading-relaxed">
                  Customized e-waste programs for businesses with compliance requirements.
                </div>
              </div>
            </div>

            {/* IT Asset Disposal Card - Made Square */}
            <div className="w-full max-w-[280px] flex flex-col relative aspect-square items-center justify-center px-4 py-6 rounded-2xl shadow-lg overflow-hidden">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/fa2667fcb92e26d2ca00064c42884aa8f8e966da?placeholderIfAbsent=true"
                className="absolute inset-0 h-full w-full object-cover object-center"
                alt="Card background"
              />
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* IT Asset Disposal Icon - Made Square */}
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white rounded-lg shadow-md mb-4">
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 17L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 17L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-[#2C3E50] text-xl md:text-2xl font-bold mb-3 text-center">
                  IT Asset Disposal
                </div>
                <div className="text-[#7F8C8D] text-sm md:text-base text-center leading-relaxed">
                  Secure data destruction and environmentally responsible disposal of IT equipment.
                </div>
              </div>
            </div>

            {/* Environmental Protection Card - Made Square */}
            <div className="w-full max-w-[280px] flex flex-col relative aspect-square items-center justify-center px-4 py-6 rounded-2xl shadow-lg overflow-hidden sm:col-span-2 lg:col-span-1 sm:max-w-[280px] sm:mx-auto">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/482795c922a0e946c1298d56aa072a714561cda0?placeholderIfAbsent=true"
                className="absolute inset-0 h-full w-full object-cover object-center"
                alt="Card background"
              />
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Environmental Protection Icon - Made Square */}
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white rounded-lg shadow-md mb-4">
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 12L10.5 14.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-[#2C3E50] text-xl md:text-2xl font-bold mb-3 text-center">
                  Environmental Protection
                </div>
                <div className="text-[#7F8C8D] text-sm md:text-base text-center leading-relaxed">
                  Preventing hazardous e-waste materials from reaching landfills for a cleaner planet.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clientinterface04;
