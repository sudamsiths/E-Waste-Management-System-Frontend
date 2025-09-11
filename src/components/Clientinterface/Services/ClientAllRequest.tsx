import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import { RefreshCcw, Package, MapPin, Eye, Filter, Search } from 'lucide-react';

// Define interfaces for garbage request data
interface GarbageRequest {
  id?: number;
  title: string;
  location: string;
  category: string;
  weight: string;
  description: string;
  points: number;
  status: string;
  userName: string;
  SubmissionDate?: string | Date; // Updated to accept both string and Date
  image?: string;
}

// Status color mapping
const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  APPROVED: 'bg-green-100 text-green-800 border-green-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
  COMPLETED: 'bg-purple-100 text-purple-800 border-purple-200',
  CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200'
};

// Category icons mapping
const categoryIcons: Record<string, string> = {
  IT_EQUIPMENT: '💻',
  CONSUMER_ELECTRONICS: '📱',
  LIGHTING: '💡',
  TOOLS: '🔧',
  TOYS: '🎮',
  MEDICAL_DEVICES: '⚕️',
  MONITORING_INSTRUMENTS: '🔍',
  BATTERIES: '🔋',
  SOLAR_PANELS: '☀️',
  OTHER: '📦'
};

const ClientAllRequest: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<GarbageRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<GarbageRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Filter and search states
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Get username from localStorage
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setCurrentUsername(username);
    } else {
      setError('Please log in to view your requests');
      // Redirect to login if no user is logged in
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [navigate]);

  // Fetch user's garbage requests
  useEffect(() => {
    if (currentUsername) {
      fetchUserRequests();
    }
  }, [currentUsername, refreshTrigger]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...requests];

    // Apply status filter
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(request => request.status === selectedStatus);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.SubmissionDate || '').getTime() - new Date(a.SubmissionDate || '').getTime();
        case 'oldest':
          return new Date(a.SubmissionDate || '').getTime() - new Date(b.SubmissionDate || '').getTime();
        case 'points_high':
          return b.points - a.points;
        case 'points_low':
          return a.points - b.points;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredRequests(filtered);
  }, [requests, selectedStatus, searchTerm, sortBy]);

  const fetchUserRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Fetching requests for user: ${currentUsername}`);
      
      const response = await fetch(`http://localhost:8085/garbage/Garbage/SearchBy/${currentUsername}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`API Response status: ${response.status}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // No requests found for this user
          setRequests([]);
          return;
        }
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Retrieved requests:', data);
      
      // Ensure data is an array
      const requestsArray = Array.isArray(data) ? data : [data];
      setRequests(requestsArray);
      
    } catch (err) {
      console.error('Failed to fetch user requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch your requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || '📦';
  };

  const totalPoints = requests.reduce((sum, request) => sum + request.points, 0);
  const completedRequests = requests.filter(request => request.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8" style={{ paddingTop: '85px', margin: '0 20px'  }}>
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                Your Pickup Requests
              </h1>
              <p className="text-gray-600">
                Track and manage all your e-waste pickup requests for <span className="font-semibold text-green-600">{currentUsername}</span>
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="flex gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-green-600">{requests.length}</div>
                <div className="text-sm text-green-700">Total Requests</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-blue-600">{completedRequests}</div>
                <div className="text-sm text-blue-700">Completed</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-purple-600">{totalPoints}</div>
                <div className="text-sm text-purple-700">Total Points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="points_high">Highest Points</option>
                <option value="points_low">Lowest Points</option>
                <option value="title">Title A-Z</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <span className="ml-3 text-gray-600">Loading your requests...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredRequests.length === 0 && requests.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Requests Found</h3>
            <p className="text-gray-600 mb-6">You haven't submitted any pickup requests yet.</p>
            <button
              onClick={() => navigate('/ClientRequest')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Your First Request
            </button>
          </div>
        )}

        {/* No Results State */}
        {!isLoading && !error && filteredRequests.length === 0 && requests.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Matching Requests</h3>
            <p className="text-gray-600 mb-6">No requests match your current filters.</p>
            <button
              onClick={() => {
                setSelectedStatus('ALL');
                setSearchTerm('');
              }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Requests Grid */}
        {!isLoading && !error && filteredRequests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request, index) => (
              <div key={request.id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Request Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">
                        {getCategoryIcon(request.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate max-w-[150px]">
                          {request.title}
                        </h3>
                        <p className="text-sm text-gray-500">{request.category.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{request.location}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {request.description || 'No description provided'}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{request.points}</div>
                      <div className="text-xs text-gray-500">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{request.weight || 'N/A'}</div>
                      <div className="text-xs text-gray-500">Weight (kg)</div>
                    </div>
                  </div>

                
                </div>

                {/* Request Footer */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => {
                      // You can implement a detailed view modal here
                      console.log('View details for request:', request);
                    }}
                    className="w-full flex items-center justify-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {!isLoading && !error && filteredRequests.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredRequests.length} of {requests.length} requests
            {selectedStatus !== 'ALL' && ` (filtered by ${selectedStatus})`}
            {searchTerm && ` (filtered by "${searchTerm}")`}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientAllRequest;