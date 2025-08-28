import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AgentFormData {
  fullName: string;
  email: string;
  contactNo: string;
  assignBranch: string;
  status: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  contactNo?: string;
  assignBranch?: string;
  status?: string;
}

interface AddAgentProps {
  onSuccess?: () => void;
}

const AddAgent: React.FC<AddAgentProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AgentFormData>({
    fullName: '',
    email: '',
    contactNo: '',
    assignBranch: '', // Simple string field
    status: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const statuses = [
    'ACTIVE',
    'DELETED',
    'INACTIVE'
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required';
    }
    
    if (!formData.assignBranch.trim()) {
      newErrors.assignBranch = 'Branch is required';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status selection is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors for this field when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleStatusSelect = (status: string) => {
    setFormData(prev => ({
      ...prev,
      status
    }));
    setShowStatusDropdown(false);
    
    // Clear status error if it exists
    if (errors.status) {
      setErrors({
        ...errors,
        status: undefined
      });
    }
  };

  // Update handleCancel to use onSuccess callback if provided
  const handleCancel = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/manage-agent-profile');
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('agentDraft', JSON.stringify(formData));
    alert('Draft saved successfully!');
  };

  // Update the form submission handler to use onSuccess callback
  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Format the payload according to backend expectations
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        contactNo: formData.contactNo,
        assignBranch: formData.assignBranch,  // Using consistent naming
        status: formData.status
      };
      
      console.log('Sending agent data to backend:', payload);
      
      // Set appropriate headers for the API request
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      // Make the API request
      const response = await axios.post('http://localhost:8082/agent/add', payload, config);
      
      console.log('Agent created successfully:', response.data);
      
      // Show success message and reset
      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        contactNo: '',
        assignBranch: '',
        status: ''
      });
      
      // Call onSuccess callback if provided (for popup mode) or navigate (for standalone mode)
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(); // Close popup and refresh data
        } else {
          navigate('/manage-agent-profile');
        }
      }, 1500);
      
    } catch (error) {
      console.error('Failed to create agent:', error);
      
      // Improved error handling with detailed messages
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const status = error.response.status;
          const responseData = error.response.data;
          
          if (status === 400) {
            // Bad request - typically validation errors
            const errorMessage = responseData.message || responseData.error || 'Invalid data provided';
            setSubmitError(`Validation error: ${errorMessage}`);
          } else if (status === 409) {
            // Conflict - typically duplicate email
            setSubmitError('An agent with this email already exists');
          } else if (status === 401 || status === 403) {
            // Unauthorized or Forbidden
            setSubmitError('You do not have permission to add agents');
          } else {
            // Other server errors
            setSubmitError(`Server error (${status}): ${responseData.message || 'Unknown error'}`);
          }
        } else if (error.request) {
          // The request was made but no response was received
          setSubmitError('No response received from the server. Please check your connection and try again.');
        } else {
          // Something happened in setting up the request
          setSubmitError(`Error: ${error.message}`);
        }
      } else {
        // Non-Axios error
        setSubmitError('Failed to create agent. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove the header since it's now in the modal
  return (
    <div>
      {/* Success/Error Messages */}
      {submitSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">Agent created successfully!</p>
        </div>
      )}
      
      {submitError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleCreateAgent} className="space-y-6">
        {/* Personal Information Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className={`w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                required
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="agent@company.com"
                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-3 py-2 border ${errors.contactNo ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                required
              />
              {errors.contactNo && (
                <p className="text-red-500 text-sm">{errors.contactNo}</p>
              )}
            </div>

            {/* Branch - Text Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Assign Branch <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="assignBranch"
                value={formData.assignBranch}
                onChange={handleInputChange}
                placeholder="Enter branch name"
                className={`w-full px-3 py-2 border ${errors.assignBranch ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                required
              />
              {errors.assignBranch && (
                <p className="text-red-500 text-sm">{errors.assignBranch}</p>
              )}
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`w-full px-3 py-2 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent flex items-center justify-between`}
                >
                  <span className={formData.status ? 'text-gray-900' : 'text-gray-400'}>
                    {formData.status || 'Select status'}
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showStatusDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-2 max-h-60 overflow-y-auto">
                    {statuses.map((status, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full px-3 py-2 text-left text-gray-900 hover:bg-gray-50 transition-colors"
                        onClick={() => handleStatusSelect(status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
                {errors.status && (
                  <p className="text-red-500 text-sm">{errors.status}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 sm:ml-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating...</span>
              </>
            ) : 'Create Agent'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAgent;
