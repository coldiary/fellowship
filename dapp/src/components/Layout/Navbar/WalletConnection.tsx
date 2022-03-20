import React, { useContext, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { ReactComponent as CashIcon } from 'assets/img/cash.svg';
import { UnlockView } from 'components/Layout/Navbar/UnlockView';
import { primaryButton } from 'components/styles';
import { AccountContext } from 'contexts/Account';
import { Dropdown } from '../Dropdown';
import { Modal, useModal } from '../Modal';
import { AccountView } from './AccountView';

export const WalletConnection = () => {
    const account = useContext(AccountContext);
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });

    useEffect(() => {
        // setTimeout(() => {
            setLoggedIn(Boolean(account.address));
        // }, 500);
    }, [account.address]);

    const [
        connectModalShown,
        openConnectModal,
        closeConnectModal,
    ] = useModal();

    const toggleConnectModal = () => connectModalShown ? closeConnectModal() : openConnectModal();

    const getShortHash = (hash: string) => `${hash.slice(0, 5)}...${hash.slice(-5)}`;

    return isLoggedIn ? (
        isMobile ? (
            <Modal shown={connectModalShown} closeModal={closeConnectModal}
                content={() => <AccountView />}
                toggle={() => (
                    <button className={primaryButton} onClick={toggleConnectModal}>
                        <div className="flex flex-row gap-2 items-center">
                            <CashIcon />
                            {getShortHash(account.address ?? '')}
                        </div>
                    </button>
                )}
            />
        ) : (
            <Dropdown shown={connectModalShown} closeDropdown={closeConnectModal}
                content={() => <AccountView />}
                toggle={() => (
                    <button className={primaryButton} onClick={toggleConnectModal}>
                        <div className="flex flex-row gap-2 items-center">
                            <CashIcon />
                            {getShortHash(account.address ?? '')}
                        </div>
                    </button>
                )}
            />
        )
    ) : (
        <Modal shown={connectModalShown} closeModal={closeConnectModal}
            content={() => <UnlockView />}
            toggle={() => (<button className={primaryButton} onClick={toggleConnectModal}>Connect wallet</button>)}
        ></Modal>
    );
};
