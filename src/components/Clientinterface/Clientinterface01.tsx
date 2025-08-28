import { useState, useEffect } from "react";
import Header from "../common/Header";
import { Link } from "react-router-dom";
import { MessageCircle, Star, X, Send } from "lucide-react";

// Feedback interfaces
interface FeedbackData {
  customerName: string;
  feedbackType: string;
  message: string;
}

interface FeedbackFormErrors {
  customerName?: string;
  feedbackType?: string;
  message?: string;
}

function UserInterface() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    customerName: '',
    feedbackType: '',
    message: ''
  });
  const [feedbackErrors, setFeedbackErrors] = useState<FeedbackFormErrors>({});
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitSuccess, setFeedbackSubmitSuccess] = useState(false);
  const [feedbackSubmitError, setFeedbackSubmitError] = useState<string | null>(null);
  
  const totalSlides = 4;

  const images = [
    "src/assets/img/recycle-all-it-s-worth-poster.jpg",
    "src/assets/img/composition-different-trashed-objects.jpg",
    "src/assets/img/recycle-icon-compact-fluorescent-light-bulb-against-white-background.jpg",
    "src/assets/img/many-kinds-garbage-were-scattered-dark-floor.jpg"
  ];

  const feedbackTypes = [
    { value: 'POSITIVE', label: 'Positive', icon: '😊', color: 'text-green-600' },
    { value: 'NEGATIVE', label: 'Negative', icon: '😞', color: 'text-red-600' },
    { value: 'NEUTRAL', label: 'Neutral', icon: '😐', color: 'text-gray-600' },
    { value: 'NOTANSATISFACTION', label: 'Not Satisfied', icon: '😤', color: 'text-orange-600' }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Feedback form handlers
  const handleFeedbackInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (feedbackErrors[name as keyof FeedbackFormErrors]) {
      setFeedbackErrors({
        ...feedbackErrors,
        [name]: undefined
      });
    }
  };

  const handleFeedbackTypeSelect = (type: string) => {
    setFeedbackData(prev => ({
      ...prev,
      feedbackType: type
    }));
    
    // Clear feedback type error
    if (feedbackErrors.feedbackType) {
      setFeedbackErrors({
        ...feedbackErrors,
        feedbackType: undefined
      });
    }
  };

  const validateFeedbackForm = (): boolean => {
    const errors: FeedbackFormErrors = {};
    let isValid = true;

    if (!feedbackData.customerName.trim()) {
      errors.customerName = 'Customer name is required';
      isValid = false;
    }

  

    if (!feedbackData.feedbackType) {
      errors.feedbackType = 'Please select a feedback type';
      isValid = false;
    }

    if (!feedbackData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    } else if (feedbackData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
      isValid = false;
    }

    setFeedbackErrors(errors);
    return isValid;
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFeedbackForm()) {
      return;
    }

    setIsSubmittingFeedback(true);
    setFeedbackSubmitError(null);
    setFeedbackSubmitSuccess(false);

    try {
      // Prepare payload with proper date handling
      const currentDate = new Date();
      const submittedAtISO = currentDate.toISOString();
      
      const payload = {
        customerName: feedbackData.customerName.trim(),
        feedbackType: feedbackData.feedbackType,
        submittedAt: submittedAtISO,
        message: feedbackData.message.trim()
      };

      console.log('Submitting feedback:', payload);

      const response = await fetch('http://localhost:8084/feedback/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Feedback submitted successfully:', result);

      setFeedbackSubmitSuccess(true);
      
      // Reset form
      setFeedbackData({
        customerName: localStorage.getItem('username') || '',
        feedbackType: '',
        message: ''
      });

      // Close modal after delay
      setTimeout(() => {
        setShowFeedbackModal(false);
        setFeedbackSubmitSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setFeedbackSubmitError(error instanceof Error ? error.message : 'Failed to submit feedback');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setFeedbackSubmitSuccess(false);
    setFeedbackSubmitError(null);
    setFeedbackErrors({});
  };

  return (
    <>
      <Header />
      
      {/* Floating Feedback Button */}
      <button
        onClick={() => setShowFeedbackModal(true)}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Give Feedback"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Give Feedback
        </span>
      </button>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Share Your Feedback</h2>
              </div>
              <button
                onClick={closeFeedbackModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close feedback modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {feedbackSubmitSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    <span>Thank you for your feedback! It has been submitted successfully.</span>
                  </div>
                </div>
              )}

              {feedbackSubmitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {feedbackSubmitError}
                </div>
              )}

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={feedbackData.customerName}
                    onChange={handleFeedbackInputChange}
                    className={`w-full px-3 py-2 border ${feedbackErrors.customerName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your name"
                  />
                  {feedbackErrors.customerName && (
                    <p className="mt-1 text-sm text-red-500">{feedbackErrors.customerName}</p>
                  )}
                </div>

                {/* Feedback Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {feedbackTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleFeedbackTypeSelect(type.value)}
                        className={`p-3 border-2 rounded-lg transition-all duration-200 ${
                          feedbackData.feedbackType === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xl">{type.icon}</span>
                          <span className={`text-sm font-medium ${type.color}`}>
                            {type.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {feedbackErrors.feedbackType && (
                    <p className="mt-1 text-sm text-red-500">{feedbackErrors.feedbackType}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={feedbackData.message}
                    onChange={handleFeedbackInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 border ${feedbackErrors.message ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                    placeholder="Please share your detailed feedback..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {feedbackErrors.message ? (
                      <p className="text-sm text-red-500">{feedbackErrors.message}</p>
                    ) : (
                      <p className="text-sm text-gray-500">Minimum 10 characters</p>
                    )}
                    <p className="text-sm text-gray-400">{feedbackData.message.length}/500</p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeFeedbackModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    disabled={isSubmittingFeedback}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                    disabled={isSubmittingFeedback}
                  >
                    {isSubmittingFeedback ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Existing carousel code */}
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