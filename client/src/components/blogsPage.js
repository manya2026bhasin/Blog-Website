import React, { useState, useEffect } from 'react';
import '../styles/BlogsPage.css';
import axios from 'axios';
import User from './user.js';
import {jwtDecode} from 'jwt-decode';
import filterimg from '../images/filter1.png';
import deleteimg from '../images/delete.png';
import editimg from '../images/pen.png';

function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ blog: '', category: '', author: '', createdAt: '' });
  const [showPopup, setShowPopup] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');

  function getEmailFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.email; // Assuming the email is in the payload
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  function togglePopup() {
    const email = getEmailFromToken();
    const date = new Date();
    console.log(date);
    const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
    if (email) {
      setForm({
        ...form,
        author: email,
        createdAt: formattedDate,
      });
    }
    setShowPopup(!showPopup);
  }

  // function toggleCategoryDropdown() {
  //   setShowCategoryDropdown(!showCategoryDropdown);
  // }

  // function toggleEmailPopup() {
  //   setShowEmailPopup(!showEmailPopup);
  // }

  function handleFormDataChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function addBlog() {
    if (form.blog && form.category) {
      try {
        await axios.post('http://localhost:5000/api/blogs', form);
        const result = await axios.get('http://localhost:5000/api/blogs');
        setBlogs(result.data);
        setShowPopup(false);
        setForm({ blog: '', category: '', author: '', createdAt: '' });
      } catch (error) {
        console.error('Error sending data:', error);
        alert('Error adding blog. Please try again.');
      }
    } else {
      alert('Please fill in both the blog and category fields.');
    }
  }
  async function handleDelete(id,author) {
    try{
      if(author === getEmailFromToken()){
      await axios.post('http://localhost:5000/api/deleteblogs',{id});
      const result = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(result.data);
      }
      else{
        alert("you are not the author of this blog. you can't delete it.");
      }
    }
    catch(error){
      console.error('Error sending data:', error);
        alert('Error deleting blog. Please try again.');
    }
  }
  async function handleEdit(id) {
    
    // try{
    //   await axios.post('http://localhost:5000/api/deleteblogs',{id});
    //   const result = await axios.get('http://localhost:5000/api/blogs');
    //   setBlogs(result.data);
    // }
    // catch(error){
    //   console.error('Error sending data:', error);
    //     alert('Error deleting blog. Please try again.');
    // }
  }
  async function sortCategory(e) {
    try {
      const category = e.target.textContent;
      const response = await fetch(`http://localhost:5000/api/categoryblogs?category=${encodeURIComponent(category)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch category blogs');
      }

      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching category blogs:', error);
      alert('Error fetching blogs by category. Please try again.');
    }
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blogs');
        const data = await response.json();
        setBlogs(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="blogs-page">
      <div className="header">
        <div
          className="filter-container"
          onMouseEnter={() => setShowFilterDropdown(true)}
          onMouseLeave={() => setShowFilterDropdown(false)}
        >
          <img src={filterimg} alt='profile' className="filter-button" />
          {showFilterDropdown && (
            <div className="filter-dropdown">
              <p
                onMouseEnter={() => setShowCategoryDropdown(true)}
                onMouseLeave={() => setShowCategoryDropdown(false)}
              >
                Category
              </p>
              <p
                onMouseEnter={() => setShowEmailPopup(true)}
                onMouseLeave={() => setShowEmailPopup(false)}
              >
                Author
              </p>
            </div>
          )}
        </div>
        <span>Blogeria</span>
        <User blogs={blogs} setBlogs={setBlogs} getEmailFromToken={getEmailFromToken} />
      </div>

      {/** Email Popup */}
      {showEmailPopup && (
        <div
          className="email-popup"
          onMouseEnter={() => setShowEmailPopup(true)}
          onMouseLeave={() => setShowEmailPopup(false)}
        >
          <div>
            <span>Email: </span>
            <input
              type="email"
              name="email"
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>
        </div>
      )}

      {/** Category Dropdown */}
      {showCategoryDropdown && (
        <div
          className="category-dropdown"
          onMouseEnter={() => setShowCategoryDropdown(true)}
          onMouseLeave={() => setShowCategoryDropdown(false)}
        >
          <p value="All blogs" onClick={sortCategory}>All Blogs</p>
          <p value="Technology" onClick={sortCategory}>Technology</p>
          <p value="Lifestyle" onClick={sortCategory}>Lifestyle</p>
          <p value="Health" onClick={sortCategory}>Health</p>
          <p value="Travel" onClick={sortCategory}>Travel</p>
          <p value="Education" onClick={sortCategory}>Education</p>
        </div>
      )}

      <div className="blogsPage-body">
        {blogs
          .filter((blog) => {
            return searchEmail === '' ? blog : blog.author.includes(searchEmail);
          })
          .map((blog, index) => {
            console.log('Blog Object:', blog); // Log the entire blog object
            return (
              <div key={index} className="blog">
                <p className="category-text">{blog.category}</p>
                <p className="date-text">
                  {blog.createdat}
                </p>
                <p>{blog.blog}</p>
                <p className="author-text">Author: {blog.author}</p>
                <div className='icons'>
                  <img src={deleteimg} alt='delete' className='deletebtn' onClick={()=> handleDelete(blog.id,blog.author)}></img>
                  <img src={editimg} alt='edit' className='editbtn' onClick={() => handleEdit(blog.id)}></img>
                  </div>
              </div>
          );
})}
      </div>

      <div className="footer">
        <button className="roundedFixedButton" onClick={togglePopup}>+</button>
      </div>

      {/** Popup for adding a blog */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add Blog</h2>
            <label>
              Blog:
              <input
                type="textarea"
                name="blog"
                value={form.blog}
                onChange={handleFormDataChange}
              />
            </label>
            <label>
              Category:
              <select
                name="category"
                value={form.category}
                onChange={handleFormDataChange}
              >
                <option value="">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Health">Health</option>
                <option value="Travel">Travel</option>
                <option value="Education">Education</option>
              </select>
            </label>
            <button onClick={addBlog}>Add Blog</button>
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogsPage;
