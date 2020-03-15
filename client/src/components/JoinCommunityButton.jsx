import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { AuthContext } from './Auth';
import Loading from './Loading';

export default function JoinCommunityButton(props) {
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const { community } = props;
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch(`/api/users/communities/specify/${community._id}`)
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
    fetch(`/api/communities/join/${community._id}`, {
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
    fetch(`/api/communities/leave/${community._id}`, {
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
    <>
      {loading ? (
        <Loading />
      ) : (
        <Button onClick={joined ? leave : join} disabled={!user}>
          {joined ? 'Leave' : 'Join'}
        </Button>
      )}
    </>
  );
}
