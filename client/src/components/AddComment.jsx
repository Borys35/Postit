import React, { useState } from 'react';

export default function AddComment(props) {
  const [content, setContent] = useState('');
  const { postId } = props;

  function handleAdd() {
    fetch(`/api/posts/add-comment/${postId}`, {
      method: 'post',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content
      })
    });
  }

  return (
    <div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          className="form-control"
          id="content"
          rows="6"
          placeholder="What are your thoughts?"
          onChange={e => setContent(e.target.value)}
        ></textarea>
      </div>
      <button className="btn btn-primary" onClick={handleAdd}>
        Submit
      </button>
    </div>
  );
}
