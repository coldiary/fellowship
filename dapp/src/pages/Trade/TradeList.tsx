import React, { useEffect, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';

// import { getAllCampaigns } from 'api/tips/getAllCampaigns';
import { getTradesFor } from 'api/trades';
import { ReactComponent as EmptyImg } from 'assets/img/empty.svg';
import { Modal, useModal } from 'components/Layout/Modal';
import { secondaryButton } from 'components/styles';
import { Trade } from 'types/Trades';
import { CreateTradeModal } from './CreateTradeModal';
import { TradeCard } from './TradeCard';

type SortedTrades = [created: Trade[], reserved: Trade[]];

export const TradeList = () => {
    const { address } = useGetAccountInfo();
    const [trades, setTrades] = useState([[], []] as SortedTrades);
    const [
        creationModalShown, openCreationModal, closeCreationModal
    ] = useModal();

    useEffect(() => {
        (async () => {
            if (!address) return;
            const all = await getTradesFor(address);
            console.log(all);
            const sorted = all.reduce<SortedTrades>((acc, trade) => {
                if (trade.offer_address === address) {
                    acc[0].push(trade);
                } else if (trade.trader_address === address) {
                    acc[1].push(trade);
                }
                return acc;
            }, [[], []]);
            setTrades(sorted);
        })().catch(console.error);
    }, [address]);

    return (
        <div className='max-w-screen-2xl mx-auto p-10 w-full flex-auto flex flex-col gap-6'>
            <div className='flex-auto'>
                <div className="flex flex-row justify-between mb-6">
                    <div className="text-4xl">My trades</div>
                    <Modal shown={creationModalShown} closeModal={closeCreationModal}
                        content={() => <CreateTradeModal />}
                        toggle={() => (<button className={secondaryButton} onClick={openCreationModal}>Create trade</button>)}>
                    </Modal>
                </div>
                {trades[0].length ? (
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                        {trades[0].map(t => <TradeCard trade={t} key={t.id} />)}
                    </div>
                ) : (
                    <div className='flex-auto flex justify-center items-center'>
                        <div className='flex flex-col gap-6 items-center justify-center'>
                            <EmptyImg className='w-40 h-auto' />
                            <div className='text-2xl text-gray-500 font-medium'>No pending trade</div>
                        </div>
                    </div>
                )}
            </div>
            <div className='flex-auto'>
                <div className="flex flex-row justify-between mb-6">
                    <div className="text-4xl">Reserved trades</div>
                </div>
                {trades[1].length ? (
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                        {trades[1].map(t => <TradeCard trade={t} key={t.id} />)}
                    </div>
                ) : (
                    <div className='flex-auto flex justify-center items-center'>
                        <div className='flex flex-col gap-6 items-center justify-center'>
                            <EmptyImg className='w-40 h-auto' />
                            <div className='text-2xl text-gray-500 font-medium'>No trade reserved</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
