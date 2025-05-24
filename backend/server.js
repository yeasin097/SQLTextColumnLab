const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create an in-memory database
const db = new sqlite3.Database(':memory:');

// Initialize the database with tables and sample data
db.serialize(() => {
  // Create products table (2 columns - limited visibility)
  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY, 
    name TEXT
  )`);
  
  // Create users table
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    email TEXT,
    password TEXT
  )`);
  
  // Create admin_users table
  db.run(`CREATE TABLE admin_users (
    id INTEGER PRIMARY KEY,
    admin_username TEXT,
    admin_password TEXT,
    role TEXT
  )`);
  
  // Insert products
  db.run("INSERT INTO products VALUES (1, 'Gaming Laptop')");
  db.run("INSERT INTO products VALUES (2, 'Business Laptop')");
  db.run("INSERT INTO products VALUES (3, 'Smartphone Pro')");
  db.run("INSERT INTO products VALUES (4, 'Smartphone Basic')");
  db.run("INSERT INTO products VALUES (5, 'Wireless Headphones')");
  db.run("INSERT INTO products VALUES (6, 'Bluetooth Speaker')");
  
  // Insert users
  db.run("INSERT INTO users VALUES (1, 'john_doe', 'john@email.com', 'password123')");
  db.run("INSERT INTO users VALUES (2, 'jane_smith', 'jane@email.com', 'mypassword')");
  db.run("INSERT INTO users VALUES (3, 'mike_wilson', 'mike@email.com', 'secret123')");
  db.run("INSERT INTO users VALUES (4, 'sarah_davis', 'sarah@email.com', 'pass456')");
  
  // Insert admin users
  db.run("INSERT INTO admin_users VALUES (1, 'admin', 'admin123', 'Super Admin')");
  db.run("INSERT INTO admin_users VALUES (2, 'manager', 'manager456', 'Store Manager')");
});

// API endpoint for products with SQL Injection vulnerability (limited visibility)
app.get('/api/products', (req, res) => {
  const search = req.query.search || '';
  let query;

  if (search === '') {
    query = `SELECT id, name FROM products`;
  } else {
    // This is vulnerable to SQL injection - only 2 columns, limited visibility
    query = `SELECT id, name FROM products WHERE name LIKE '%${search}%'`;
  }

  console.log("Executing SQL:", query);

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json({ sql: query, data: rows });
  });
});

// API endpoint for product details
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const query = `SELECT * FROM products WHERE id = ?`;
  
  db.get(query, [productId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(row);
  });
});

app.get('/api/', (req, res) => {
  console.log("Frontend HIT");
  return res.status(200).json({ message: 'Multiple Values Lab API' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Try: http://localhost:3000/api/products?search=laptop\' UNION SELECT NULL,username||\':\' ||password FROM users--');
});