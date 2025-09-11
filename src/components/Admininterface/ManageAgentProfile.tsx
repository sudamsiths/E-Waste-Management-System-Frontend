import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Download, Plus, ArrowUpDown, RefreshCcw, AlertCircle, Edit, Trash } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Define Agent status types
type AgentStatus = "Active" | "Pending" | "Inactive";

// Interface for Agent entity
interface Agent {
  agentId: number;
  fullName: string;
  email: string;
  contactNumber: string;
  assignBranch: string;
  status: AgentStatus;
  joinedDate?: string;
  avatar?: string;
}

// Interface for Branch entity
interface AssignBranch {
  id: number | string;
  name: string;
  location?: string;
}

// Define FilterState type for filters state
type FilterState = {
  search: string;
  assignBranch: string;
  status: string;
};

// Helper: resolve branch display name from agent payload + fetched branches
const resolveAssignBranchName = (
  agent: any,
  assignBranches: AssignBranch[]
): string => {
  // 1) If branch is a direct string and not empty/null
  if (typeof agent.assignBranch === 'string' && agent.assignBranch.trim() && 
      agent.assignBranch !== 'null' && agent.assignBranch !== 'undefined' && agent.assignBranch !== '') {
    return agent.assignBranch.trim();
  }
  
  // 2) If branch is an object with name property
  if (agent.assignBranch && typeof agent.assignBranch === 'object') {
    
    // Check common object properties
    const possibleNames = [
      agent.assignBranch.name,
      agent.assignBranch.branchName,
      agent.assignBranch.location,
      agent.assignBranch.title
    ];
    
    for (const name of possibleNames) {
      if (typeof name === 'string' && name.trim()) {
        return name.trim();
      }
    }
  }
  
  // 3) Try to match by ID in branches array
  const possibleIds = [
    agent.assignBranchId,
    agent.assignBranch,
    agent.assignBranch?.id,
    agent.assignBranch?.branchId
  ].filter(id => id !== null && id !== undefined && id !== '');
  
  for (const id of possibleIds) {
    // Try exact match first
    const exactMatch = assignBranches.find(b => String(b.id) === String(id));
    if (exactMatch) {
      return exactMatch.name;
    }
    
    // Try case-insensitive match
    const caseMatch = assignBranches.find(b => 
      String(b.id).toLowerCase() === String(id).toLowerCase()
    );
    if (caseMatch) {
      return caseMatch.name;
    }
  }
  
  // 4) If nothing found, show what we have for debugging
  console.log('❌ No branch match found');
  console.log('Agent data summary:', {
    agentId: agent.agentId,
    assignBranch: agent.assignBranch,
    assignBranchId: agent.assignBranchId,
    allFields: Object.keys(agent)
  });
  
  return 'N/A';
};

