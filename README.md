# Fleet Dispatch - Complete Setup & Implementation Guide

## 🚀 Project Overview

Fleet Dispatch is a comprehensive fleet management system with:
- **Frontend**: React + Vite (running on http://localhost:5174)
- **Backend**: Django + Django REST Framework (running on http://localhost:8000)
- **Authentication**: JWT Token-based authentication
- **Database**: SQLite (development)

---

## 📋 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- pip and npm

### Backend Setup

1. **Install dependencies:**
```bash
cd c:\Users\Acer\FleetDispatch\backend
pip install -r requirements.txt
```

2. **Run migrations:**
```bash
python manage.py migrate
```

3. **Create test users:**
```bash
python create_users.py
```

4. **Start the backend server:**
```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Install dependencies:**
```bash
cd c:\Users\Acer\FleetDispatch\frontend
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5174`

---

## 🔐 Login Credentials

### Admin Account
| Field | Value |
|-------|-------|
| **Username** | DAR123 |
| **Password** | barjan123 |
| **URL** | http://localhost:5174/admin-login |

### Test User Accounts
| Username | Password | Role |
|----------|----------|------|
| user1 | user123 | Regular User |
| driver1 | driver123 | Test Driver |
| manager1 | manager123 | Fleet Manager |

**Test URL:** http://localhost:5174/

---

## 🏗️ Architecture & Data Flow

### Frontend Components

#### 1. **Login Page** (`src/components/Login.jsx`)
- User login with email/username and password
- JWT token storage in localStorage
- Redirects to `/dashboard` on success
- API Endpoint: `POST /api/login/`

#### 2. **User Dashboard** (`src/components/UserDashboard.jsx`)
- Protected route (requires valid token)
- User profile display
- Fleet statistics (active fleets, trips, distance, fuel)
- Quick action buttons
- Recent activity feed
- API Endpoint: `GET /api/user-profile/`

#### 3. **Admin Login Page** (`src/components/AdminLogin.jsx`)
- Admin authentication with username/password
- Admin token stored separately
- Redirects to `/admin-dashboard` on success
- API Endpoint: `POST /api/admin-login/`

#### 4. **Admin Dashboard** (`src/components/AdminDashboard.jsx`)
- Protected route (admin only)
- Sidebar navigation with 5 main sections:
  - **Overview**: System statistics and quick actions
  - **Users**: User management table with edit/delete
  - **Fleets**: Fleet management and vehicle tracking
  - **Reports**: Generate various system reports
  - **Settings**: System configuration options
- API Endpoint: `GET /api/admin-dashboard/`

### Backend API Endpoints

#### Authentication
```
POST /api/login/
Request: { "username": "user1", "password": "user123" }
Response: { "token": "...", "user": {...} }

POST /api/admin-login/
Request: { "username": "DAR123", "password": "barjan123" }
Response: { "token": "...", "admin": {...} }
```

#### User Endpoints
```
GET /api/user-profile/
Headers: Authorization: Bearer {token}
Response: { "id": 1, "username": "user1", "email": "...", "stats": {...} }
```

#### Admin Endpoints
```
GET /api/admin-dashboard/
Headers: Authorization: Bearer {adminToken}
Response: { 
  "admin": {...}, 
  "stats": {...}, 
  "users": [...], 
  "fleets": [...] 
}
```

---

## 🎨 UI Design & Styling

### Color Scheme
- **Primary Green**: `#2d8659` - Main brand color
- **Light Green**: `#67c442` - Action buttons
- **Dark Green**: `#1a5f3f` - Hover states
- **Background**: `#f5f7fa` - Light gray

### Responsive Design
- **Desktop**: Full sidebar layout (Admin), card-based layout (User)
- **Tablet (≤1024px)**: Adjusted spacing, optimized cards
- **Mobile (≤768px)**: Sidebar becomes collapsible
- **Small Mobile (≤480px)**: Single column layout

### Key UI Features
- Smooth animations and transitions
- Gradient backgrounds
- Card-based components
- Hover effects on interactive elements
- Loading spinners for async operations
- Error message displays
- Professional typography

---

## 🔄 Frontend-Backend Integration Points

### Authentication Flow
1. User enters credentials on login page
2. Frontend sends POST request to `/api/login/`
3. Backend returns JWT token
4. Frontend stores token in `localStorage.setItem('token', token)`
5. Frontend redirects to `/dashboard`
6. Dashboard page checks for token on mount
7. If valid, displays user data; if not, redirects to login

### Token Usage
```javascript
// Headers for API requests
{
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:5173`
- `http://localhost:5174`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:5174`

---

## 📁 Project Structure

```
FleetDispatch/
├── backend/
│   ├── accounts/
│   │   ├── views.py (API endpoints)
│   │   ├── urls.py (URL routing)
│   │   ├── models.py
│   │   └── templates/
│   ├── core/
│   │   ├── settings.py (Django config, CORS setup)
│   │   └── urls.py (Main URL config)
│   ├── create_users.py (Test data script)
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── UserDashboard.jsx
    │   │   ├── AdminLogin.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── styles/
    │   │   ├── Login.css
    │   │   ├── UserDashboard.css
    │   │   ├── AdminLogin.css
    │   │   └── AdminDashboard.css
    │   ├── App.jsx (Routing)
    │   ├── main.jsx
    │   └── index.css
    ├── public/
    │   └── assets/
    │       └── images/ (Logo, backgrounds, car)
    ├── vite.config.js
    ├── package.json
    └── index.html
```

---

## 🔧 Key Features Implemented

### ✅ Frontend Features
- [x] User login with JWT authentication
- [x] Admin login with separate authentication
- [x] User dashboard with statistics
- [x] Admin dashboard with multi-tab interface
- [x] Protected routes (authentication checks)
- [x] Responsive design for all screen sizes
- [x] Token-based API calls
- [x] Logout functionality with token cleanup
- [x] Loading states and error handling
- [x] Modern UI with smooth animations

### ✅ Backend Features
- [x] User and admin authentication with JWT
- [x] Protected API endpoints
- [x] CORS configuration for frontend integration
- [x] Admin dashboard data endpoint
- [x] User profile endpoint
- [x] Test data creation script
- [x] Proper error responses with status codes

---

## 🧪 Testing the Application

### Test Scenario 1: User Login
1. Navigate to http://localhost:5174/
2. Enter credentials: `user1` / `user123`
3. Click "Log In"
4. Should redirect to `/dashboard` and display user stats
5. Click "Logout" to return to login page

### Test Scenario 2: Admin Login
1. Navigate to http://localhost:5174/admin-login
2. Enter credentials: `DAR123` / `barjan123`
3. Click "Access Admin Panel"
4. Should redirect to `/admin-dashboard`
5. Verify all tabs work (Overview, Users, Fleets, Reports, Settings)
6. Click "Logout" to return to admin login

### Test Scenario 3: Token Validation
1. Login as user
2. Open browser DevTools → Application → Local Storage
3. Verify `token` is stored
4. Admin login stores `adminToken` and `isAdmin` flag
5. Refresh page - dashboard should remain accessible
6. Clear token from localStorage and refresh - should redirect to login

---

## 🚨 Common Issues & Solutions

### Issue: CORS Errors
**Solution**: Ensure backend is running on port 8000 and has CORS_ALLOWED_ORIGINS configured.

### Issue: 401 Unauthorized on API calls
**Solution**: Check that token is being sent in Authorization header with "Bearer" prefix.

### Issue: Login credentials not working
**Solution**: Run `python create_users.py` in backend folder to create test users.

### Issue: Frontend not loading
**Solution**: 
1. Check Node.js is installed: `node --version`
2. Reinstall dependencies: `npm install`
3. Check if port 5174 is available

### Issue: Backend not responding
**Solution**:
1. Check Python 3.9+ is installed: `python --version`
2. Install dependencies: `pip install -r requirements.txt`
3. Run migrations: `python manage.py migrate`
4. Check if port 8000 is available

---

## 📦 Dependencies

### Backend (`requirements.txt`)
- Django==6.0.3
- djangorestframework==3.14.0
- djangorestframework-simplejwt==5.5.1
- django-cors-headers==4.3.1
- sqlparse>=0.2.2
- tzdata>=2021.5

### Frontend (`package.json`)
- react@^19.2.4
- react-dom@^19.2.4
- react-router-dom@^7.13.2
- vite@^8.0.1
- @vitejs/plugin-react@^6.0.1

---

## 🔐 Security Notes

### Development Mode
- Debug is enabled (`DEBUG=True`)
- SQLite database is used
- Secret key is visible (change in production!)

### Production Recommendations
1. Set `DEBUG=False`
2. Use a secure database (PostgreSQL, MySQL)
3. Generate a new SECRET_KEY
4. Add specific ALLOWED_HOSTS
5. Enable HTTPS
6. Use environment variables for sensitive data
7. Implement rate limiting
8. Add input validation and sanitization

---

## 📞 API Response Examples

### User Login Success
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "user1",
    "email": "user1@example.com"
  }
}
```

### User Profile Response
```json
{
  "id": 1,
  "username": "user1",
  "email": "user1@example.com",
  "first_name": "User",
  "last_name": "One",
  "stats": {
    "activeFleets": 3,
    "totalTrips": 45,
    "totalDistance": 2500,
    "fuelExpense": 750.50
  }
}
```

### Admin Dashboard Response
```json
{
  "admin": {
    "id": 1,
    "username": "DAR123",
    "email": "admin@fleetdispatch.com"
  },
  "stats": {
    "totalUsers": 3,
    "totalFleets": 45,
    "totalTrips": 2340,
    "totalRevenue": 45600.75,
    "activeVehicles": 180,
    "systemStatus": "Online"
  },
  "users": [...],
  "fleets": [...]
}
```

---

## 🎯 Next Steps for Enhancement

1. **Database Models**: Create proper Fleet, Vehicle, Trip, and Route models
2. **Real Data**: Replace mock data with actual database queries
3. **Map Integration**: Add GPS tracking and route mapping
4. **Notifications**: Implement real-time alerts for fleet events
5. **Analytics**: Add advanced reporting and analytics dashboard
6. **Mobile App**: Create mobile app with React Native
7. **Payment Integration**: Add billing and payment processing
8. **Advanced Security**: Implement 2FA, OAuth, role-based access control

---

## 📊 System Status

| Component | Status | Port | URL |
|-----------|--------|------|-----|
| Backend | ✅ Running | 8000 | http://localhost:8000 |
| Frontend | ✅ Running | 5174 | http://localhost:5174 |
| Database | ✅ SQLite | - | backend/db.sqlite3 |
| JWT Auth | ✅ Enabled | - | - |
| CORS | ✅ Configured | - | - |

---

## 📝 Version Info

- **Project**: Fleet Dispatch v1.0
- **Created**: April 6, 2026
- **Frontend Framework**: React 19.2.4 + Vite 8.0.1
- **Backend Framework**: Django 6.0.3 + DRF 3.14.0
- **Authentication**: JWT (SimpleJWT 5.5.1)

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API endpoints and expected responses
3. Check browser console and Django server logs
4. Verify all dependencies are installed correctly
5. Ensure both frontend and backend servers are running

---

**Happy coding! 🚀**
