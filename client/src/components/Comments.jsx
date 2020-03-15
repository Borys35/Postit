import React from 'react';
import { Link } from 'react-router-dom';

export default function Comments(props) {
  const { comments } = props;

  return (
    <div>
      <h3>Comments</h3>
      <ul className="list-group">
        {comments.length !== 0 ? (
          comments.map((c, i) => (
            <li key={i} className="list-group-item text-dark my-1">
              {c.content}
              {/* <Link to={`/profile/${c.author}`}>{c.author}</Link>{' '}
              {c.createdAt} */}
            </li>
          ))
        ) : (
          <p>Be the first who commented here</p>
        )}
      </ul>
    </div>
  );
}
