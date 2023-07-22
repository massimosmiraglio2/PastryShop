import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './NavBar.css';
import NavLinks from './NavLinks';
import Backdrop from '../ui_element/Backdrop';
import SideDrawer from './SideDrawer';

function NavBar() {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="navbar__drawer">
          <NavLinks />
        </nav>
      </SideDrawer>

      <header className="navbar__header">
        <Link className="navbar__brand" to="/">
          PastryShop
        </Link>

        <button className="navbar__btn" onClick={openDrawerHandler}>
          <span />
          <span />
          <span />
        </button>
        <nav className="navbar__bar">
          <NavLinks />
        </nav>
      </header>
    </React.Fragment>
  );
}

export default NavBar;
