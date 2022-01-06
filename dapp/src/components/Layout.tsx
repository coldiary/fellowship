/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useState } from 'react';

import { Account, LightningBolt } from './Icons';
import { Links } from './Links';
import { DarkModeToggle } from './DarkModeToggle';
import { Brand } from './Brand';
import { Link, useHistory, useLocation } from 'react-router-dom';
import * as Dapp from '@elrondnetwork/dapp';

const ProfileMenu = () => {
    const location = useLocation();
    const dapp = Dapp.useContext();
    const dappLogout = Dapp.useLogout()
    const history = useHistory();

    const logout = () => {
        dappLogout({ callbackUrl: `${window.location.origin}/` });
        history.push("/");
    }

    useEffect(() => {
        console.log(dapp);
    }, []);

    return (
        <>
            { dapp.loggedIn ? (
                <div className="ml-3 relative">
                    <div>
                        <button type="button" className="max-w-xs bg-gray-800 rounded-md p-2 text-white flex items-center text-sm" id="user-menu-button" aria-expanded="false" aria-haspopup="true"
                            onClick={logout}>
                            <span className="sr-only">Open user menu</span>
                            <Account />
                            { dapp.address.substring(0, 5) } ... { dapp.address.substr(-5) }
                        </button>
                    </div>
                </div>
            ) : (
                <Link to={{ pathname: "/connect", state: { referer: location.pathname }}} className="bg-gray-500 hover:bg-black text-white text-sm font-medium mx-2 p-2 rounded-md flex flex-row gap-2 items-center">
                    <span className="sr-only">Connect wallet</span>
                    <LightningBolt />
                    Connect
                </Link>
            )}
        </>
    )
}

const MenuToggle: FC<{ onClick: () => void }> = () => (
    <div className="-mr-2 flex md:hidden">
        {/* <!-- Mobile menu button --> */}
        <button type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700" aria-controls="mobile-menu" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            {/* <!--
            Heroicon name: outline/menu

            Menu open: "hidden", Menu closed: "block"
            --> */}
            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {/* <!--
            Heroicon name: outline/x

            Menu open: "block", Menu closed: "hidden"
            --> */}
            <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
)

export const Layout: FC<{ title: string }> = ({ title, children }) => {
    const [menuOpened, toggleMenu] = useState(false);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <nav className="shadow dark:bg-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Brand name={title} />
                            <Links />
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6">
                                <DarkModeToggle />

                                <button type="button" className="m-2 rounded-full text-gray-400 hover:text-black">
                                    <span className="sr-only">View notifications</span>
                                    {/* <!-- Heroicon name: outline/bell --> */}
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </button>

                                {/* <!-- Profile dropdown --> */}
                                <ProfileMenu />
                            </div>
                        </div>
                        <MenuToggle onClick={() => toggleMenu(!menuOpened)}/>
                    </div>
                </div>

                {/* <!-- Mobile menu, show/hide based on menu state. --> */}
                { menuOpened ?
                    <div className="md:hidden" id="mobile-menu" >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Links />
                        </div>
                        <div className="pt-4 pb-3 border-t border-gray-700">
                            <DarkModeToggle />

                            <button type="button" className="m-2 rounded-full text-gray-400 hover:text-black">
                                <span className="sr-only">View notifications</span>
                                {/* <!-- Heroicon name: outline/bell --> */}
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            {/* <!-- Profile dropdown --> */}
                            <ProfileMenu />
                        </div>
                    </div> : null
                }
            </nav>

            <div className="flex-auto flex flex-col">
                { children }
            </div>
        </div>
    )
}
