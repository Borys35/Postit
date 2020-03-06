import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { calculateTimeAgo } from '../utils';

export default function PostDetails() {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/api/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container-lg">
      {post === null ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <React.Fragment>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <h3>{post.author.username}</h3>
          <small>{calculateTimeAgo(post.createdAt)}</small>
        </React.Fragment>
      )}
    </div>
  );
}
