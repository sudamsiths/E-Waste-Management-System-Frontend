import React, { useState, useEffect } from 'react';
import { RefreshCcw, Edit, Trash, Plus, X, Check, Save } from 'lucide-react';

// Define TypeScript interfaces for data structures
interface RecyclingCenter {
  centerId?: number;
  location: string;
  centerName: string;
  contactNo: string;
  contactPerson: string;
  email: string;
}

interface FormErrors {
  centerId?: string;
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
  
  // Delete state
  const [centerToDelete, setCenterToDelete] = useState<RecyclingCenter | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  // Edit state
  const [editingCenter, setEditingCenter] = useState<RecyclingCenter | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState<RecyclingCenter>({
    location: '',
    centerName: '',
    contactNo: '',
    contactPerson: '',
    email: ''
  });
  const [editFormErrors, setEditFormErrors] = useState<FormErrors>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
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

  // Handle form input changes for Add form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCenter(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };

  // Handle form input changes for Edit form
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (editFormErrors[name as keyof FormErrors]) {
      setEditFormErrors({
        ...editFormErrors,
        [name]: undefined
      });
    }
  };

  // Validate form before submission
  const validateForm = (data: RecyclingCenter) => {
    const errors: FormErrors = {};
    let isValid = true;
    
    if (!data.location.trim()) {
      errors.location = 'Location is required';
      isValid = false;
    }
    
    if (!data.centerName.trim()) {
      errors.centerName = 'Center name is required';
      isValid = false;
    }
    
    if (!data.contactNo.trim()) {
      errors.contactNo = 'Contact number is required';
      isValid = false;
    }
    
    if (!data.contactPerson.trim()) {
      errors.contactPerson = 'Contact person is required';
      isValid = false;
    }
    
    if (!data.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email';
      isValid = false;
    }
    
    return { isValid, errors };
  };

  // Handle form submission for new center
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, errors } = validateForm(newCenter);
    setFormErrors(errors);
    if (!isValid) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      const response = await fetch('http://localhost:8083/recycling-centers/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newCenter)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      // Reset form and show success message
      setNewCenter({
        location: '',
        centerName: '',
        contactNo: '',
        contactPerson: '',
        email: ''
      });
      
      setSubmitSuccess(true);
      
      // Refresh the list of centers
      setRefreshTrigger(prev => prev + 1);
      
      // Close the form after a delay
      setTimeout(() => {
        setShowAddForm(false);
        setSubmitSuccess(false);
      }, 2000);
      
    } catch (err) {
      console.error('Failed to add recycling center:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to add recycling center');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit form submission
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCenter || !editingCenter.centerId) {
      setUpdateError('Invalid center data - missing ID');
      return;
    }
    
    const { isValid, errors } = validateForm(editFormData);
    setEditFormErrors(errors);
    if (!isValid) {
      return;
    }
    
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    
    try {
      console.log(`Attempting to update center with ID: ${editingCenter.centerId}`, editFormData);
      
      // Using the correct API endpoint with double slash
      const response = await fetch(`http://localhost:8083/recycling-centers/Update/${editingCenter.centerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });
      
      console.log(`Update response status: ${response.status}`);
      
      if (!response.ok) {
        let errorMessage = `Error: ${response.status} - ${response.statusText}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = `Error: ${response.status} - ${errorText}`;
          }
        } catch (e) {
          console.log('Could not read error response body');
        }
        throw new Error(errorMessage);
      }
      
      console.log(`Successfully updated center with ID: ${editingCenter.centerId}`);
      
      setUpdateSuccess(true);
      
      // Update the centers list locally
      setCenters(prevCenters => 
        prevCenters.map(center => 
          center.centerId === editingCenter.centerId ? { ...editFormData, centerId: editingCenter.centerId } : center
        )
      );
      
      // Also refresh from server to ensure consistency
      setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
      }, 100);
      
      // Close the form after a delay
      setTimeout(() => {
        setShowEditForm(false);
        setEditingCenter(null);
        setUpdateSuccess(false);
        setEditFormData({
          location: '',
          centerName: '',
          contactNo: '',
          contactPerson: '',
          email: ''
        });
      }, 2000);
      
    } catch (err) {
      console.error('Failed to update recycling center:', err);
      setUpdateError(err instanceof Error ? err.message : 'Failed to update recycling center');
    } finally {
      setIsUpdating(false);
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
    }
    setShowAddForm(!showAddForm);
  };

  // Handle initiating edit
  const handleEditClick = (e: React.MouseEvent, center: RecyclingCenter) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Edit clicked for center:', center);
    if (!center.centerId) {
      console.error('Cannot edit center without ID');
      setUpdateError('Cannot edit center: missing ID');
      return;
    }
    
    setEditingCenter(center);
    setEditFormData({
      centerId: center.centerId,
      location: center.location,
      centerName: center.centerName,
      contactNo: center.contactNo,
      contactPerson: center.contactPerson,
      email: center.email
    });
    setEditFormErrors({});
    setUpdateError(null);
    setUpdateSuccess(false);
    setShowEditForm(true);
    
    // Close add form if it's open
    if (showAddForm) {
      setShowAddForm(false);
    }
  };

  // Cancel edit form
  const cancelEdit = () => {
    setShowEditForm(false);
    setEditingCenter(null);
    setEditFormErrors({});
    setUpdateError(null);
    setEditFormData({
      location: '',
      centerName: '',
      contactNo: '',
      contactPerson: '',
      email: ''
    });
  };

  // Initiate delete process
  const handleDeleteClick = (e: React.MouseEvent, center: RecyclingCenter) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Delete clicked for center:', center);
    if (!center.centerId) {
      console.error('Cannot delete center without ID');
      setDeleteError('Cannot delete center: missing ID');
      return;
    }
    
    setCenterToDelete(center);
    setShowDeleteConfirm(true);
    setDeleteError(null);
    setDeleteSuccess(false);
    setIsDeleting(false);
    
    // Close any open forms
    if (showAddForm) {
      setShowAddForm(false);
    }
    if (showEditForm) {
      setShowEditForm(false);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    if (isDeleting) return; // Prevent canceling during deletion
    
    setShowDeleteConfirm(false);
    setCenterToDelete(null);
    setDeleteError(null);
    setDeleteSuccess(false);
  };

  // Confirm and execute deletion
  const confirmDelete = async () => {
    if (!centerToDelete || !centerToDelete.centerId) {
      setDeleteError('Invalid center data - missing ID');
      return;
    }
    
    setIsDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(false);
    
    try {
      console.log(`Attempting to delete center with ID: ${centerToDelete.centerId}`);
      
      // Using the correct API endpoint with double slash
      const response = await fetch(`http://localhost:8083/recycling-centers/Delete/${centerToDelete.centerId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Delete response status: ${response.status}`);
      
      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = `Error ${response.status}: ${errorText}`;
          }
        } catch (e) {
          console.log('Could not read error response body');
        }
        throw new Error(errorMessage);
      }
      
      console.log(`Successfully deleted center with ID: ${centerToDelete.centerId}`);
      
      // Remove deleted item from state immediately
      setCenters(prevCenters => prevCenters.filter(center => center.centerId !== centerToDelete.centerId));
      setDeleteSuccess(true);
      
      // Also refresh from server to ensure consistency
      setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
      }, 100);
      
      // Close modal after delay
      setTimeout(() => {
        setShowDeleteConfirm(false);
        setCenterToDelete(null);
        setDeleteSuccess(false);
        setIsDeleting(false);
      }, 2000);
      
    } catch (err) {
      console.error('Failed to delete recycling center:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete recycling center');
    } finally {
      setIsDeleting(false);
    }
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
      
      {/* Add Form - conditionally rendered */}
      {showAddForm && (
        <div className="p-4 lg:p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Add New Recycling Center Branch</h3>
          
          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
              Recycling center branch added successfully!
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
                  value={newCenter.centerName}
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
                  value={newCenter.location}
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
                  value={newCenter.contactPerson}
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
                  value={newCenter.contactNo}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.contactNo ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter contact number"
                />
                {formErrors.contactNo && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.contactNo}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newCenter.email}
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
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Branch</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Form - conditionally rendered */}
      {showEditForm && editingCenter && (
        <div className="p-4 lg:p-6 bg-blue-50 border-b border-blue-200">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Edit Recycling Center Branch</h3>
          
          {updateSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
              Recycling center branch updated successfully!
            </div>
          )}
          
          {updateError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {updateError}
            </div>
          )}
          
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Center Name</label>
                <input
                  type="text"
                  name="centerName"
                  value={editFormData.centerName}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-2 border ${editFormErrors.centerName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter center name"
                />
                {editFormErrors.centerName && (
                  <p className="mt-1 text-sm text-red-500">{editFormErrors.centerName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editFormData.location}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-2 border ${editFormErrors.location ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter location"
                />
                {editFormErrors.location && (
                  <p className="mt-1 text-sm text-red-500">{editFormErrors.location}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={editFormData.contactPerson}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-2 border ${editFormErrors.contactPerson ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter contact person name"
                />
                {editFormErrors.contactPerson && (
                  <p className="mt-1 text-sm text-red-500">{editFormErrors.contactPerson}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="text"
                  name="contactNo"
                  value={editFormData.contactNo}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-2 border ${editFormErrors.contactNo ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter contact number"
                />
                {editFormErrors.contactNo && (
                  <p className="mt-1 text-sm text-red-500">{editFormErrors.contactNo}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-2 border ${editFormErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter email address"
                />
                {editFormErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{editFormErrors.email}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-50"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Branch</span>
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
                  ID
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
                <tr key={center.centerId || `center-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{center.centerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{center.centerId || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                    <div className="flex items-center space-x-3">
                      <button 
                        type="button"
                        onClick={(e) => handleEditClick(e, center)}
                        className="text-blue-600 hover:text-blue-900 flex items-center px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                        aria-label={`Edit ${center.centerName}`}
                        disabled={isDeleting || isUpdating || isSubmitting}
                      >
                        <Edit className="w-4 h-4" />
                        <span className="ml-1 hidden sm:inline">Edit</span>
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => handleDeleteClick(e, center)}
                        className="text-red-600 hover:text-red-900 flex items-center px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        aria-label={`Delete ${center.centerName}`}
                        disabled={isDeleting || isUpdating || isSubmitting}
                      >
                        <Trash className="w-4 h-4" />
                        <span className="ml-1 hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && centerToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-5">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <Trash className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Recycling Center</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete "<strong>{centerToDelete.centerName}</strong>" in {centerToDelete.location}? 
                This action cannot be undone.
              </p>
            </div>
            
            {deleteError && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                <p className="text-sm">{deleteError}</p>
              </div>
            )}
            
            {deleteSuccess && (
              <div className="mb-5 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                <p className="text-sm">Recycling center deleted successfully!</p>
              </div>
            )}
            
            {isDeleting ? (
              <div className="text-center py-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 mb-4">
                  <svg className="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Deleting...</h3>
                <p className="text-sm text-gray-500">Please wait while we process your request.</p>
              </div>
            ) : (
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  disabled={deleteSuccess}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={deleteSuccess}
                >
                  Delete Center
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;