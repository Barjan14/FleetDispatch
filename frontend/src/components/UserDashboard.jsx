import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    activeFleets: 0,
    totalTrips: 0,
    totalDistance: 0,
    fuelExpense: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    
    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user-profile/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('An error occurred while loading user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="company-logo-header">
            <img 
              src="/public/assets/images/Company_Logo.png" 
              alt="Company Logo"
            />
          </div>
          <h1>Fleet Dispatch</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.username || 'User'}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <h2>Welcome back, {user?.username || 'User'}!</h2>
            <p>Manage your fleet operations and track your vehicles</p>
          </section>

          {/* Stats Cards */}
          <section className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">🚗</div>
              <div className="stat-content">
                <h3>Active Fleets</h3>
                <p className="stat-value">{stats.activeFleets}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Total Trips</h3>
                <p className="stat-value">{stats.totalTrips}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📍</div>
              <div className="stat-content">
                <h3>Total Distance</h3>
                <p className="stat-value">{stats.totalDistance} km</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⛽</div>
              <div className="stat-content">
                <h3>Fuel Expense</h3>
                <p className="stat-value">${stats.fuelExpense}</p>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-btn">
                <span className="action-icon">➕</span>
                Add New Fleet
              </button>
              <button className="action-btn">
                <span className="action-icon">👁️</span>
                View Fleets
              </button>
              <button className="action-btn">
                <span className="action-icon">📈</span>
                View Reports
              </button>
              <button className="action-btn">
                <span className="action-icon">⚙️</span>
                Settings
              </button>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="recent-activity">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p className="activity-text">Fleet initialized</p>
                  <p className="activity-time">2 hours ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p className="activity-text">Trip completed</p>
                  <p className="activity-time">5 hours ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p className="activity-text">Login successful</p>
                  <p className="activity-time">1 day ago</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
