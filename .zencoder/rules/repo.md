# Google Club - Project Documentation

## Project Overview
Google Club is a full-stack web application designed for managing club events, notifications, and resources with an admin panel. It features user authentication, role-based access control (admin/user), and a modern UI with dark mode support.

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context (Theme), React Query for async operations
- **Build Tool**: Vite
- **Icons**: Lucide React

### Backend
- **Server**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Middleware**: CORS, body-parser

## Project Structure

```
google-club/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.tsx      # Main navigation with auth status & dark mode toggle
│   │   │   ├── ProtectedRoute.tsx  # Route protection component for admin areas
│   │   │   ├── Chatbot.tsx
│   │   │   └── ui/                 # shadcn/ui components
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx    # Dark mode theme management
│   │   ├── pages/
│   │   │   ├── Auth.tsx            # Login/Register page
│   │   │   ├── Profile.tsx         # User profile (shows email, role, logout button)
│   │   │   ├── AdminLogin.tsx      # Admin-only login
│   │   │   ├── AdminDashboard.tsx  # Admin dashboard
│   │   │   ├── AdminEvents.tsx     # Manage events (CRUD)
│   │   │   ├── AdminNotifications.tsx # Manage notifications
│   │   │   ├── AdminResources.tsx  # Manage resources
│   │   │   ├── Events.tsx
│   │   │   ├── Notifications.tsx
│   │   │   ├── Resources.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── IdeaWall.tsx
│   │   │   └── NotFound.tsx
│   │   ├── App.tsx                 # Main app with routes
│   │   ├── main.tsx
│   │   └── index.css               # Global styles + dark mode CSS variables
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json

└── backend/
    ├── index.js                    # Express server setup
    ├── models/
    │   └── User.js                 # User schema (email, password, role)
    ├── routes/
    │   └── auth.js                 # Auth endpoints: /register, /login
    ├── admin/
    │   └── admin.js                # Admin routes with JWT protection
    └── package.json
```

## Key Features Implemented

### Authentication & Authorization
- **User Registration**: `/api/auth/register` (defaults to role: 'user')
- **User Login**: `/api/auth/login` (stores JWT token & email)
- **Admin Login**: Redirects to `/admin/login` → Dashboard (Fixed ✅)
- **Protected Routes**: Admin pages require valid JWT token with admin role
- **Token Storage**: Stored in localStorage (token, userRole, userEmail)

### User Interface
- **Dark Mode Toggle**: Moon/Sun icon in navigation (persisted to localStorage)
- **Authentication Status**: Navigation shows email + "Sign Out" when logged in, "Sign In" when logged out
- **Profile Page**: 
  - Shows logged-in user email and role (with color-coded badge)
  - Displays sign-out button
  - Edit profile form (fields editable, email read-only)
  - Account settings section

### Admin Panel
- **Dashboard**: `/admin/dashboard` - Main admin hub with links to management pages
- **Event Management**: Add/Edit/Delete events
- **Notification Management**: Add/Edit/Delete notifications with type selector (info/warning/error/success)
- **Resource Management**: Add/Edit/Delete resources with category support
- **All Admin Routes**: Protected by JWT authentication middleware

## Fixed Issues

### ✅ Token Storage Mismatch (FIXED)
**Problem**: AdminDashboard/AdminEvents/AdminNotifications/AdminResources were looking for 'adminToken' but Auth pages stored 'token'
**Solution**: Standardized all token references to use 'token' and 'userRole'

### ✅ Navigation Auth Display (FIXED)
**Problem**: Navigation always showed "Sign In" even when user was logged in
**Solution**: Check localStorage for token and display email + "Sign Out" when logged in

### ✅ Profile Page (FIXED)
**Problem**: Profile showed hardcoded data (John Doe)
**Solution**: Now displays actual logged-in user email and role with protection (redirects to login if not authenticated)

### ✅ Dark Mode (ADDED)
**Implementation**: 
- Created ThemeContext to manage theme state
- Theme persisted to localStorage
- CSS variables in index.css handle light/dark mode styling
- Toggle button in Navigation on desktop (icon) and mobile (text + icon)

## Authentication Flow

### User Registration & Login
```
Sign Up → POST /api/auth/register 
  → Token generated 
  → Stored in localStorage 
  → Redirect to /profile
```

```
Sign In → POST /api/auth/login 
  → Token + role + email stored 
  → If admin role → /admin/dashboard
  → If user role → /profile
```

### Admin Login
```
POST /admin/login → 
  Verify role === 'admin' → 
  Store token & email → 
  Redirect to /admin/dashboard
```

## Storage Keys Used
- `token`: JWT authentication token
- `userRole`: User role ('user' or 'admin')
- `userEmail`: User email address
- `theme`: Current theme preference ('light' or 'dark')

## Known Limitations & TODO

### Backend
- [ ] Create MongoDB models for Event, Notification, Resource (currently just console.log)
- [ ] Implement actual CRUD operations to database
- [ ] Remove/merge duplicate `/api/admin/login` route (already exists in `/api/auth/login`)
- [ ] Add validation to prevent regular users creating admin accounts
- [ ] Implement DELETE endpoints for all resources

### Frontend
- [ ] Fetch events/notifications/resources from backend instead of hardcoded data
- [ ] Create separate Edit pages (EditEvent, EditNotification, EditResource)
- [ ] Add admin navigation link in main menu
- [ ] Implement search/filter functionality
- [ ] Add loading states for API calls
- [ ] Improve error handling and validation

### Testing
- [ ] Test complete admin CRUD workflow
- [ ] Test role-based route protection
- [ ] Test dark mode persistence across sessions
- [ ] Test logout functionality across all pages

## Credentials for Testing

### Default Admin Account
- Email: `maite@gmail.com`
- Password: `MIATE`
- Note: Must be created via `/api/auth/register` endpoint with `role: 'admin'`

## Environment Setup

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:3000`
Frontend runs on `http://localhost:5173` (Vite default)

## Important Notes for Developers

1. **Token Authentication**: Include token in Authorization header for admin routes:
   ```
   Authorization: <jwt_token>
   ```

2. **Dark Mode**: Always test components in both light and dark modes using CSS variables

3. **Protected Routes**: Use `ProtectedRoute` component with `allowedRoles` prop for route protection

4. **Error Handling**: All auth pages have error toast notifications for user feedback

5. **LocalStorage**: Clear localStorage when debugging authentication issues

## Recent Changes (Latest Session)
- ✅ Fixed admin login redirection to dashboard
- ✅ Added Sign Out button to navigation
- ✅ Profile page now shows user email and role
- ✅ Implemented dark mode toggle in navigation
- ✅ Theme persistence using localStorage
- ✅ Added logout functionality across all pages
- ✅ Email display in navigation bar when logged in