import React from 'react';
import { useAuth } from './AuthProvider';
import { logout } from '../utils/auth';
import 'bootstrap-icons/font/bootstrap-icons.css';

const UserInfo = () => {
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '10px',
      padding: '10px 15px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      color: '#333',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <div>
        <i className="bi bi-person-circle" style={{ marginRight: '5px' }}></i>
        {user?.name || user?.username || 'User'}
      </div>
      <button
        onClick={handleLogout}
        style={{
          background: 'none',
          border: 'none',
          color: '#dc3545',
          cursor: 'pointer',
          fontSize: '16px',
          padding: '2px 5px',
          borderRadius: '3px',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#f8d7da'}
        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        title="Logout"
      >
        <i className="bi bi-box-arrow-right"></i>
      </button>
    </div>
  );
};

export default UserInfo; 