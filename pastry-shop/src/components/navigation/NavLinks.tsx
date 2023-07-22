import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import './NavLinks.css';
import { AuthContext } from '../../utils/context/authentication-context';

const NavLinks = () => {
  const auth = useContext(AuthContext);

  return (
    <ul className="navlink__list">
      <li>
        <NavLink to="/" className="navlink__link">
          Home
        </NavLink>
      </li>

      {auth.isLoggedIn ? (
        <li>
          <NavLink to="/sales" className="navlink__link">
            Gestione
          </NavLink>
        </li>
      ) : null}

      {auth.isLoggedIn ? (
        <li>
          <NavLink to="/" className="navlink__link" onClick={auth.logout}>
            Logout
          </NavLink>
        </li>
      ) : (
        <li>
          <NavLink to="/login" className="navlink__link">
            Login
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
