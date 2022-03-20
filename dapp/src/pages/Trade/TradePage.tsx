import React, { useContext, useEffect, useMemo, useState } from 'react';
import { DappUI, transactionServices, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';

import { Trades } from 'api/trades';
import { ReactComponent as CheckIcon } from 'assets/img/check-circle.svg';
import { ReactComponent as TradeIcon } from 'assets/img/trade.svg';
import { Button } from 'components/Button';
import { ConfirmModal, useModal } from 'components/Layout/Modal';
import { primaryButton } from 'components/styles';
import { TokensContext } from 'contexts/Tokens';
import { Trade } from 'types/Trades';
import { getShortHash } from 'utils/display';

const {
    useGetPendingTransactions,
    useTrackTransactionStatus,
} = transactionServices;

export const TradePage = () => {
    const { id } = useParams();
    const { hasPendingTransactions } = useGetPendingTransactions();
    const { address } = useGetAccountInfo();
    const navigate = useNavigate();
    const { get: getToken } = useContext(TokensContext);
    const { data: trade, mutate } = useSWR(id ? `trade-${id}` : null, async (): Promise<Trade | undefined> => {
        if (!id) return;
        return await Trades.instance.getTrade(+id);
    });
    const isCreator = trade?.offer_address === address;

    const [txId, setTxId] = useState<string | null>(null);
    const { isSuccessful } = useTrackTransactionStatus({ transactionId: txId });

    const [cancelModalShown, openCancelModal, closeCancelModal] = useModal();

    useEffect(() => {
        if (!trade) return;
        if (trade.offer_address !== address && trade.trader_address &&trade.trader_address !== address) {
            navigate('/');
        }
    }, [trade]);

    useEffect(() => { mutate(); }, [id, hasPendingTransactions]);

    const [offerToken, traderToken] = useMemo(() => {
        if (!trade) return [];
        return [
            getToken(trade.offer_asset_token),
            getToken(trade.trader_asset_token),
        ];
    }, [trade]);

    const proceedTrade = async () => {
        if (!trade || !traderToken) return;
        const sessionId = await Trades.instance.trade(trade.id, +trade.trader_asset_quantity, traderToken.identifier);
        setTxId(sessionId);
    };

    const onCloseCancelModal = async (confirm: boolean) => {
        closeCancelModal();

        if (!id) return;

        if (confirm) {
            await Trades.instance.cancelTrade(+id);
        }
    };

    return (
        <div className='max-w-screen-2xl mx-auto my-4 p-10 w-full flex-auto flex flex-col'>
            { !trade || !offerToken || !traderToken ? (
                <>
                    { isSuccessful ? (
                        <div className='bg-whitee border rounded-md gap-6 p-12 flex flex-col justify-center items-center'>
                            <CheckIcon className='w-20 text-green-700' />
                            <div className="text-4xl bold">
                                Trade successful
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-6 text-4xl opacity-50">
                            Trade not found
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col gap-12 p-6 md:gap-24 md:p-12 bg-whitee border">
                    <div className="text-lg text-center">
                        {
                            isCreator ? 'You created this trade :' :
                            trade.trader_address ? 'This trade has been reserved for you :' : null
                        }
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-trade items-center">
                        <div className="flex-auto flex flex-col items-center gap-4 md:gap-8">
                            <div className="text-xs uppercase">Offered</div>
                            <div className="flex flex-row items-center gap-4">
                                <img className='w-8 h-8' src={offerToken.assets?.svgUrl} />
                                <div className="text-2xl md:text-4xl">
                                    <DappUI.Denominate value={trade.offer_asset_quantity} token={offerToken.name} denomination={offerToken.decimals} decimals={2}/>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center w-12 transform rotate-90 m-auto md:rotate-0">
                            <TradeIcon className='w-full h-full' />
                        </div>
                        <div className="flex-auto flex flex-col items-center gap-4 md:gap-8">
                            <div className="text-xs uppercase">Asked</div>
                            <div className="flex flex-row items-center gap-4">
                                <img className='w-8 h-8' src={traderToken.assets?.svgUrl} />
                                <div className="tex-2xl md:text-4xl">
                                    <DappUI.Denominate value={trade.trader_asset_quantity} token={traderToken.name} denomination={traderToken.decimals} decimals={2}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-trade items-center">
                        <div className="flex-auto flex flex-col items-center gap-4">
                            {isCreator ? (
                                <ConfirmModal shown={cancelModalShown} closeModal={onCloseCancelModal}
                                    toggle={() => <button className={primaryButton} onClick={openCancelModal}>Cancel trade</button>}
                                    content={() => (
                                        <div className='flex flex-col gap-4'>
                                            <div className="text-lg text-center uppercase">Cancel trade</div>
                                            <div className="flex flex-col gap-4">
                                                Are you sure you want to cancel this trade ?<br />
                                                <div className="text-sm text-gray-500">
                                                    Your funds will be returned to your address.
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                ></ConfirmModal>
                            ): (
                                <div className='text-gray-600 font-medium'>
                                    <>Created by {getShortHash(trade.offer_address)}</>
                                </div>
                            )}
                        </div>
                        <div className="flex-shrink-0 w-6 flex justify-center items-center">
                        </div>
                        <div className="flex-auto flex flex-col items-center gap-4">
                            {!isCreator ? (
                                <Button onClick={proceedTrade} onlyAuth>Trade</Button>
                            ) : (
                                <div className='text-gray-600 font-medium'>
                                    {trade.trader_address && <>Reserved for {getShortHash(trade.trader_address)}</>}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};
