import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';

import ReactTooltip from 'react-tooltip';
import { ReactComponent as ElrondLogo } from 'assets/img/elrond-symbol.svg';
import { ReactComponent as DappLogo } from 'assets/img/logo_light.svg';
import { ReactComponent as MenuIcon } from 'assets/img/menu.svg';
import { navLink, secondaryButton } from 'components/styles';
import { ToastsContext } from 'contexts/Toasts';
import { Dropdown } from '../Dropdown';
import { useModal } from '../Modal';
import { WalletConnection } from './WalletConnection';

const Navbar = () => {
  const navLinkClass = (props: { isActive: boolean }) => `${navLink} ${props.isActive ? 'text-main' : ''} `;

  const [menuShown, /* openMenu */, closeMenu, toggleMenu] = useModal();

  const { showToast } = useContext(ToastsContext);

  const showComingSoonToast = () => showToast({ message: 'Comming soon !' });

  return (
    <div className='bg-white border-b-2 px-4 py-3'>
      <div className='flex flex-row justify-between items-center gap-6'>
        <Link to="/" className='flex items-center'>
          <ElrondLogo className='h-6 md:h-8 md:mr-2'/>
          <DappLogo className='h-auto w-40 md:w-60'/>
        </Link>

        <div className="hidden lg:flex flex-auto flex-row justify-between items-center">
          <div className='flex flex-row items-center gap-6'>
            <NavLink data-tip="Coming soon !" data-for="nav" className={navLink} to={'/' /*routeNames.kickstart */}>Kickstart</NavLink>
            <NavLink data-tip="Coming soon !" data-for="nav" className={navLink} to={'/' /*routeNames.giveaway */}>Fundraise</NavLink>
            <NavLink className={navLinkClass} to="/tip">Tip</NavLink>
            <NavLink className={navLinkClass} to='/trade'>Trade</NavLink>
            <NavLink data-tip="Coming soon !" data-for="nav" className={navLink} to={'/' /*routeNames.giveaway */}>Giveaway</NavLink>
            <NavLink data-tip="Coming soon !" data-for="nav" className={navLink} to={'/' /*routeNames.airdrop */}>Airdrop</NavLink>
          </div>

          <ReactTooltip id='nav' place='bottom'/>

          <WalletConnection />
        </div>

        <div className="lg:hidden">
          <Dropdown
            shown={menuShown}
            closeDropdown={closeMenu}
            toggle={() => (
              <button className={secondaryButton} onClick={toggleMenu}>
                <MenuIcon />
              </button>
            )}
            content={() => (
              <div className='flex flex-col items-center gap-6'>
                <NavLink className={navLink} to={'/' /*routeNames.kickstart */} onClick={showComingSoonToast}>Kickstart</NavLink>
                <NavLink className={navLink} to={'/' /*routeNames.giveaway */}>Fundraise</NavLink>
                <NavLink className={navLink} to="/tip">Tip</NavLink>
                <NavLink className={navLink} to='/trade'>Trade</NavLink>
                <NavLink className={navLink} to={'/' /*routeNames.giveaway */}>Giveaway</NavLink>
                <NavLink className={navLink} to={'/' /*routeNames.airdrop */}>Airdrop</NavLink>
                <WalletConnection />
              </div>
            )}
          ></Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
