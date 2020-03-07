import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from './Auth';

export default function Logout() {
  const { setUserId } = useContext(AuthContext);
  const history = useHistory();

  function handleLogout() {
    fetch('/api/users/logout', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    }).then(() => {
      setUserId(null);
      history.push('/');
    });
  }

  return (
    <div className="container-lg text-center">
      <h3 className="text-danger font-weight-bold">Log out from postit?</h3>
      <p>You can always log back in at any time</p>
      <div className="d-flex justify-content-center align-items-center">
        <Link className="btn btn-primary mx-2" to="/">
          Go back
        </Link>
        <button className="btn btn-danger mx-2" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
