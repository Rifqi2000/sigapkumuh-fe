import React, { useState, useEffect } from 'react';
import { debugCookies, checkDomainCompatibility, testCrossPortCookies } from '../utils/auth';

const CookieDebugger = () => {
  const [cookieInfo, setCookieInfo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [crossPortTest, setCrossPortTest] = useState(null);

  useEffect(() => {
    const info = debugCookies();
    const domainInfo = checkDomainCompatibility();
    setCookieInfo({ ...info, domainInfo });
  }, []);

  const runCrossPortTest = async () => {
    console.log('🧪 Running cross-port cookie test...');
    const results = await testCrossPortCookies();
    setCrossPortTest(results);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '8px 12px',
          fontSize: '12px',
          cursor: 'pointer'
        }}
      >
        🔍 Debug Cookies
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      borderRadius: '10px',
      padding: '15px',
      maxWidth: '400px',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0 }}>🍪 Cookie Debug Info</h4>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ✕
        </button>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Cookie Type:</strong> <span style={{ color: '#FFD700' }}>🔒 HTTP-Only Cookies</span>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Auth Status:</strong> <span style={{ color: '#4CAF50' }}>🔄 Server will determine</span>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Domain Info:</strong>
        <div style={{ marginLeft: '10px', marginTop: '5px' }}>
          <div>Current: {cookieInfo?.domainInfo?.currentDomain}</div>
          <div>Auth: {cookieInfo?.domainInfo?.authDomain}</div>
          <div style={{ color: cookieInfo?.domainInfo?.isSameDomain ? '#4CAF50' : '#f44336' }}>
            Same Domain: {cookieInfo?.domainInfo?.isSameDomain ? '✅ Yes' : '❌ No'}
          </div>
          <div style={{ color: cookieInfo?.domainInfo?.isCrossOrigin ? '#f44336' : '#4CAF50' }}>
            Cross-Origin: {cookieInfo?.domainInfo?.isCrossOrigin ? '⚠️ Yes' : '✅ No'}
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>HTTP-Only Auth Cookies:</strong>
        <div style={{ marginLeft: '10px', marginTop: '5px' }}>
          <div style={{ color: '#FFD700' }}>
            accessToken: 🔒 HTTP-Only (cannot read)
          </div>
          <div style={{ color: '#FFD700' }}>
            refreshToken: 🔒 HTTP-Only (cannot read)
          </div>
        </div>
      </div>
      
              <div style={{ marginBottom: '10px' }}>
          <strong>All Auth Cookies:</strong>
          {cookieInfo?.authCookies.map((cookie, index) => {
            const isPrimary = cookie.name === 'accessToken' || cookie.name === 'refreshToken';
            return (
              <div key={index} style={{ 
                marginLeft: '10px', 
                marginTop: '5px',
                fontWeight: isPrimary ? 'bold' : 'normal',
                color: isPrimary ? '#FFD700' : 'inherit'
              }}>
                <span style={{ color: '#FFD700' }}>
                  {cookie.name}: 🔒 HTTP-Only (cannot read)
                  {isPrimary && ' (Primary)'}
                </span>
              </div>
            );
          })}
        </div>
      
              <details style={{ marginTop: '10px' }}>
          <summary style={{ cursor: 'pointer' }}>📋 All Cookies</summary>
          <div style={{ 
            marginTop: '5px', 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            padding: '5px', 
            borderRadius: '3px',
            wordBreak: 'break-all'
          }}>
            {cookieInfo?.allCookies || 'No cookies found'}
          </div>
        </details>
        
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={runCrossPortTest}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            🧪 Test Cross-Port Cookies
          </button>
          
          {crossPortTest && (
            <details style={{ marginTop: '5px' }}>
              <summary style={{ cursor: 'pointer' }}>🧪 Cross-Port Test Results</summary>
              <div style={{ 
                marginTop: '5px', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                padding: '5px', 
                borderRadius: '3px',
                fontSize: '10px'
              }}>
                {crossPortTest.map((result, index) => (
                  <div key={index} style={{ marginBottom: '5px' }}>
                    <strong>{result.test}:</strong> {result.status || result.error}
                    {result.url && <div>URL: {result.url}</div>}
                    {result.redirected && <div>Redirected: Yes</div>}
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
    </div>
  );
};

export default CookieDebugger; 