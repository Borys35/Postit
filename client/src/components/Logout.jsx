import React from 'react';
import { Link, useHistory } from 'react-router-dom';

export default function Logout(props) {
  const { onLogout } = props;
  const history = useHistory();

  function handleLogout() {
    fetch('http://localhost:5000/api/users/logout', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    }).then(() => {
      onLogout(null);
      history.push('/');
    });
  }

  return (
    <div className="container-lg">
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
