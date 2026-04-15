import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }
  return (
    <div className="user-dashboard">
      {/* Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`user-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg viewBox="0 0 100 100" className="sidebar-logo-svg">
              <circle cx="50" cy="30" r="8" fill="white"/>
              <rect x="30" y="45" width="40" height="15" rx="3" fill="white" opacity="0.8"/>
              <circle cx="40" cy="65" r="8" fill="white"/>
              <circle cx="60" cy="65" r="8" fill="white"/>
              <line x1="35" y1="50" x2="25" y2="40" stroke="white" strokeWidth="2"/>
              <line x1="65" y1="50" x2="75" y2="40" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <h2>Fleet Dispatch</h2>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('overview');
              setSidebarOpen(false);
            }}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span>Overview</span>
          </button>          <button
            className={`nav-item ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('vehicles');
              setSidebarOpen(false);
            }}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 17h2v2h-2z"/>
              <path d="M3 5a2 2 0 0 1 2-2h4l2-3h2l2 3h4a2 2 0 0 1 2 2v3H3V5z"/>
              <rect x="1" y="10" width="22" height="8" rx="1"/>
              <path d="M3 19h2v2H3z"/>
            </svg>
            <span>Vehicles</span>
          </button>          <button
            className={`nav-item ${activeTab === 'trips' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('trips');
              setSidebarOpen(false);
            }}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 11l3 3L20 4"/>
              <path d="M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            <span>Trips</span>
          </button>          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('profile');
              setSidebarOpen(false);
            }}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Profile</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2"/>
                <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2"/>
                <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2"/>
              </svg>
            </button>
            <div>
              <h1>Dashboard</h1>
              <p className="user-greeting">Welcome back, {user?.username || 'User'}!</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="tab-content">
              <div className="welcome-section">
                <h2>Fleet Overview</h2>
                <p>Your fleet management dashboard is ready. Monitor your vehicles and trips here.</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🚗</div>
                  <h3>Total Vehicles</h3>
                  <p className="stat-value">0</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📍</div>
                  <h3>Active Trips</h3>
                  <p className="stat-value">0</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⛽</div>
                  <h3>Fuel Cost</h3>
                  <p className="stat-value">$0</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <h3>Distance Covered</h3>
                  <p className="stat-value">0 km</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="tab-content">
              <h2>Your Vehicles</h2>
              <div className="empty-state">
                <p>No vehicles assigned yet.</p>
              </div>
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="tab-content">
              <h2>Trip History</h2>
              <div className="empty-state">
                <p>No trips recorded yet.</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="tab-content">
              <h2>Your Profile</h2>
              <div className="profile-card">
                <div className="profile-info">
                  <h3>{user?.username || 'User'}</h3>
                  <p>{user?.email || 'Email not set'}</p>
                  <p className="profile-name">{user?.first_name} {user?.last_name}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;