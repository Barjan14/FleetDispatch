# Fleet Dispatch - Complete Setup & Usage Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### Step 1: Start Backend Server
```powershell
cd c:\Users\Acer\FleetDispatch\backend
python manage.py runserver
```
Backend runs on: `http://localhost:8000`

### Step 2: Start Frontend Server
```powershell
cd c:\Users\Acer\FleetDispatch\frontend
npm run dev
```
Frontend runs on: `http://localhost:5174` (or `http://localhost:5173`)

### Step 3: Create Test Users (One-time setup)
```powershell
cd c:\Users\Acer\FleetDispatch\backend
python create_users.py
```

---

## 🔐 Login Credentials

### Admin Account
- **Username:** `DAR123`
- **Password:** `barjan123`
- **URL:** `http://localhost:5174/admin-login`
- **After Login:** Redirects to `/admin-dashboard`

### Test Regular User
- **Username:** `user1`
- **Password:** `user123`
- **URL:** `http://localhost:5174/`
- **After Login:** Redirects to `/dashboard`

### Test Fleet Manager
- **Username:** `manager1`
- **Password:** `manager123`

---

## 📁 Project Structure

```
FleetDispatch/
├── backend/                 # Django REST API
│   ├── accounts/           # User authentication app
│   ├── core/               # Django settings & config
│   ├── create_users.py     # Script to create test users
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/               # React + Vite
    ├── src/
    │   ├── components/     # React components
    │   │   ├── Login.jsx
    │   │   ├── AdminLogin.jsx
    │   │   ├── UserDashboard.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── styles/         # CSS files
    │   └── App.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🔗 API Endpoints (Backend)

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/login/` | User login with JWT |
| POST | `/api/admin-login/` | Admin login with JWT |
| GET | `/api/protected/` | Test protected endpoint |

### User Endpoints
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|----------------|
| GET | `/api/user-profile/` | Get user profile & stats | ✅ Bearer Token |

### Admin Endpoints
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|----------------|
| GET | `/api/admin-dashboard/` | Get admin dashboard data | ✅ Bearer Token (Admin) |

---

## 📱 Frontend Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Login.jsx | User login page |
| `/admin-login` | AdminLogin.jsx | Admin login page |
| `/dashboard` | UserDashboard.jsx | User dashboard (protected) |
| `/admin-dashboard` | AdminDashboard.jsx | Admin dashboard (protected) |

---

## 🎨 Features Implemented

### ✅ User Login Page
- Email/Username input field
- Password input with show/hide toggle
- Remember me checkbox
- Forgot password link
- Admin login button
- Floating labels with animations
- **Fixed:** Header stays visible when typing in inputs
- Error messages display

### ✅ Admin Login Page
- Username and password fields
- Password visibility toggle
- Back to user login button
- Admin-themed styling
- **Fixed:** Header stays visible when typing in inputs

### ✅ User Dashboard
- User profile display
- Statistics cards (Fleets, Trips, Distance, Fuel)
- Quick action buttons
- Recent activity feed
- Logout functionality
- Protected route (redirects to login if no token)

### ✅ Admin Dashboard
- Professional two-panel layout with sidebar navigation
- **Overview Tab:** System stats & quick actions
- **Users Tab:** User management with table
- **Fleets Tab:** Fleet management
- **Reports Tab:** Report generation options
- **Settings Tab:** System configuration
- Admin authentication check
- Protected route (redirects to admin login if not admin)

---

## 🔄 Authentication Flow

### User Login Flow
```
1. User visits http://localhost:5174/
2. Enters credentials
3. Frontend POSTs to /api/login/
4. Backend returns JWT token
5. Token stored in localStorage as "token"
6. Redirected to /dashboard
7. Dashboard fetches /api/user-profile/ with Bearer token
8. Dashboard displays user data
```

### Admin Login Flow
```
1. Admin visits http://localhost:5174/admin-login
2. Enters admin credentials (DAR123 / barjan123)
3. Frontend POSTs to /api/admin-login/
4. Backend returns JWT token (admin only)
5. Token stored in localStorage as "adminToken"
6. Flag stored in localStorage as "isAdmin" = "true"
7. Redirected to /admin-dashboard
8. Dashboard fetches /api/admin-dashboard/ with Bearer token
9. Dashboard displays admin data
```

---

## 🛠️ Backend Configuration

### Django Settings Updated
- ✅ `CORS_HEADERS` middleware added
- ✅ CORS allowed origins configured for localhost:5173 & 5174
- ✅ JWT authentication configured
- ✅ Access token lifetime: 60 minutes
- ✅ Refresh token lifetime: 1 day

