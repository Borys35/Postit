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
  const [vote, setVote] = useState(0);
  const [doneVote, setDoneVote] = useState(0);
  const [voteClass, setVoteClass] = useState('');
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  function handleVote(value) {
    if (vote === value) setVote(0);
    else setVote(value);
  }

  useEffect(() => {
    setVoteClass(vote === 0 ? '' : 'text-danger');
    fetch(`/api/posts/vote/${id}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vote
      })
    });
  }, [vote]);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => {
        const { post, initVote } = data;
        if (initVote) {
          setDoneVote(initVote);
          setVote(initVote);
        }
        setPost(post);
      })
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
          <div>
            <Button onClick={() => handleVote(1)}>/\</Button>
            <h3 className={`font-weight-bold ${voteClass}`}>
              {post.votes.upvotes - post.votes.downvotes - doneVote + vote}
            </h3>
            <Button onClick={() => handleVote(-1)}>\/</Button>
          </div>
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
