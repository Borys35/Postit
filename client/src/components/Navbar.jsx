import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './Auth';

export default function Navbar() {
  const { isLoading, userId } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark mb-1">
      <Link className="navbar-brand" to="/">
        <h3>Postit</h3>
      </Link>
      {!isLoading && (
        <React.Fragment>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="navbar-nav">
              <Link className="nav-item nav-link active" to="/posts">
                Home <span className="sr-only">(current)</span>
              </Link>
              {!userId ? (
                <React.Fragment>
                  <Link className="nav-item nav-link" to="/login">
                    Login
                  </Link>
                  <Link className="nav-item nav-link" to="/register">
                    Register
                  </Link>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Link className="nav-item nav-link" to="/create-post">
                    Create post
                  </Link>
                  <Link className="nav-item nav-link" to={`/profile/${userId}`}>
                    {userId}
                  </Link>
                  <Link className="nav-item nav-link" to="/logout">
                    Log Out
                  </Link>
                </React.Fragment>
              )}
            </div>
          </div>
        </React.Fragment>
      )}
    </nav>
  );
}
