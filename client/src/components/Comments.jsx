import React from 'react';
import { Link } from 'react-router-dom';
import { getTimeAgo } from '../utils';

export default function Comments(props) {
  const { comments } = props;

  return (
    <div>
      <h3>Comments</h3>
      <ul className="list-group">
        {comments.length !== 0 ? (
          comments.map((c, i) => (
            <li key={i} className="list-group-item text-dark my-1">
              <Link to={`/profile/${c.author}`}>{c.author}</Link>
              <p
                style={{
                  textIndent: 5
                }}
              >
                {c.content}
              </p>
              <small className="float-right text-muted">
                {getTimeAgo(c.createdAt)}
              </small>
            </li>
          ))
        ) : (
          <p>Be the first who commented here</p>
        )}
      </ul>
    </div>
  );
}
