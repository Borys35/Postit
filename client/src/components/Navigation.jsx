import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { AuthContext } from './Auth';

export default function Navigation() {
  const [links, setLinks] = useState([
    { to: '/posts', content: 'Home', active: false },
    { to: '/login', content: 'Login', active: false },
    { to: '/register', content: 'Register', active: false }
  ]);

  const { isLoading, user } = useContext(AuthContext);
  const location = useLocation();

  const publicOnlyLinks = [
    { to: '/posts', content: 'Home', active: false },
    { to: '/login', content: 'Login', active: false },
    { to: '/register', content: 'Register', active: false }
  ];
  const privateLinks = [
    { to: '/posts', content: 'Home', active: false },
    { to: '/create-post', content: 'Create post', active: false },
    {
      to: `/profile/${user?.username}`,
      content: user?.username,
      active: false
    },
    { to: '/logout', content: 'Logout', active: false }
  ];

  useEffect(() => {
    const { pathname } = location;
    const array = !user ? [...publicOnlyLinks] : [...privateLinks];
    array.map(l => {
      if (l.to === pathname) l.active = true;
      else l.active = false;
    });
    setLinks(array);
  }, [location, user]);

  return (
    <Navbar expand="lg">
      <Navbar.Brand as={Link} to="/">
        Postit
      </Navbar.Brand>
      {!isLoading && (
        <React.Fragment>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav variant="pills">
              {links.map((l, i) => (
                <Nav.Item key={i} className="mx-1">
                  <Nav.Link as={Link} to={l.to} active={l.active}>
                    {l.content}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Navbar.Collapse>
        </React.Fragment>
      )}
    </Navbar>
    // <nav className="navbar navbar-expand-lg navbar-dark mb-1">
    //   <Link className="navbar-brand" to="/">
    //     <h3>Postit</h3>
    //   </Link>
    //   {!isLoading && (
    //     <React.Fragment>
    //       <button
    //         className="navbar-toggler"
    //         type="button"
    //         data-toggle="collapse"
    //         data-target="#navbarMain"
    //         aria-controls="navbarMain"
    //         aria-expanded="false"
    //         aria-label="Toggle navigation"
    //       >
    //         <span className="navbar-toggler-icon"></span>
    //       </button>
    //       <div id="navbarMain" className="collapse navbar-collapse">
    //         <div className="navbar-nav">
    //           <Link className="nav-item nav-link active" to="/posts">
    //             Home <span className="sr-only">(current)</span>
    //           </Link>
    //           {!user ? (
    //             <React.Fragment>
    //               <Link className="nav-item nav-link" to="/login">
    //                 Login
    //               </Link>
    //               <Link className="nav-item nav-link" to="/register">
    //                 Register
    //               </Link>
    //             </React.Fragment>
    //           ) : (
    //             <React.Fragment>
    //               <Link className="nav-item nav-link" to="/create-post">
    //                 Create post
    //               </Link>
    //               <Link
    //                 className="nav-item nav-link"
    //                 to={`/profile/${user.username}`}
    //               >
    //                 {user.username}
    //               </Link>
    //               <Link className="nav-item nav-link" to="/logout">
    //                 Log Out
    //               </Link>
    //             </React.Fragment>
    //           )}
    //         </div>
    //       </div>
    //     </React.Fragment>
    //   )}
    // </nav>
  );
}
