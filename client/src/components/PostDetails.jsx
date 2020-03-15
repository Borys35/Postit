import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { calculateTimeAgo } from '../utils';
import { AuthContext } from './Auth';

import Loading from './Loading';
import AddComment from './AddComment';
import Comments from './Comments';

export default function PostDetails() {
  const [post, setPost] = useState(null);
  const [votes, setVotes] = useState(null);
  const [vote, setVote] = useState(0);
  const [voteClass, setVoteClass] = useState('');
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  function handleVote(value) {
    if (value === vote) value = 0;
    setVote(value);

    fetch(`/api/posts/vote/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vote: value
      })
    });
  }

  useEffect(() => {
    setVoteClass(vote !== 0 ? 'text-info' : '');
  }, [vote]);

  function initialize() {
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(setPost);

    fetch(`/api/posts/get/votes/${id}`)
      .then(res => res.json())
      .then(data => {
        setVotes(data.votes);
        setVote(data.userVote);
      });
  }

  useEffect(() => {
    initialize();
  }, []);

  function getPercentage() {
    const total = votes.total + (vote !== 0 ? 1 : 0);
    const totalUps = votes.totalUps + (vote > 0 ? 1 : 0);
    return total === 0 ? 0 : Math.round((totalUps / total) * 100);
  }

  return (
    <div className="container-lg">
      {!post ? (
        <Loading />
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {votes && (
            <div>
              <Button onClick={() => handleVote(1)}>/\</Button>
              <h3 className={`font-weight-bold ${voteClass}`}>
                {votes.totalUps - (votes.total - votes.totalUps) + vote}
              </h3>
              <p>{getPercentage()}% upvoted</p>
              <Button onClick={() => handleVote(-1)}>\/</Button>
            </div>
          )}
          <h3>
            <Link to={`/profile/${post.author.username}`}>
              Author: {post.author.username}
            </Link>
          </h3>
          <small>{calculateTimeAgo(post.createdAt)}</small>
          <div className="m-4">
            {post.commentable ? (
              user ? (
                <AddComment postId={id} onAdd={initialize} />
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
        </>
      )}
    </div>
  );
}
