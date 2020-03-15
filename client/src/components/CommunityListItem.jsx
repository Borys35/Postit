import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JoinCommunityButton from './JoinCommunityButton';

export default function CommunityListItem(props) {
  const { community } = props;

  return (
    <div className="list-group-item my-2">
      <Link to={`/communities/${community.name}`}>
        <h3>{community.name}</h3>
        <p>{community.description}</p>
      </Link>
      <div className="float-right">
        <JoinCommunityButton community={community} />
      </div>
    </div>
  );
}
