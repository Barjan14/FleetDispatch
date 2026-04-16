import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [adminUser] = useState({ username: 'Admin User' });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const token = localStorage.getItem('token');

  // Fetch users from backend
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/admin/users/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditFormData({
      username: user.username,
      email: user.email,
      is_staff: user.is_staff,
    });
  };

  const handleSaveEdit = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/users/${userId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => u.id === userId ? updatedUser : u));
        setEditingUserId(null);
        setEditFormData({});
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditFormData({});
  };

  return (
    <div className="admin-dashboard">
      {/* Burger Menu Button */}
      <button 
        className="burger-menu" 
        aria-label="Toggle Navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <ul className="nav-tabs">
          <li>
            <a 
              href="#overview"
              className={`${activeTab === 'overview' ? 'active' : ''}`}              onClick={(e) => {
                e.preventDefault();
                setActiveTab('overview');
              }}
            >
              📊 Overview
            </a>
          </li>
          <li>
            <a 
              href="#users"
              className={`${activeTab === 'users' ? 'active' : ''}`}              onClick={(e) => {
                e.preventDefault();
                setActiveTab('users');
              }}
            >
              👥 Users
            </a>
          </li>
          <li>
            <a 
              href="#fleets"
              className={`${activeTab === 'fleets' ? 'active' : ''}`}              onClick={(e) => {
                e.preventDefault();
                setActiveTab('fleets');
              }}
            >
              🚗 Fleets
            </a>
          </li>
          <li>
            <a 
              href="#reports"
              className={`${activeTab === 'reports' ? 'active' : ''}`}              onClick={(e) => {
                e.preventDefault();
                setActiveTab('reports');
              }}
            >
              📈 Reports
            </a>
          </li>
          <li>
            <a 
              href="#settings"
              className={`${activeTab === 'settings' ? 'active' : ''}`}              onClick={(e) => {
                e.preventDefault();
                setActiveTab('settings');
              }}
            >
              ⚙️ Settings
            </a>
          </li>
        </ul>
      </aside>      {/* Main Content */}
      <main className="dashboard-content">        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p className="header-subtitle">
              {activeTab === 'overview' && 'System Overview & Statistics'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'fleets' && 'Fleet Management'}
              {activeTab === 'reports' && 'System Reports'}
              {activeTab === 'settings' && 'System Settings'}
            </p>
          </div>
          <div className="header-right">
            <div 
              className={`profile-dropdown ${showProfileMenu ? 'open' : ''}`}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="profile-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="admin-name">
                <span className="admin-name-text">ADMIN</span>
                <span className="admin-badge">ADMIN</span>
              </div>
              <span className="dropdown-arrow">▼</span>
              
              <div className="dropdown-menu">
                <a href="#profile" className="dropdown-item" onClick={(e) => e.preventDefault()}>✏️ Profile</a>
                <a href="#settings" className="dropdown-item" onClick={(e) => e.preventDefault()}>⚙️ Settings</a>
                <a href="#logout" className="dropdown-item logout" onClick={(e) => e.preventDefault()}>🚪 Logout</a>
              </div>
            </div>
          </div>
        </header>        {/* Tab Content */}
        <div className="stats-section">          {activeTab === 'overview' && (
            <div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Users</div>
                  <div className="stat-value">1,234</div>
                  <div className="stat-change positive">+12% from last month</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Vehicles</div>
                  <div className="stat-value">567</div>
                  <div className="stat-change positive">+5% from last month</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Fleets</div>
                  <div className="stat-value">42</div>
                  <div className="stat-change negative">-2% from last month</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Bookings</div>
                  <div className="stat-value">892</div>
                  <div className="stat-change positive">+18% from last month</div>
                </div>              </div>
            </div>
          )}          {activeTab === 'users' && (
            <div className="data-table-section">
              {loading ? (
                <p style={{ textAlign: 'center', padding: '20px' }}>Loading users...</p>
              ) : users.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '20px' }}>No users found</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                          {editingUserId === user.id ? (
                            <input
                              type="text"
                              value={editFormData.username}
                              onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                              className="edit-input"
                            />
                          ) : (
                            user.username
                          )}
                        </td>
                        <td>
                          {editingUserId === user.id ? (
                            <input
                              type="email"
                              value={editFormData.email}
                              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                              className="edit-input"
                            />
                          ) : (
                            user.email
                          )}
                        </td>
                        <td>
                          {editingUserId === user.id ? (
                            <select
                              value={editFormData.is_staff ? 'Staff' : 'User'}
                              onChange={(e) => setEditFormData({ ...editFormData, is_staff: e.target.value === 'Staff' })}
                              className="edit-select"
                            >
                              <option value="User">User</option>
                              <option value="Staff">Staff</option>
                            </select>
                          ) : (
                            user.is_staff ? 'Staff' : 'User'
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${user.is_staff ? 'active' : 'inactive'}`}>
                            {user.is_staff ? '● Active' : '○ Inactive'}
                          </span>
                        </td>
                        <td>
                          {editingUserId === user.id ? (
                            <div className="edit-actions">
                              <button
                                className="btn-save"
                                onClick={() => handleSaveEdit(user.id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn-cancel"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn-edit"
                              onClick={() => handleEditClick(user)}
                            >
                              ✏️ Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}{activeTab === 'fleets' && (
            <div className="data-table-section">
              <table>
                <thead>
                  <tr>
                    <th>Fleet ID</th>
                    <th>Fleet Name</th>
                    <th>Vehicles</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>F001</td>
                    <td>Fleet Alpha</td>
                    <td>15</td>
                    <td><span className="status">Active</span></td>
                  </tr>
                  <tr>
                    <td>F002</td>
                    <td>Fleet Beta</td>
                    <td>22</td>
                    <td><span className="status">Active</span></td>
                  </tr>
                  <tr>
                    <td>F003</td>
                    <td>Fleet Gamma</td>
                    <td>18</td>
                    <td><span className="status">Active</span></td>
                  </tr>
                  <tr>
                    <td>F004</td>
                    <td>Fleet Delta</td>
                    <td>25</td>
                    <td><span className="status">Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}          {activeTab === 'reports' && (
            <div className="data-table-section">
              <p style={{ padding: '20px', color: '#666' }}>Reports section content here</p>
            </div>
          )}          {activeTab === 'settings' && (
            <div className="data-table-section">
              <p style={{ padding: '20px', color: '#666' }}>Settings section content here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;