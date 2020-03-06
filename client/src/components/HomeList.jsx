import React from 'react';
import HomeListItem from './HomeListItem';

export default function HomeList(props) {
  const { posts } = props;

  return (
    <div className="list-group list-group-flush">
      {posts.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        posts.map(p => <HomeListItem key={p._id} post={p} />)
      )}
    </div>
  );
}
