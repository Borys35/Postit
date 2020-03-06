import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function Register(props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { onRegister } = props;
  const history = useHistory();

  function handleRegister() {
    fetch('http://localhost:5000/api/users/register', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        username,
        email,
        password
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        onRegister(data);
        history.push('/');
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <div className="container-lg">
      <h2>Register</h2>
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
    </div>
  );
}
