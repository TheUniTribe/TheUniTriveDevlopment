import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Articles = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('/articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Articles</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.id} className="mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p>{article.content}</p>
            <p className="text-sm text-gray-600">By: {article.author || 'Unknown'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Articles;
