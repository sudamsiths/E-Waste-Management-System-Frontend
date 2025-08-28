import React, { useState, useEffect } from 'react';
import { RefreshCcw, Edit, Trash, Plus, X, Check } from 'lucide-react';

// Define TypeScript interfaces for data structures
interface RecyclingCenter {
  id?: number;
  location: string;
  centerName: string;
  contactNo: string;
  contactPerson: string;
  email: string;
}

interface FormErrors {
  location?: string;
  centerName?: string;
  contactNo?: string;
  contactPerson?: string;
  email?: string;
}

const Branches: React.FC = () => {
  // State for recycling centers list
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // State for new center form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCenter, setNewCenter] = useState<RecyclingCenter>({
    location: '',
    centerName: '',
    contactNo: '',
    contactPerson: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // State for edit functionality
  const [editingCenter, setEditingCenter] = useState<RecyclingCenter | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch all recycling centers
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:8083/recycling-centers/getAll');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        setCenters(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch recycling centers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recycling centers');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCenters();
  }, [refreshTrigger]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (isEditing && editingCenter) {
      setEditingCenter(prev => prev ? {
        ...prev,
        [name]: value
      } : null);
    } else {
      setNewCenter(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field when user types
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate form before submission
  const validateForm = (centerData: RecyclingCenter) => {
    const errors: FormErrors = {};
    let isValid = true;
    
    if (!centerData.location.trim()) {
      errors.location = 'Location is required';
      isValid = false;
    }
    
    if (!centerData.centerName.trim()) {
      errors.centerName = 'Center name is required';
      isValid = false;
    }
    
    if (!centerData.contactNo.trim()) {
      errors.contactNo = 'Contact number is required';
      isValid = false;
    }
    
    if (!centerData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person is required';
      isValid = false;
    }
    
    if (!centerData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(centerData.email)) {
      errors.email = 'Please enter a valid email';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission for adding new center
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToValidate = isEditing && editingCenter ? editingCenter : newCenter;
    
    if (!validateForm(dataToValidate)) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      const url = isEditing && editingCenter?.id 
        ? `http://localhost:8083/recycling-centers/update/${editingCenter.id}`
        : 'http://localhost:8083/recycling-centers/add';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToValidate)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      // Reset form and show success message
      if (isEditing) {
        setEditingCenter(null);
        setIsEditing(false);
      } else {
        setNewCenter({
          location: '',
          centerName: '',
          contactNo: '',
          contactPerson: '',
          email: ''
        });
      }
      
      setSubmitSuccess(true);
      
      // Refresh the list of centers
      setRefreshTrigger(prev => prev + 1);
      
      // Close the form after a delay
      setTimeout(() => {
        setShowAddForm(false);
        setSubmitSuccess(false);
        setIsEditing(false);
        setEditingCenter(null);
      }, 2000);
      
    } catch (err) {
      console.error('Failed to save recycling center:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to save recycling center');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEdit = (center: RecyclingCenter) => {
    setEditingCenter(center);
    setIsEditing(true);
    setShowAddForm(true);
    setFormErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this recycling center?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8083/recycling-centers/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      // Refresh the list
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to delete recycling center:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete recycling center');
    }
  };

  // Reset form and toggle visibility
  const toggleAddForm = () => {
    if (showAddForm) {
      // Reset form if closing
      setNewCenter({
        location: '',
        centerName: '',
        contactNo: '',
        contactPerson: '',
        email: ''
      });
      setFormErrors({});
      setSubmitError(null);
      setSubmitSuccess(false);
      setIsEditing(false);
      setEditingCenter(null);
    }
    setShowAddForm(!showAddForm);
  };

  // Manual refresh function
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Recycling Center Branches</h2>
            <p className="text-sm text-gray-500">Manage your recycling center locations</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
              disabled={isLoading}
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button 
              onClick={toggleAddForm}
              className={`px-4 py-2 ${showAddForm ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg text-sm font-medium flex items-center gap-2`}
            >
              {showAddForm ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Branch</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Add/Edit Form - conditionally rendered */}
      {showAddForm && (
        <div className="p-4 lg:p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-md font-semibold text-gray-800 mb-4">
            {isEditing ? 'Edit Recycling Center Branch' : 'Add New Recycling Center Branch'}
          </h3>
          
          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
              {isEditing ? 'Recycling center updated successfully!' : 'Recycling center branch added successfully!'}
            </div>
          )}
          
          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {submitError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Center Name</label>
                <input
                  type="text"
                  name="centerName"
                  value={isEditing && editingCenter ? editingCenter.centerName : newCenter.centerName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.centerName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter center name"
                />
                {formErrors.centerName && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.centerName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={isEditing && editingCenter ? editingCenter.location : newCenter.location}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.location ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter location"
                />
                {formErrors.location && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.location}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={isEditing && editingCenter ? editingCenter.contactPerson : newCenter.contactPerson}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.contactPerson ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter contact person name"
                />
                {formErrors.contactPerson && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.contactPerson}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="text"
                  name="contactNo"
                  value={isEditing && editingCenter ? editingCenter.contactNo : newCenter.contactNo}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.contactNo ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter contact number"
                />
                {formErrors.contactNo && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.contactNo}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={isEditing && editingCenter ? editingCenter.email : newCenter.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter email address"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={toggleAddForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{isEditing ? 'Updating...' : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isEditing ? 'Update Branch' : 'Save Branch'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      )}
      
      {/* Error State */}
      {error && !isLoading && (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="font-medium">Error Loading Recycling Centers</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-2 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded hover:bg-red-200"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {!isLoading && !error && centers.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recycling centers</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first recycling center branch.</p>
          <div className="mt-6">
            <button
              onClick={toggleAddForm}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Branch
            </button>
          </div>
        </div>
      )}
      
      {/* Data Display */}
      {!isLoading && !error && centers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Center Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Person
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {centers.map((center, index) => (
                <tr key={center.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{center.centerName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{center.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{center.contactPerson}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{center.contactNo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{center.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                        onClick={() => handleEdit(center)}
                        title="Edit center"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                        onClick={() => center.id && handleDelete(center.id)}
                        title="Delete center"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Branches;