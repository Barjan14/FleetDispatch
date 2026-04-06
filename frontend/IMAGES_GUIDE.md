# Fleet Dispatch Frontend - React Vite

A modern, beautiful React + Vite frontend for the Fleet Dispatch application with admin login functionality.

## 🎨 Design Features

- **Modern UI** with gradient backgrounds (green and yellow theme)
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Beautiful Login Forms** with animations
- **Admin Panel** with separate branding
- **Vehicle Images** integration
- **Company Logo** support

## 📁 Project Structure

```
frontend/
├── public/
│   └── assets/
│       └── images/          ← 🎯 PUT YOUR IMAGES HERE
│           ├── car.png      (Main vehicle image for login)
│           └── dap-logo.png (Company/DAP logo)
├── src/
│   ├── components/
│   │   ├── Login.jsx        (User login page)
│   │   └── AdminLogin.jsx   (Admin login page)
│   ├── styles/
│   │   ├── Login.css        (User login styles)
│   │   └── AdminLogin.css   (Admin login styles)
│   ├── App.jsx              (Main routing)
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🖼️ Adding Your Images

### Step 1: Prepare Your Images
Place your images in the `public/assets/images/` folder:

```
frontend/public/assets/images/
├── car.png        (Your vehicle image - used in user login)
├── dap-logo.png   (Your company logo - shown as badge)
```

### Recommended Image Specifications

**car.png** (Main Vehicle):
- Format: PNG with transparency
- Size: 400x350px or larger (will scale)
- Aspect Ratio: Landscape (wider than tall)
- File Size: < 500KB

**dap-logo.png** (Company Logo):
- Format: PNG with transparency
- Size: 100x100px or larger
- Aspect Ratio: Square recommended
- File Size: < 200KB

### Step 2: Update Image Paths (if needed)
If you want to use different image names or paths, edit:

**For User Login** (`src/components/Login.jsx`):
```jsx
<img 
  src="/assets/images/car.png"  // Change this path
  alt="Fleet Vehicle"
/>

<img 
  src="/assets/images/dap-logo.png"  // Change this path
  alt="DAP Logo"
/>
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

## 📄 Pages

### User Login (`/`)
- Email/Username input
- Password input with visibility toggle
- Remember me checkbox
- Forgot password link
- Link to admin login
- Responsive car image display

### Admin Login (`/admin-login`)
- Admin username input
- Password input with visibility toggle
- Beautiful admin branding
- Admin features list
- Back to user login button

## 🔧 Configuration

### Backend API Integration

Edit the API endpoints in the components:

**`src/components/Login.jsx`** (line ~25):
```javascript
const response = await fetch('http://localhost:8000/api/login/', {
  // ...
});
```

**`src/components/AdminLogin.jsx`** (line ~18):
```javascript
const response = await fetch('http://localhost:8000/api/admin-login/', {
  // ...
});
```

Update these URLs to match your Django backend endpoints.

## 🎨 Customizing Colors

Edit the CSS files to change the color scheme:

**`src/styles/Login.css`**:
```css
/* Change the green gradient */
background: linear-gradient(135deg, #1a5f3f 0%, #2d8659 50%, #3d9d6f 100%);

/* Change the button color */
background: linear-gradient(135deg, #67c442 0%, #5cb340 100%);
```

**`src/styles/AdminLogin.css`**:
```css
/* Change the red/orange gradient */
background: linear-gradient(135deg, #d32f2f 0%, #f57c00 100%);
```

## 📦 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌐 CORS Configuration

If you get CORS errors when calling the Django backend, update your Django `settings.py`:

```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

Install corsheaders:
```bash
pip install django-cors-headers
```

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px to 1023px
- **Mobile**: Below 768px

The design uses mobile-first approach and adapts beautifully to all screen sizes.

## 🎯 Features Implemented

✅ Modern login/admin login UI  
✅ Beautiful gradient backgrounds  
✅ Responsive design  
✅ Form validation  
✅ Password visibility toggle  
✅ Loading states  
✅ Error handling  
✅ Image integration (with fallbacks)  
✅ Smooth animations  
✅ Professional styling  

## 📄 License

This project is part of the Fleet Dispatch application.

## 🤝 Contributing

Feel free to customize the design, colors, and functionality to match your brand.

---

**Need Help?**
- 🚗 Replace the car.png with your vehicle images
- 🏢 Replace the dap-logo.png with your company logo
- 🎨 Customize colors in the CSS files
- 🔌 Connect your Django backend endpoints
- 📱 Test on different devices using browser dev tools
