import React from 'react';
import { logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Link } from 'react-router-dom';

import { navLink } from 'components/styles';
import { routeNames } from 'routes';
import { ReactComponent as DappLogo } from 'assets/img/logo_light.svg';
import { ReactComponent as ElrondLogo } from 'assets/img/elrond-symbol.svg';
import { WalletConnection } from './WalletConnection';

const Navbar = () => {
  const { address } = useGetAccountInfo();

  const handleLogout = () => {
    logout(`${window.location.origin}/unlock`);
  };

  const isLoggedIn = Boolean(address);

  return (
    <div className='bg-white border-bottom px-4 py-3'>
      <div className='flex flex-row justify-between items-center'>
        <Link to={routeNames.home} className='flex'>
          <ElrondLogo className='h-8 mr-2'/>
          <DappLogo className='h-auto w-48'/>
        </Link>


        <div className='flex flex-row items-center gap-6'>
          <Link className={navLink} to={routeNames.kickstart}>Kickstart</Link>
          <Link className={navLink} to={routeNames.fundraise}>Fundraise</Link>
          <Link className={navLink} to={routeNames.tip}>Tip</Link>
          <Link className={navLink} to={routeNames.trade}>Trade</Link>
          <Link className={navLink} to={routeNames.giveaway}>Giveaway</Link>
          <Link className={navLink} to={routeNames.airdrop}>Airdrop</Link>
        </div>

        <WalletConnection />
      </div>
    </div>
  );
};

export default Navbar;
