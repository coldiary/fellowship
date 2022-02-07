import React, { useEffect, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';

import { ReactComponent as CashIcon } from 'assets/img/cash.svg';
import { UnlockView } from 'components/Layout/Navbar/UnlockView';
import { primaryButton } from 'components/styles';
import { Dropdown } from '../Dropdown';
import { Modal, useModal } from '../Modal';
import { AccountView } from './AccountView';

export const WalletConnection = () => {
    const { address } = useGetAccountInfo();
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => {
            setLoggedIn(Boolean(address));
        }, 500);
    }, [address]);

    const [
        connectModalShown,
        openConnectModal,
        closeConnectModal,
    ] = useModal();

    const getShortHash = (hash: string) => `${hash.slice(0, 5)}...${hash.slice(-5)}`;

    return isLoggedIn ? (
        <Dropdown shown={connectModalShown} closeDropdown={closeConnectModal}
            content={() => <AccountView />}
            toggle={() => (
                <button className={primaryButton} onClick={openConnectModal}>
                    <div className="flex flex-row gap-2 items-center">
                        <CashIcon />
                        {getShortHash(address)}
                    </div>
                </button>
            )}
        />
    ) : (
        <Modal shown={connectModalShown} closeModal={closeConnectModal}
            content={() => <UnlockView />}
            toggle={() => (<button className={primaryButton} onClick={openConnectModal}>Connect wallet</button>)}
        ></Modal>
    );
};
