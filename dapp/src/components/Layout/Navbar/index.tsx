import React, { useContext, useState } from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import { ReactComponent as ElrondLogo } from 'assets/img/elrond-symbol.svg';
import { ReactComponent as FrFlag } from 'assets/img/flags/fr.svg';
import { ReactComponent as GbFlag } from 'assets/img/flags/gb.svg';
import { ReactComponent as DappLogo } from 'assets/img/logo_light.svg';
import { ReactComponent as MenuIcon } from 'assets/img/menu.svg';
import { navLink, secondaryButton } from 'components/styles';
import { ToastsContext } from 'contexts/Toasts';
import { Dropdown } from '../Dropdown';
import { useModal } from '../Modal';
import { WalletConnection } from './WalletConnection';

const Navbar = () => {
    const navLinkClass = (props: { isActive: boolean }) => `${navLink} ${props.isActive ? 'text-main' : ''} `;
    const [lang, setLang] = useState('fr');
    const { t } = useTranslation();
    const [menuShown, /* openMenu */, closeMenu, toggleMenu] = useModal();
    const [langShown, /* openLang */, closeLang, toggleLang] = useModal();
    const { showToast } = useContext(ToastsContext);

    const showComingSoonToast = () => showToast({ message: 'Comming soon !' });

    const changeLang = (l: string) => {
        i18next.changeLanguage(l);
        setLang(l);
        closeLang();
    };

    return (
        <div className='bg-white border-b-2 px-4 py-3'>
            <div className='flex flex-row justify-between items-center gap-6'>
                <Link to="/" className='flex items-center'>
                    <ElrondLogo className='h-6 md:h-8 md:mr-2' />
                    <DappLogo className='h-auto w-40 md:w-60' />
                </Link>

                <div className="hidden lg:flex flex-auto flex-row justify-between items-center">
                    <div className='flex flex-row items-center gap-6'>
                        <NavLink data-tip={t('coming_soon')} data-for="nav" className={navLink} to={'/' /*routeNames.kickstart */}>Kickstart</NavLink>
                        <NavLink data-tip={t('coming_soon')} data-for="nav" className={navLink} to={'/' /*routeNames.giveaway */}>Fundraise</NavLink>
                        <NavLink className={navLinkClass} to="/tip">Tip</NavLink>
                        <NavLink className={navLinkClass} to='/trade'>Trade</NavLink>
                        <NavLink data-tip={t('coming_soon')} data-for="nav" className={navLink} to={'/' /*routeNames.giveaway */}>Giveaway</NavLink>
                        <NavLink data-tip={t('coming_soon')} data-for="nav" className={navLink} to={'/' /*routeNames.airdrop */}>Airdrop</NavLink>
                    </div>

                    <ReactTooltip id='nav' place='bottom' />

                    <div className='flex flex-row items-center justify-center gap-4'>
                        <Dropdown
                            shown={langShown}
                            closeDropdown={closeLang}
                            toggle={() => (
                                <button className='border py-1 px-2 rounded-md' onClick={toggleLang} title={t('change_lang')}>
                                    {(() => {
                                        switch (lang) {
                                            case 'fr': return <FrFlag className='w-6 h-6' />;
                                            case 'en': return <GbFlag className='w-6 h-6' />;
                                        }
                                    })()}
                                </button>
                            )}
                            content={() => (
                                <div className='flex flex-col gap-2 p-1'>
                                    <div className="flex flex-row gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => changeLang('fr')}>
                                        <FrFlag className='w-6 h-6' /> Français
                                    </div>
                                    <div className="flex flex-row gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => changeLang('en')}>
                                        <GbFlag className='w-6 h-6' /> English
                                    </div>
                                </div>
                            )}
                        />

                        <WalletConnection />
                    </div>

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
                            <div className='flex flex-col items-center gap-6 p-6'>
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
