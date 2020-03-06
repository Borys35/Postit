import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from './Loading';

export default function Profile() {
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/get/${id}`)
      .then(res => res.json())
      .then(setUser);
  }, []);

  return (
    <div className="container-lg">
      {user === null ? (
        <Loading />
      ) : (
        <React.Fragment>
          <h2>{user.username}</h2>
          <small>{new Date(user.joinedAt).toUTCString()}</small>
        </React.Fragment>
      )}
    </div>
  );
}
