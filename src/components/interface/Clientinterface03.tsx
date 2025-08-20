import { useState, useEffect, useRef } from "react";

const Clientinterface03: React.FC = () => {
  // State for counters
  const [clientCount, setClientCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [yearCount, setYearCount] = useState(0);
  
  // Target values for each counter
  const targetClients = 4272;
  const targetTeam = 416;
  const targetYears = 25;
  
  // Track if animation has been triggered
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Reference to the stats section
  const statsRef = useRef<HTMLDivElement>(null);

  // Setup Intersection Observer to detect when stats are visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 } // Trigger when 30% of the element is visible
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  // Animation function for counters
  const animateCounters = () => {
    // Duration in milliseconds
    const duration = 2000;
    // Number of steps in animation
    const steps = 60;
    // Interval between steps
    const interval = duration / steps;
    
    // Counter for animation steps
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      
      // Easing function for smoother animation
      const progress = easeOutQuad(step / steps);
      
      // Update counters based on progress
      setClientCount(Math.floor(progress * targetClients));
      setTeamCount(Math.floor(progress * targetTeam));
      setYearCount(Math.floor(progress * targetYears));
      
      // Stop animation when complete
      if (step >= steps) {
        setClientCount(targetClients);
        setTeamCount(targetTeam);
        setYearCount(targetYears);
        clearInterval(timer);
      }
    }, interval);
  };
  
  // Easing function for smoother animation
  const easeOutQuad = (x: number): number => {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  };

  return (
    <div className="w-full min-h-[345px] flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 py-8 bg-[#BBF58C] mx-auto md:flex-row flex-col md:py-12 gap-8">
      {/* Title Section - With consistent width */}
      <div className="flex-1 text-center md:text-left max-w-full md:max-w-md">
        <h2 className="text-[#5C5656] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-[1.2] font-['Inter'] m-0">
          Our Services Trusted By Big
        </h2>
        <h2 className="text-[#5C5656] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-[1.2] font-['Inter'] m-0">
          Management
        </h2>
      </div>

      {/* Statistics Section - With improved alignment and fixed widths */}
      <div 
        ref={statsRef}
        className="flex flex-col sm:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center justify-center md:justify-end w-full md:w-auto"
      >
        {/* Happy Clients Stat - Fixed width container */}
        <div className="flex flex-col items-center text-center w-[130px] sm:w-[140px]">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
            {/* Updated Client Icon - More professional and consistent */}
            <svg className="w-9 h-9 sm:w-10 sm:h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 10C22.2091 10 24 11.7909 24 14C24 16.2091 22.2091 18 20 18C17.7909 18 16 16.2091 16 14C16 11.7909 17.7909 10 20 10Z" fill="#7CB342"/>
              <path d="M20 20C16.134 20 13 23.134 13 27V31H27V27C27 23.134 23.866 20 20 20Z" fill="#7CB342"/>
              <path d="M29 14C30.1046 14 31 14.8954 31 16C31 17.1046 30.1046 18 29 18C27.8954 18 27 17.1046 27 16C27 14.8954 27.8954 14 29 14Z" fill="#7CB342" fillOpacity="0.7"/>
              <path d="M11 14C12.1046 14 13 14.8954 13 16C13 17.1046 12.1046 18 11 18C9.89543 18 9 17.1046 9 16C9 14.8954 9.89543 14 11 14Z" fill="#7CB342" fillOpacity="0.7"/>
              <path d="M29 19C27.9391 19 26.9217 19.4214 26.1716 20.1716C25.4214 20.9217 25 21.9391 25 23V31H33V23C33 21.9391 32.5786 20.9217 31.8284 20.1716C31.0783 19.4214 30.0609 19 29 19Z" fill="#7CB342" fillOpacity="0.7"/>
              <path d="M11 19C9.93913 19 8.92172 19.4214 8.17157 20.1716C7.42143 20.9217 7 21.9391 7 23V31H15V23C15 21.9391 14.5786 20.9217 13.8284 20.1716C13.0783 19.4214 12.0609 19 11 19Z" fill="#7CB342" fillOpacity="0.7"/>
            </svg>
          </div>
          <div className="text-[#5C5656] font-bold text-3xl sm:text-4xl md:text-5xl leading-tight font-['Inter'] mb-2">
            {clientCount}+
          </div>
          <div className="text-[#5C5656] text-sm sm:text-base font-['Inter'] m-0 whitespace-nowrap">
            Our Happy Clients
          </div>
        </div>

        {/* Team Members Stat - Fixed width container */}
        <div className="flex flex-col items-center text-center w-[130px] sm:w-[140px]">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
            {/* Updated Team Icon - More professional and consistent */}
            <svg className="w-9 h-9 sm:w-10 sm:h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 8C22.2091 8 24 9.79086 24 12C24 14.2091 22.2091 16 20 16C17.7909 16 16 14.2091 16 12C16 9.79086 17.7909 8 20 8Z" fill="#7CB342"/>
              <path d="M26 19C27.1046 19 28 19.8954 28 21C28 22.1046 27.1046 23 26 23C24.8954 23 24 22.1046 24 21C24 19.8954 24.8954 19 26 19Z" fill="#7CB342"/>
              <path d="M14 19C15.1046 19 16 19.8954 16 21C16 22.1046 15.1046 23 14 23C12.8954 23 12 22.1046 12 21C12 19.8954 12.8954 19 14 19Z" fill="#7CB342"/>
              <path d="M20 17C17.6131 17 15.3239 17.9482 13.636 19.636C11.9482 21.3239 11 23.6131 11 26V31H29V26C29 23.6131 28.0518 21.3239 26.364 19.636C24.6761 17.9482 22.3869 17 20 17Z" fill="#7CB342" fillOpacity="0.7"/>
              <path d="M26 24C25.2044 24 24.4413 24.3161 23.8787 24.8787C23.3161 25.4413 23 26.2044 23 27V31H32V27C32 24.8 30 24 26 24Z" fill="#7CB342" fillOpacity="0.5"/>
              <path d="M14 24C14.7956 24 15.5587 24.3161 16.1213 24.8787C16.6839 25.4413 17 26.2044 17 27V31H8V27C8 24.8 10 24 14 24Z" fill="#7CB342" fillOpacity="0.5"/>
            </svg>
          </div>
          <div className="text-[#5C5656] font-bold text-3xl sm:text-4xl md:text-5xl leading-tight font-['Inter'] mb-2">
            {teamCount}+
          </div>
          <div className="text-[#5C5656] text-sm sm:text-base font-['Inter'] m-0 whitespace-nowrap">
            Team Members
          </div>
        </div>

        {/* Years Experience Stat - Fixed width container */}
        <div className="flex flex-col items-center text-center w-[130px] sm:w-[140px]">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
            {/* Updated Experience Icon - More professional and consistent */}
            <svg className="w-9 h-9 sm:w-10 sm:h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="15" stroke="#7CB342" strokeWidth="2" fill="none"/>
              <circle cx="20" cy="20" r="2" fill="#7CB342"/>
              <path d="M20 10V12" stroke="#7CB342" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 28V30" stroke="#7CB342" strokeWidth="2" strokeLinecap="round"/>
              <path d="M30 20H28" stroke="#7CB342" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 20H10" stroke="#7CB342" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 20L14 14" stroke="#7CB342" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 20L26 16" stroke="#7CB342" strokeWidth="2" strokeLinecap="round"/>
              <path d="M27 13L25 15" stroke="#7CB342" strokeWidth="2" strokeLinecap="round"/>
              <path d="M15 25L13 27" stroke="#7CB342" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-[#5C5656] font-bold text-3xl sm:text-4xl md:text-5xl leading-tight font-['Inter'] mb-2">
            {yearCount}+
          </div>
          <div className="text-[#5C5656] text-sm sm:text-base font-['Inter'] m-0 whitespace-nowrap">
            Years Experience
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clientinterface03;
