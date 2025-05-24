import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function ArticleDetail() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/articles/${id}`);
        setArticle(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching article details:', error);
        setError('Article not found or error loading details');
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading article details...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-danger">
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">Back to Articles</Link>
      </div>
    );
  }
  
  return (
    <div className="card shadow">
      <div className="card-header bg-primary text-white">
        <h2 className="mb-0">{article.title}</h2>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-8">
            <p className="lead">{article.content}</p>
          </div>
          <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h6>Article Stats</h6>
                <p><strong>Views:</strong> {article.view_count}</p>
                <p><strong>Published:</strong> {article.published_date}</p>
              </div>
            </div>
          </div>
        </div>
        
        <hr/>
        
        <div className="row">
          <div className="col-md-6">
            <h5>Article Details</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item"><strong>Article ID:</strong> {article.id}</li>
              <li className="list-group-item"><strong>Views:</strong> {article.view_count}</li>
              <li className="list-group-item"><strong>Published:</strong> {article.published_date}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <Link to="/" className="btn btn-secondary">Back to Articles</Link>
      </div>
    </div>
  );
}

export default ArticleDetail;