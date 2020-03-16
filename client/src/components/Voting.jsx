import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

export default function Voting(props) {
  const [voteClass, setVoteClass] = useState('');
  const { votes, vote, onVote } = props;

  function getPercentage() {
    const total = votes.total + (vote !== 0 ? 1 : 0);
    const totalUps = votes.totalUps + (vote > 0 ? 1 : 0);
    return total === 0 ? 0 : Math.round((totalUps / total) * 100);
  }

  useEffect(() => {
    setVoteClass(vote !== 0 ? 'text-info' : '');
  }, [vote]);

  return (
    <div>
      {votes && (
        <div>
          <Button onClick={() => onVote(1)}>/\</Button>
          <h3 className={`font-weight-bold ${voteClass}`}>
            {votes.totalUps - (votes.total - votes.totalUps) + vote}
          </h3>
          <p>{getPercentage()}% upvoted</p>
          <Button onClick={() => onVote(-1)}>\/</Button>
        </div>
      )}
    </div>
  );
}