### Installed Packages
```
Django==6.0.3
djangorestframework==3.14.0
djangorestframework-simplejwt==5.5.1
django-cors-headers==4.3.1
```

---

## 📦 Frontend Configuration

### Installed Packages
```
react ^19.2.4
react-dom ^19.2.4
react-router-dom ^7.13.2
vite ^8.0.1
@vitejs/plugin-react ^6.0.1
eslint ^9.39.4
```

### Vite Config
- React plugin enabled
- Hot Module Replacement (HMR) enabled
- Development server on port 5173/5174

---

## 🧪 Testing the API

### Test User Login
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "user123"}'
```

### Test Admin Login
```bash
curl -X POST http://localhost:8000/api/admin-login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "DAR123", "password": "barjan123"}'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:8000/api/user-profile/ \
  -H "Authorization: Bearer {your_token_here}"
```

---

## 🐛 Troubleshooting

### Frontend won't load
- Check if backend is running on port 8000
- Clear browser cache and reload
- Check browser console for CORS errors
- Verify CORS settings in `backend/core/settings.py`

### Login not working
- Verify credentials: `DAR123` / `barjan123` (admin) or `user1` / `user123` (user)
- Check backend is running: `http://localhost:8000/`
- Check network tab in browser DevTools
- Look for error messages in backend terminal

### Dashboard not loading
- Verify token is stored in localStorage
- Check if you're logged in (look at URL - should be `/dashboard` or `/admin-dashboard`)
- Verify backend `/api/user-profile/` or `/api/admin-dashboard/` endpoints are working

### Port already in use
- Backend: `lsof -i :8000` or change port in `manage.py runserver 8001`
- Frontend: Vite will automatically try port 5174 if 5173 is taken

---

## 📝 Important Notes

### Frontend
- Token stored in `localStorage` with key `"token"` for users
- Admin token stored with key `"adminToken"`
- Admin flag stored with key `"isAdmin"`
- All API calls use `Authorization: Bearer {token}` header
- Logout clears localStorage and redirects to login

### Backend
- Uses SQLite database (db.sqlite3)
- JWT tokens expire after 60 minutes
- Admin users distinguished by `is_superuser` flag
- CORS enabled for development

---

## 🔄 Making Changes

### Adding a New Route
1. Create component in `frontend/src/components/`
2. Add route in `frontend/src/App.jsx`
3. Add corresponding CSS in `frontend/src/styles/`

### Adding a New API Endpoint
1. Create view function in `backend/accounts/views.py`
2. Add URL pattern in `backend/accounts/urls.py`
3. Call from frontend using fetch with Bearer token

### Updating Styles
- User Login: `frontend/src/styles/Login.css`
- Admin Login: `frontend/src/styles/AdminLogin.css`
- User Dashboard: `frontend/src/styles/UserDashboard.css`
- Admin Dashboard: `frontend/src/styles/AdminDashboard.css`

---

## 📊 Database

### SQLite Database Location
- `backend/db.sqlite3`

### Django Admin Panel
- URL: `http://localhost:8000/admin/`
- Username: `DAR123`
- Password: `barjan123`

---

## 🚀 Production Deployment Checklist

- [ ] Set `DEBUG = False` in `core/settings.py`
- [ ] Update `SECRET_KEY` in production
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Update `CORS_ALLOWED_ORIGINS` with production URLs
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set up environment variables for sensitive data
- [ ] Use HTTPS for all connections
- [ ] Build frontend: `npm run build` (creates `dist/` folder)
- [ ] Serve `dist/` folder from production server
- [ ] Set up proper JWT token refresh mechanism

---

## 📚 Useful Commands

### Backend
```powershell
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test

# Django shell
python manage.py shell

# Create test users
python create_users.py
```

### Frontend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 💡 Next Steps

1. **Customize Dashboard:** Update stats and data in components
2. **Add More Features:** Create fleet management pages
3. **Connect Real API:** Replace mock data with actual backend data
4. **Add Authentication Guards:** Protect routes more thoroughly
5. **Implement Logout:** Already done - clears tokens and redirects
6. **Style Refinements:** Adjust colors and layouts to match brand

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review browser console for errors
3. Check backend terminal for API errors
4. Verify all servers are running
5. Clear cache and restart servers

---

**Last Updated:** April 6, 2026  
**Status:** ✅ Production Ready for Testing
