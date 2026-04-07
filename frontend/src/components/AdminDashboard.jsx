import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFleets: 0,
    totalTrips: 0,
    totalRevenue: 0,
    activeVehicles: 0,
    systemStatus: 'Online',
  });
  const [users, setUsers] = useState([]);
  const [fleets, setFleets] = useState([]);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const isAdmin = localStorage.getItem('isAdmin');

    if (!adminToken || isAdmin !== 'true') {
      navigate('/admin-login');
      return;
    }

    // Fetch admin dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin-dashboard/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAdminUser(data.admin);
          setStats(data.stats);
          setUsers(data.users || []);
          setFleets(data.fleets || []);
        } else if (response.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isAdmin');
          navigate('/admin-login');
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('An error occurred while loading dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    navigate('/admin-login');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg viewBox="0 0 100 100" className="sidebar-logo-svg">
              <rect x="20" y="20" width="60" height="60" rx="5" fill="none" stroke="white" strokeWidth="3"/>
              <circle cx="50" cy="50" r="8" fill="white"/>
              <line x1="50" y1="30" x2="50" y2="20" stroke="white" strokeWidth="2"/>
              <line x1="70" y1="50" x2="80" y2="50" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <h2>Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            Overview
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="nav-icon">👥</span>
            Users
          </button>
          <button
            className={`nav-item ${activeTab === 'fleets' ? 'active' : ''}`}
            onClick={() => setActiveTab('fleets')}
          >
            <span className="nav-icon">🚗</span>
            Fleets
          </button>
          <button
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <span className="nav-icon">📈</span>
            Reports
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn-sidebar" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <div className="header-info">
              <span className="admin-name">{adminUser?.username || 'Admin'}</span>
              <span className="system-status" style={{ color: stats.systemStatus === 'Online' ? '#67c442' : '#ff6b6b' }}>
                ● {stats.systemStatus}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="admin-content">
          {error && <div className="error-banner">{error}</div>}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <section className="tab-content">
              <h2>System Overview</h2>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card-admin">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>Total Users</h3>
                    <p className="stat-number">{stats.totalUsers}</p>
                  </div>
                </div>

                <div className="stat-card-admin">
                  <div className="stat-icon">🚗</div>
                  <div className="stat-info">
                    <h3>Total Fleets</h3>
                    <p className="stat-number">{stats.totalFleets}</p>
                  </div>
                </div>

                <div className="stat-card-admin">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3>Total Trips</h3>
                    <p className="stat-number">{stats.totalTrips}</p>
                  </div>
                </div>

                <div className="stat-card-admin">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>Total Revenue</h3>
                    <p className="stat-number">${stats.totalRevenue}</p>
                  </div>
                </div>

                <div className="stat-card-admin">
                  <div className="stat-icon">🟢</div>
                  <div className="stat-info">
                    <h3>Active Vehicles</h3>
                    <p className="stat-number">{stats.activeVehicles}</p>
                  </div>
                </div>

                <div className="stat-card-admin">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>System Status</h3>
                    <p className="stat-number">{stats.systemStatus}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions-admin">
                <h3>Quick Actions</h3>
                <div className="action-grid">
                  <button className="action-card">
                    <span className="action-icon">➕</span>
                    <span>Add User</span>
                  </button>
                  <button className="action-card">
                    <span className="action-icon">🚗</span>
                    <span>Add Fleet</span>
                  </button>
                  <button className="action-card">
                    <span className="action-icon">📊</span>
                    <span>Generate Report</span>
                  </button>
                  <button className="action-card">
                    <span className="action-icon">⚡</span>
                    <span>System Check</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <section className="tab-content">
              <div className="tab-header">
                <h2>User Management</h2>
                <button className="btn-add">+ Add User</button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{user.username || 'N/A'}</td>
                          <td>{user.email || 'N/A'}</td>
                          <td>{user.created_at || 'N/A'}</td>
                          <td>
                            <button className="action-btn-table">Edit</button>
                            <button className="action-btn-table delete">Delete</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Fleets Tab */}
          {activeTab === 'fleets' && (
            <section className="tab-content">
              <div className="tab-header">
                <h2>Fleet Management</h2>
                <button className="btn-add">+ Add Fleet</button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fleet ID</th>
                      <th>Name</th>
                      <th>Owner</th>
                      <th>Vehicles</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fleets.length > 0 ? (
                      fleets.map((fleet, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{fleet.name || 'N/A'}</td>
                          <td>{fleet.owner || 'N/A'}</td>
                          <td>{fleet.vehicle_count || 0}</td>
                          <td><span className="status-badge active">Active</span></td>
                          <td>
                            <button className="action-btn-table">View</button>
                            <button className="action-btn-table delete">Delete</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-data">No fleets found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <section className="tab-content">
              <h2>System Reports</h2>
              <div className="reports-container">
                <div className="report-card">
                  <h3>📈 Monthly Revenue Report</h3>
                  <p>Generate and view monthly revenue analytics</p>
                  <button className="btn-report">Generate Report</button>
                </div>
                <div className="report-card">
                  <h3>🚗 Fleet Usage Report</h3>
                  <p>Detailed fleet usage and vehicle statistics</p>
                  <button className="btn-report">Generate Report</button>
                </div>
                <div className="report-card">
                  <h3>👥 User Activity Report</h3>
                  <p>User engagement and activity logs</p>
                  <button className="btn-report">Generate Report</button>
                </div>
                <div className="report-card">
                  <h3>⛽ Fuel Efficiency Report</h3>
                  <p>Fuel consumption and efficiency metrics</p>
                  <button className="btn-report">Generate Report</button>
                </div>
              </div>
            </section>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <section className="tab-content">
              <h2>System Settings</h2>
              <div className="settings-container">
                <div className="settings-section">
                  <h3>General Settings</h3>
                  <div className="settings-item">
                    <label>Application Name</label>
                    <input type="text" defaultValue="Fleet Dispatch" />
                  </div>
                  <div className="settings-item">
                    <label>Support Email</label>
                    <input type="email" defaultValue="support@fleetdispatch.com" />
                  </div>
                  <button className="btn-save">Save Changes</button>
                </div>

                <div className="settings-section">
                  <h3>Security Settings</h3>
                  <div className="settings-item">
                    <label>Session Timeout (minutes)</label>
                    <input type="number" defaultValue="30" />
                  </div>
                  <div className="settings-item">
                    <label>Max Login Attempts</label>
                    <input type="number" defaultValue="5" />
                  </div>
                  <button className="btn-save">Save Changes</button>
                </div>

                <div className="settings-section danger">
                  <h3>Danger Zone</h3>
                  <p>Be careful with these actions</p>
                  <button className="btn-danger">Clear Cache</button>
                  <button className="btn-danger">System Reset</button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
