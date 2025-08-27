import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './AdminDashboard.css';
import ManageUserProfile from './ManageUserProfile';
import ManageAgentProfile from './ManageAgentProfile';
import AddAgent from './AddAgent';
import CustomerAccountSettings from '../Clientinterface/CustomerAccountSettings';
import { RefreshCcw } from 'lucide-react';

// Define AdminDashboard props interface
interface AdminDashboardProps {
  initialTab?: string;
}

// Define TypeScript interfaces for data structures
interface StatData {
  title: string;
  value: string;
  change: string;
  positive: boolean;
}

interface RequestData {
  id: string;
  user: string;
  location: string;
  items: string;
  status: 'completed' | 'in-progress' | 'pending';
  weight: string;
  category: string;
}

// Define Category type to match backend (enum replaced with union type for erasableSyntaxOnly)
type Category =
  | "ELECTRONIC_WASTE"
  | "PLASTIC"
  | "METAL"
  | "PAPER"
  | "GLASS"
  | "ORGANIC"
  | "HAZARDOUS"
  | "OTHER";

// Interface for Garbage entity
interface GarbageItem {
  id: number;
  title: string;
  category: Category;
  image: string;
  points: number;
  location: string;
  weight: number;
  description: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'dashboard' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [unauthorized, setUnauthorized] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [garbageItems, setGarbageItems] = useState<GarbageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GarbageItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  // New state variables for pickup requests
  const [pickupRequests, setPickupRequests] = useState<RequestData[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [currentRequestPage, setCurrentRequestPage] = useState(1);
  const [requestsPerPage] = useState(5);
  
  // Add state for dynamic statistics
  const [statsData, setStatsData] = useState<StatData[]>([
    { title: 'Total Requests', value: '0', change: '+0%', positive: true },
    { title: 'Recycled Material', value: '0 tons', change: '+0%', positive: true },
    { title: 'Carbon Saved', value: '0 kg', change: '+0%', positive: true },
    { title: 'Pending Pickups', value: '0', change: '0%', positive: false }
  ]);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Calculate total pages and paginated requests
  const totalRequestPages = useMemo(() => Math.ceil(pickupRequests.length / requestsPerPage), [pickupRequests, requestsPerPage]);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentRequestPage - 1) * requestsPerPage;
    const endIndex = startIndex + requestsPerPage;
    return pickupRequests.slice(startIndex, endIndex);
  }, [pickupRequests, currentRequestPage, requestsPerPage]);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const logoutConfirmRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Sample data for statistics
  const statsDataSample: StatData[] = [
    { title: 'Total Requests', value: '2,547', change: '+12.5%', positive: true },
    { title: 'Recycled Material', value: '18.3 tons', change: '+7.2%', positive: true },
    { title: 'Carbon Saved', value: '342 kg', change: '+5.1%', positive: true },
    { title: 'Pending Pickups', value: '24', change: '-3.6%', positive: false }
  ];

  // Sample data for recent requests
  const recentRequests: RequestData[] = [
    { id: 'REQ001', user: 'John Doe', location: 'New York, NY', items: 'Laptop, Phone', status: 'completed', weight: '2.3 kg', category: 'IT EQUIPMENT' },
    { id: 'REQ002', user: 'Jane Smith', location: 'Los Angeles, CA', items: 'Monitor', status: 'in-progress', weight: '5.1 kg', category: 'LIGHTING' },
    { id: 'REQ003', user: 'Mike Johnson', location: 'Chicago, IL', items: 'Printer', status: 'pending', weight: '8.7 kg', category: 'TOOLS' },
    { id: 'REQ004', user: 'Sarah Williams', location: 'Boston, MA', items: 'TV, Cables', status: 'completed', weight: '12.5 kg', category: 'APPLIANCES' }
  ];

  useEffect(() => {
    // Check if user is authenticated and has admin role
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    
    if (!token) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }
    
    // Strict role check for admin dashboard
    if (role !== "ADMIN") {
      // Show unauthorized message and redirect after delay
      setUnauthorized(true);
      
      // Store the unauthorized attempt reason
      localStorage.setItem("authError", "You don't have permission to access the Admin Dashboard. Redirecting to appropriate dashboard...");
      
      setTimeout(() => {
        // Redirect to appropriate dashboard based on role
        if (role === "CUSTOMER") {
          navigate("/Navigate");
        } else {
          // If role is undefined or something else, go to login
          navigate("/login");
        }
      }, 3000);
      return;
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle profile dropdown with proper state management
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(prevState => !prevState);
    
    // Close logout confirmation if it's open when toggling profile
    if (showLogoutConfirm) {
      setShowLogoutConfirm(false);
    }
  };

  // Handle admin logout
  const initiateLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const confirmLogout = () => {
    setIsLoggingOut(true);
    
    // Clear all auth data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("rememberMe");
    
    // Set logout success message to display on login page
    localStorage.setItem("logoutSuccess", "true");
    
    // Show logout feedback for a brief moment before redirecting
    setTimeout(() => {
      navigate('/login');
    }, 800);
  };

  // Fetch garbage data from API
  const fetchGarbageData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8085/garbage/getAll');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      const data: GarbageItem[] = await response.json();
      setGarbageItems(data);
    } catch (err) {
      console.error('Failed to fetch garbage data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch garbage data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch pickup requests from backend API - updated to use the "latest" endpoint
  const fetchPickupRequests = async () => {
    try {
      setRequestsLoading(true);
      setRequestsError(null);
      
      // Use the specific endpoint for latest garbage items
      const response = await fetch('http://localhost:8085/garbage/latest', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      // Parse response
      const data = await response.json();
      console.log("Latest garbage items:", data);
      
      // Format data for display - ensure we get an array even if structure varies
      const itemsArray = Array.isArray(data) ? data : 
                       (data.content ? data.content : 
                       (data.items ? data.items : 
                       (data.data ? data.data : [])));
                       
      // Take only the 5 most recent items if there are more
      const latestItems = itemsArray.slice(0, 5);
      
      // Map to RequestData format for display
      const mappedRequests: RequestData[] = latestItems.map((item: any) => ({
        id: String(item.id || ''),
        user: item.userName || item.createdBy || 'Unknown',
        location: item.location || 'Not specified',
        items: item.title || item.description || 'Unknown item',
        status: item.status ? 
          (String(item.status).toLowerCase().includes('complete') ? 'completed' : 
          (String(item.status).toLowerCase().includes('progress') ? 'in-progress' : 'pending')) : 'pending',
        weight: `${item.weight || 0} kg`,
        category: item.category || 'MISC'
      }));
      
      setPickupRequests(mappedRequests);
      
    } catch (err) {
      console.error('Failed to fetch latest garbage items:', err);
      setRequestsError(err instanceof Error ? err.message : 'Failed to fetch latest garbage items');
    } finally {
      setRequestsLoading(false);
    }
  };

  // Fetch dashboard statistics from backend
  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      
      // Fetch total requests count
      const requestsPromise = fetch('http://localhost:8085/garbage/GetCount/Garbages')
        .then(res => res.ok ? res.json() : 0)
        .catch(() => 0);
      
      // Fetch carbon saved (garbage kg)
      const carbonPromise = fetch('http://localhost:8085/garbage/GetCount/GarbagesKG')
        .then(res => res.ok ? res.json() : 0)
        .catch(() => 0);
        
      // Wait for both requests to complete
      const [requestsCount, carbonKg] = await Promise.all([requestsPromise, carbonPromise]);
      
      // Format the values for display
      const formattedRequests = Number(requestsCount).toLocaleString();
      const formattedCarbon = Number(carbonKg).toLocaleString();
      
      // Calculate recycled material estimate (just an example - adjust the formula as needed)
      const recycledTons = (Number(carbonKg) / 10).toFixed(1);
      
      // Update the stats data with fetched values
      setStatsData(prevStats => {
        const newStats = [...prevStats];
        
        // Update Total Requests
        newStats[0] = {
          ...newStats[0],
          value: formattedRequests
        };
        
        // Update Recycled Material (example calculation)
        newStats[1] = {
          ...newStats[1],
          value: `${recycledTons} tons`
        };
        
        // Update Carbon Saved
        newStats[2] = {
          ...newStats[2],
          value: `${formattedCarbon} kg`
        };
        
        return newStats;
      });
      
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch garbage data on component mount or when activeTab changes to 'garbage'
  useEffect(() => {
    if (activeTab === 'garbage') {
      fetchGarbageData();
    }
  }, [activeTab]);

  // Fetch pickup requests when dashboard tab is active
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchPickupRequests();
      fetchDashboardStats();
    }
  }, [activeTab]);

  // Update active tab when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Enhanced click outside handler for both dialogs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle profile dropdown
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      
      // Handle logout confirmation
      if (showLogoutConfirm && logoutConfirmRef.current && !logoutConfirmRef.current.contains(event.target as Node)) {
        // Only close if we're not in the logging out state
        if (!isLoggingOut) {
          setShowLogoutConfirm(false);
        }
      }

      // Handle delete confirmation
      if (showDeleteConfirm && deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node)) {
        // Only close if we're not in the deleting state
        if (!isDeleting) {
          setShowDeleteConfirm(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown, showLogoutConfirm, isLoggingOut, showDeleteConfirm, isDeleting]);

  // Add keyboard accessibility for modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showProfileDropdown) setShowProfileDropdown(false);
        if (showLogoutConfirm && !isLoggingOut) setShowLogoutConfirm(false);
        if (showDeleteConfirm && !isDeleting) setShowDeleteConfirm(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showProfileDropdown, showLogoutConfirm, isLoggingOut, showDeleteConfirm, isDeleting]);

  // Close logout confirmation when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logoutConfirmRef.current && !logoutConfirmRef.current.contains(event.target as Node)) {
        setShowLogoutConfirm(false);
      }
    };

    if (showLogoutConfirm) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoutConfirm]);

  // Initiate deletion process
  const handleDeleteClick = (item: GarbageItem) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
    setDeleteError(null);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  // Confirm and execute deletion
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const response = await fetch(`http://localhost:8085/garbage/delete/${itemToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Remove deleted item from state
      setGarbageItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (err) {
      console.error('Failed to delete item:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Render the garbage items table
  const renderGarbageTable = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error Loading Data</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchGarbageData}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!garbageItems.length) {
      return (
        <div className="text-center py-8 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <p className="mt-2 text-sm">No garbage items found</p>
        </div>
      );
    }

    return (
      <>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {garbageItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">{item.title}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">{item.location}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">{item.weight} kg</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">{item.points}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700 flex gap-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">Edit</button>
                    <button 
                      onClick={() => handleDeleteClick(item)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Cards */}
        <div className="md:hidden">
          {garbageItems.map((item) => (
            <div key={item.id} className="border-b border-gray-200 p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-900">{item.title}</span>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {item.category.replace('_', ' ')}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">ID:</div>
                <div className="text-right">{item.id}</div>
                
                <div className="text-gray-500">Location:</div>
                <div className="text-right">{item.location}</div>
                
                <div className="text-gray-500">Weight:</div>
                <div className="text-right">{item.weight} kg</div>
                
                <div className="text-gray-500">Points:</div>
                <div className="text-right">{item.points}</div>
              </div>
              
              <div className="mt-3 flex justify-end gap-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">Edit</button>
                <button 
                  onClick={() => handleDeleteClick(item)}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  // Show unauthorized message if needed
  if (unauthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="flex items-center justify-center text-red-600 mb-6">
            <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-center text-2xl font-bold text-gray-800 mb-2">Unauthorized Access</h1>
          <p className="text-center text-gray-600 mb-6">
            You don't have permission to access the Admin Dashboard. Redirecting you to the appropriate dashboard.
          </p>
          <div className="flex justify-center">
            <div className="inline-block h-2 w-32 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full bg-red-500 animate-progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // add derived summary for Recent Pickup Requests subtitle
  const recentSummary = useMemo(() => {
	if (requestsLoading) return 'Loading latest items from server...';
	if (requestsError) return requestsError;
	if (!pickupRequests.length) return 'No recent garbage items found.';
	// show count and up to 3 item titles for brevity
	const titles = pickupRequests.map(r => r.items).slice(0, 3).join(', ');
	return `Showing ${pickupRequests.length} latest item(s): ${titles}${pickupRequests.length > 3 ? ', …' : ''}`;
}, [requestsLoading, requestsError, pickupRequests]);

  return (
    <div className="admin-dashboard bg-gray-100 min-h-screen flex flex-col">
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 bg-slate-800 text-white z-50 shadow-md">
          <div className="flex justify-between items-center px-4 py-3">
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-xs text-slate-300">E-Waste Management</p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Profile Button on Mobile */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium hover:bg-blue-600"
                  aria-label="User profile menu"
                >
                  AD
                </button>
                
                {/* Profile Dropdown on Mobile */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800">Admin User</p>
                      <p className="text-xs text-gray-500">admin@ewaste.com</p>
                    </div>
                    <button
                      onClick={initiateLogout} // Changed to trigger logout confirmation
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                    </div>
                )}
              </div>
              
              <button
                onClick={toggleMobileMenu}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                aria-label="Toggle navigation menu"
              >
                <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                  <span className="bg-white"></span>
                  <span className="bg-white"></span>
                  <span className="bg-white"></span>
                </div>
              </button>
            </div>
          </div>
        </header>
      )}

      <div className="flex h-full">
        {/* Sidebar */}
        <aside 
          className={`sidebar-wrapper bg-slate-800 text-white ${isMobile ? 'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out' : ''} ${isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}`}
          style={{ width: isMobile ? '280px' : '21%', marginTop: isMobile ? '60px' : '0' }}
        >
          <div className="sidebar-inner h-full flex flex-col">
            {/* Sidebar Header - Only visible on desktop */}
            {!isMobile && (
              <div className="p-6">
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-sm text-slate-400 mt-1">E-Waste Management</p>
              </div>
            )}
            
            {/* Navigation Items */}
            <nav className="flex-grow">
              <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                <div className="flex items-center gap-3 py-3 px-6">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                  <span>Dashboard</span>
                </div>
                {activeTab === 'dashboard' && <div className="nav-indicator"></div>}
              </div>
              
              <div className="px-6 py-4">
                <p className="text-xs uppercase text-slate-400 font-medium mb-2">Management</p>

                <div className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                  <div className="flex items-center gap-3 py-3 px-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <span>Users</span>
                  </div>
                  {activeTab === 'users' && <div className="nav-indicator"></div>}
                </div>

                <div className={`nav-item ${activeTab === 'agents' ? 'active' : ''}`} onClick={() => setActiveTab('agents')}>
                  <div className="flex items-center gap-3 py-3 px-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <span>Agents</span>
                  </div>
                  {activeTab === 'agents' && <div className="nav-indicator"></div>}
                </div>
                
                {/* New Add Agent Navigation Item */}
                <div className={`nav-item ${activeTab === 'add-agent' ? 'active' : ''}`} onClick={() => setActiveTab('add-agent')}>
                  <div className="flex items-center gap-3 py-3 px-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    <span>Add Agent</span>
                  </div>
                  {activeTab === 'add-agent' && <div className="nav-indicator"></div>}
                </div>
                
                <div className={`nav-item ${activeTab === 'pickups' ? 'active' : ''}`} onClick={() => setActiveTab('pickups')}>
                  <div className="flex items-center gap-3 py-3 px-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7l4-4m0 0l4 4m-4-4v18"></path>
                    </svg>
                    <span>Pickups</span>
                  </div>
                  {activeTab === 'pickups' && <div className="nav-indicator"></div>}
                </div>
                
                {/* New Garbage Management Nav Item */}
                <div className={`nav-item ${activeTab === 'garbage' ? 'active' : ''}`} onClick={() => setActiveTab('garbage')}>
                  <div className="flex items-center gap-3 py-3 px-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <span>Garbage</span>
                  </div>
                  {activeTab === 'garbage' && <div className="nav-indicator"></div>}
                </div>
                
                <div className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
                  <div className="flex items-center gap-3 py-3 px-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span>Reports</span>
                  </div>
                  {activeTab === 'reports' && <div className="nav-indicator"></div>}
                </div>
                
                <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                  <div className="flex items-center gap-3 py-3 px-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>Settings</span>
                  </div>
                  {activeTab === 'settings' && <div className="nav-indicator"></div>}
                </div>
              </div>
            </nav>
            
            {/* User Profile - Updated to be clickable */}
            <div className="admin-profile-section mt-auto border-t border-slate-700">
              <div className="flex flex-col">
                {/* Admin Profile Button */}
                <div className="relative" ref={!isMobile ? profileDropdownRef : undefined}>
                  <button 
                    onClick={toggleProfileDropdown}
                    className="flex items-center gap-3 p-4 bg-slate-900 hover:bg-slate-800 w-full transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      AD
                    </div>
                    <div>
                      <p className="text-sm font-medium text-left">Admin User</p>
                      <p className="text-xs text-slate-400 text-left">admin@ewaste.com</p>
                    </div>
                    <svg className={`w-4 h-4 ml-auto transform transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Profile Dropdown (Desktop) */}
                  {!isMobile && showProfileDropdown && (
                    <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-t-lg shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800">Admin User</p>
                        <p className="text-xs text-gray-500">admin@ewaste.com</p>
                      </div>
                      <button
                        onClick={initiateLogout} // Changed to trigger logout confirmation
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
                
                
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-4 lg:p-6" style={{ marginLeft: isMobile ? '0' : '0', marginTop: isMobile ? '60px' : '0' }}>
          {/* Page Header */}
          <header className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-sm text-gray-500">Monitor your e-waste management operations</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <svg 
                    className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* Desktop Profile Button (for better visibility) */}
                {!isMobile && (
                  <div className="relative" ref={isMobile ? undefined : profileDropdownRef}>
                    <button
                      onClick={toggleProfileDropdown}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-gray-700"
                      aria-label="User profile menu"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        AD
                      </div>
                      <span className="text-sm font-medium">Admin</span>
                      <svg className={`w-4 h-4 transform transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Profile Dropdown (Desktop) */}
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-semibold text-gray-800">Admin User</p>
                          <p className="text-xs text-gray-500">admin@ewaste.com</p>
                        </div>
                        <Link to="/customer-account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Your Profile
                        </Link>
                        <Link to="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Settings
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={initiateLogout} // Changed to trigger logout confirmation
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                        </div>
                      )}
                    </div>
                )}
              </div>
            </div>
          </header>
          
          {/* Conditional Content Based on Active Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
                {statsData.map((stat, index) => (
                  <div key={index} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${stat.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                      {statsLoading ? (
                        <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse"></span>
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Charts Section */}
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Waste Collection Trends</h2>
                  <p className="text-sm text-gray-500">Monthly e-waste collection overview</p>
                </div>
                
                <div className="h-64 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                  {/* This would be replaced with an actual chart component */}
                  <div className="text-center p-4">
                    <svg className="w-10 h-10 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                    </svg>
                    <p className="mt-2 text-gray-500">Chart visualization would be rendered here</p>
                  </div>
                </div>
              </div>
              
              {/* Recent Pickup Requests Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Recent Pickup Requests Table Header */}
                <div className="p-4 lg:p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">Recent Pickup Requests</h2>
                      <p className="text-sm text-gray-500">Latest 5 garbage items from database</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={fetchPickupRequests}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                        disabled={requestsLoading}
                      >
                        <RefreshCcw className={`w-4 h-4 ${requestsLoading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                      </button>
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
                        New Request
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Loading State */}
                {requestsLoading && (
                  <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                  </div>
                )}
                
                {/* Error State */}
                {requestsError && !requestsLoading && (
                  <div className="p-6">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                      <p className="font-medium">Error Loading Pickup Requests</p>
                      <p className="text-sm">{requestsError}</p>
                      <button 
                        onClick={fetchPickupRequests}
                        className="mt-2 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded hover:bg-red-200"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Empty State */}
                {!requestsLoading && !requestsError && pickupRequests.length === 0 && (
                  <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-8 0a2 2 0 110-4 2 2 0 010 4zm0 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H9z"></path>
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No pickup requests</h3>
                    <p className="mt-1 text-sm text-gray-500">No pickup requests have been made yet.</p>
                  </div>
                )}
                
                {/* Data Table */}
                {!requestsLoading && !requestsError && pickupRequests.length > 0 && (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {paginatedRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-50">
                              <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                              <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">{request.user}</td>
                              <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">{request.location}</td>
                              <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">{request.items}</td>
                              <td className="py-4 px-4 whitespace-nowrap text-sm">
                                <span 
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                    ${request.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                      request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                                        'bg-yellow-100 text-yellow-800'}`}
                              >
                                {request.status === 'completed' ? 'Completed' : 
                                  request.status === 'in-progress' ? 'In Progress' : 'Pending'}
                              </span>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">{request.weight}</td>
                              <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">{request.category}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Mobile Cards */}
                    <div className="md:hidden">
                      {paginatedRequests.map((request) => (
                        <div key={request.id} className="border-b border-gray-200 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-gray-900">{request.id}</span>
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${request.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-yellow-100 text-yellow-800'}`}
                            >
                              {request.status === 'completed' ? 'Completed' : 
                                request.status === 'in-progress' ? 'In Progress' : 'Pending'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-500">User:</div>
                            <div className="text-right">{request.user}</div>
                            
                            <div className="text-gray-500">Location:</div>
                            <div className="text-right">{request.location}</div>
                            
                            <div className="text-gray-500">Items:</div>
                            <div className="text-right">{request.items}</div>
                            
                            <div className="text-gray-500">Weight:</div>
                            <div className="text-right">{request.weight}</div>
                            
                            <div className="text-gray-500">Category:</div>
                            <div className="text-right">{request.category}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                {/* Pagination */}
                {!requestsLoading && !requestsError && pickupRequests.length > 0 && (
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentRequestPage(prev => Math.max(1, prev - 1))}
                        disabled={currentRequestPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentRequestPage(prev => Math.min(totalRequestPages, prev + 1))}
                        disabled={currentRequestPage === totalRequestPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{((currentRequestPage - 1) * requestsPerPage) + 1}</span> to{' '}
                          <span className="font-medium">{Math.min(currentRequestPage * requestsPerPage, pickupRequests.length)}</span> of{' '}
                          <span className="font-medium">{pickupRequests.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentRequestPage(1)}
                            disabled={currentRequestPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <span className="sr-only">First</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          
                          {/* Page numbers */}
                          {Array.from({ length: Math.min(5, totalRequestPages) }, (_, i) => {
                            let pageNumber: number;
                            
                            // Calculate which page numbers to show
                            if (totalRequestPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentRequestPage <= 3) {
                              pageNumber = i + 1;
                            } else if (currentRequestPage >= totalRequestPages - 2) {
                              pageNumber = totalRequestPages - 4 + i;
                            } else {
                              pageNumber = currentRequestPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => setCurrentRequestPage(pageNumber)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentRequestPage === pageNumber
                                    ? 'z-10 bg-green-50 border-green-500 text-green-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => setCurrentRequestPage(totalRequestPages)}
                            disabled={currentRequestPage === totalRequestPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <span className="sr-only">Last</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Garbage Management Tab Content */}
          {activeTab === 'garbage' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 lg:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Garbage Management</h2>
                    <p className="text-sm text-gray-500">Manage e-waste and recycling materials</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={fetchGarbageData} 
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Add New Item
                    </button>
                  </div>
                </div>
              </div>
              
              {renderGarbageTable()}
            </div>
          )}

          {/* Users Tab Content */}
          {activeTab === 'users' && (
            <ManageUserProfile />
          )}
          
          {/* Agents Tab Content */}
          {activeTab === 'agents' && (
            <ManageAgentProfile />
          )}
          
          {/* Add Agent Tab Content */}
          {activeTab === 'add-agent' && (
            <AddAgent />
          )}
          
          {/* Other tabs */}
          {activeTab === 'pickups' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Pickup Management</h2>
              <p className="text-gray-500">Pickup management content will appear here</p>
            </div>
          )}
          
          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Reports</h2>
              <p className="text-gray-500">Reports content will appear here</p>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <CustomerAccountSettings />
          )}
        </main>
      </div>

      {/* Logout confirmation modal with improved accessibility */}
      {showLogoutConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="logout-dialog-title"
        >
          <div 
            ref={logoutConfirmRef}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all animate-fade-in-up"
            tabIndex={-1}
          >
            {!isLoggingOut ? (
              <>
                <div className="text-center mb-5">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <h3 id="logout-dialog-title" className="text-lg font-medium text-gray-900 mb-2">Confirm Logout</h3>
                  <p className="text-sm text-gray-500">
                    Are you sure you want to log out of the admin dashboard?
                    This will end your current session.
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={cancelLogout}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    autoFocus
                  >
                    Yes, Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 mb-4" aria-hidden="true">
                  <svg className="animate-spin h-10 w-10 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Logging out...</h3>
                <p className="text-sm text-gray-500">
                  Please wait while we securely log you out.
                </p>
              </div>
            )}
        </div>
      </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && itemToDelete && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="delete-dialog-title"
        >
          <div 
            ref={deleteModalRef}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all animate-fade-in-up"
          >
            {!isDeleting ? (
                <>
                  <div className="text-center mb-5">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                      <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    </div>
                    <h3 id="delete-dialog-title" className="text-lg font-medium text-gray-900 mb-2">Delete Item</h3>
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete "<span className="font-semibold">{itemToDelete.title}</span>"?
                      This action cannot be undone.
                    </p>
                  </div>
                  
                  {deleteError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      {deleteError}
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={cancelDelete}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      disabled={isDeleting}
                      autoFocus
                    >
                      Delete Item
                    </button>
                  </div>
                </>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 mb-4" aria-hidden="true">
                  <svg className="animate-spin h-10 w-10 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Deleting Item...</h3>
                <p className="text-sm text-gray-500">
                  Please wait while we process your request.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Overlay for Sidebar */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
   