import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Col, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from './Auth';

export default function CreatePost(props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [communities, setCommunities] = useState([]);
  const [community, setCommunity] = useState(null);
  const [commentable, setCommentable] = useState(true);
  const [error, setError] = useState(null);
  const { fetchPosts } = props;
  const { user } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    fetch(`/api/users/communities/${user.id}`)
      .then(res => res.json())
      .then(setCommunities);
  }, []);

  function handleCreate() {
    fetch('/api/posts/create', {
      method: 'post',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        community,
        commentable
      })
    })
      .then(res => {
        if (res.ok) {
          fetchPosts();
          history.push('/');
        } else {
          throw res;
        }
      })
      .catch(err => {
        err.text().then(setError);
      });
  }

  return (
    <Container>
      <Form>
        <h2>Create post</h2>
        {error && (
          <Alert variant="danger" className="m-3">
            {error}
          </Alert>
        )}
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              onChange={e => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} md={4}>
            <Form.Label>Community</Form.Label>
            <Form.Control
              as="select"
              onChange={e => setCommunity(e.target.value)}
            >
              <option value="">Choose...</option>
              {communities.map((c, i) => (
                <option key={i} value={c._id}>
                  {c.name}
                </option>
              ))}
              <option
                className="text-primary"
                onClick={() => history.push('/communities')}
              >
                Find more
              </option>
            </Form.Control>
          </Form.Group>
        </Form.Row>

        <Form.Group>
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows="14"
            onChange={e => setContent(e.target.value)}
          />
        </Form.Group>
        {/* <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            onChange={e => setTitle(e.target.value)}
          />
        </div> */}
        {/* <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            className="form-control"
            id="content"
            rows="14"
            onChange={e => setContent(e.target.value)}
          ></textarea>
        </div> */}
        <div className="custom-control custom-checkbox my-3">
          <input
            type="checkbox"
            className="custom-control-input"
            id="commentable"
            onChange={() => setCommentable(!commentable)}
          />
          <label className="custom-control-label" htmlFor="commentable">
            Disable comments
          </label>
          <small id="title" className="form-text text-muted">
            This option makes your post uncommentable
          </small>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          Submit
        </Button>
      </Form>
    </Container>
  );
}
