import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 5000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json()); // Parses JSON requests
const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// POST endpoint
let data;
app.post('/api/login', async (req, res) => {
    data = req.body;
    console.log('Data received:', data);
    try {
        const client = await pool.connect();


        const query = 'SELECT * FROM users WHERE username = $1';
        const values = [req.body["email"]];

        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            if (user.passwords === req.body["password"]) {
                const token = jwt.sign(
                    { email: req.body["email"] }, // Embed the email in the payload
                    'your_jwt_secret', // Replace with your actual secret key
                    { expiresIn: '1h' } // Set token expiry
                );
                res.status(200).json({ message: 'Login successful',token });
            } else {
                res.status(401).json({ message: 'Incorrect password' });
            }
        } else {
            res.status(401).json({ message: 'email not found' });
        }

        client.release();
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).send('Internal server error');
    }

});

app.post('/api/signup', async (req, res) => {
    data = req.body;
    console.log('Data received:', data);
    try {

        const client = await pool.connect();
        const query2 = 'SELECT * FROM users WHERE username = $1';
        const values2 = [req.body["email"]];

        const result2 = await client.query(query2, values2);

        if (result2.rows.length > 0) {
            res.status(401).json({ message: "email already exists" });
        }
        else {
            const query = 'INSERT INTO users (username, passwords) VALUES ($1, $2)';
            // const values = [grades, remark, fileInput];
            const values = [req.body["email"], req.body["password"]];

            await client.query(query, values);
            res.status(200).json({ message: "Account created" });

        }

        client.release();
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).send('Internal server error');
    }

});

app.post('/api/blogs', async (req, res) => {
    data = req.body;
    console.log('Data received:', data);
    try {

        const client = await pool.connect();
        const query = 'INSERT INTO blogs (blog,category,author,createdAt) VALUES ($1,$2,$3,$4)';
        const values = [req.body["blog"],req.body["category"],req.body["author"],req.body["createdAt"]];

        const result = await client.query(query, values);
        client.release();
        res.status(200).send('data added');
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).send('Internal server error');
    }

});

app.post('/api/editblogs', async (req, res) => {
    data = req.body;
    console.log('Data received:', data);
    try {

        const client = await pool.connect();
        const query = 'UPDATE blogs SET blog=$1,category=$2, author=$3,createdat=$4 WHERE id = $5';
        const values = [req.body["blog"],req.body["category"],req.body["author"],req.body["createdAt"],req.body["id"]];

        const result = await client.query(query, values);
        client.release();
        res.status(200).send('data edited');
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).send('Internal server error');
    }

});

app.post('/api/deleteblogs', async (req,res) => {
    const {id} = req.body;
    console.log(id);
    try{
        const client = await pool.connect();
        const query = 'DELETE FROM blogs WHERE id = $1';
        const values = [id];

        const result = await client.query(query, values);
        client.release();
        res.status(200).send('data deleted');
    }
    catch(error){
        console.error('Error processing deletion of blogs:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/api/blogs', async (req, res) => {
    try {
        const client = await pool.connect();
        const query = 'SELECT * FROM blogs ORDER BY createdAt DESC';
        const result = await client.query(query);
        client.release();
        
        res.status(200).json(result.rows); // Send back the blogs as a JSON array
    } catch (error) {
        console.error('Error retrieving blogs:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/api/categoryblogs', async (req, res) => {
    try {
        const { category } = req.query; // Extract category from query parameters
        if(category === 'All Blogs'){
            const client = await pool.connect();
            const query = 'SELECT * FROM blogs ORDER BY createdAt DESC';
            const result = await client.query(query);
            client.release();
        res.status(200).json(result.rows); // Send the filtered blogs back to the client
    }
        else{
        const client = await pool.connect();
        const query = 'SELECT * FROM blogs WHERE category = $1 ORDER BY createdAt DESC';
        const values = [category];
        const result = await client.query(query, values);
        client.release();
        res.status(200).json(result.rows); // Send the filtered blogs back to the client
    }

    } catch (error) {
        console.error('Error retrieving blogs:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/api/emailblogs', async (req, res) => {
    try {
        const { email } = req.query; // Extract category from query parameters
        const client = await pool.connect();
        const query = 'SELECT * FROM blogs WHERE author = $1 ORDER BY createdAt DESC';
        const values = [email];
        const result = await client.query(query, values);
        client.release();

        res.status(200).json(result.rows); // Send the filtered blogs back to the client
    } catch (error) {
        console.error('Error retrieving blogs:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/', (req, res) => {
    res.send('Server is working!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
