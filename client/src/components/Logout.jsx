import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import { AuthContext } from './Auth';

export default function Logout() {
  const { setUser } = useContext(AuthContext);
  const history = useHistory();

  function handleLogout() {
    fetch('/api/users/logout', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    }).then(() => {
      setUser(null);
      history.push('/');
    });
  }

  return (
    <Container fluid className="text-dark">
      <Card style={{ 'max-width': '24rem' }}>
        <Card.Header>Logout</Card.Header>
        <Card.Body>
          <Card.Title>Log out from postit?</Card.Title>
          <Card.Text>You can always log back in at any time</Card.Text>
          <Link className="btn btn-primary mr-2" to="/">
            Go back
          </Link>
          <Button variant="danger" onClick={handleLogout}>
            Log out
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
