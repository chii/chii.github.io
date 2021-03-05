import React from 'react';
import { StyledMenu } from './Menu.styled';
import { bool } from 'prop-types';
import { Link } from 'react-router-dom';

const Menu = ({ open, setOpen }) => {
  return (
    <StyledMenu open={open}>
      <nav className="Navigation">
        <Link to="/" open={open} onClick={() => setOpen(!open)}>Home</Link>
        <Link to="/about" open={open} onClick={() => setOpen(!open)}>About</Link>
        <Link to="/work" open={open} onClick={() => setOpen(!open)}>Work</Link>
      </nav>
    </StyledMenu>
  )
}
Menu.propTypes = {
    open: bool.isRequired,
}
export default Menu;
