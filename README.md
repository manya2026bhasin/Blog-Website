# Blog Website
A full-stack blog website that allows users to sign up, log in, create, edit, and delete blogs. The website also includes category-based filtering and supports JWT authentication for secure user sessions.

## Table of Contents
* Features
* Technologies Used
* Getting Started
    * Prerequisites
    * Installation
    * Environment Variables
* Project Structure
* Usage
* API Endpoints
* Contributing

## Features
* User authentication using JWT (JSON Web Token).
* Create, edit, and delete blogs.
* Filter blogs by category.
* Responsive design for optimal viewing on any device.
## Technologies Used
* Frontend:

   * React.js
   * CSS
     
* Backend:

   * Node.js
   * Express.js
   * PostgreSQL
   * JWT for authentication
* Tools:

   * Git
   * npm (Node Package Manager)
   * dotenv for managing environment variables
## Getting Started
### Prerequisites
* Node.js: Ensure you have Node.js installed on your machine.
* PostgreSQL: A PostgreSQL database is required to store blog and user information.
### Installation
1. Clone the repository:

```bash
git clone https://github.com/yourusername/blog-website.git
```
```bash
cd blog-website
```

2. Install dependencies for both client and server:

```bash
cd client
npm install
cd ../server
npm install
```
### Environment Variables
Create a .env file in the server directory with the following content:

```plaintext
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=blogWebsite
JWT_SECRET=your_jwt_secret_key
```
Note: Make sure the .env file is added to .gitignore to prevent it from being committed to version control.

### Running the Application
1. Start the backend server:

```bash
cd server
npm start
```
2. Start the frontend server:

```bash
cd ../client
npm start
```
3. Access the application:

Open a browser and go to http://localhost:3000.

## Project Structure
```plaintext
.
├── client               # Frontend React application
│   ├── src
│   │   ├── components   # Reusable React components
│   │   ├── pages        # Page components
│   │   ├── App.js       # Main React component
│   │   └── index.js     # Entry point
│   └── package.json
├── server               # Backend Express application
│   ├── index.js         # Main server file
│   ├── routes           # Express routes
│   ├── controllers      # Request handlers
│   ├── models           # Database models
│   └── package.json
├── .env                 # Environment variables (not included in version control)
└── README.md            # Project documentation
```
## Usage
### User Authentication
Sign Up: Create a new account using your email and password.
Login: Authenticate with your credentials to access blog features.
### Blog Management
Create: Add new blog posts.
Edit: Modify existing blogs.
Delete: Remove blogs you no longer want to keep.
Filter: Browse blogs by category.
## API Endpoints
POST /api/signup: Register a new user.
POST /api/login: Log in a user and return a JWT.
POST /api/blogs: Create a new blog post.
POST /api/editblogs: Edit an existing blog post.
POST /api/deleteblogs: Delete a blog post.
GET /api/blogs: Get all blogs.
GET /api/categoryblogs: Get blogs by category.
GET /api/emailblogs: Get blogs by author (email).
## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
