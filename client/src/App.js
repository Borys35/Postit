import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PostDetails from './components/PostDetails';
import CreatePost from './components/CreatePost';
import Profile from './components/Profile';
import Logout from './components/Logout';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        true ? <Component {...props} /> : <Redirect to="/register" />
      }
    />
  );
};

const PublicOnlyRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (true ? <Component {...props} /> : <Redirect to="/" />)}
    />
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/users/verify', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setUser(data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <Router>
        <Navbar user={user} />
        <Switch>
          <Route
            exact
            path="/posts"
            component={() => <Home posts={posts} setPosts={setPosts} />}
          />
          <Route path="/posts/:id" component={PostDetails} />
          <PublicOnlyRoute
            path="/login"
            component={() => <Login onLogin={setUser} />}
          />
          <PublicOnlyRoute
            path="/register"
            component={() => <Register onRegister={setUser} />}
          />
          <PublicOnlyRoute
            path="/logout"
            component={() => <Logout onLogout={setUser} />}
          />
          <PrivateRoute path="/create-post" component={CreatePost} />
          <Route path="/profile/:id" component={Profile} />
          <Route path="*" component={() => <Redirect to="/posts" />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
