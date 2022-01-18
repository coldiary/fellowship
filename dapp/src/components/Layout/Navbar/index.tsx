import React from 'react';
import { logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Navbar as BsNavbar, NavItem, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { dAppName } from 'config';
import { routeNames } from 'routes';
import { ReactComponent as ElrondLogo } from './../../../assets/img/elrond.svg';
import { ReactComponent as DappLogo } from './../../../assets/img/logo_light.svg';

const Navbar = () => {
  const { pathname } = useLocation();
  const { address } = useGetAccountInfo();

  const handleLogout = () => {
    logout(`${window.location.origin}/unlock`);
  };

  const isLoggedIn = Boolean(address);

  return (
    <BsNavbar className='bg-white border-bottom px-4 py-3'>
      <div className='container-fluid'>
        <Link
          className='d-flex align-items-center navbar-brand mr-0'
          to={routeNames.home}
        >
          <DappLogo className='dapp-logo' />
        </Link>

        <Nav className='m-auto' activeKey={pathname}>
          <Nav.Link className="mx-3 text-lg text-uppercase font-bold" href={routeNames.kickstart}>Kickstart</Nav.Link>
          <Nav.Link className="mx-3 text-uppercase font-bold" href={routeNames.fundraise}>Fundraise</Nav.Link>
          <Nav.Link className="mx-3 text-uppercase font-bold" href={routeNames.tip}>Tip</Nav.Link>
          <Nav.Link className="mx-3 text-uppercase font-bold" href={routeNames.trade}>Trade</Nav.Link>
          <Nav.Link className="mx-3 text-uppercase font-bold" href={routeNames.giveaway}>Giveaway</Nav.Link>
          <Nav.Link className="mx-3 text-uppercase font-bold" href={routeNames.airdrop}>Airdrop</Nav.Link>
        </Nav>

        {isLoggedIn ? (
            <NavItem>
              <a className='btn btn-primary text-white' href={routeNames.home} onClick={handleLogout}>
                Disconnect
              </a>
            </NavItem>
          ) : (
            <Link
                to={routeNames.unlock}
                className='btn btn-primary mt-3 text-white'
                data-testid='loginBtn'
              >
                Connect
              </Link>
          )}
      </div>
    </BsNavbar>
  );
};

export default Navbar;
