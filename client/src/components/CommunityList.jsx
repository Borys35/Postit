import React from 'react';
import Loading from './Loading';
import CommunityListItem from './CommunityListItem';

export default function CommunityList(props) {
  const { communities } = props;

  return (
    <div className="list-group list-group-flush">
      {communities.length === 0 ? (
        <Loading />
      ) : (
        communities.map(c => <CommunityListItem key={c._id} community={c} />)
      )}
    </div>
  );
}
