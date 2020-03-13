import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Loading from './Loading';
import HomeList from './HomeList';
import JoinCommunityButton from './JoinCommunityButton';

export default function CommunityPage() {
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/communities/${id}`)
      .then(res => res.json())
      .then(data => {
        setCommunity(data.comm);
        setPosts(data.posts);
      });
  }, []);

  return (
    <Container>
      {!community ? (
        <Loading />
      ) : (
        <React.Fragment>
          <Row>
            <Col md={{ span: 10, offset: 1 }} className="mb-3">
              <h2 className="font-weight-bold text-primary">
                {community.name}
              </h2>
              <p>{community.description}</p>
              <h4>
                Members: <strong>{community.users.length}</strong>
              </h4>
              <div className="float-right">
                <JoinCommunityButton community={community} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <HomeList posts={posts} />
            </Col>
          </Row>
        </React.Fragment>
      )}
    </Container>
  );
}
