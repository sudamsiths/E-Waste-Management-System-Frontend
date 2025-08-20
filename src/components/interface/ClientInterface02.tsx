import Footer from "../common/Footer";

const ClientInterface02: React.FC = () => {
  return (
    <div className="user-interface-section pt-[70px] sm:pt-[90px]">
      <div className="main-container bg-[#D3F6B7] w-full px-4 sm:px-6 md:px-10 lg:px-16 py-8 md:py-12 lg:py-16">
        <div className="content-wrapper flex flex-col md:flex-row gap-6 md:gap-10 lg:gap-20">
          <div className="text-column w-full md:w-1/2 order-2 md:order-1">
            <div className="text-content">
              <div className="section-label text-[#8BC34A] text-lg sm:text-xl md:text-2xl">
                About Our E-Waste Services
              </div>
              <div className="main-heading text-[#2C3E50] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-3 sm:mt-4 md:mt-6">
                We Have Experts in
                <br />
                E-Waste Management
              </div>
              <div className="description-wrapper mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                <div className="description-text text-sm sm:text-base md:text-lg">
                  Our team specializes in responsible electronic waste disposal, helping to protect
                  the environment from hazardous materials. <br className="hidden sm:block" />
                  We ensure proper recycling and safe handling of all electronic components.
                  <br className="hidden sm:block" />
                  <br className="hidden sm:block" />
                  Electronic waste contains valuable materials that can be recovered and reused,
                  reducing the need for raw material extraction. Our advanced recycling processes
                  safely extract precious metals and other reusable components while preventing
                  toxic substances from entering landfills or water supplies.
                </div>
                <button
                  className="mt-6 sm:mt-8 md:mt-10 px-6 py-3 bg-[#4CAF50] text-white rounded-full font-medium text-sm sm:text-base hover:bg-[#43A047] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-50"
                  style={{ cursor: "pointer" }}
                >
                  Know More
                </button>
              </div>
            </div>
          </div>
          <div className="image-column w-full md:w-1/2 order-1 md:order-2">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/2e2c586f4d733fc3f7282c8a85a2d9ea1d669be9?placeholderIfAbsent=true"
              className="w-full h-auto object-cover rounded-lg shadow-lg"
              alt="E-waste management experts"
            />
          </div>
        </div>
      </div>
    </div>
  );
};


export default ClientInterface02;
