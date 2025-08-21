import React, { useState, useEffect } from 'react';

const AdminDashboard: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        {/* Mobile Header */}
        {isMobile && (
          <div className="mobile-header">
            <div className="mobile-header-content">
              <div className="mobile-branding">
                <div className="mobile-admin-title">Admin Panel</div>
                <div className="mobile-admin-subtitle">E-Waste Management</div>
              </div>
              <button
                className="mobile-menu-toggle"
                onClick={toggleMobileMenu}
                aria-label="Toggle navigation menu"
              >
                <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
            </div>
          </div>
        )}

        <div className="layout-wrapper">
          {/* Sidebar */}
          <div className={`sidebar-column ${isMobile && isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar">
              {!isMobile && (
                <div className="sidebar-header">
                  <div className="admin-branding">
                    <div className="admin-title">Admin Panel</div>
                    <div className="admin-subtitle">E-Waste Management</div>
                  </div>
                </div>
              )}
              
              <div className="nav-item active" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                <div className="nav-content">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/24d67d3a38fce0b397d90399be0f827e63ddcefb?placeholderIfAbsent=true"
                    alt="Dashboard icon"
                    className="nav-icon"
                  />
                  <div className="nav-text">Dashboard</div>
                </div>
                <div className="nav-indicator" />
              </div>
              
              <div className="nav-group">
                <div className="nav-item" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/5f72574529f7dc4eba7d81f2720cc8af1ea82c15?placeholderIfAbsent=true"
                    alt="Users icon"
                    className="nav-icon"
                  />
                  <div className="nav-text">Users</div>
                </div>

                <div className="nav-item" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/5f72574529f7dc4eba7d81f2720cc8af1ea82c15?placeholderIfAbsent=true"
                    alt="Pickups icon"
                    className="nav-icon"
                  />
                  <div className="nav-text">Pickups</div>
                </div>

                <div className="nav-item" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/5f72574529f7dc4eba7d81f2720cc8af1ea82c15?placeholderIfAbsent=true"
                    alt="Reports icon"
                    className="nav-icon"
                  />
                  <div className="nav-text">Reports</div>
                </div>

                <div className="nav-item" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/5f72574529f7dc4eba7d81f2720cc8af1ea82c15?placeholderIfAbsent=true"
                    alt="Settings icon"
                    className="nav-icon"
                  />
                  <div className="nav-text">Settings</div>
                </div>
              </div>
              
              <div className="admin-profile">
                <div className="profile-avatar">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/82ad99669f82b34123a7e42fd69954b3de4a2921?placeholderIfAbsent=true"
                    alt="Admin avatar"
                    className="avatar-bg"
                  />
                  <div className="avatar-text">AD</div>
                </div>
                <div className="profile-info">
                  <div className="profile-name">Admin User</div>
                  <div className="profile-email">admin@ewaste.com</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="content-column">
            <div className="main-content">
              {/* Header */}
              <div className="content-header">
                <div className="header-info">
                  <div className="page-title">Dashboard Overview</div>
                  <div className="page-subtitle">Monitor your e-waste management operations</div>
                </div>
                <div className="header-actions">
                  <div className="search-container">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/3aac17f1c5f308659d2cadc07bd1d728c08d49a1?placeholderIfAbsent=true"
                      alt="Search background"
                      className="search-bg"
                    />
                    <div className="search-text">Search...</div>
                  </div>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/ae3d4149bcffe739e2b6d04535019dc491f61a32?placeholderIfAbsent=true"
                    alt="Notification icon"
                    className="notification-icon"
                  />
                </div>
              </div>
              
              {/* Stats Cards */}
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/a75ca7c80f73d6e228e5990d338f8834c02e1112?placeholderIfAbsent=true"
                alt="Stats cards"
                className="stats-cards"
              />
              
              {/* Summary Stats */}
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/a10ee3c1c0d489efaa40de479eca35d67f9af152?placeholderIfAbsent=true"
                alt="Summary statistics"
                className="summary-stats"
              />
              
              {/* Waste Collection Trends Chart */}
              <div className="chart-container">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/1ccb9abc284e2cb507149990d87a3e36adb2fa12?placeholderIfAbsent=true"
                  alt="Chart background"
                  className="chart-bg"
                />
                <div className="chart-header">
                  <div className="chart-title">Waste Collection Trends</div>
                  <div className="chart-subtitle">Monthly e-waste collection overview</div>
                </div>
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/cea269f83543b8f9df05a75c480f50a2f1478e37?placeholderIfAbsent=true"
                  alt="Collection trends chart"
                  className="trend-chart"
                />
              </div>
              
              {/* Recent Pickup Requests Table */}
              <div className="requests-container">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/42b5de10cbbe2b879ca72fd0a93c95a2c263661d?placeholderIfAbsent=true"
                  alt="Table background"
                  className="table-bg"
                />

                <div className="table-header">
                  <div className="table-info">
                    <div className="table-title">Recent Pickup Requests</div>
                    <div className="table-subtitle">Latest e-waste pickup requests from users</div>
                  </div>
                  <div className="table-actions">
                    <div className="action-btn schedule-btn">
                      <img
                        src="https://api.builder.io/api/v1/image/assets/TEMP/b07be06d22fc89130ee7294e8146e975797100fa?placeholderIfAbsent=true"
                        alt="Schedule button"
                        className="btn-bg"
                      />
                      <div className="btn-text">Schedule</div>
                    </div>
                    <div className="action-btn new-request-btn">
                      <img
                        src="https://api.builder.io/api/v1/image/assets/TEMP/7500bbb7313197fb3878cc9ae972bbaf9a4caafa?placeholderIfAbsent=true"
                        alt="New request button"
                        className="btn-bg"
                      />
                      <div className="btn-text">New Request</div>
                    </div>
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="desktop-table">
                  <div className="table-column-headers">
                    <div className="header-group-left">
                      <div className="column-header">REQUEST ID</div>
                      <div className="column-header">USER</div>
                    </div>
                    <div className="column-header">LOCATION</div>
                    <div className="column-header">ITEMS</div>
                    <div className="header-group-right">
                      <div className="column-header">STATUS</div>
                      <div className="column-header">WEIGHT</div>
                      <div className="column-header">CATEGORY</div>
                    </div>
                  </div>

                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/aa784cdddf6d9078dfcbd16d48674bb4722e50be?placeholderIfAbsent=true"
                    alt="Table divider"
                    className="table-divider"
                  />

                  {/* Table Rows */}
                  <div className="table-row">
                    <div className="row-data">REQ001</div>
                    <div className="row-data">John Doe</div>
                    <div className="row-data">New York, NY</div>
                    <div className="row-data">Laptop, Phone</div>
                    <div className="status-badge completed">
                      <img
                        src="https://api.builder.io/api/v1/image/assets/TEMP/c7c9fcafc9b41ce91ffa9a215a318778b6d9e769?placeholderIfAbsent=true"
                        alt="Completed status"
                        className="status-bg"
                      />
                      <div className="status-text">Completed</div>
                    </div>
                    <div className="row-data">2.3 kg</div>
                    <div className="row-data">IT EQUIPMENT</div>
                  </div>

                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/aa784cdddf6d9078dfcbd16d48674bb4722e50be?placeholderIfAbsent=true"
                    alt="Table divider"
                    className="table-divider"
                  />

                  <div className="table-row">
                    <div className="row-group-left">
                      <div className="row-data">REQ002</div>
                      <div className="row-data">Jane Smith</div>
                      <div className="row-data">Los Angeles, CA</div>
                      <div className="row-data">Monitor</div>
                    </div>
                    <div className="row-group-right">
                      <div className="status-badge in-progress">
                        <img
                          src="https://api.builder.io/api/v1/image/assets/TEMP/f621eeaf44b4ff838c174b7b512fd113b21c944e?placeholderIfAbsent=true"
                          alt="In progress status"
                          className="status-bg"
                        />
                        <div className="status-text">In Progress</div>
                      </div>
                      <div className="row-data">5.1 kg</div>
                      <div className="row-data">LIGHTING</div>
                    </div>
                  </div>

                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/aa784cdddf6d9078dfcbd16d48674bb4722e50be?placeholderIfAbsent=true"
                    alt="Table divider"
                    className="table-divider"
                  />

                  <div className="table-row">
                    <div className="row-group-left">
                      <div className="row-data">REQ003</div>
                      <div className="row-data">Mike Johnson</div>
                      <div className="row-data">Chicago, IL</div>
                    </div>
                    <div className="row-data">Printer</div>
                    <div className="row-group-right">
                      <div className="status-badge pending">
                        <img
                          src="https://api.builder.io/api/v1/image/assets/TEMP/2dd9b6f45c92c7282a963185276532e10256ad1d?placeholderIfAbsent=true"
                          alt="Pending status"
                          className="status-bg"
                        />
                        <div className="status-text">Pending</div>
                      </div>
                      <div className="row-data">8.7 kg</div>
                      <div className="row-data">TOOLS</div>
                    </div>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="mobile-cards">
                  <div className="request-card">
                    <div className="card-header">
                      <div className="request-id">REQ001</div>
                      <div className="status-badge completed">
                        <img
                          src="https://api.builder.io/api/v1/image/assets/TEMP/c7c9fcafc9b41ce91ffa9a215a318778b6d9e769?placeholderIfAbsent=true"
                          alt="Completed status"
                          className="status-bg"
                        />
                        <div className="status-text">Completed</div>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="card-row">
                        <span className="card-label">User:</span>
                        <span className="card-value">John Doe</span>
                      </div>
                      <div className="card-row">
                        <span className="card-label">Location:</span>
                        <span className="card-value">New York, NY</span>
                      </div>
                      <div className="card-row">
                        <span className="card-label">Items:</span>
                        <span className="card-value">Laptop, Phone</span>
                      </div>
                      <div className="card-row">
                        <span className="card-label">Weight:</span>
                        <span className="card-value">2.3 kg</span>
                      </div>
                      <div className="card-row">
                        <span className="card-label">Category:</span>
                        <span className="card-value">IT EQUIPMENT</span>
                      </div>
                    </div>
                  </div>

                  <div className="request-card">
                    <div className="card-header">
                      <div className="request-id">REQ002</div>
                      <div className="status-badge in-progress">
                        <img
                          src="https://api.builder.io/api/v1/image/assets/TEMP/f621eeaf44b4ff838c174b7b512fd113b21c944e?placeholderIfAbsent=true"
                          alt="In progress status"
                          className="status-bg"
                        />
                        <div className="status-text">In Progress</div>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="card-row">
                        <span className="card-label">User:</span>
                        <span className="card-value">Jane Smith</span>
                      </div>
                      <div className="card-row">
                        <span className="card-label">Location:</span>
                        <span className="card-value">Los Angeles, CA</span>
                      </div>
                      <div className="card-row">
                        <span className="card-label">Items:</span>
                        <span className="card-value">Monitor</span>
                      </div>
                      <div className="card-row">
                        <span className="card-label">Weight:</span>
                        <span className="card-value">5.1 kg</span>
                      </div>
                      <div className="card-row">
                        <span className="card-label">Category:</span>
                        <span className="card-value">LIGHTING</span>
                      </div>
                    </div>
                  </div>

                  <div className="request-card">
                    <div className="card-header">
                      <div className="request-id">REQ003</div>
                      <div className="status-badge pending">
                        <img
                          src="https://api.builder.io/api/v1/image/assets/TEMP/2dd9b6f45c92c7282a963185276532e10256ad1d?placeholderIfAbsent=true"
                          alt="Pending status"
                          className="status-bg"
                        />
                        <div className="status-text">Pending</div>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="card-row">
                        <span className="card-label">User:</span>
                        <span className="card-value">Mike Johnson</span>
                      </div>
                      <div className="card-row">
                        <span className="card-label">Location:</span>
                        <span className="card-value">Chicago, IL</span>
                      </div>
                      <div className="card-row">
                        <span className="card-label">Items:</span>
                        <span className="card-value">Printer</span>
                      </div>
                      <div className="card-row">
                        <span className="card-label">Weight:</span>
                        <span className="card-value">8.7 kg</span>
                      </div>
                      <div className="card-row">
                        <span className="card-label">Category:</span>
                        <span className="card-value">TOOLS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pagination */}
                <div className="pagination-container">
                  <div className="pagination-info">Showing 1 to 5 of 327 results</div>
                  <div className="pagination-number">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/de872fb19775fe5534f735bdc309e06241d6826a?placeholderIfAbsent=true"
                      alt="Page number background"
                      className="page-number-bg"
                    />
                    <div className="page-number">1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobile && isMobileMenuOpen && (
          <div
            className="mobile-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
