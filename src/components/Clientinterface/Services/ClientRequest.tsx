import React, { useState, useEffect } from 'react';

// E-Waste category enum matching backend
enum EWasteCategory {
  IT_EQUIPMENT = 'IT_EQUIPMENT',
  CONSUMER_ELECTRONICS = 'CONSUMER_ELECTRONICS',
  LIGHTING = 'LIGHTING',
  TOOLS = 'TOOLS',
  TOYS = 'TOYS',
  MEDICAL_DEVICES = 'MEDICAL_DEVICES',
  MONITORING_INSTRUMENTS = 'MONITORING_INSTRUMENTS',
  BATTERIES = 'BATTERIES',
  SOLAR_PANELS = 'SOLAR_PANELS',
  OTHER = 'OTHER'
}

// Category display names and base points
const categoryInfo: Record<EWasteCategory, { name: string, basePoints: number, icon: string }> = {
  [EWasteCategory.IT_EQUIPMENT]: { name: '💻 IT Equipment', basePoints: 10, icon: '💻' },
  [EWasteCategory.CONSUMER_ELECTRONICS]: { name: '📱 Consumer Electronics', basePoints: 8, icon: '📱' },
  [EWasteCategory.LIGHTING]: { name: '💡 Lighting', basePoints: 12, icon: '💡' },
  [EWasteCategory.TOOLS]: { name: '🔧 Tools', basePoints: 15, icon: '🔧' },
  [EWasteCategory.TOYS]: { name: '🎮 Toys', basePoints: 7, icon: '🎮' },
  [EWasteCategory.MEDICAL_DEVICES]: { name: '⚕️ Medical Devices', basePoints: 9, icon: '⚕️' },
  [EWasteCategory.MONITORING_INSTRUMENTS]: { name: '🔍 Monitoring Instruments', basePoints: 9, icon: '🔍' },
  [EWasteCategory.BATTERIES]: { name: '🔋 Batteries', basePoints: 8, icon: '🔋' },
  [EWasteCategory.SOLAR_PANELS]: { name: '☀️ Solar Panels', basePoints: 8, icon: '☀️' },
  [EWasteCategory.OTHER]: { name: '📦 Other', basePoints: 5, icon: '📦' }
};

// Convert enum to array for dropdown
const categories = Object.values(EWasteCategory);

interface FormData {
  itemTitle: string;
  pickupLocation: string;
  category: EWasteCategory | '';
  estimatedWeight: string;
  itemImage: File | null;
  description: string;
}

