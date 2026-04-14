import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [exitAnimation, setExitAnimation] = useState(false);

  const navigateTo = (path) => {
    setExitAnimation(true);
    setTimeout(() => {
      navigate(path);
    }, 300);
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
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('isAdmin', 'true');
        navigateTo('/admin-dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError('An error occurred during login');
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
      </div>      {/* Background Image with Car - Full Screen */}
      <div className="admin-image-section">
        <div className="background-image-wrapper">
          <img 
            src="/assets/images/background_2.png" 
            alt="Background"
          />
        </div>
        <div className="car-wrapper">
          <div className="car-circle-wrapper-admin">
            <img 
              className="admin-car"
              src="/assets/images/car.png" 
              alt="Fleet Vehicle"
            />
          </div>
        </div>
        {/* Admin Icon Overlay */}
        <div className="admin-icon-overlay">
          <img 
            className="admin-icon-image"
            src="/assets/images/admin_icon.png" 
            alt="Admin Icon"
          />
        </div>
      </div>{/* Floating Form Box - Centered and Above Background */}
      <div className="admin-form-container">
        <div className="admin-login-card">          {/* Form Box Container */}
          <div className="admin-form-box">
            {/* Header inside Form */}
            <div className="admin-header-inline">
              <div className="admin-logo-container">
                <div className="admin-logo-icon">
                  <svg viewBox="0 0 100 100" className="admin-logo-svg">
                    <circle cx="50" cy="30" r="8" fill="white"/>
                    <rect x="30" y="45" width="40" height="15" rx="3" fill="white" opacity="0.8"/>
                    <circle cx="40" cy="65" r="8" fill="white"/>
                    <circle cx="60" cy="65" r="8" fill="white"/>
                    <line x1="35" y1="50" x2="25" y2="40" stroke="white" strokeWidth="2"/>
                    <line x1="65" y1="50" x2="75" y2="40" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              <h1 className="admin-logo-text">ADMIN PANEL</h1>
              <p className="admin-header-subtitle">Fleet Dispatch Management</p>
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Login Form */}
            <form onSubmit={handleAdminLogin} className="admin-login-form">
              {/* Username Input */}
              <div className="admin-form-group">
                <label htmlFor="admin-username" className="admin-form-label">Username</label>
                <div className="admin-input-wrapper">
                  <div className="admin-floating-label">Enter your username</div>
                  <input
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
              </div>

              {/* Password Input */}
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
                  />                  <button
                    type="button"
                    className="admin-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="admin-eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    ) : (
                      <svg className="admin-eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>              {/* Login Button */}
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Log In'}
              </button>

              {/* Back to User Login Button */}
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
