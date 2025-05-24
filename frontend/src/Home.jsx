import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ArticleFilter from './ArticleFilter';

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [querySQL, setQuerySQL] = useState('');
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get category from URL parameters, default to 'all'
  const selectedCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/articles?category=${encodeURIComponent(selectedCategory)}`);
        setArticles(response.data.data);
        setQuerySQL(response.data.sql);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError(error.response?.data?.error || 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory]);

  const handleFilterChange = (category) => {
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading articles...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center mb-4">News & Articles</h1>
      <ArticleFilter onFilterChange={handleFilterChange} currentCategory={selectedCategory} />

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!error && articles.length === 0 ? (
        <div className="alert alert-info">
          No articles found. Try a different search or check your SQL injection syntax.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
          {articles.map(article => (
            <div key={article.id} className="col">
              <div className="card h-100 shadow-sm article-card">
                <div className="card-body">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">{article.content}</p>
                  <p className="card-text">
                    <span className="badge bg-info me-2">Views: {article.view_count || 'N/A'}</span>
                    <span className="badge bg-secondary">Date: {article.published_date}</span>
                  </p>
                  <Link to={`/article/${article.id}`} className="btn btn-primary">Read More</Link>
                </div>
                <div className="card-footer text-muted">
                  <small>Article ID: {article.id}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Query Information</h5>
          <p className="card-text"><strong>Total articles shown:</strong> {articles.length}</p>
          <p className="card-text"><strong>Current search:</strong> {selectedCategory === 'all' ? 'All Articles' : `Search: ${selectedCategory}`}</p>
        </div>
      </div>

      {querySQL && (
        <div className="card mt-4 bg-light">
          <div className="card-body">
            <h5 className="card-title">Executed SQL Query</h5>
            <pre className="bg-dark text-white p-3 rounded">
              {querySQL}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;