const ClientRequest: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    itemTitle: '',
    pickupLocation: '',
    category: '',
    estimatedWeight: '',
    itemImage: null,
    description: ''
  });

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);

  // Calculate reward points when category or weight changes
  useEffect(() => {
    calculateRewardPoints();
  }, [formData.category, formData.estimatedWeight]);

  // Calculate reward points based on category and weight
  const calculateRewardPoints = () => {
    if (!formData.category || !formData.estimatedWeight) {
      setRewardPoints(0);
      return;
    }
    
    const weight = parseFloat(formData.estimatedWeight);
    if (isNaN(weight) || weight <= 0) {
      setRewardPoints(0);
      return;
    }

    // Base calculation: Category base points × weight × multiplier
    const basePoints = categoryInfo[formData.category].basePoints;
    
    // Progressive multiplier - higher weights get bonus points
    let weightMultiplier = 1;
    if (weight > 10) weightMultiplier = 1.5;
    else if (weight > 5) weightMultiplier = 1.25;
    else if (weight > 1) weightMultiplier = 1.1;

    // Calculate final points (rounded to nearest integer)
    const calculatedPoints = Math.round(basePoints * weight * weightMultiplier);
    setRewardPoints(calculatedPoints);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategorySelect = (category: EWasteCategory) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
    setShowCategoryDropdown(false);
  };

  const handleFileChange = (file: File) => {
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setFormData(prev => ({
        ...prev,
        itemImage: file
      }));
    } else {
      alert('File size must be less than 5MB');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setFormData({
      itemTitle: '',
      pickupLocation: '',
      category: '',
      estimatedWeight: '',
      itemImage: null,
      description: ''
    });
    setRewardPoints(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.itemTitle || !formData.pickupLocation || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    // Create final submission object including calculated points
    const submissionData = {
      ...formData,
      rewardPoints
    };
    
    console.log('Form submitted:', submissionData);
    alert(`Request submitted successfully! You've earned ${rewardPoints} points.`);
    handleReset();
  };

  return (
    <div className="min-h-screen relative font-inter bg-gradient-to-br from-[#B4F9AE] via-[#6BCF7F] to-[#88D982] overflow-x-hidden">
      {/* Background decorative elements - hidden on mobile for better performance */}
      <div className="hidden lg:block">
        {/* Background image */}
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/2d5be248aadc64639ebfa10eb425e323ae9c90a4?width=824"
          alt=""
          className="absolute -left-[26px] top-[189px] w-[412px] h-[407px] rounded-[36px] opacity-90"
        />
        
        {/* Decorative circles */}
        <div className="absolute left-[72px] top-[110px] w-24 h-20 bg-white rounded-full opacity-10"></div>
        <div className="absolute right-[192px] top-[140px] w-36 h-30 bg-white rounded-full opacity-[0.08]"></div>
        <div className="absolute left-[49px] bottom-[120px] w-[95px] h-[81px] bg-white rounded-full opacity-[0.06]"></div>
      </div>

      {/* Request Form Container */}
      <div className="relative container mx-auto px-4 py-12 lg:py-20 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#2E2E2E] mb-3">Request Pickup Service</h1>
            <p className="text-[#555] text-sm lg:text-base max-w-xl mx-auto">
              Schedule a pickup for your electronic waste. Fill in the details below and our team will get in touch with you soon.
            </p>
          </div>
          
          {/* Card Container */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First row - Title and Location */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[#2E2E2E] text-sm font-bold">
                    Item Title *
                  </label>
                  <input
                    type="text"
                    name="itemTitle"
                    value={formData.itemTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Old Laptop"
                    className="w-full h-12 sm:h-14 px-4 sm:px-5 border border-[#E1E5E9] rounded-xl sm:rounded-2xl bg-[#F8F9FA] text-[#2E2E2E] text-sm sm:text-base outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[#2E2E2E] text-sm font-bold">
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleInputChange}
                    placeholder="e.g., 123 Green Street"
                    className="w-full h-12 sm:h-14 px-4 sm:px-5 border border-[#E1E5E9] rounded-xl sm:rounded-2xl bg-[#F8F9FA] text-[#2E2E2E] text-sm sm:text-base outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Second row - Category and Weight */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[#2E2E2E] text-sm font-bold">
                    Category *
                  </label>
                  <div className="relative">
                    <div
                      className="h-12 sm:h-14 px-4 sm:px-5 border border-[#E1E5E9] rounded-xl sm:rounded-2xl bg-[#F8F9FA] flex items-center justify-between cursor-pointer transition-all hover:border-[#4CAF50] focus-within:border-[#4CAF50] focus-within:ring-2 focus-within:ring-[#4CAF50]/20"
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    >
                      <span className={`text-sm sm:text-base ${formData.category ? 'text-[#2E2E2E]' : 'text-[#999]'}`}>
                        {formData.category ? categoryInfo[formData.category].name : 'Select category'}
                      </span>
                      <div className="w-7 h-4 bg-[#4CAF50] rounded flex items-center justify-center">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="2"/>
                        </svg>
                      </div>
                    </div>
                    {showCategoryDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1E5E9] rounded-xl sm:rounded-2xl shadow-lg z-20 py-2 max-h-60 overflow-y-auto">
                        {categories.map((category, index) => (
                          <div
                            key={index}
                            className="px-4 sm:px-5 py-3 text-[#2E2E2E] text-sm sm:text-base cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => handleCategorySelect(category)}
                          >
                            {categoryInfo[category].name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[#2E2E2E] text-sm font-bold">
                    Estimated Weight (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="estimatedWeight"
                      value={formData.estimatedWeight}
                      onChange={handleInputChange}
                      placeholder="e.g., 2.5"
                      step="0.1"
                      className="w-full h-12 sm:h-14 px-4 sm:px-5 pr-12 sm:pr-14 border border-[#E1E5E9] rounded-xl sm:rounded-2xl bg-[#F8F9FA] text-[#2E2E2E] text-sm sm:text-base outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all"
                    />
                    <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 p-1">
                      <span className="text-xs text-[#4CAF50] font-semibold">kg</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Third row - Image Upload and Reward Points */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[#2E2E2E] text-sm font-bold">
                    Item Image
                  </label>
                  <div
                    className={`h-32 sm:h-36 border-2 border-dashed ${dragActive ? 'border-[#4CAF50] bg-[#4CAF50]/5' : 'border-[#E1E5E9]'} rounded-xl sm:rounded-2xl bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer transition-all hover:border-[#4CAF50] hover:bg-[#4CAF50]/5 p-4`}
                    onDrop={handleDrop}
                    onDragOver={handleDrag}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    {formData.itemImage ? (
                      <div className="text-center">
                        <div className="text-[#4CAF50] text-sm font-bold mb-1 truncate max-w-full">
                          {formData.itemImage.name}
                        </div>
                        <div className="text-[#999] text-xs">File uploaded successfully</div>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#4CAF50]/10 flex items-center justify-center mb-2 sm:mb-3">
                          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 8L10 4L14 8" stroke="#4CAF50" strokeWidth="2"/>
                            <path d="M10 4V12" stroke="#4CAF50" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="text-[#4CAF50] text-xs sm:text-sm font-bold mb-1">Upload Image</div>
                        <div className="text-[#999] text-xs">PNG, JPG up to 5MB</div>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[#2E2E2E] text-sm font-bold">
                    Reward Points
                  </label>
                  <div className="h-12 sm:h-14 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center px-4 sm:px-6 gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#FF9800] rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] sm:text-xs font-bold">★</span>
                    </div>
                    <span className="text-[#F57F17] text-sm sm:text-base font-bold">
                      {rewardPoints > 0 
                        ? `${rewardPoints} points for this pickup` 
                        : "Fill details to calculate points"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-[#2E2E2E] text-sm font-bold">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the condition and any additional details about your e-waste items..."
                  rows={4}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-[#E1E5E9] rounded-xl sm:rounded-2xl bg-[#F8F9FA] text-[#2E2E2E] text-sm sm:text-base outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center sm:justify-end pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-36 h-12 sm:h-14 bg-gray-200 rounded-2xl sm:rounded-3xl text-gray-700 text-base sm:text-lg font-bold hover:bg-gray-300 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-200"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-54 h-12 sm:h-14 bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] rounded-2xl sm:rounded-3xl text-white text-base sm:text-lg font-bold flex items-center justify-center gap-2 sm:gap-3 hover:from-[#43A047] hover:to-[#1B5E20] transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#4CAF50]/30"
                >
                  Send Request
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Help button - repositioned for mobile */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 cursor-pointer z-30">
        <div className="w-full h-full bg-[#4CAF50] rounded-full flex items-center justify-center shadow-lg hover:bg-[#43A047] transition-all transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#4CAF50]/30">
          <span className="text-white text-lg sm:text-xl lg:text-2xl font-normal">?</span>
        </div>
      </div>
    </div>
  );
};

export default ClientRequest;
