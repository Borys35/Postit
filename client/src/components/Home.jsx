import React, { useEffect } from 'react';
import HomeList from './HomeList';

export default function Home(props) {
  const { posts, setPosts } = props;

  useEffect(() => {
    if (posts.length === 0)
      fetch('http://localhost:5000/api/posts/')
        .then(res => res.json())
        .then(setPosts);
  }, []);

  return (
    <div className="container-lg">
      <HomeList posts={posts} />
    </div>
  );
}
