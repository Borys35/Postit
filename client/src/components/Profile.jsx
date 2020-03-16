import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { getDate } from '../utils';

import Loading from './Loading';
import CommunityList from './CommunityList';
import HomeList from './HomeList';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const { name } = useParams();

  useEffect(() => {
    fetch(`/api/users/get-by-name/${name}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        const { _id } = data;
        fetch(`/api/users/posts/${_id}`)
          .then(res => res.json())
          .then(setPosts);

        fetch(`/api/users/communities/${_id}`)
          .then(res => res.json())
          .then(setCommunities);
      });
  }, [name]);

  return (
    <Container fluid className="px-4">
      {user === null ? (
        <Loading />
      ) : (
        <React.Fragment>
          <Row>
            <Col md="3">
              <h2>{user.username}</h2>
              <p>Joined {getDate(user.joinedAt)}</p>
            </Col>
            <Col>
              <h3>Posts</h3>
              <HomeList posts={posts} />
            </Col>
            <Col md="3">
              <h3>Communities</h3>
              <CommunityList communities={communities} />
            </Col>
          </Row>
        </React.Fragment>
      )}
    </Container>
  );
}
