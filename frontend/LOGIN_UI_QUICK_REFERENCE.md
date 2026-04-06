# Login UI - Quick Reference Guide

## File Locations

### Components
- **Login Component**: `c:\Users\Acer\Fleet_Dispatch\frontend\src\components\Login.jsx`
- **Admin Login Component**: `c:\Users\Acer\Fleet_Dispatch\frontend\src\components\AdminLogin.jsx`

### Styles
- **Login Styles**: `c:\Users\Acer\Fleet_Dispatch\frontend\src\styles\Login.css`
- **Admin Login Styles**: `c:\Users\Acer\Fleet_Dispatch\frontend\src\styles\AdminLogin.css`

---

## Key CSS Classes & Their Purposes

### Login Page
| Class | Purpose | Location |
|-------|---------|----------|
| `.login-container` | Main container | Login.css |
| `.company-logo` | Logo positioning (100px × 100px) | Login.css |
| `.login-car` | User car image (120% height) | Login.css |
| `.car-circle-wrapper` | Green circle animation wrapper | Login.css |
| `.login-header` | Header section (hides on focus) | Login.css |
| `.form-label` | Form input labels | Login.css |
| `.input-wrapper` | Input field container | Login.css |
| `.floating-label` | Animated floating label text | Login.css |
| `.form-input` | Input field styling | Login.css |

### Admin Login Page
| Class | Purpose | Location |
|-------|---------|----------|
| `.admin-login-container` | Main container | AdminLogin.css |
| `.admin-car` | Admin car image (300% height) | AdminLogin.css |
| `.car-circle-wrapper-admin` | Red circle animation wrapper | AdminLogin.css |
| `.admin-header` | Header section (hides on focus) | AdminLogin.css |
| `.admin-form-label` | Form input labels | AdminLogin.css |
| `.admin-input-wrapper` | Input field container | AdminLogin.css |
| `.admin-floating-label` | Animated floating label text | AdminLogin.css |
| `.admin-form-input` | Input field styling | AdminLogin.css |

---

## State Variables (React)

### Login Component
```javascript
const [email, setEmail] = useState('');              // Email input value
const [password, setPassword] = useState('');        // Password input value
const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
const [headerVisible, setHeaderVisible] = useState(true); // Header visibility
```

### AdminLogin Component
```javascript
const [username, setUsername] = useState('');        // Username input value
const [password, setPassword] = useState('');        // Password input value
const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
const [headerVisible, setHeaderVisible] = useState(true); // Header visibility
```

---

## CSS Animation Keyframes

### Login Page Animations
- `@keyframes popIn` - 0.5s, scales from 0.5 to 1, pops label into view
- `@keyframes floatUp` - 0.4s, moves label up 35px, shrinks to 0.85
- `@keyframes rotateWave` - 8s, rotates green circle with wave effect

### Admin Login Page Animations
- `@keyframes adminPopIn` - 0.5s, scales from 0.5 to 1
- `@keyframes adminFloatUp` - 0.4s, moves label up 35px, shrinks to 0.85
- `@keyframes rotateWaveAdmin` - 8s, rotates red circle with wave effect

---

## Common Modifications

### Change Floating Label Color (Login)
**File**: `Login.css`
**Find**: `.floating-label { color: #2d8659; }`
**Change**: `color: #2d8659;` to your desired color (hex, rgb, or named color)

### Change Floating Label Color (Admin)
**File**: `AdminLogin.css`
**Find**: `.admin-floating-label { color: #d32f2f; }`
**Change**: `color: #d32f2f;` to your desired color

### Modify Header Hide Animation Speed
**File**: `Login.css` or `AdminLogin.css`
**Find**: `.login-header { transition: all 0.3s ease; }`
**Change**: `0.3s` to desired duration (e.g., `0.5s`, `0.2s`)

### Adjust Floating Label Animation Speed
**File**: `Login.css`
**Find**: `animation: popIn 0.5s cubic-bezier(...)`
**Change**: `0.5s` to desired duration

### Change Input Focus Border Color (Login)
**File**: `Login.css`
**Find**: `.form-input:focus { border-color: #2d8659; }`
**Change**: `#2d8659` to your color

