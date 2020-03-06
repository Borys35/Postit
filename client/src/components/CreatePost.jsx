import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [commentable, setCommentable] = useState(true);
  const history = useHistory();

  function handleCreate() {
    fetch('http://localhost:5000/api/posts/create', {
      method: 'post',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        commentable
      })
    }).then(res => res.ok && history.push('/'));
  }

  return (
    <div className="container-lg">
      <h2>Create post</h2>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          className="form-control"
          id="title"
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          className="form-control"
          id="content"
          rows="14"
          onChange={e => setContent(e.target.value)}
        ></textarea>
      </div>
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
      <button className="btn btn-primary" onClick={handleCreate}>
        Submit
      </button>
    </div>
  );
}
