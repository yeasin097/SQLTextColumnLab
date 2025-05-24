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
  // Create articles table (5 columns with mixed data types)
  db.run(`CREATE TABLE articles (
    id INTEGER PRIMARY KEY, 
    title TEXT, 
    content TEXT, 
    view_count INTEGER,
    published_date TEXT
  )`);
  
  // Create categories table
  db.run(`CREATE TABLE categories (
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
  
  // Insert articles
  db.run("INSERT INTO articles VALUES (1, 'Tech News Today', 'Latest technology developments and innovations', 1250, '2024-05-20')");
  db.run("INSERT INTO articles VALUES (2, 'Sports Update', 'Championship results and player statistics', 890, '2024-05-19')");
  db.run("INSERT INTO articles VALUES (3, 'Entertainment Buzz', 'Movie reviews and celebrity news', 2100, '2024-05-18')");
  
  // Insert categories
  db.run("INSERT INTO categories VALUES (1, 'tech')");
  db.run("INSERT INTO categories VALUES (2, 'sports')");
  db.run("INSERT INTO categories VALUES (3, 'entertainment')");
  
  // Insert users
  db.run("INSERT INTO users VALUES (1, 'john_doe', 'john@email.com', 'password123')");
  db.run("INSERT INTO users VALUES (2, 'jane_smith', 'jane@email.com', 'mypassword')");
  db.run("INSERT INTO users VALUES (3, 'mike_wilson', 'mike@email.com', 'secret123')");
  
  // Insert admin users
  db.run("INSERT INTO admin_users VALUES (1, 'admin', 'admin123', 'Super Admin')");
  db.run("INSERT INTO admin_users VALUES (2, 'manager', 'manager456', 'Content Manager')");
});

// Function to validate data types and simulate strict type checking
function validateUnionQuery(query) {
  const unionMatch = query.match(/UNION\s+SELECT\s+([^-]+)--/i);
  if (unionMatch) {
    const selectPart = unionMatch[1].trim();
    const values = selectPart.split(',').map(v => v.trim());
    
    // Expected data types for articles table: INTEGER, TEXT, TEXT, INTEGER, TEXT
    const expectedTypes = ['INTEGER', 'TEXT', 'TEXT', 'INTEGER', 'TEXT'];
    
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const expectedType = expectedTypes[i];
      
      // Check if it's a string literal (quoted)
      if (value.startsWith("'") && value.endsWith("'")) {
        if (expectedType === 'INTEGER') {
          throw new Error(`datatype mismatch: cannot insert TEXT value into INTEGER column ${i + 1} (${value})`);
        }
      }
    }
  }
}

// API endpoint for articles with SQL Injection vulnerability
app.get('/api/articles', (req, res) => {
  const category = req.query.category || 'all';
  let query;

  if (category === 'all') {
    query = `SELECT * FROM articles`;
  } else {
    // This is vulnerable to SQL injection
    query = `SELECT * FROM articles WHERE title LIKE '%${category}%'`;
  }

  console.log("Executing SQL:", query);

  // Validate for data type mismatches in UNION queries
  try {
    validateUnionQuery(query);
  } catch (error) {
    console.error("Data type validation error:", error.message);
    return res.status(500).json({ 
      error: 'Database error', 
      details: error.message 
    });
  }

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json({ sql: query, data: rows });
  });
});

// API endpoint for categories
app.get('/api/categories', (req, res) => {
  const query = `SELECT * FROM categories`;
  
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ sql: query, data: rows });
  });
});

// API endpoint for article details
app.get('/api/articles/:id', (req, res) => {
  const articleId = req.params.id;
  const query = `SELECT * FROM articles WHERE id = ?`;
  
  db.get(query, [articleId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(row);
  });
});

app.get('/api/', (req, res) => {
  console.log("Frontend HIT");
  return res.status(200).json({ message: 'Text Column Lab API' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Try: http://localhost:3000/api/articles?category=tech\' UNION SELECT \'TEST\',NULL,NULL,NULL,NULL--');
  console.log('Expected: datatype mismatch error for TEXT in INTEGER position');
});