const ManageAgentProfile: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [assignBranches, setAssignBranches] = useState<AssignBranch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [branchesLoading, setBranchesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Agent | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    assignBranch: '',
    status: ''
  });

  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch agents from backend API
  const fetchAgents = async (branchList?: AssignBranch[]) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching agents from API...');
      
      // Make the actual API call to the backend endpoint
      const response = await axios.get('http://localhost:8082/agent/getAll');
      
      console.log('=== FULL API RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
      console.log('First agent (if exists):', response.data[0]);
      
      // Use the passed branchList or the current branches state
      const availableBranches = branchList || assignBranches;
      console.log('=== AVAILABLE BRANCHES ===');
      console.log(availableBranches);
      
      // If we have no branches, try to fetch them again
      if (availableBranches.length === 0) {
        console.log('No branches available, trying to fetch...');
        try {
          const branchResponse = await axios.get('http://localhost:8082/branch/getAll');
          const fetchedBranches: AssignBranch[] = branchResponse.data.map((branch: any) => ({
            id: branch.id ?? branch.branchId ?? '',
            name: branch.name ?? branch.branchName ?? 'Unknown Branch',
            location: branch.location ?? branch.branchLocation ?? ''
          }));
          console.log('Fetched branches during agent fetch:', fetchedBranches);
          setAssignBranches(fetchedBranches);
        } catch (branchErr) {
          console.error('Failed to fetch branches during agent fetch:', branchErr);
        }
      }
      
      // Map backend data to our Agent interface
      const mappedAgents: Agent[] = response.data.map((agent: any, index: number) => {
        console.log(`\n=== PROCESSING AGENT ${index + 1} ===`);
        
        // Safely format date
        let formattedDate = 'Unknown';
        if (agent.joinedDate) {
          try {
            formattedDate = new Date(agent.joinedDate).toLocaleDateString();
          } catch (e) {
            console.warn(`Failed to parse date for agent ${agent.agentId}:`, e);
          }
        }
        
        const branchValue = resolveAssignBranchName(agent, availableBranches);
        
        console.log(`Final branch value for agent ${agent.agentId}:`, branchValue);
        
        return {
          agentId: agent.agentId || 0,
          fullName: agent.fullName || 'Unknown',
          email: agent.email || 'N/A',
          contactNumber: agent.contactNo || agent.contactNumber || 'N/A',
          assignBranch: branchValue,
          status: agent.status || 'Pending',
          joinedDate: formattedDate,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.fullName || 'Agent')}&background=random`
        };
      });

      console.log('=== FINAL MAPPED AGENTS ===');
      console.log(mappedAgents.map(a => ({ 
        id: a.agentId, 
        name: a.fullName, 
        branch: a.assignBranch 
      })));
      
      setAgents(mappedAgents);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
      
      // More detailed error message
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
        } else if (err.request) {
          setError('Network error: No response received. Is the agent service running?');
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError('Failed to load agents. Please check if the agent service is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Updated useEffect to properly sequence the API calls
  useEffect(() => {
    // Fetch branches first, then agents
    const loadData = async () => {
      try {
        // First fetch branches
        setBranchesLoading(true);
        console.log('Fetching branches from API...');
        
        const branchResponse = await axios.get('http://localhost:8082/branch/getAll');
        console.log('Branches response:', branchResponse.data);
        
        // Map response to Branch interface
        const fetchedBranches: AssignBranch[] = branchResponse.data.map((branch: any) => ({
          id: branch.id ?? branch.branchId ?? '',
          name: branch.name ?? branch.branchName ?? 'Unknown Branch',
          location: branch.location ?? branch.branchLocation ?? ''
        }));
        
        setAssignBranches(fetchedBranches);
        setBranchesLoading(false);
        
        // Then fetch agents with the branch data
        await fetchAgents(fetchedBranches);
        
      } catch (err) {
        console.error('Failed to fetch branches:', err);
        setAssignBranches([]);
        setBranchesLoading(false);
        
        // Still try to fetch agents even if branches fail
        await fetchAgents([]);
      }
    };
    
    loadData();
  }, []);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
        setShowBranchDropdown(false);
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
  }, [showBranchDropdown, showStatusDropdown, deleteModalOpen, isDeleting]);

  // Status badge styling
  const getStatusBadgeStyle = (status: AgentStatus = 'Active') => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Inactive':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAgents(new Set());
    } else {
      setSelectedAgents(new Set(filteredAgents.map(agent => agent.agentId)));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual agent selection
  const handleAgentSelect = (agentId: number) => {
    const newSelected = new Set(selectedAgents);
    if (newSelected.has(agentId)) {
      newSelected.delete(agentId);
    } else {
      newSelected.add(agentId);
    }
    setSelectedAgents(newSelected);
    setSelectAll(newSelected.size === filteredAgents.length);
  };

  // Handle sorting
  const handleSort = (key: keyof Agent) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort agents
  const sortedAgents = React.useMemo(() => {
    if (!sortConfig.key) return agents;

    return [...agents].sort((a, b) => {
      if (!sortConfig.key) return 0;
      const key = sortConfig.key as keyof Agent;
      const aValue = a[key] ?? '';
      const bValue = b[key] ?? '';

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [agents, sortConfig]);

  // Filter agents (branch match case-insensitive)
  const filteredAgents = React.useMemo(() => {
    return sortedAgents.filter(agent => {
      const searchMatch = !filters.search || 
        agent.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        agent.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        agent.contactNumber?.toLowerCase().includes(filters.search.toLowerCase());

      const branchMatch = !filters.assignBranch || 
        (agent.assignBranch || '').toLowerCase() === filters.assignBranch.toLowerCase();
      const statusMatch = !filters.status || agent.status === filters.status;
      
      return searchMatch && branchMatch && statusMatch;
    });
  }, [sortedAgents, filters]);

  // Paginate agents
  const paginatedAgents = React.useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredAgents.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAgents, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredAgents.length / rowsPerPage);

  // Updated handleRetry function
  const handleRetry = async () => {
    try {
      // First fetch branches
      setBranchesLoading(true);
      const branchResponse = await axios.get('http://localhost:8082/branch/getAll');
      const fetchedBranches: AssignBranch[] = branchResponse.data.map((branch: any) => ({
        id: branch.id ?? branch.branchId ?? '',
        name: branch.name ?? branch.branchName ?? 'Unknown Branch',
        location: branch.location ?? branch.branchLocation ?? ''
      }));
      
      setAssignBranches(fetchedBranches);
      setBranchesLoading(false);
      
      // Then fetch agents
      await fetchAgents(fetchedBranches);
    } catch (err) {
      console.error('Failed to retry:', err);
      setAssignBranches([]);
      setBranchesLoading(false);
      await fetchAgents([]);
    }
  };

  // Function to open delete confirmation modal
  const openDeleteModal = (agent: Agent) => {
    setAgentToDelete(agent);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  // Function to handle agent deletion
  const handleDeleteAgent = async () => {
    if (!agentToDelete) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      // Call the REST API endpoint to delete the agent
      const response = await axios.delete(`http://localhost:8082/agent/delete/${agentToDelete.agentId}`);
      
      console.log('Delete response:', response);
      
      // Remove the deleted agent from the state
      setAgents(prevAgents => prevAgents.filter(agent => agent.agentId !== agentToDelete.agentId));
      
      // Clear any selected agents that include the deleted one
      setSelectedAgents(prev => {
        const newSelected = new Set(prev);
        if (newSelected.has(agentToDelete.agentId)) {
          newSelected.delete(agentToDelete.agentId);
        }
        return newSelected;
      });
      
      // Close the modal
      setDeleteModalOpen(false);
      setAgentToDelete(null);
      
    } catch (error) {
      console.error('Failed to delete agent:', error);
      
      // Handle error response
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setDeleteError(`Error: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
          setDeleteError('Network error: No response received from server');
        } else {
          setDeleteError(`Error: ${error.message}`);
        }
      } else {
        setDeleteError('An unknown error occurred while deleting the agent');
      }
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
              Agent Management
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Manage all your agents in one place. Assign branches, update status, and monitor activity.
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
                      placeholder="Search agents..."
                      value={filters.search}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, search: e.target.value }));
                        setCurrentPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Branch Filter */}
                <div ref={branchDropdownRef} className="relative min-w-32">
                  <button
                    onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                    disabled={branchesLoading}
                  >
                    <span className="text-gray-700">
                      {filters.assignBranch || 'All Branches'}
                    </span>
                    {branchesLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  {showBranchDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => {
                          setFilters(prev => ({ ...prev, assignBranch: '' }));
                          setShowBranchDropdown(false);
                          setCurrentPage(1);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                      >
                        All Branches
                      </button>
                      {assignBranches.map((branch) => (
                        <button
                          key={branch.id}
                          onClick={() => {
                            setFilters(prev => ({ ...prev, assignBranch: branch.name }));
                            setShowBranchDropdown(false);
                            setCurrentPage(1);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
                        >
                          {branch.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Filter */}
                <div ref={statusDropdownRef} className="relative min-w-32">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                  >
                    <span className="text-gray-700">
                      {filters.status || 'All Status'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => {
                          setFilters(prev => ({ ...prev, status: '' }));
                          setShowStatusDropdown(false);
                          setCurrentPage(1);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                      >
                        All Status
                      </button>
                      {['Active', 'Pending', 'Inactive'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setFilters(prev => ({ ...prev, status }));
                            setShowStatusDropdown(false);
                            setCurrentPage(1);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
                        >
                          {status}
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
                
                <Link to="/add-agent" className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 transition-colors text-sm">
                  <Plus className="w-4 h-4" />
                  <span>Add Agent</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Loading agents...</p>
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
                  <h3 className="text-lg font-medium text-red-800">Error Loading Agents</h3>
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

        {/* Agent Table */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Results Info */}
            <div className="px-4 md:px-6 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((currentPage - 1) * rowsPerPage) + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * rowsPerPage, filteredAgents.length)}</span> of{' '}
                  <span className="font-medium">{filteredAgents.length}</span> agents
                </p>
                {selectedAgents.size > 0 && (
                  <p className="text-sm text-green-600">
                    {selectedAgents.size} agent{selectedAgents.size !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            </div>

            {/* Empty State */}
            {filteredAgents.length === 0 && (
              <div className="px-4 md:px-6 py-12">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No agents found</h3>
                  <p className="text-gray-500">
                    {agents.length === 0 
                      ? "No agents have been added to the system yet." 
                      : "Try adjusting your search or filter criteria."}
                  </p>
                </div>
              </div>
            )}

            {/* Table */}
            {filteredAgents.length > 0 && (
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
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                        </th>
                        
                        <th 
                          className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('fullName')}
                        >
                          <div className="flex items-center gap-2">
                            <span>Agent</span>
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
                          onClick={() => handleSort('contactNumber')}
                        >
                          <div className="flex items-center gap-2">
                            <span>Contact</span>
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </th>
                        
                        <th 
                          className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('assignBranch')}
                        >
                          <div className="flex items-center gap-2">
                            <span>Branch</span>
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </th>
                        
                        <th 
                          className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center gap-2">
                            <span>Status</span>
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </th>
                        
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedAgents.map((agent) => (
                        <tr key={agent.agentId} className="hover:bg-gray-50">
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedAgents.has(agent.agentId)}
                              onChange={() => handleAgentSelect(agent.agentId)}
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                          </td>
                          
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <img 
                                  className="h-8 w-8 rounded-full object-cover" 
                                  src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.fullName}&background=random`} 
                                  alt={agent.fullName}
                                />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {agent.fullName}
                                </div>
                                <div className="text-xs text-gray-500 sm:hidden">
                                  {agent.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                            <div className="text-sm text-gray-900">{agent.email}</div>
                          </td>
                          
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="text-sm text-gray-900">{agent.contactNumber}</div>
                          </td>
                          
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{agent.assignBranch}</div>
                          </td>
                          
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeStyle(agent.status)}`}>
                              {agent.status}
                            </span>
                          </td>
                          
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                className="p-1 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                                title="Edit Agent"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(agent)}
                                className="p-1 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                                title="Delete Agent"
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
                          className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
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
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_: unknown, i: number) => {
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
                                    ? 'bg-green-600 text-white' 
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
      {deleteModalOpen && agentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div 
            ref={deleteModalRef}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
          >
            <div className="text-center mb-5">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <Trash className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Agent</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete {agentToDelete.fullName}? This action cannot be undone.
              </p>
            </div>
            
            {deleteError && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {deleteError}
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAgent}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Delete Agent"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAgentProfile;