### Change Input Focus Border Color (Admin)
**File**: `AdminLogin.css`
**Find**: `.admin-form-input:focus { border-color: #d32f2f; }`
**Change**: `#d32f2f` to your color

---

## Event Handlers

### Email/Username Input Focus
```javascript
onFocus={(e) => {
  e.target.parentElement.classList.add('focused');  // Trigger floatUp animation
  setHeaderVisible(false);                           // Hide header
}}
```

### Email/Username Input Blur
```javascript
onBlur={(e) => {
  if (!e.target.value) {  // Only if input is empty
    e.target.parentElement.classList.remove('focused');
  }
}}
```

### Password Input Focus (Admin only, keeps header visible)
```javascript
onFocus={(e) => {
  e.target.parentElement.classList.add('focused');  // Trigger floatUp animation
}}
```

---

## Responsive Breakpoints

Both Login and AdminLogin use the same responsive breakpoints:
- **1024px and down**: Form adjusted for tablets
- **768px and down**: Form centered on screen
- **600px and down**: Mobile optimization
- **480px and down**: Extra small devices
- **360px and down**: Ultra small portrait mode
- **600px height and down**: Landscape mode adjustments

---

## Colors Used

### Login Page (Green Theme)
- Primary: `#2d8659` (Dark Green)
- Light Green: `#67c442` (Button)
- Circle: `rgba(45, 134, 89, 0.3)` (Semi-transparent green)

### Admin Login Page (Red/Orange Theme)
- Primary: `#d32f2f` (Red)
- Secondary: `#f57c00` (Orange)
- Circle: `rgba(211, 47, 47, 0.3)` (Semi-transparent red)

### Neutral Colors
- Text: `#1a1a1a` (Dark)
- Secondary Text: `#666` (Gray)
- Borders: `#e0e0e0` (Light Gray)
- Background: `#f9f9f9` (Off-white)

---

## Input Width Specifications

All input fields are set to:
```css
width: 100%;
```

This ensures:
- Email and password inputs have identical width
- Username and password inputs in admin have identical width
- Inputs fill the entire form container
- Consistent alignment across all pages

---

## Best Practices for Modifications

1. **Always test on both pages** - Changes to Login should be mirrored to AdminLogin
2. **Maintain color consistency** - Use the theme colors defined above
3. **Keep animation speeds consistent** - Use 0.3s-0.5s for smooth transitions
4. **Test on mobile** - Use browser dev tools to test responsive behavior
5. **Don't remove classes** - Classes like `.focused` are required for JS functionality
6. **Preserve event handlers** - onFocus/onBlur handlers manage animations and header visibility

---

## Troubleshooting

### Floating labels not animating
- Check that `.input-wrapper` or `.admin-input-wrapper` has `focused` class on focus
- Verify keyframes are defined in CSS file
- Check animation duration isn't set to 0s

### Header not hiding
- Verify `headerVisible` state is initialized to `true`
- Check that `{!headerVisible ? 'hidden' : ''}` is in header className
- Ensure `.hidden` class has `display: none; opacity: 0;`

### Input fields misaligned
- Verify `.input-wrapper` and `.form-input` both have `width: 100%`
- Check `.form-group` uses `display: flex; flex-direction: column;`
- Ensure no padding/margin is overriding widths

### Circle animation not rotating
- Verify `@keyframes rotateWave` and `@keyframes rotateWaveAdmin` are defined
- Check `animation` property on `.car-circle-wrapper::before` and `.car-circle-wrapper-admin::before`
- Verify animation duration is `8s linear infinite`

---

## Development Server

Start frontend: `npm run dev` from `c:\Users\Acer\Fleet_Dispatch\frontend`
- Default URL: http://localhost:5173/ (or next available port)
- Hot reload enabled
- CSS changes visible immediately

---

## File Size Notes

- **Login.jsx**: ~5 KB
- **AdminLogin.jsx**: ~4 KB
- **Login.css**: ~18 KB
- **AdminLogin.css**: ~16 KB
- **Total**: ~43 KB (excellent for page load)

---

**Last Updated**: March 31, 2026
**Version**: 2.0 (Complete with Admin Login floating labels)
