import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Loading from './Loading';

export default function JoinCommunityButton(props) {
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const { community } = props;

  useEffect(() => {
    fetch(`/api/users/communities/${community._id}`)
      .then(res => res.json())
      .then(data => {
        if (data) setJoined(true);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  function join() {
    setLoading(true);
    fetch(`/api/users/communities/join/${community._id}`, {
      method: 'PATCH',
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) setJoined(true);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function leave() {
    setLoading(true);
    fetch(`/api/users/communities/leave/${community._id}`, {
      method: 'PATCH',
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) setJoined(false);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  return (
    <React.Fragment>
      {loading ? (
        <Loading />
      ) : (
        <Button onClick={joined ? leave : join}>
          {joined ? 'Leave' : 'Join'}
        </Button>
      )}
    </React.Fragment>
  );
}
