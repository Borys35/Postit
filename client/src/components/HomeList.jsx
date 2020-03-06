import React from 'react';
import HomeListItem from './HomeListItem';
import Loading from './Loading';

export default function HomeList(props) {
  const { posts } = props;

  return (
    <div className="list-group list-group-flush">
      {posts.length === 0 ? (
        <Loading />
      ) : (
        posts.map(p => <HomeListItem key={p._id} post={p} />)
      )}
    </div>
  );
}
