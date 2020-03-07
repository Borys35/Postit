import React from 'react';

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
            </li>
          ))
        ) : (
          <p>Be the first who commented here</p>
        )}
      </ul>
    </div>
  );
}
