import React from 'react';
import { Container } from 'react-bootstrap';
import CommunityList from './CommunityList';

export default function Communities(props) {
  const { communities } = props;

  return (
    <Container>
      <CommunityList communities={communities} />
    </Container>
  );
}
