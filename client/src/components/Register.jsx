import React, { useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';
import { AuthContext } from './Auth';

export default function Register(props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);
  const history = useHistory();

  function handleRegister() {
    fetch('/api/users/register', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        username,
        email,
        password
      })
    })
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(data => {
        setUser(data);
        history.push('/');
      })
      .catch(err => {
        err.text().then(setError);
      });
  }

  return (
    <Container>
      <h2>Register</h2>
      {error && (
        <Alert variant="danger" className="m-3">
          {error}
        </Alert>
      )}
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          className="form-control"
          id="username"
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          className="form-control"
          id="email"
          aria-describedby="emailHelp"
          onChange={e => setEmail(e.target.value)}
        />
        <small id="emailHelp" className="form-text text-muted">
          We'll never share your email with anyone else.
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={handleRegister}>
        Sign up
      </button>
      <Link to="/login" className="d-block mt-2">
        You've already got account? Sign here!
      </Link>
    </Container>
  );
}
