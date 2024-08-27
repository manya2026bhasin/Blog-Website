import React, { useState } from 'react';
import '../styles/user.css';
import { useNavigate } from 'react-router-dom';
import personimg from '../images/user.png';

function User({ blogs, setBlogs, getEmailFromToken }) {
  const navigate = useNavigate();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  function openAccountDropdown() {
    setShowAccountDropdown(true);
  }

  function closeAccountDropdown() {
    setShowAccountDropdown(false);
  }

  function handleSignOut() {
    navigate('/login');
  }

  async function handleUsersBlogs() {
    try {
      const email = getEmailFromToken();
      const response = await fetch(`http://localhost:5000/api/emailblogs?email=${encodeURIComponent(email)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user blogs');
      }

      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      alert('Error fetching user blogs. Please try again.');
    }
  }

  return (
    <div 
      className="user"
      onMouseEnter={openAccountDropdown}
      onMouseLeave={closeAccountDropdown}
    >
      <img 
        src={personimg} 
        className="account-button" 
      />
      {showAccountDropdown && (
        <div className="account-dropdown">
          <p onClick={() => console.log('My profile clicked')}>My profile</p>
          <p onClick={handleUsersBlogs}>My blogs</p>
          <p onClick={handleSignOut}>Sign out</p>
        </div>
      )}
    </div>
  );
}

export default User;
