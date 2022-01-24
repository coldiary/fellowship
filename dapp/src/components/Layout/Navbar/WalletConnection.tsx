import React, { useEffect, useState } from 'react';
import { logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Ui } from '@elrondnetwork/dapp-utils';
import { Popover } from 'react-tiny-popover';

import { ReactComponent as CashIcon } from 'assets/img/cash.svg';
import { ReactComponent as CopyCheckIcon } from 'assets/img/copy-check.svg';
import { ReactComponent as CopyIcon } from 'assets/img/copy.svg';
import { ReactComponent as ExplorerIcon } from 'assets/img/explorer.svg';
import { ReactComponent as FailureIcon } from 'assets/img/failure.svg';
import { ReactComponent as PendingIcon } from 'assets/img/pending.svg';
import { ReactComponent as SuccessIcon } from 'assets/img/success.svg';
import Unlock from 'components/Layout/Navbar/UnlockView';
import { primaryButton, primaryLink } from 'components/styles';
import { network } from 'config';
import useLatestTransactions from 'hooks/useLatestTransactions';
import useTokenBalance from 'hooks/useTokenBalance';

export const WalletConnection = () => {
    const { address, account } = useGetAccountInfo();
    const { tokens } = useTokenBalance(address);
    const { transactions } = useLatestTransactions(address);

    const [connectModalShown, showConnectModal] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    const openExplorer = (txHash: string) => window.open(`${network.explorerAddress}/transactions/${txHash}`, '_blank');
    const handleLogout = () => logout(`${window.location.origin}`);
    const toggleConnectModal = () => showConnectModal(!connectModalShown);
    const copyAddress = () => {
        navigator.clipboard.writeText(address);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 3000);
    };

    const isLoggedIn = Boolean(address);

    const getTokenShortName = (ticker: string) => ticker.slice(0, ticker.indexOf('-'));
    const getShortHash = (hash: string) => `${hash.slice(0, 5)}...${hash.slice(-5)}`;

    useEffect(() => {
        console.log(transactions);
    }, [transactions]);

    return isLoggedIn ? (
        <Popover
            isOpen={connectModalShown}
            positions={['bottom', 'left']}
            padding={10}
            onClickOutside={toggleConnectModal}
            boundaryInset={20}
            content={
                <div className='bg-white border shadow-md rounded-md max-w-screen-md p-6' onClick={e => e.stopPropagation()}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-row justify-between">
                            <div className="text-2xl">
                            <Ui.Denominate value={account.balance} decimals={2} token='EGLD'
                                denomination={18} showLastNonZeroDecimal={false} />
                            </div>
                            <button className={primaryLink} onClick={handleLogout}>Disconnect</button>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className="font-medium">My address :</div>
                            <div className="flex flex-row gap-4 justify-end items-center text-sm">
                                {address}
                                <button title='Copy address to clipboard' onClick={copyAddress}>
                                    { hasCopied ? <CopyCheckIcon /> : <CopyIcon /> }
                                </button>
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className="font-medium">My tokens :</div>
                            <div className="flex flex-row flex-wrap gap-10 text-sm">
                                {tokens.map(token => (
                                    <Ui.Denominate key={token.identifier} value={token.balance} decimals={2} token={getTokenShortName(token.ticker)}
                                        showLastNonZeroDecimal={false} denomination={18} />
                                ))}
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className="font-medium">Latest transactions :</div>
                            <div className="flex flex-col gap-4 text-sm">
                                {transactions.map(tr => (
                                    <div key={tr.txHash} className="flex flex-row items-center justify-between">
                                        <div className="w-6 mr-2">
                                            {
                                            tr.status === 'success' ?
                                                <SuccessIcon title='Successful' /> :
                                            tr.status === 'fail' ?
                                                <FailureIcon title='Failed' /> :
                                                <PendingIcon title='Pending' />
                                            }
                                        </div>
                                        <div className='w-28 text-center flex-shrink-0'>
                                            {getShortHash(tr.txHash)}
                                        </div>
                                        <div className='w-6 flex-shrink-0 text-center'>-</div>
                                        <div className='flex-auto overflow-hidden overflow-ellipsis whitespace-nowrap'>
                                            {tr.action.description}
                                        </div>
                                        <button title='Open in explorer' className="w-6 ml-2" onClick={() => openExplorer(tr.txHash)}>
                                            <ExplorerIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <button className={primaryButton} onClick={toggleConnectModal}>
                <div className="flex flex-row gap-2 items-center">
                    <CashIcon />
                    {getShortHash(address)}
                </div>
            </button>
        </Popover>
    ) : (
        <Popover
            isOpen={connectModalShown}
            containerStyle={{ width: '100vw', height: '100vh', position: 'absolute' }}
            contentLocation={{ top: 0, left: 0 }}
            content={
                <div className='absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center' onClick={toggleConnectModal}>
                    <div className='bg-white border shadow-md rounded-md' onClick={e => e.stopPropagation()}>
                        <Unlock />
                    </div>
                </div>
            }
        >
            <button className={primaryButton} onClick={toggleConnectModal}>Connect wallet</button>
        </Popover>
    );
};
