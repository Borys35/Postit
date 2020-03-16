import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import CommunityList from './CommunityList';
import HomeList from './HomeList';

export default function Home(props) {
  const { posts, communities } = props;

  return (
    <Container fluid className="px-4">
      <Row>
        <Col lg={3} md={4}>
          <CommunityList communities={communities} />
          <Link className="list-group-item text-center" to="/communities">
            More communities
          </Link>
        </Col>
        <Col>
          <h2>Posts</h2>
          <HomeList posts={posts} />
        </Col>
      </Row>
    </Container>
  );
}
