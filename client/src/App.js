// App.js
import React from 'react';
// import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/signup';
import BlogsPage from './components/blogsPage';
import LogIn from './components/login';
import Home from './components/home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogsPage" element={<BlogsPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </Router>
  );
}

export default App;