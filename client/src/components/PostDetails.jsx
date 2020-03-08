import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { calculateTimeAgo } from '../utils';
import { AuthContext } from './Auth';

import Loading from './Loading';
import AddComment from './AddComment';
import Comments from './Comments';

export default function PostDetails() {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container-lg">
      {!post ? (
        <Loading />
      ) : (
        <React.Fragment>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <h3>
            <Link to={`/profile/${post.author.username}`}>
              Author: {post.author.username}
            </Link>
          </h3>
          <small>{calculateTimeAgo(post.createdAt)}</small>
          <div className="m-4">
            {post.commentable ? (
              user ? (
                <AddComment postId={id} />
              ) : (
                <h4>
                  <Link to="/login">Sign in</Link> to be able to comment
                </h4>
              )
            ) : (
              <h4>This post doesn't allow comments</h4>
            )}
          </div>

          <Comments comments={post.comments} />
        </React.Fragment>
      )}
    </div>
  );
}
