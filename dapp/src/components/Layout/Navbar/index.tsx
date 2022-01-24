import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import ReactTooltip from 'react-tooltip';
import { ReactComponent as ElrondLogo } from 'assets/img/elrond-symbol.svg';
import { ReactComponent as DappLogo } from 'assets/img/logo_light.svg';
import { navLink } from 'components/styles';
import { routeNames } from 'routes';
import { WalletConnection } from './WalletConnection';

const Navbar = () => {
  const navLinkClass = (props: { isActive: boolean }) => `${navLink} ${props.isActive ? 'text-main' : ''} `;

  return (
    <div className='bg-white border-bottom px-4 py-3'>
      <div className='flex flex-row justify-between items-center'>
        <Link to={routeNames.home} className='flex items-center'>
          <ElrondLogo className='h-8 mr-2'/>
          <DappLogo className='h-auto w-60'/>
        </Link>


        <div className='flex flex-row items-center gap-6'>
          <NavLink data-tip="Coming soon !" data-for="nav" className={navLinkClass} to={'/' /*routeNames.kickstart */}>Kickstart</NavLink>
          <NavLink data-tip="Coming soon !" data-for="nav" className={navLinkClass} to={'/' /*routeNames.giveaway */}>Fundraise</NavLink>
          <NavLink data-for="nav" className={navLinkClass} to={routeNames.tip}>Tip</NavLink>
          <NavLink data-tip="Coming soon !" data-for="nav" className={navLinkClass} to={'/' /*routeNames.trade */}>Trade</NavLink>
          <NavLink data-tip="Coming soon !" data-for="nav" className={navLinkClass} to={'/' /*routeNames.giveaway */}>Giveaway</NavLink>
          <NavLink data-tip="Coming soon !" data-for="nav" className={navLinkClass} to={'/' /*routeNames.airdrop */}>Airdrop</NavLink>
        </div>

        <ReactTooltip id='nav' place='bottom'/>

        <WalletConnection />
      </div>
    </div>
  );
};

export default Navbar;
