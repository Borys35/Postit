import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { calculateTimeAgo } from '../utils';
import Loading from './Loading';

export default function PostDetails() {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container-lg">
      {post === null ? (
        <Loading />
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
