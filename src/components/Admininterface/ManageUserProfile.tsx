import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Download, Plus, MoreHorizontal, ArrowUpDown, RefreshCcw, AlertCircle, Trash, Check, X, Edit } from 'lucide-react';
import axios from 'axios';

// Define Role type to match backend
type Role = "ADMIN" | "CUSTOMER";

// Updated User interface to match backend structure
interface User {
  userId: number;
  fullName: string;
  contactNo: string;
  username: string;
  address: string;
  email: string;
  role: Role;
  // Additional UI-specific fields
  status?: 'Active' | 'Inactive';
  lastActive?: string;
  avatar?: string;
}

interface FilterState {
  search: string;
  role: string;
  status: string;
  date: string;
}

interface SortConfig {
  key: keyof User | null;
  direction: 'asc' | 'desc';
}

const ManageUserProfile: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    role: '',
    status: '',
    date: ''
  });

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch users from backend API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8081/users/getAll');
      
      // Map backend data to our User interface
      const mappedUsers: User[] = response.data.map((user: any) => ({
        userId: user.userId,
        fullName: user.fullName || 'Unknown',
        contactNo: user.contactNo || 'N/A',
        username: user.username,
        address: user.address || 'N/A',
        email: user.email,
        role: user.role || "CUSTOMER",
        // Set default UI fields - you can adjust these based on your backend data
        status: 'Active', // Default to Active since backend doesn't provide status
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username)}&background=random`
      }));

      setUsers(mappedUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setShowRoleDropdown(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node) && !isDeleting) {
        setDeleteModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Status badge styling
  const getStatusBadgeStyle = (status: string = 'Active') => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Inactive':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(user => user.userId)));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual user selection
  const handleUserSelect = (userId: number) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
    setSelectAll(newSelected.size === filteredUsers.length);
  };

  // Handle sorting
  const handleSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort users
  const sortedUsers = React.useMemo(() => {
    if (!sortConfig.key) return users;

    return [...users].sort((a, b) => {
      const aValue = a[sortConfig.key!] ?? '';
      const bValue = b[sortConfig.key!] ?? '';

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [users, sortConfig]);

  // Filter users
  const filteredUsers = React.useMemo(() => {
    return sortedUsers.filter(user => {
      const searchMatch = !filters.search || 
        user.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.username?.toLowerCase().includes(filters.search.toLowerCase());
        
      const roleMatch = !filters.role || user.role?.toString() === filters.role;
      const statusMatch = !filters.status || user.status === filters.status;
      
      return searchMatch && roleMatch && statusMatch;
    });
  }, [sortedUsers, filters]);

  // Paginate users
  const paginatedUsers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  // Handle a retry when API fails
  const handleRetry = () => {
    fetchUsers();
  };

  // Update selectAll when filtered users change
  useEffect(() => {
    setSelectAll(selectedUsers.size > 0 && selectedUsers.size === filteredUsers.length);
  }, [selectedUsers, filteredUsers]);

  // Handle click outside for delete modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node) && !isDeleting) {
        setDeleteModalOpen(false);
      }
    };

    if (deleteModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [deleteModalOpen, isDeleting]);

  // Function to initiate user deletion
  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  // Function to delete user
  const deleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      // Call the delete endpoint with the username
      await axios.delete(`http://localhost:8081/users/delete/${userToDelete.username}`);
      
      // Remove the user from the local state
      setUsers(prevUsers => prevUsers.filter(user => user.username !== userToDelete.username));
      
      // Remove from selected users if present
      if (selectedUsers.has(userToDelete.userId)) {
        const newSelected = new Set(selectedUsers);
        newSelected.delete(userToDelete.userId);
        setSelectedUsers(newSelected);
      }
      
      setDeleteModalOpen(false);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              User Management
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Manage all users in one place. Control access, assign roles, and monitor activity across your platform.
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                {/* Search Filter */}
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={filters.search}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, search: e.target.value }));
                        setCurrentPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Role Filter */}
                <div ref={roleDropdownRef} className="relative min-w-32">
                  <button
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  >
                    <span className="text-gray-700">
                      {filters.role || 'All Roles'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  {showRoleDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {['', 'ADMIN', 'CUSTOMER'].map((role) => (
                        <button
                          key={role}
                          onClick={() => {
                            setFilters(prev => ({ ...prev, role }));
                            setShowRoleDropdown(false);
                            setCurrentPage(1);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {role || 'All Roles'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Filter */}
                <div ref={statusDropdownRef} className="relative min-w-32">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  >
                    <span className="text-gray-700">
                      {filters.status || 'All Status'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {['', 'Active', 'Inactive'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setFilters(prev => ({ ...prev, status }));
                            setShowStatusDropdown(false);
                            setCurrentPage(1);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {status || 'All Status'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleRetry} 
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  disabled={loading}
                >
                  <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                
                <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  <Plus className="w-4 h-4" />
                  <span>Add Clients</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
                <div className="flex items-center mb-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-medium text-red-800">Error Loading Users</h3>
                </div>
                <p className="text-red-700 mb-4">{error}</p>
                <button 
                  onClick={handleRetry}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Table */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Results Info */}
            <div className="px-4 md:px-6 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((currentPage - 1) * rowsPerPage) + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * rowsPerPage, filteredUsers.length)}</span> of{' '}
                  <span className="font-medium">{filteredUsers.length}</span> users
                </p>
                {selectedUsers.size > 0 && (
                  <p className="text-sm text-blue-600">
                    {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="px-4 md:px-6 py-12">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
                  <p className="text-gray-500">
                    {users.length === 0 
                      ? "No users have been added to the system yet." 
                      : "Try adjusting your search criteria."}
                  </p>
                </div>
              </div>
            )}

            {/* Table */}
            {filteredUsers.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 md:px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </th>
                        
                        <th 
                          className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('fullName')}
                        >
                          <div className="flex items-center gap-2">
                            <span>Full Name</span>
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </th>
                        
                        <th 
                          className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                          onClick={() => handleSort('email')}
                        >
                          <div className="flex items-center gap-2">
                            <span>Email</span>
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </th>
                        
                        <th 
                          className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden md:table-cell"
                          onClick={() => handleSort('contactNo')}
                        >
                          <div className="flex items-center gap-2">
                            <span>Contact</span>
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </th>
                        
                        <th 
                          className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden lg:table-cell"
                          onClick={() => handleSort('username')}
                        >
                          <div className="flex items-center gap-2">
                            <span>Username</span>
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </th>
                        
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          Status
                        </th>
                        
                        <th 
                          className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('role')}
                        >
                          <div className="flex items-center gap-2">
                            <span>Role</span>
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </th>
                        
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedUsers.map((user) => (
                        <tr key={user.userId} className="hover:bg-gray-50">
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedUsers.has(user.userId)}
                              onChange={() => handleUserSelect(user.userId)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <img 
                                  className="h-8 w-8 rounded-full object-cover" 
                                  src={user.avatar} 
                                  alt={user.fullName}
                                />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.fullName}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="text-sm text-gray-900">{user.contactNo}</div>
                          </td>
                          
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                            <div className="text-sm text-gray-900">{user.username}</div>
                          </td>
                          
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeStyle(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'ADMIN' 
                                ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center gap-2 justify-end">
                              <button 
                                className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                                title="Edit user"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                              </button>
                              <button 
                                className="p-1 rounded-full hover:bg-red-100 transition-colors"
                                title="Delete user"
                                onClick={() => openDeleteModal(user)}
                              >
                                <Trash className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-4 md:px-6 py-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Show</span>
                        <select 
                          value={rowsPerPage} 
                          onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          {[5, 10, 20, 50].map(value => (
                            <option key={value} value={value}>{value}</option>
                          ))}
                        </select>
                        <span className="text-sm text-gray-700">per page</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">First page</span>
                          ⟪
                        </button>
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous page</span>
                          ⟨
                        </button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum: number;
                          
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          if (pageNum > 0 && pageNum <= totalPages) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                  currentPage === pageNum 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                          return null;
                        })}
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next page</span>
                          ⟩
                        </button>
                        
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Last page</span>
                          ⟫
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            ref={deleteModalRef}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in-up"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <Trash className="h-8 w-8 text-red-600" />
              </div>
              
              <h3 className="text-xl font-medium text-gray-900 mb-2">Delete User</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete the user <span className="font-medium text-gray-700">{userToDelete.username}</span>?
                This action cannot be undone.
              </p>
              
              {deleteError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  {deleteError}
                </div>
              )}
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors disabled:opacity-50"
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center justify-center gap-2 min-w-[100px] disabled:opacity-50"
                  onClick={deleteUser}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash className="h-4 w-4" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUserProfile;