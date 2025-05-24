import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ArticleFilter({ onFilterChange, currentCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.response?.data?.error || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row mb-4">
      <div className="col-md-6 offset-md-3">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Search Articles</h5>
            {error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <>
                <select 
                  className="form-select" 
                  value={currentCategory} 
                  onChange={(e) => onFilterChange(e.target.value)}
                >
                  <option value="all">All Articles</option>
                  {Array.isArray(categories) && categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <div className="mt-3">
                  <small className="text-muted">
                    <strong>Current URL:</strong> {window.location.href}
                  </small>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleFilter;