import React from 'react';
import { Link } from 'react-router-dom';

export default function HomeListItem(props) {
  const { post } = props;

  return (
    <div className="list-group-item my-2">
      <Link to={`/posts/${post._id}`}>
        <h1>{post.title}</h1>
        <p>
          {post.content.slice(0, 80)}...
          <span className="text-info"> Learn more.</span>
        </p>
        <h3>Author: {post.author.username}</h3>
      </Link>
    </div>
  );
}
