import React, { useState } from 'react';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [exitAnimation, setExitAnimation] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  const navigateTo = (url) => {
    setExitAnimation(true);
    setTimeout(() => {
      window.location.href = url;
    }, 800);
  };
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/admin-login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token || data.access);
        localStorage.setItem('admin', JSON.stringify(data.admin || {}));
        localStorage.setItem('isAdmin', 'true');
        navigateTo('/admin-dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError('An error occurred during login. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={`admin-login-container admin-login ${exitAnimation ? 'exit-animation' : ''}`}>
      {/* Company Logo */}
      <div className="company-logo">
        <img 
          src="/public/assets/images/Company_Logo.png" 
          alt="Company Logo"
        />
      </div>

      {/* Background Image with Car - Full Screen */}
      <div className="admin-image-section">
        <div className="background-image-wrapper">
          <img 
            src="/assets/images/background_2.png" 
            alt="Background"          />        </div>        <div className="car-wrapper">
          <div className="car-circle-wrapper-admin">
            <img 
              className="admin-car"
              src="/assets/images/car.png" 
              alt="Fleet Vehicle"
            />
          </div>
        </div>
      </div>

      {/* Floating Form Box - Centered and Above Background */}
      <div className="admin-form-container">
        <div className="admin-login-card">          {/* Header */}
          <div className={`admin-header ${!headerVisible ? 'hidden' : ''}`}>
            <div className="admin-logo-icon">
              <svg viewBox="0 0 100 100" className="admin-logo-svg">
                <rect x="20" y="20" width="60" height="60" rx="5" fill="none" stroke="white" strokeWidth="3"/>
                <circle cx="50" cy="50" r="8" fill="white"/>
                <line x1="50" y1="30" x2="50" y2="20" stroke="white" strokeWidth="2"/>
                <line x1="70" y1="50" x2="80" y2="50" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <h1 className="admin-logo-text">ADMIN PANEL</h1>
            <p className="admin-header-subtitle">Fleet Dispatch Management</p>
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Form Box Container */}
          <div className="admin-form-box">
            {/* Login Form */}
            <form onSubmit={handleAdminLogin} className="admin-login-form">              {/* Username Input */}
              <div className="admin-form-group">
                <label htmlFor="admin-username" className="admin-form-label">Admin Username</label>
                <div className="admin-input-wrapper">
                  <div className="admin-floating-label">Enter your admin username</div>                  <input
                    type="text"
                    id="admin-username"
                    className="admin-form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={(e) => {
                      e.target.parentElement.classList.add('focused');
                    }}
                    onBlur={(e) => {
                      if (!e.target.value) {
                        e.target.parentElement.classList.remove('focused');
                      }
                    }}
                    required
                  />
                </div>
              </div>            {/* Password Input */}
            <div className="admin-form-group">
              <label htmlFor="admin-password" className="admin-form-label">Password</label>
              <div className="admin-password-input-wrapper admin-input-wrapper">
                <div className="admin-floating-label">Enter your password</div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password"
                  className="admin-form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => e.target.parentElement.classList.add('focused')}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      e.target.parentElement.classList.remove('focused');
                    }
                  }}
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg className="admin-eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={isLoading}
            >              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </button>            {/* Back to User Login */}
            <button
              type="button"
              className="admin-btn admin-btn-back"
              onClick={() => navigateTo('/')}
            >
              Back to User Login
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
