import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home-background"></div>
      <div className="home-container">
        <h1>Welcome to <span>Blogeria</span></h1>
        <button onClick={() => navigate('/signup')}>Sign Up</button>
        <button onClick={() => navigate('/login')}>Log In</button>
      </div>
    </div>
  );
}

export default Home;
