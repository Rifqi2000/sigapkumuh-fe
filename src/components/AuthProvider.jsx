import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAuth, redirectToLogin, handlePostLoginRedirect, checkLoginRedirect, checkLocalLoginStatus } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      console.log('🔍 Starting authentication verification...');
      console.log('🔍 Checking authentication status...');
      
      // Check if user came from login page
      const loginInfo = checkLoginRedirect();
      console.log('🔍 Login redirect info:', loginInfo);
      
      try {
        const { isAuthenticated: authStatus, user: userData } = await checkAuth();
        
        console.log('🔍 Auth check result:', { authStatus, user: userData });
        console.log('🔍 Authentication status:', authStatus ? 'SUCCESS' : 'FAILED');
        
        if (authStatus) {
          console.log('✅ User authenticated, setting state...');
          setIsAuthenticated(true);
          setUser(userData);
          
          // Check if we need to redirect after login
          const wasRedirected = handlePostLoginRedirect();
          if (wasRedirected) {
            console.log('🔄 Redirecting to saved URL after login...');
            console.log('✅ User authenticated - Redirecting to saved URL');
            alert('✅ Authentication successful! Redirecting to your requested page...');
            return; // Don't continue with normal flow
          }
          
          // User is authenticated, continue to current page without redirect
          console.log('✅ User authenticated - Continuing to current page');
          alert('✅ Authentication successful! Welcome back!');
        } else {
          console.log('❌ User not authenticated, trying local auth check...');
          
          // Try local auth check as fallback
          try {
            const localAuthResult = await checkLocalLoginStatus();
            console.log('🔍 Local auth check result:', localAuthResult);
            
            if (localAuthResult.isAuthenticated) {
              console.log('✅ Local auth check successful, setting authenticated state...');
              setIsAuthenticated(true);
              setUser(localAuthResult.user);
              console.log('✅ User authenticated via local check - Continuing to current page');
              alert('✅ Authentication successful! Welcome back!');
            } else {
              console.log('❌ Local auth check also failed, redirecting to login...');
              console.log('⚠️ Authentication required - Redirecting to login page');
              alert('⚠️ Authentication required! Please login to continue...');
              // If not authenticated, redirect to login
              redirectToLogin();
              return;
            }
          } catch (localAuthError) {
            console.log('❌ Local auth check failed:', localAuthError);
            console.log('⚠️ Authentication required - Redirecting to login page');
            alert('⚠️ Authentication required! Please login to continue...');
            redirectToLogin();
            return;
          }
        }
      } catch (error) {
        console.error('❌ Authentication verification failed:', error);
        console.log('🚨 Authentication error - Redirecting to login page');
        alert('🚨 Authentication error! Please try logging in again...');
        redirectToLogin();
        return;
      } finally {
        console.log('🏁 Authentication check completed, setting loading to false');
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const value = {
    isAuthenticated,
    user,
    isLoading,
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#83DBF6',
        color: '#fff',
        fontSize: '18px'
      }}>
        Memverifikasi autentikasi...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 