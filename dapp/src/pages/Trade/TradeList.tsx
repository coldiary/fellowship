import React, { useEffect } from 'react';
import { transactionServices, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { useTranslation, Trans } from 'react-i18next';
import useSWR from 'swr';

import { Trades } from 'api/trades';
import { ReactComponent as EmptyImg } from 'assets/img/empty.svg';
import { Button } from 'components/Button';
import { Modal, useModal } from 'components/Layout/Modal';
import { contracts } from 'config';
import { Trade } from 'types/Trades';
import githubLogo from '../../assets/img/github.png';
import { CreateTradeModal } from './CreateTradeModal';
import { TradeCard } from './TradeCard';
import { TradeHowTo } from './TradeHowTo';

type SortedTrades = [created: Trade[], reserved: Trade[]];

export const TradeList = () => {
    const { t } = useTranslation();
    const { hasPendingTransactions } = transactionServices.useGetPendingTransactions();
    const { address } = useGetAccountInfo();
    const [creationModalShown, openCreationModal, closeCreationModal] = useModal();
    const [ howToModalShown, openHowToModal, closeHowToModal ] = useModal();
    const { data: trades = [[], []], mutate } = useSWR(address ? `trades-${address}` : null, async (): Promise<SortedTrades> => {
        const own = await Trades.instance.getTradesFor(address);
        return own.reduce<SortedTrades>((acc, trade) => {
            if (trade.offer_address === address) {
                acc[0].push(trade);
            } else if (trade.trader_address === address) {
                acc[1].push(trade);
            }
            return acc;
        }, [[], []]);
    });

    useEffect(() => { mutate(); }, [hasPendingTransactions]);

    return (
        <div className='max-w-screen-2xl mx-auto p-10 w-full flex-auto flex flex-col gap-6'>
            <div className='flex flex-row items-center justify-end gap-4'>
                <Modal shown={howToModalShown} closeModal={closeHowToModal}
                    content={() => <TradeHowTo closeModal={closeHowToModal} />}
                    toggle={() => (
                        <Button onClick={openHowToModal} type="clear">
                            {t('trade.list.how_to')}
                        </Button>
                    )}>
                </Modal>

                <a className="flex-shrink-0" href={contracts.trade.sourceUrl} target='_blank' rel="noreferrer" title={t('trade.list.see_code')}>
                    <img className='w-5 h-5' src={githubLogo}></img>
                </a>

                <Modal shown={creationModalShown} closeModal={closeCreationModal}
                        content={() => <CreateTradeModal closeModal={closeCreationModal} />}
                        toggle={() => (
                            <Button onClick={openCreationModal} type="secondary" onlyAuth>
                                <Trans i18nKey='trade.list.create_trade'>
                                    Create <span className='hidden sm:inline'>trade</span>
                                </Trans>
                            </Button>
                        )}>
                    </Modal>
            </div>
            <div className='flex-auto flex flex-col'>
                <div className="flex flex-row justify-between mb-6">
                    <div className="text-2xl lg:text-3xl">{t('trade.list.my_trades')}</div>
                </div>
                {trades[0].length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {trades[0].map(trade => <TradeCard trade={trade} key={trade.id} />)}
                    </div>
                ) : (
                    <div className='flex-auto flex justify-center items-center'>
                        <div className='flex flex-col gap-6 items-center justify-center'>
                            <EmptyImg className='w-28 md:w-40 h-auto' />
                            <div className='text-2xl text-gray-500 font-medium'>{t('trade.list.no_pending_trades')}</div>
                        </div>
                    </div>
                )}
            </div>
            <div className='flex-auto flex flex-col'>
                <div className="flex flex-row justify-between mb-6">
                    <div className="text-2xl lg:text-3xl">{t('trade.list.reserved_trades')}</div>
                </div>
                {trades[1].length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {trades[1].map(trade => <TradeCard trade={trade} key={trade.id} />)}
                    </div>
                ) : (
                    <div className='flex-auto flex justify-center items-center'>
                        <div className='flex flex-col gap-6 items-center justify-center'>
                            <EmptyImg className='w-28 md:w-40 h-auto' />
                            <div className='text-2xl text-gray-500 font-medium'>{t('trade.list.no_reserved_trades')}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
