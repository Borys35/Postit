import React, { useState, useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import './App.css';
import Auth, { AuthContext } from './components/Auth';
import Loading from './components/Loading';

import Navigation from './components/Navigation';
import Home from './components/Home';
import Communities from './components/Communities';
import CommunityPage from './components/CommunityPage';
import Login from './components/Login';
import Register from './components/Register';
import PostDetails from './components/PostDetails';
import CreatePost from './components/CreatePost';
import Profile from './components/Profile';
import Logout from './components/Logout';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isLoading, user } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={props =>
        !isLoading ? (
          user ? (
            <Component {...props} />
          ) : (
            <Redirect to="/login" />
          )
        ) : (
          <Loading />
        )
      }
    />
  );
};

const PublicOnlyRoute = ({ component: Component, ...rest }) => {
  const { isLoading, user } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={props =>
        !isLoading ? (
          !user ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          )
        ) : (
          <Loading />
        )
      }
    />
  );
};

function App() {
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);

  function fetchPosts() {
    fetch('/api/posts/')
      .then(res => res.json())
      .then(setPosts);
  }

  function fetchCommunities() {
    fetch('/api/communities/')
      .then(res => res.json())
      .then(setCommunities);
  }

  useEffect(() => {
    fetchPosts();
    fetchCommunities();
  }, []);

  return (
    <div>
      <Auth>
        <Router>
          <Navigation />
          <Switch>
            <Route path="/posts/:id" component={PostDetails} />
            <Route
              path="/posts"
              component={() => <Home posts={posts} communities={communities} />}
            />
            <Route path="/communities/:id" component={CommunityPage} />
            <Route
              path="/communities"
              component={() => <Communities communities={communities} />}
            />
            <PublicOnlyRoute path="/login" component={Login} />
            <PublicOnlyRoute path="/register" component={Register} />
            <PrivateRoute
              path="/create-post"
              component={() => <CreatePost fetchPosts={fetchPosts} />}
            />
            <PrivateRoute path="/logout" component={Logout} />
            <Route path="/profile/:name" component={Profile} />
            <Route path="*" component={() => <Redirect to="/posts" />} />
          </Switch>
        </Router>
      </Auth>
    </div>
  );
}

export default App;
