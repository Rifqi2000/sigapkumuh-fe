const AUTH_BASE_URL = 'https://10.15.38.162:3100/api/sso/v1';

// Function to get cookie by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Function to check if user has valid authentication cookies
// Note: For HTTP-only cookies, we cannot read them via JavaScript
// We rely on server response to determine authentication status
const hasValidAuthCookies = () => {
  // For HTTP-only cookies, we cannot check them client-side
  // The server will validate the cookies and return appropriate response
  console.log('🍪 HTTP-only cookies cannot be read by JavaScript');
  console.log('🍪 Relying on server response for authentication status');
  return true; // Let the server decide
};

export const checkAuth = async () => {
  try {
    // For HTTP-only cookies, we cannot check them client-side
    console.log('🍪 Using HTTP-only cookies - relying on server validation');
    
    // Check domain compatibility
    const domainInfo = checkDomainCompatibility();
    console.log('🌐 Domain compatibility:', domainInfo);
    
    // Check primary auth cookies (for logging purposes only)
    const primaryCookies = checkPrimaryAuthCookies();
    console.log('🔑 HTTP-only cookies status:', primaryCookies);
    
    // For HTTP-only cookies, we always make the request to server
    // Server will validate the cookies and return appropriate response
    console.log('🔍 Making authentication request to server...');
    console.log('🌐 Current domain:', window.location.origin);
    console.log('🔗 Auth endpoint:', `${AUTH_BASE_URL}/auth/me`);

    // Make request to auth endpoint with cookies
    const response = await fetch(`${AUTH_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('🔍 Auth check response status:', response.status);
    console.log('🔍 Auth check response headers:', response.headers);
    console.log('🔍 Response URL:', response.url);
    
    // Check for CORS issues
    if (response.status === 0) {
      console.log('🚨 CORS Error - Request blocked by CORS policy');
      return { isAuthenticated: false, user: null, error: 'CORS_ERROR' };
    }
    
    // Log response details for debugging
    const responseText = await response.text();
    console.log('🔍 Response body:', responseText);
    
    let userData = null;
    try {
      userData = JSON.parse(responseText);
    } catch (e) {
      console.log('🔍 Response is not JSON:', responseText);
    }

    if (response.ok) {
      console.log('✅ Authentication successful:', userData);
      return { isAuthenticated: true, user: userData };
    } else {
      console.log('❌ Authentication failed - Status:', response.status);
      console.log('❌ Response body:', responseText);
      return { isAuthenticated: false, user: null };
    }
      } catch (error) {
      console.error('❌ Auth check failed:', error);
      
      // Check if it's a CORS or network error
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.log('🚨 Network/CORS Error - Trying alternative approach...');
        
        // Try to check local login status as fallback
        try {
          const localAuthResult = await checkLocalLoginStatus();
          console.log('🔍 Local auth check result:', localAuthResult);
          
          if (localAuthResult.isAuthenticated) {
            console.log('✅ Local auth check successful');
            return localAuthResult;
          }
        } catch (localAuthError) {
          console.log('❌ Local auth check failed:', localAuthError);
        }
      }
      
      return { isAuthenticated: false, user: null, error: error.message };
    }
};

export const redirectToLogin = () => {
  console.log('🔄 Redirecting to login page...');
  
  // Save current URL for redirect after login
  const currentUrl = window.location.href;
  console.log('📍 Current URL to redirect back:', currentUrl);
  
  // Store the current URL in sessionStorage for redirect after login
  sessionStorage.setItem('redirectAfterLogin', currentUrl);
  
  // Redirect to local login page
  window.location.href = 'http://localhost:3000/peta/login';
};

export const logout = () => {
  console.log('🚪 Logging out...');
  // Clear any local auth data if needed
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
  
  // Clear all cookies (optional - be careful with this)
  // document.cookie.split(";").forEach(function(c) { 
  //   document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  // });
  
  // Redirect to login
  redirectToLogin();
};

// Function to check specific primary auth cookies
// Note: For HTTP-only cookies, we cannot read them via JavaScript
export const checkPrimaryAuthCookies = () => {
  console.log('🍪 Cannot read HTTP-only cookies (accessToken, refreshToken)');
  console.log('🍪 Server will validate HTTP-only cookies automatically');
  
  return {
    hasAccessToken: false, // Cannot read HTTP-only cookies
    hasRefreshToken: false, // Cannot read HTTP-only cookies
    accessToken: null,
    refreshToken: null,
    hasAnyPrimary: false, // Server will determine this
    isHttpOnly: true
  };
};

// Function to handle redirect after successful authentication
export const handlePostLoginRedirect = () => {
  const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
  
  if (redirectUrl) {
    console.log('🔄 Redirecting back to:', redirectUrl);
    sessionStorage.removeItem('redirectAfterLogin'); // Clear the stored URL
    window.location.href = redirectUrl;
    return true;
  }
  
  return false;
};

// Function to check if user came from login page
export const checkLoginRedirect = () => {
  const referrer = document.referrer;
  const isFromLogin = referrer.includes('localhost:3000/peta/login');
  
  console.log('🔍 Checking if user came from login page...');
  console.log('🔍 Referrer:', referrer);
  console.log('🔍 Is from login:', isFromLogin);
  
  return {
    referrer,
    isFromLogin,
    shouldCheckAuth: isFromLogin
  };
};

// Function to check login status on localhost:3000
export const checkLocalLoginStatus = async () => {
  try {
    console.log('🔍 Checking login status on localhost:3000...');
    console.log('🔍 Cross-port cookie check...');
    
    const response = await fetch('http://localhost:3000/peta/login', {
      method: 'GET',
      credentials: 'include', // This sends HTTP-only cookies
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    });
    
    console.log('🔍 Local login response status:', response.status);
    console.log('🔍 Local login response URL:', response.url);
    console.log('🔍 Response headers:', response.headers);
    
    // Check if cookies were sent (indirectly)
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      console.log('🍪 Server set new cookies:', setCookieHeader);
    }
    
    // If we get redirected to home, user is authenticated
    if (response.url.includes('/peta/home') || response.url.includes('/peta/dashboard')) {
      console.log('✅ User appears to be authenticated (redirected to home)');
      return { isAuthenticated: true, user: { name: 'Authenticated User' } };
    }
    
    // If we can access login page, user is not authenticated
    if (response.status === 200) {
      console.log('❌ User not authenticated (can access login page)');
      return { isAuthenticated: false, user: null };
    }
    
    return { isAuthenticated: false, user: null };
  } catch (error) {
    console.log('❌ Cannot check local login status:', error);
    return { isAuthenticated: false, user: null, error: error.message };
  }
};

// Function to test cross-port cookie transmission
export const testCrossPortCookies = async () => {
  console.log('🧪 Testing cross-port cookie transmission...');
  
  const tests = [
    {
      name: 'Test 1: Direct API call',
      url: 'http://localhost:3000/api/auth/status',
      method: 'GET'
    },
    {
      name: 'Test 2: Login page check',
      url: 'http://localhost:3000/peta/login',
      method: 'GET'
    },
    {
      name: 'Test 3: Home page check',
      url: 'http://localhost:3000/peta/home',
      method: 'GET'
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      console.log(`🔍 ${test.name}...`);
      
      const response = await fetch(test.url, {
        method: test.method,
        credentials: 'include',
        headers: {
          'Accept': 'application/json,text/html,*/*',
        },
      });
      
      const result = {
        test: test.name,
        status: response.status,
        url: response.url,
        redirected: response.redirected,
        headers: {
          'set-cookie': response.headers.get('set-cookie'),
          'content-type': response.headers.get('content-type'),
        }
      };
      
      console.log(`✅ ${test.name} result:`, result);
      results.push(result);
      
    } catch (error) {
      console.log(`❌ ${test.name} failed:`, error);
      results.push({
        test: test.name,
        error: error.message
      });
    }
  }
  
  return results;
};

// Function to check login page status
export const checkLoginPageStatus = async () => {
  try {
    console.log('🔍 Checking login page status at http://localhost:3000/peta/login...');
    
    const response = await fetch('http://localhost:3000/peta/login', {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log('🔍 Login page status:', response.status);
    console.log('🔍 Login page headers:', response.headers);
    
    return {
      status: response.status,
      ok: response.ok,
      redirected: response.redirected,
      url: response.url
    };
  } catch (error) {
    console.log('❌ Cannot access login page:', error);
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
};

// Function to check if we're on the same domain as the auth server
export const checkDomainCompatibility = () => {
  const currentDomain = window.location.origin;
  const authDomain = new URL(AUTH_BASE_URL).origin;
  
  console.log('🌐 Current domain:', currentDomain);
  console.log('🔗 Auth domain:', authDomain);
  console.log('🔍 Same domain:', currentDomain === authDomain);
  
  return {
    currentDomain,
    authDomain,
    isSameDomain: currentDomain === authDomain,
    isLocalhost: currentDomain.includes('localhost'),
    isCrossOrigin: currentDomain !== authDomain
  };
};

// Export cookie checking function for debugging
export const debugCookies = () => {
  console.log('🍪 Current cookies (readable):', document.cookie);
  console.log('🔍 HTTP-only cookies cannot be read by JavaScript');
  
  const primaryCookies = checkPrimaryAuthCookies();
  console.log('🔑 HTTP-only cookies status:', primaryCookies);
  
  return {
    allCookies: document.cookie,
    hasValidAuth: 'Server will determine', // Cannot check HTTP-only cookies
    primaryCookies,
    isHttpOnly: true,
    note: 'HTTP-only cookies are automatically sent with requests but cannot be read by JavaScript',
    authCookies: ['accessToken', 'refreshToken', 'token', 'access_token', 'auth_token', 'session', 'sessionId', 'JSESSIONID', 'connect.sid'].map(name => ({
      name,
      value: 'HTTP-only (cannot read)',
      isHttpOnly: true
    }))
  };
}; 