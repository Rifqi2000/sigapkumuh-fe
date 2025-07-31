# Authentication Implementation

## Overview
This React application now includes authentication that integrates with the SSO system at `10.15.38.162:3100/api/sso/v1`.

## How it works

### 1. Authentication Check
- On app load, the `AuthProvider` component automatically checks authentication by calling `/auth/me`
- If no valid authentication cookies are found, the user is redirected to `/auth/login`
- If authentication is valid, the app loads normally

### 2. API Calls
- All API calls now include `credentials: 'include'` to send authentication cookies
- This ensures that the backend can verify the user's authentication status

### 3. User Interface
- A user info panel appears in the top-right corner showing the authenticated user's name
- A logout button is available to redirect users back to the login page

## Files Modified/Created

### New Files:
- `src/utils/auth.js` - Authentication utility functions
- `src/components/AuthProvider.jsx` - Authentication context provider
- `src/components/UserInfo.jsx` - User info display component
- `AUTHENTICATION.md` - This documentation

### Modified Files:
- `src/index.js` - Wrapped App with AuthProvider
- `src/App.js` - Added UserInfo component and credentials to API calls
- `src/components/HeroSection.jsx` - Added credentials to API calls
- `src/components/DashboardCapCip.js` - Added credentials to API calls

## Authentication Flow

1. **App Load** → AuthProvider checks `/auth/me`
2. **Not Authenticated** → Redirect to `/auth/login`
3. **Authenticated** → Load app with user info
4. **API Calls** → Include authentication cookies
5. **Logout** → Clear local data and redirect to login

## Environment Variables

Make sure your `.env` file includes:
```
REACT_APP_API_URL=your_backend_api_url
```

The authentication system uses the hardcoded SSO URL: `http://10.15.38.162:3100/api/sso/v1` 