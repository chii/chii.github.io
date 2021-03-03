import React from 'react';
import { Link } from 'react-router-dom';

import './Navigation.css';

const Nav = () => {
    return(
        <nav className="Navigation">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/work">Work</Link>
        </nav>
    )
}

export default Nav
